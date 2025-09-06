-- Main quest
CREATE TABLE IF NOT EXISTS main_quest (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	description TEXT,
	duration TEXT,
	status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
	started_at DATETIME,
	completed_at DATETIME
);

-- Daily quests
CREATE TABLE IF NOT EXISTS daily_quests (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	type TEXT NOT NULL,
	duration TEXT,
	last_used DATETIME
);

CREATE TABLE IF NOT EXISTS active_daily_quests (
	quest_id INTEGER NOT NULL,
	PRIMARY KEY (quest_id),
	FOREIGN KEY (quest_id) REFERENCES daily_quests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS completed_daily_quests (
	quest_id INTEGER NOT NULL,
	completed_at DATETIME NOT NULL,
	PRIMARY KEY (quest_id, completed_at),
	FOREIGN KEY (quest_id) REFERENCES daily_quests(id) ON DELETE CASCADE
);

-- Weekly quests
CREATE TABLE IF NOT EXISTS weekly_quests (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	type TEXT NOT NULL,
	duration TEXT,
	last_used DATETIME
);

CREATE TABLE IF NOT EXISTS active_weekly_quests (
	quest_id INTEGER NOT NULL,
	PRIMARY KEY (quest_id),
	FOREIGN KEY (quest_id) REFERENCES weekly_quests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS completed_weekly_quests (
	quest_id INTEGER NOT NULL,
	completed_at DATETIME NOT NULL,
	PRIMARY KEY (quest_id, completed_at),
	FOREIGN KEY (quest_id) REFERENCES weekly_quests(id) ON DELETE CASCADE
);
