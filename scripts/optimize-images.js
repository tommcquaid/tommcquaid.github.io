const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");
const chokidar = require("chokidar");

const ROOT_DIR = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(ROOT_DIR, "images", "source");
const OUTPUT_DIR = path.join(ROOT_DIR, "images", "optimized");
const CACHE_FILE = path.join(OUTPUT_DIR, ".optimization-cache.json");
const MAX_WIDTH = 2000;
const DEFAULT_QUALITY = 85;
const UI_QUALITY = 90;
const OPTIMIZER_VERSION = 1;
const SUPPORTED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function isSupportedImage(filePath) {
    return SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function getQuality(filePath) {
    return /-(ui|screen|table|workflow)/i.test(path.basename(filePath, path.extname(filePath)))
        ? UI_QUALITY
        : DEFAULT_QUALITY;
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    const units = ["KB", "MB", "GB"];
    let value = bytes / 1024;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    return `${value.toFixed(1)} ${units[unitIndex]}`;
}

async function readCache() {
    try {
        return JSON.parse(await fs.readFile(CACHE_FILE, "utf8"));
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.warn(`Could not read optimization cache; rebuilding it: ${error.message}`);
        }
        return {};
    }
}

async function writeCache(cache) {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`);
}

async function collectImages(directory) {
    const files = [];
    let entries;
    try {
        entries = await fs.readdir(directory, { withFileTypes: true });
    } catch (error) {
        console.error(`Could not read ${directory}: ${error.message}`);
        return files;
    }

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...await collectImages(fullPath));
        } else if (entry.isFile() && isSupportedImage(fullPath)) {
            files.push(fullPath);
        }
    }
    return files;
}

async function optimizeImage(sourcePath, cache) {
    const relativePath = path.relative(SOURCE_DIR, sourcePath);
    const relativeOutput = `${relativePath.slice(0, -path.extname(relativePath).length)}.webp`;
    const outputPath = path.join(OUTPUT_DIR, relativeOutput);
    const quality = getQuality(sourcePath);

    try {
        const sourceBuffer = await fs.readFile(sourcePath);
        const sourceHash = crypto.createHash("sha256").update(sourceBuffer).digest("hex");
        const config = `${OPTIMIZER_VERSION}:${MAX_WIDTH}:${quality}`;
        const cacheKey = path.relative(ROOT_DIR, sourcePath);
        const cached = cache[cacheKey];

        try {
            await fs.access(outputPath);
            if (cached?.hash === sourceHash && cached?.config === config) {
                console.log(`Unchanged: ${relativePath}`);
                return "unchanged";
            }
        } catch {
            // A missing output is regenerated even when the source hash is cached.
        }

        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        const result = await sharp(sourceBuffer)
            .rotate()
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality, effort: 6, smartSubsample: true, alphaQuality: 100 })
            .toFile(outputPath);

        cache[cacheKey] = { hash: sourceHash, config };
        const reduction = ((sourceBuffer.length - result.size) / sourceBuffer.length) * 100;
        console.log(
            `Optimized: ${relativePath} → ${path.relative(ROOT_DIR, outputPath)} | ` +
            `${formatBytes(sourceBuffer.length)} → ${formatBytes(result.size)} | ${reduction.toFixed(1)}% reduction | q${quality}`,
        );
        return "optimized";
    } catch (error) {
        console.error(`Failed to optimize ${relativePath}: ${error.message}`);
        return "failed";
    }
}

async function optimizeAll(cache) {
    await fs.mkdir(SOURCE_DIR, { recursive: true });
    const images = await collectImages(SOURCE_DIR);
    if (images.length === 0) {
        console.log("No supported images found in images/source/.");
        return;
    }
    const counts = { optimized: 0, unchanged: 0, failed: 0 };
    for (const imagePath of images) {
        const result = await optimizeImage(imagePath, cache);
        if (result) counts[result] += 1;
    }
    await writeCache(cache);
    console.log(
        `\nImage optimization complete: ${images.length} checked, ` +
        `${counts.optimized} optimized, ${counts.unchanged} unchanged, ${counts.failed} failed. ` +
        `WebP files are in ${path.relative(ROOT_DIR, OUTPUT_DIR)}/.`,
    );
}

async function watchImages(cache) {
    const watcher = chokidar.watch(SOURCE_DIR, {
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
    });
    const pending = new Map();

    const scheduleOptimization = (filePath) => {
        if (!isSupportedImage(filePath)) return;
        clearTimeout(pending.get(filePath));
        pending.set(filePath, setTimeout(async () => {
            pending.delete(filePath);
            await optimizeImage(filePath, cache);
            await writeCache(cache);
        }, 200));
    };

    watcher.on("add", scheduleOptimization);
    watcher.on("change", scheduleOptimization);
    watcher.on("error", (error) => console.error(`Image watcher error: ${error.message}`));
    watcher.on("ready", () => console.log("Watching images/source/ for new or changed images…"));
}

async function main() {
    const cache = await readCache();
    await optimizeAll(cache);
    if (process.argv.includes("--watch")) {
        await watchImages(cache);
    }
}

main().catch((error) => {
    console.error(`Image optimization failed: ${error.message}`);
    process.exitCode = 1;
});