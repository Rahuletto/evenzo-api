import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Event } from "../../schema/Events";
import { Club } from "../../schema/Clubs";
import * as EventModel from "../../models/events/index";
import * as ClubModel from "../../models/clubs/index";
import { EventSchema } from "../../schema/Events";
import { ClubsSchema } from "../../schema/Clubs";

const EventInputSchema = EventSchema.omit({ id: true });
const ClubInputSchema = ClubsSchema.omit({ id: true });

export const routes = new OpenAPIHono();

// Event Routes
const getEvents = createRoute({
  method: "get",
  path: "/events",
  tags: ["Events"],
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
  tags: ["Events"],
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
  tags: ["Events"],
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
  tags: ["Events"],
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
  tags: ["Events"],
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

routes.openapi(getEvents, async ({ env, json }) => {
  const events: Event[] = await EventModel.getAllEvents((env as any).DB);
  return json(events);
});

routes.openapi(createEventRoute, async ({ env, json, req }) => {
  const eventInput: Omit<Event, "id"> = await req.json();
  const newEvent: Event = await EventModel.createEvent(
    (env as any).DB,
    eventInput
  );

  return json(newEvent, 201);
});

routes.openapi(getEventById, async ({ env, json, req }) => {
  const id: string = req.param("id");
  const event: Event | null = await EventModel.getEventById(
    (env as any).DB,
    id,
  );
  if (event) {
    return json(event);
  }
  return json({ error: "Event not found" }, 404);
});

routes.openapi(updateEventRoute, async ({ env, json, req }) => {
  const id: string = req.param("id");
  const eventUpdate: Omit<Event, "id"> = await req.json();
  const updatedEvent: Event | null = await EventModel.updateEvent(
    (env as any).DB,
    id,
    eventUpdate as any,
  );
  if (updatedEvent) {
    return json(updatedEvent);
  }
  return json({ error: "Event not found" }, 404);
});

routes.openapi(deleteEventRoute, async ({ env, json, req }) => {
  const id: string = req.param("id");
  const deleted: boolean = await EventModel.deleteEvent((env as any).DB, id);
  if (deleted) {
    return json({ message: "Event deleted successfully" });
  }
  return json({ error: "Event not found" }, 404);
});

// Club Routes
const getClubs = createRoute({
  method: "get",
  path: "/clubs",
  tags: ["Clubs"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(ClubsSchema),
        },
      },
      description: "Successful response",
    },
  },
});

const createClubRoute = createRoute({
  method: "post",
  path: "/clubs",
  tags: ["Clubs"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ClubInputSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: ClubsSchema,
        },
      },
      description: "Club created",
    },
  },
});
const createClubsRoute = createRoute({
  method: "post",
  path: "/clubs/all",
  tags: ["Clubs"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ClubInputSchema.array(),
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.array(ClubsSchema),
        },
      },
      description: "Clubs created",
    },
  },
});

const getClubById = createRoute({
  method: "get",
  path: "/clubs/{id}",
  tags: ["Clubs"],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ClubsSchema,
        },
      },
      description: "Successful response",
    },
    404: {
      description: "Club not found",
    },
  },
});

const updateClubRoute = createRoute({
  method: "put",
  path: "/clubs/{id}",
  tags: ["Clubs"],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: ClubInputSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ClubsSchema,
        },
      },
      description: "Club updated",
    },
    404: {
      description: "Club not found",
    },
  },
});

const deleteClubRoute = createRoute({
  method: "delete",
  path: "/clubs/{id}",
  tags: ["Clubs"],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Club deleted",
    },
    404: {
      description: "Club not found",
    },
  },
});

routes.openapi(getClubs, async ({ env, json }) => {
  const clubs: Club[] = await ClubModel.getAllClubs((env as any).DB);
  return json(clubs);
});

routes.openapi(createClubRoute, async ({ env, json, req }) => {
  const club: Omit<Club, "id"> = await req.json();
  console.log(club)
  const newClub: Club = await ClubModel.createClub(
    (env as any).DB,
    club,
  );

  return json(newClub, 201);
});


routes.openapi(createClubsRoute, async ({ env, json, req }) => {
  const clubInput: Omit<Club[], "id"> = await req.json();
  const newClub: Club[] = await ClubModel.createClubs(
    (env as any).DB,
    clubInput,
  );
  return json(newClub, 201);
});


routes.openapi(getClubById, async ({ env, json, req }) => {
  const id: string = req.param("id");
  const club: Club | null = await ClubModel.getClubById(
    (env as any).DB,
    id,
  );
  if (club) {
    return json(club);
  }
  return json({ error: "Club not found" }, 404);
});

routes.openapi(updateClubRoute, async ({ env, json, req }) => {
  const id: string = req.param("id");
  const clubUpdate: Omit<Club, "id"> = await req.json();


  const updatedClub: Club | null = await ClubModel.updateClub(
    (env as any).DB,
    id,
    clubUpdate,
  );
  if (updatedClub) {
    return json(updatedClub);
  }
  return json({ error: "Club not found" }, 404);
});

routes.openapi(deleteClubRoute, async ({ env, json, req }) => {
  const id: string = req.param("id");
  const deleted: boolean = await ClubModel.deleteClub((env as any).DB, id);
  if (deleted) {
    return json({ message: "Club deleted successfully" });
  }
  return json({ error: "Club not found" }, 404);
});
