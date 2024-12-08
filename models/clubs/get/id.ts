import { initializeClubsTable } from "../initialize";

import { Club } from "../../../schema/Clubs";

export async function getClubById(
  db: D1Database,
  id: string
): Promise<Club | null> {
  await initializeClubsTable(db);
  const club = await db
    .prepare("SELECT * FROM clubs WHERE id = ?")
    .bind(id)
    .first();

  if (club) {
    club.tags = JSON.parse(club.tags as string);
    club.socialmedia = JSON.parse(club.socialmedia as string);
  }
  return club as Club | null;
}
