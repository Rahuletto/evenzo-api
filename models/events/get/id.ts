import { initializeEventsTable } from "../initialize";
import { Event } from "../../../schema/Events";

export async function getEventById(
  db: D1Database,
  id: string
): Promise<Event | null> {
  await initializeEventsTable(db);
  const event = await db
    .prepare("SELECT * FROM events WHERE id = ?")
    .bind(id)
    .first();

  if (event) {
    event.timing = JSON.parse(event.timing as string);
    event.tags = JSON.parse(event.tags as string);
    event.memberCount = JSON.parse(event.memberCount as string);
  }

  return event as Event | null;
}
