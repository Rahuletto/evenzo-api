import { Club } from "../../schema/Clubs";
import { initializeClubsTable } from "./initialize";

export async function updateClub(
  db: D1Database,
  id: string,
  club: Omit<Club, "id">,
): Promise<Club | null> {
  await initializeClubsTable(db);
  const existingClub = await db
    .prepare("SELECT * FROM clubs WHERE id = ?")
    .bind(id)
    .first<Club>();

  if (!existingClub) return null;

  const parsedClub = {
    ...club,
    ...(club.socialmedia ? { socialmedia: JSON.stringify(club.socialmedia) } : {}),
    ...(club.tags ? { tags: JSON.stringify(club.tags) } : {}),
  }

  const updatedClub = { ...existingClub, ...parsedClub };
  console.log(updatedClub)
  const { meta } = await db
    .prepare(
      "UPDATE clubs SET name = ?, shortName = ?, description = ?, type = ?, socialmedia = ?, image = ?, banner = ?, url = ?, recruiting = ?, recruitmentUrl = ?, tags = ? WHERE id = ?",
    )
    .bind(
      updatedClub.name,
      updatedClub.shortName,
      updatedClub.description,
      updatedClub.type,
      updatedClub.socialmedia,
      updatedClub.image,
      updatedClub.banner,
      updatedClub.url,
      updatedClub.recruiting,
      updatedClub.recruitmentUrl,
      updatedClub.tags,
      id,
    )
    .run();

  if (meta.changes > 0) {
    const json = {
      ...updatedClub,
      socialmedia: JSON.parse(updatedClub.socialmedia as string),
      tags: JSON.parse(updatedClub.tags as string),
    }
    return { ...json };
  }
  return null;
}
