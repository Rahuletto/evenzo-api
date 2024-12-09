import { Event } from "../../schema/Events";
import { generateUUID } from "../../utils/uuid";
import { initializeEventsTable } from "./initialize";

export async function createEvent(
  db: D1Database,
  event: Omit<Event, "id">
): Promise<Event> {
  await initializeEventsTable(db);
  const { title, description, location, timing, hostedBy, hostId = 0, tags = "", image = "", url = "", ods = true, price = "Free", memberCount } = event;
  const id = generateUUID(32);
  const { meta } = await db
    .prepare(
      "INSERT INTO events (id, title, description, location, timing, hostedBy, hostId, tags, image, url, ods, price, memberCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(id, title, description, location, JSON.stringify(timing), hostedBy, hostId, JSON.stringify(tags), image, url, ods, price, JSON.stringify(memberCount))
    .run();

  return { id, ...event };
}