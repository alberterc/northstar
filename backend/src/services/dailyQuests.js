import { runExec, runQuery } from "../db";
import { LOCAL_TIME_OFFSET } from "../utils/date";

export async function getDailyQuests(env) {
  return await runQuery(
    env,
    `SELECT dq.*,
        CASE WHEN cdq.quest_id IS NOT NULL THEN 1 ELSE 0 END AS is_completed
    FROM daily_quests dq
    JOIN active_daily_quests adq ON dq.id = adq.quest_id
    LEFT JOIN completed_daily_quests cdq
        ON dq.id = cdq.quest_id
        AND DATE(cdq.completed_at, ?) = DATE('now', ?)
    ORDER BY adq.quest_id`,
    [LOCAL_TIME_OFFSET, LOCAL_TIME_OFFSET],
  );
}

export async function insertDailyQuest(env, quest) {
  await runExec(
    env,
    `INSERT INTO daily_quests (title, type, duration) VALUES (?, ?, ?)`,
    [quest.title, quest.type, quest.duration],
  );
}

export async function completeDailyQuest(env, questId) {
  // verify quest id exists
  const { results } = await runQuery(
    env,
    `SELECT id FROM daily_quests WHERE id = ?`,
    [questId],
  );
  const questCheck = results.length;
  if (questCheck === 0) {
    throw new Error(`quest with id - "${questId}" not found.`);
  }

  // log quest completion in history table
  await runExec(
    env,
    `INSERT INTO completed_daily_quests (quest_id, completed_at) VALUES (?, CURRENT_TIMESTAMP)`,
    [questId],
  );
}

export async function rotateDailyQuests(env) {
  // delete previously active daily quests
  await runExec(env, `DELETE FROM active_daily_quests`);

  // pick 5 random daily quests and not used in last 7 days
  let data = await runQuery(
    env,
    `SELECT id FROM daily_quests
    WHERE last_used IS NULL OR last_used < DATE('now', '-7 days')
    ORDER BY last_used ASC NULLS FIRST, RANDOM()
    LIMIT 5`,
  );
  let daily = data.results;

  // fallback to select 5 daily quests randomly
  if (daily.length === 0) {
    data = await runQuery(
      env,
      `SELECT id FROM daily_quests ORDER BY RANDOM() LIMIT 5`,
    );
    daily = data.results;
  }

  for (const quest of daily) {
    await runExec(
      env,
      `INSERT INTO active_daily_quests (quest_id) VALUES (?)`,
      [quest.id],
    );

    await runExec(
      env,
      `UPDATE daily_quests
      SET last_used = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [quest.id],
    );
  }
}
