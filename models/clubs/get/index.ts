import { initializeClubsTable } from "../initialize";
import { Club } from "../../../schema/Clubs";

export async function getAllClubs(db: D1Database): Promise<Club[]> {
  await initializeClubsTable(db);
  const { results }: any = await db.prepare("SELECT * FROM clubs").all();
  return results.map((club: Club) => {
    club.tags = JSON.parse((club.tags ?? "[]") as string);
    club.socialmedia = JSON.parse(club.socialmedia as string);
    return club;
  }) as Club[];
}