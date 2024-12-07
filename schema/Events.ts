import { z } from "@hono/zod-openapi";

export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  timing: z.object({
    from: z.number(),
    to: z.number(),
  }),
  hostedBy: z.number(), // CLUB ID
  image: z.string(),
  url: z.string().optional(),
  ods: z.boolean().optional(),
});

export type Event = z.infer<typeof EventSchema>;