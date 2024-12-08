export async function initializeClubsTable(db: D1Database): Promise<void> {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS clubs (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          shortName TEXT,
          description TEXT,
          type TEXT NOT NULL,
          socialmedia TEXT,
          image TEXT NOT NULL,
          banner TEXT,
          url TEXT,
          recruiting BOOLEAN DEFAULT 0,
          recruitmentUrl TEXT,
          tags TEXT
        );`,
    )
    .run();
}
