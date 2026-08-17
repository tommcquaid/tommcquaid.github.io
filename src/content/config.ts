import { defineCollection } from 'astro:content';
import { caseStudySchema } from '../schemas/blocks';

const caseStudies = defineCollection({
  type: 'data',
  schema: caseStudySchema,
});

export const collections = {
  caseStudies,
};
