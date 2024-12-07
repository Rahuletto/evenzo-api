import { Event } from "../../schema/Events";
import { initializeEventsTable } from "./initialize";

export async function createEvent(
  db: D1Database,
  event: Omit<Event, "id">
): Promise<Event> {
  await initializeEventsTable(db);
  const { title, description, location, timing, hostedBy, image, url, ods } = event;
  const { meta } = await db
    .prepare(
      "INSERT INTO events (title, description, location, timing, hostedBy, image, url, ods) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(title, description, location, JSON.stringify(timing), hostedBy, image, url, ods)
    .run();

  return { id: meta.last_row_id, ...event };
}