export async function initializeEventsTable(db: D1Database): Promise<void> {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        location TEXT,
        timing TEXT,
        hostedBy INTEGER NOT NULL,
        image TEXT,
        url TEXT,
        ods BOOLEAN
      );`,
    )
    .run();
}
