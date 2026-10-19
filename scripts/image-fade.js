document.documentElement.classList.add("has-image-fade");

function revealImage(image) {
    if (image.dataset.fadeHandled) return;
    image.dataset.fadeHandled = "true";

    const reveal = () => image.classList.add("is-loaded");
    if (image.naturalWidth === 0 || typeof image.decode !== "function") {
        reveal();
        return;
    }

    image.decode().then(reveal, reveal);
}

function prepareImages() {
    document.querySelectorAll("img").forEach((image) => {
        image.addEventListener("load", () => revealImage(image), { once: true });
        image.addEventListener("error", () => revealImage(image), { once: true });

        if (image.complete) revealImage(image);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepareImages, { once: true });
} else {
    prepareImages();
}
