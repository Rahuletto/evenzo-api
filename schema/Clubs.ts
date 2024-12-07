import { z } from "@hono/zod-openapi";

export const ClubsSchema = z.object({
  id: z.number(),
  name: z.string(),
  shortName: z.string().optional(),
  description: z.string(),
  type: z.string(),
  socialmedia: z.union([z.string(), z.object({
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    x: z.string().optional(),
  })]).optional(),
  image: z.string(),
  banner: z.string().optional(),
  url: z.string().optional(),
  recruiting: z.boolean().default(false),
  recruitmentUrl: z.string().optional(),
});

export type Club = z.infer<typeof ClubsSchema>;