import { z } from "@hono/zod-openapi";

export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  time: z.string(),
});
