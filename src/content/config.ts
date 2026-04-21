import { defineCollection, z } from 'astro:content';

const blogsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.number(),
    status: z.enum(['completed', 'in-progress', 'archived']),
    techStack: z.array(z.string()),
    heroImage: z.string(),
    links: z.object({
      github: z.string().url().optional(),
      live: z.string().url().optional(),
      demo: z.string().url().optional(),
    }).optional(),
  }),
});

export const collections = {
  blogs: blogsCollection,
  projects: projectsCollection,
};
