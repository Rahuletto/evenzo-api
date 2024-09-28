import { Event } from "../../types/Events";
import { initializeEventsTable } from "./initialize";


export async function createEvent(
    db: D1Database,
    event: Omit<Event, "id">
  ): Promise<Event> {
    await initializeEventsTable(db);
    const { title, description, location, time } = event;
    const { meta } = await db
      .prepare(
        "INSERT INTO events (title, description, location, time) VALUES (?, ?, ?, ?)"
      )
      .bind(title, description, location, time)
      .run();
  
    return { id: meta.last_row_id, ...event };
  }