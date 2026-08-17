import { z } from 'astro:content';

/** Blog index entries — add one YAML file per post in src/content/writing/ */
export const writingSchema = z.object({
  title: z.string(),
  /** Month and year as YYYY-MM, shown as “Mar 2026”. */
  date: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM (e.g. 2026-03)'),
  href: z.string().optional(),
  draft: z.boolean().default(false),
});

export type Writing = z.infer<typeof writingSchema>;
