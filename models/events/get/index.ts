import { initializeEventsTable } from "../initialize";
import { Event } from "../../../schema/Events";

export async function getAllEvents(db: D1Database): Promise<Event[]> {
  await initializeEventsTable(db);
  const { results }: any = await db.prepare("SELECT * FROM events").all();
  return results as Event[];
}