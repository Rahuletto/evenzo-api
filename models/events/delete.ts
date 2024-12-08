import { initializeEventsTable } from "./initialize";

export async function deleteEvent(
  db: D1Database,
  id: string
): Promise<boolean> {
  await initializeEventsTable(db);
  const { meta } = await db
    .prepare("DELETE FROM events WHERE id = ?")
    .bind(id)
    .run();

  return meta.changes > 0;
}