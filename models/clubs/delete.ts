import { initializeClubsTable } from "./initialize";

export async function deleteClub(
  db: D1Database,
  id: number
): Promise<boolean> {
  await initializeClubsTable(db);
  const { meta } = await db
    .prepare("DELETE FROM clubs WHERE id = ?")
    .bind(id)
    .run();

  return meta.changes > 0;
}