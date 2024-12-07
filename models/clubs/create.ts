import { Club } from "../../schema/Clubs";
import { initializeClubsTable } from "./initialize";

export async function createClub(
  db: D1Database,
  club: Omit<Club, "id">,
): Promise<Club> {
  await initializeClubsTable(db);
  const { name, shortName = "", description, type, socialMedia, image, banner = "", url = "", recruiting, recruitmentUrl = "" } = club;
  const { meta } = await db
    .prepare(
      "INSERT INTO clubs (name, shortname, description, type, socialMedia, image, banner, url, recruiting, recruitmentUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
    )
    .run();

  return { id: meta.last_row_id, ...club };
}
