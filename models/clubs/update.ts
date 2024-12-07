import { Club } from "../../schema/Clubs";
import { initializeClubsTable } from "./initialize";

export async function updateClub(
  db: D1Database,
  id: number,
  club: Omit<Club, "id">,
): Promise<Club | null> {
  await initializeClubsTable(db);
  const { name, shortName = "", description, type, socialMedia, image, banner="", url="", recruiting, recruitmentUrl="" } = club;
  const { meta } = await db
    .prepare(
      "UPDATE clubs SET name = ?, shortname = ?, description = ?, type = ?, socialmedia = ?, image = ?, banner = ?, url = ?, recruiting = ?, recruitmentUrl = ? WHERE id = ?",
    )
    .bind(
      name,
      shortName,
      description,
      type,
      JSON.stringify(socialMedia),
      image,
      banner,
      url,
      recruiting,
      recruitmentUrl,
      id,
    )
    .run();

  if (meta.changes > 0) {
    return { id, ...club };
  }
  return null;
}
