import { defineCollection, z } from 'astro:content';

const blogsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.object({
      en: z.string(),
      id: z.string(),
    }),
    date: z.date(),
    summary: z.object({
      en: z.string(),
      id: z.string(),
    }),
    tags: z.array(z.string()).optional(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.object({
      en: z.string(),
      id: z.string(),
    }),
    summary: z.object({
      en: z.string(),
      id: z.string(),
    }),
    date: z.date(), // For precise sorting (internal use)
    year: z.number(), // For display on frontend
    status: z.enum(['completed', 'in-progress', 'experimental', 'archived']),
    category: z.enum(['web', 'backend', 'data-mining', 'all']),
    priority: z.number().optional(), // Display order for in-progress (higher = first)
    techStack: z.array(z.string()),
    thumbnail: z.string(), // For card display in grid
    heroImage: z.string().optional(), // Optional, for future use
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
