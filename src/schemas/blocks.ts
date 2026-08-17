import { z } from 'astro:content';

/** Shared image reference — paths are relative to /public */
export const imageSchema = z.object({
  src: z.string().optional(),
  alt: z.string(),
});

export const thesisBlock = z.object({
  type: z.literal('thesis'),
  title: z.string().optional(),
  text: z.string(),
});

export const narrativeBlock = z.object({
  type: z.literal('narrative'),
  title: z.string(),
  paragraphs: z.array(z.string()).min(1).max(3),
});

export const quoteBlock = z.object({
  type: z.literal('quote'),
  quote: z.string(),
  attribution: z.string().optional(),
});

export const textVisualBlock = z.object({
  type: z.literal('textVisual'),
  title: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  image: imageSchema,
  reverse: z.boolean().optional(),
});

export const containedVisualBlock = z.object({
  type: z.literal('containedVisual'),
  image: imageSchema,
  caption: z.string().optional(),
});

export const fullBleedVisualBlock = z.object({
  type: z.literal('fullBleedVisual'),
  image: imageSchema,
});

export const visualGridBlock = z.object({
  type: z.literal('visualGrid'),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  images: z.array(imageSchema).min(2).max(4),
});

export const metricBlock = z.object({
  type: z.literal('metric'),
  items: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .min(1)
    .max(4),
});

export const processBlock = z.object({
  type: z.literal('process'),
  vertical: z.boolean().optional(),
  steps: z
    .array(
      z.object({
        label: z.string(),
        image: imageSchema.optional(),
      })
    )
    .min(2)
    .max(5),
});

export const comparisonBlock = z.object({
  type: z.literal('comparison'),
  before: z.object({
    label: z.string().optional(),
    image: imageSchema,
  }),
  after: z.object({
    label: z.string().optional(),
    image: imageSchema,
  }),
});

export const reflectionBlock = z.object({
  type: z.literal('reflection'),
  title: z.string(),
  paragraphs: z.array(z.string()).min(1).max(3),
  image: imageSchema.optional(),
  nav: z
    .object({
      prev: z.object({ label: z.string(), href: z.string() }).optional(),
      next: z.object({ label: z.string(), href: z.string() }).optional(),
    })
    .optional(),
});

export const blockSchema = z.discriminatedUnion('type', [
  thesisBlock,
  narrativeBlock,
  quoteBlock,
  textVisualBlock,
  containedVisualBlock,
  fullBleedVisualBlock,
  visualGridBlock,
  metricBlock,
  processBlock,
  comparisonBlock,
  reflectionBlock,
]);

export type Block = z.infer<typeof blockSchema>;

export const caseStudySchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  label: z.string().optional(),
  role: z.string().optional(),
  year: z.union([z.string(), z.number()]).optional(),
  company: z.string().optional(),
  team: z.string().optional(),
  meta: z.array(z.string()).optional(),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  order: z.number().optional(),
  blocks: z.array(blockSchema),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;
