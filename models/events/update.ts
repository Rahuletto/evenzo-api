import { Event } from "../../schema/Events";
import { initializeEventsTable } from "./initialize";

export async function updateEvent(
  db: D1Database,
  id: string,
  event: Omit<Event, "id">
): Promise<Event | null> {
  await initializeEventsTable(db);

  // First, get the existing event
  const existingEvent = await db
    .prepare("SELECT * FROM events WHERE id = ?")
    .bind(id)
    .first<Event>();

  if (!existingEvent) return null;

  const parsedEvent = {
    ...event,
    ...(event.timing ? { socialmedia: JSON.stringify(event.timing) } : {}),
    ...(event.tags ? { tags: JSON.stringify(event.tags) } : {}),
    ...(event.memberCount ? { memberCount: JSON.stringify(event.memberCount) } : {})
  }

  const updatedEvent = { ...existingEvent, ...parsedEvent };

  const { meta } = await db
    .prepare(
      "UPDATE events SET title = ?, type = ?, description = ?, location = ?, timing = ?, hostedBy = ?, hostId = ?, tags = ?, image = ?, url = ?, ods = ?, price = ?, memberCount = ? WHERE id = ?"
    )
    .bind(
      updatedEvent.title,
      updatedEvent.type,
      updatedEvent.description,
      updatedEvent.location,
      updatedEvent.timing,
      updatedEvent.hostedBy,
      updatedEvent.hostId,
      updatedEvent.tags,
      updatedEvent.image,
      updatedEvent.url,
      updatedEvent.ods,
      updatedEvent.price,
      updatedEvent.memberCount,
      id
    )
    .run();

  if (meta.changes > 0) {
    const json = {
      ...updatedEvent,
      timing: JSON.parse(updatedEvent.timing as unknown as string),
      tags: JSON.parse(updatedEvent.tags as string),
      memberCount: JSON.parse(updatedEvent.memberCount as string)
    }
    return { ...json };
  }
  return null;
}
