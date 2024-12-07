import { Event } from "../../schema/Events";
import { initializeEventsTable } from "./initialize";

export async function updateEvent(
  db: D1Database,
  id: number,
  event: Omit<Event, "id">
): Promise<Event | null> {
  await initializeEventsTable(db);
  const { title, description, location, timing, hostedBy, hostId = 0, tags = "", image = "", url = "", ods = true } = event;
  const { meta } = await db
    .prepare(
      "UPDATE events SET title = ?, description = ?, location = ?, timing = ?, hostedBy = ?, hostId = ?, tags = ?, image = ?, url = ?, ods = ? WHERE id = ?"
    )
    .bind(title, description, location, JSON.stringify(timing), hostedBy, hostId, JSON.stringify(tags), image, url, ods, id)
    .run();

  if (meta.changes > 0) {
    return { id, ...event };
  }
  return null;
}
