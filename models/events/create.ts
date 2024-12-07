import { Event } from "../../schema/Events";
import { initializeEventsTable } from "./initialize";

export async function createEvent(
  db: D1Database,
  event: Omit<Event, "id">
): Promise<Event> {
  await initializeEventsTable(db);
  const { title, description, location, timing, hostedBy, hostId = 0, tags = "", image = "", url = "", ods = true } = event;
  const { meta } = await db
    .prepare(
      "INSERT INTO events (title, description, location, timing, hostedBy, hostId, tags, image, url, ods) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(title, description, location, JSON.stringify(timing), hostedBy, hostId, JSON.stringify(tags), image, url, ods)
    .run();

  return { id: meta.last_row_id, ...event };
}