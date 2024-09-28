import { Event } from "../../types/Events";
import { initializeEventsTable } from "./initialize";

export async function updateEvent(
  db: D1Database,
  id: number,
  event: Omit<Event, "id">
): Promise<Event | null> {
  await initializeEventsTable(db);
  const { title, description, location, time } = event;
  const { meta } = await db
    .prepare(
      "UPDATE events SET title = ?, description = ?, location = ?, time = ? WHERE id = ?"
    )
    .bind(title, description, location, time, id)
    .run();

  if (meta.changes > 0) {
    return { id, ...event };
  }
  return null;
}
