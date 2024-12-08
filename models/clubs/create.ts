import { Club } from "../../schema/Clubs";
import { generateUUID } from "../../utils/uuid";
import { initializeClubsTable } from "./initialize";

export async function createClub(
  db: D1Database,
  club: Omit<Club, "id">,
): Promise<Club> {
  await initializeClubsTable(db);
  const { name, shortName = "", description, type, socialmedia, image, banner = "", url = "", recruiting, recruitmentUrl = "", tags = [] } = club;
  const id = generateUUID();
  const { meta } = await db
    .prepare(
      "INSERT INTO clubs (id, name, shortName, description, type, socialmedia, image, banner, url, recruiting, recruitmentUrl, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      id,
      name,
      shortName,
      description,
      type,
      JSON.stringify(socialmedia),
      image,
      banner,
      url,
      recruiting,
      recruitmentUrl,
      JSON.stringify(tags),
    )
    .run();

  return { id, ...club };
}
