import { runQuery, runExec } from "../db";
import { LOCAL_TIME_OFFSET } from "../utils/date";

export async function getWeeklyQuests(env) {
  return await runQuery(
    env,
    `SELECT wq.*,
        CASE WHEN cwq.quest_id IS NOT NULL THEN 1 ELSE 0 END AS is_completed
    FROM weekly_quests wq
    JOIN active_weekly_quests awq ON wq.id = awq.quest_id
    LEFT JOIN completed_weekly_quests cwq
        ON wq.id = cwq.quest_id
        AND DATE(cwq.completed_at, ?, 'weekday 1', '-7 days') = DATE('now', ?, 'weekday 1', '-7 days')
    ORDER BY awq.quest_id`,
    [LOCAL_TIME_OFFSET, LOCAL_TIME_OFFSET],
  );
}

export async function insertWeeklyQuest(env, quest) {
  await runExec(
    env,
    `INSERT INTO weekly_quests (title, type, duration) VALUES (?, ?, ?)`,
    [quest.title, quest.type, quest.duration],
  );
}

export async function completeWeeklyQuest(env, questId) {
  // verify quest id exists
  const { results } = await runQuery(
    env,
    `SELECT id FROM weekly_quests WHERE id = ?`,
    [questId],
  );
  const questCheck = results.length;
  if (questCheck === 0) {
    throw new Error(`quest with id - "${questId}" not found.`);
  }

  // log quest completion in history table
  await runExec(
    env,
    `INSERT OR IGNORE INTO completed_weekly_quests (quest_id, completed_at) VALUES (?, CURRENT_TIMESTAMP)`,
    [questId],
  );
}

export async function rotateWeeklyQuests(env) {
  // delete previously active weekly quests
  await runExec(env, `DELETE FROM active_weekly_quests`);

  // pick 9 random weekly quests and not used in
  let data = await runQuery(
    env,
    `SELECT id FROM weekly_quests
    WHERE last_used IS NULL OR last_used < DATE('now', 'weekday 1', '-7 days')
    ORDER BY last_used ASC NULLS FIRST, RANDOM()
    LIMIT 9`,
  );
  let weekly = data.results;

  // fallback to select 9 weekly quests randomly
  if (weekly.length === 0) {
    data = await runQuery(
      env,
      `SELECT id FROM weekly_quests ORDER BY RANDOM() LIMIT 9`,
    );
    weekly = data.results;
  }

  for (const quest of weekly) {
    await runExec(
      env,
      `INSERT INTO active_weekly_quests (quest_id) VALUES (?)`,
      [quest.id],
    );

    await runExec(
      env,
      `UPDATE weekly_quests
      SET last_used = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [quest.id],
    );
  }
}
