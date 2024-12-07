import { initializeEventsTable } from "../initialize";
import { Event } from "../../../schema/Events";

export async function getEventById(
  db: D1Database,
  id: number
): Promise<Event | null> {
  await initializeEventsTable(db);
  const event = await db
    .prepare("SELECT * FROM events WHERE id = ?")
    .bind(id)
    .first();
  return event as Event | null;
}
