import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { Event } from "../../types/Events";
import * as EventModel from "../../models/";
import { EventSchema } from "../../schema/Events";

const EventInputSchema = EventSchema.omit({ id: true });

export const eventRoutes = new OpenAPIHono();

const getEvents = createRoute({
  method: "get",
  path: "/events",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(EventSchema),
        },
      },
      description: "Successful response",
    },
  },
});

const createEventRoute = createRoute({
  method: "post",
  path: "/events",
  request: {
    body: {
      content: {
        "application/json": {
          schema: EventInputSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: EventSchema,
        },
      },
      description: "Event created",
    },
  },
});

const getEventById = createRoute({
  method: "get",
  path: "/events/{id}",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EventSchema,
        },
      },
      description: "Successful response",
    },
    404: {
      description: "Event not found",
    },
  },
});

const updateEventRoute = createRoute({
  method: "put",
  path: "/events/{id}",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: EventInputSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EventSchema,
        },
      },
      description: "Event updated",
    },
    404: {
      description: "Event not found",
    },
  },
});

const deleteEventRoute = createRoute({
  method: "delete",
  path: "/events/{id}",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Event deleted",
    },
    404: {
      description: "Event not found",
    },
  },
});

eventRoutes.openapi(getEvents, async ({ env, json }: any) => {
  const events: Event[] = await EventModel.getAllEvents((env as any).DB);
  return json(events);
});

eventRoutes.openapi(createEventRoute, async ({ env, json, req }: any) => {
  const eventInput: Omit<Event, "id"> = await req.json();
  const newEvent: Event = await EventModel.createEvent(
    (env as any).DB,
    eventInput
  );
  return json(newEvent, 201);
});

eventRoutes.openapi(getEventById, async ({ env, json, req }) => {
  const id: number = parseInt(req.param("id"));
  const event: Event | null = await EventModel.getEventById(
    (env as any).DB,
    id
  );
  if (event) {
    return json(event);
  }
  return json({ error: "Event not found" }, 404);
});

eventRoutes.openapi(updateEventRoute, async ({ env, json, req }) => {
  const id: number = parseInt(req.param("id"));
  const eventUpdate: Omit<Event, "id"> = await req.json();
  const updatedEvent: Event | null = await EventModel.updateEvent(
    (env as any).DB,
    id,
    eventUpdate
  );
  if (updatedEvent) {
    return json(updatedEvent);
  }
  return json({ error: "Event not found" }, 404);
});

eventRoutes.openapi(deleteEventRoute, async ({ env, json, req }) => {
  const id: number = parseInt(req.param("id"));
  const deleted: boolean = await EventModel.deleteEvent((env as any).DB, id);
  if (deleted) {
    return json({ message: "Event deleted successfully" });
  }
  return json({ error: "Event not found" }, 404);
});
