-- Main quest
INSERT INTO main_quest (title, description, duration, status, started_at, completed_at)
VALUES
('Master Basic Japanese Conversation', 'Hold a 5-minute conversation entirely in Japanese with no English words.', '4 weeks', 'in_progress', '2025-08-03 00:00:00', NULL),
('Launch Northstar MVP', 'Release the first public version of Northstar with working daily and weekly quests.', '1 month', 'pending', NULL, NULL),
('Complete Singing Warm-up Routine', 'Sing every day for a week without missing a day.', '1 week', 'completed', '2025-08-01 00:00:00', '2025-08-09 00:00:00');

-- Daily quests
INSERT INTO daily_quests (title, type, duration, last_used)
VALUES
('Learn 5 New Japanese Words', 'language', '15m', '2025-08-09 00:00:00'),
('Review Yesterday’s Code', 'development', '20m', '2025-08-10 00:00:00'),
('Sing for 10 Minutes', 'music', '10m', NULL),
('Do 3 Stretching Exercises', 'wellness', '5m', NULL);

-- Weekly quests
INSERT INTO weekly_quests (title, type, duration, last_used)
VALUES
('Finish 3 Song Covers', 'music', '5h', '2025-08-08 00:00:00'),
('Add Quest History Page', 'development', '3h', NULL),
('Complete 7-Day Language Challenge', 'language', '7h', '2025-08-03 00:00:00');
