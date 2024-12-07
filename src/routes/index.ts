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
  const parsedEvents = events.map(event => ({
    ...event,
    timing: JSON.parse(String(event.timing)),
    tags: JSON.parse(String(event.tags)),
    ods: String(event.ods) === "TRUE"
  }));
  return json(parsedEvents);
});

routes.openapi(createEventRoute, async ({ env, json, req }) => {
  const eventInput: Omit<Event, "id"> = await req.json();
  const obj = {
    ...eventInput,
    timing: JSON.stringify(eventInput.timing),
    tags: JSON.stringify(eventInput.tags),
    ods: eventInput.ods ? "TRUE" : "FALSE"
  }
  const newEvent: Event = await EventModel.createEvent(
    (env as any).DB,
    obj as any,
  );

  return json({
    ...newEvent,
    timing: JSON.parse(String(newEvent.timing)),
    tags: JSON.parse(String(newEvent.tags)),
    ods: String(newEvent.ods) === "TRUE"
  }, 201);
});

routes.openapi(getEventById, async ({ env, json, req }) => {
  const id: number = parseInt(req.param("id"));
  const event: Event | null = await EventModel.getEventById(
    (env as any).DB,
    id,
  );
  if (event) {
    return json({
      ...event,
      timing: JSON.parse(String(event.timing)),
      tags: JSON.parse(String(event.tags)),
      ods: String(event.ods) === "TRUE"
    });
  }
  return json({ error: "Event not found" }, 404);
});

routes.openapi(updateEventRoute, async ({ env, json, req }) => {
  const id: number = parseInt(req.param("id"));
  const eventUpdate: Omit<Event, "id"> = await req.json();
  const parsedEventUpdate = {
    ...eventUpdate,
    ...(eventUpdate.timing && { timing: JSON.stringify(eventUpdate.timing) }),
    ...(eventUpdate.tags && { tags: JSON.stringify(eventUpdate.tags) }),
    ...(eventUpdate.ods !== undefined && { ods: eventUpdate.ods ? "TRUE" : "FALSE" })
  };
  const updatedEvent: Event | null = await EventModel.updateEvent(
    (env as any).DB,
    id,
    parsedEventUpdate as any,
  );
  if (updatedEvent) {
    return json(updatedEvent);
  }
  return json({ error: "Event not found" }, 404);
});

routes.openapi(deleteEventRoute, async ({ env, json, req }) => {
  const id: number = parseInt(req.param("id"));
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
  const parsed = clubs.map(club => ({
    ...club,
    socialmedia: JSON.parse(String(club.socialmedia ?? "{}")),
    recruiting: Number(club.recruiting) == 0 ? false : true
  }))
  return json(parsed);
});

routes.openapi(createClubRoute, async ({ env, json, req }) => {
  const clubInput: Omit<Club, "id"> = await req.json();
  const club = {
    ...clubInput,
    socialmedia: JSON.stringify(clubInput.socialmedia ?? {}),
    recruiting: clubInput.recruiting ? 1 : 0
  }
  const newClub: Club = await ClubModel.createClub(
    (env as any).DB,
    club as any,
  );

  return json({
    ...newClub,
    socialmedia: JSON.parse(String(newClub.socialmedia)),
    recruiting: Number(newClub.recruiting) == 0 ? false : true
  }, 201);
});


// routes.openapi(createClubsRoute, async ({ env, json, req }) => {
//   const clubInput: Omit<Club[], "id"> = await req.json();
//   const newClub: Club[] = await ClubModel.createClubs(
//     (env as any).DB,
//     clubInput,
//   );
//   return json(newClub, 201);
// });


routes.openapi(getClubById, async ({ env, json, req }) => {
  const id: number = parseInt(req.param("id"));
  const club: Club | null = await ClubModel.getClubById(
    (env as any).DB,
    id,
  );
  if (club) {
    const parsed = {
      ...club,
      socialmedia: JSON.parse(String(club.socialmedia)),
      recruiting: Number(club.recruiting) == 0 ? false : true
    }

    return json(parsed);
  }
  return json({ error: "Club not found" }, 404);
});

routes.openapi(updateClubRoute, async ({ env, json, req }) => {
  const id: number = parseInt(req.param("id"));
  const clubUpdate: Omit<Club, "id"> = await req.json();

  const parsed = {
    ...clubUpdate,
    ...(clubUpdate.socialmedia && { socialmedia: JSON.stringify(clubUpdate.socialmedia || {}) }),
    ...(clubUpdate.recruiting !== undefined && { recruiting: clubUpdate.recruiting ? 1 : 0 })
  }

  const updatedClub: Club | null = await ClubModel.updateClub(
    (env as any).DB,
    id,
    parsed as any,
  );
  if (updatedClub) {
    return json({
      ...updatedClub,
      socialmedia: JSON.parse(String(updatedClub.socialmedia)),
      recruiting: Number(updatedClub.recruiting) == 0 ? false : true
    });
  }
  return json({ error: "Club not found" }, 404);
});

routes.openapi(deleteClubRoute, async ({ env, json, req }) => {
  const id: number = parseInt(req.param("id"));
  const deleted: boolean = await ClubModel.deleteClub((env as any).DB, id);
  if (deleted) {
    return json({ message: "Club deleted successfully" });
  }
  return json({ error: "Club not found" }, 404);
});
