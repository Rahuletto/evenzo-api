import { initializeClubsTable } from "../initialize";
import { Club } from "../../../schema/Clubs";

export async function getAllClubs(db: D1Database): Promise<Club[]> {
  await initializeClubsTable(db);
  const { results }: any = await db.prepare("SELECT * FROM clubs").all();
  return results as Club[];
}