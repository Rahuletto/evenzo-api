import { initializeClubsTable } from "../initialize";

import { Club } from "../../../schema/Clubs";

export async function getClubById(
  db: D1Database,
  id: number
): Promise<Club | null> {
  await initializeClubsTable(db);
  const event = await db
    .prepare("SELECT * FROM clubs WHERE id = ?")
    .bind(id)
    .first();
  return event as Club | null;
}
