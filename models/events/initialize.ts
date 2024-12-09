export async function initializeEventsTable(db: D1Database): Promise<void> {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT,
        location TEXT,
        timing TEXT,
        tags TEXT,
        hostedBy TEXT NOT NULL,
        hostId INTEGER DEFAULT 0,
        image TEXT,
        url TEXT,
        ods BOOLEAN
        price TEXT DEFAULT 'Free',
        memberCount TEXT
      );`,
    )
    .run();
  }
