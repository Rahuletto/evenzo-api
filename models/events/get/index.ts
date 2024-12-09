import { initializeEventsTable } from "../initialize";
import { Event } from "../../../schema/Events";

export async function getAllEvents(db: D1Database): Promise<Event[]> {
  await initializeEventsTable(db);
  const { results }: any = await db.prepare("SELECT * FROM events").all();
  return results.map((ev: Event) => {
    ev.tags = JSON.parse((ev.tags ?? "[]") as string);
    ev.timing = JSON.parse(ev.timing as unknown as string);
    ev.memberCount = JSON.parse(ev.memberCount as unknown as string);
    return ev;
  }) as Event[];
}