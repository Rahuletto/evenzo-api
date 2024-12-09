import { z } from "@hono/zod-openapi";

export const EventSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  timing: z.object({
    from: z.number(),
    to: z.number(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  hostedBy: z.string().optional(), // CLUB Name
  hostId: z.number().optional(), // CLUB ID (If any)
  image: z.string().optional(),
  url: z.string().optional(),
  ods: z.boolean().optional(),
  price: z.string().optional(),
  memberCount: z.object({
    from: z.number(),
    to: z.number(),
  }).optional() || z.object({ count: z.number() }).optional(),
});

export type Event = z.infer<typeof EventSchema>;