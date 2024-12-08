import { z } from "@hono/zod-openapi";

export const ClubsSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  socialmedia: z.union([z.string(), z.object({
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    x: z.string().optional(),
  })]).optional(),
  image: z.string().optional(),
  banner: z.string().optional(),
  url: z.string().optional(),
  recruiting: z.boolean().default(false),
  recruitmentUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type Club = z.infer<typeof ClubsSchema>;