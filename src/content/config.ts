import { defineCollection } from 'astro:content';
import { caseStudySchema } from '../schemas/blocks';
import { writingSchema } from '../schemas/lists';

const caseStudies = defineCollection({
  type: 'data',
  schema: caseStudySchema,
});

const writing = defineCollection({
  type: 'data',
  schema: writingSchema,
});

export const collections = {
  caseStudies,
  writing,
};
