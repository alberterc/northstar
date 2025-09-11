import { runQuery, runExec } from "../db";

export async function getMainQuests(env, questStatus) {
  let query = "";
  if (questStatus === "") {
    query = `SELECT * FROM main_quest`;
  } else {
    query = `SELECT * FROM main_quest WHERE status = '${questStatus}'`;
  }

  return await runQuery(env, query);
}

export async function getMainQuestsExcl(env, questStatus) {
  let query = "";
  if (questStatus === "") {
    query = `SELECT * FROM main_quest`;
  } else {
    query = `SELECT * FROM main_quest WHERE status != '${questStatus}'`;
  }

  return await runQuery(env, query);
}

export async function insertMainQuest(env, quest) {
  if (quest.description === "") {
    quest.description = null;
  } else if (quest.duration === "") {
    quest.duration = null;
  } else if (quest.started_at === "") {
    quest.started_at = null;
  }
  await runExec(
    env,
    `INSERT INTO main_quest (title, description, duration, status, started_at) VALUES (?, ?, ?, ?, ?)`,
    [
      quest.title,
      quest.description,
      quest.duration,
      quest.status,
      quest.started_at,
    ],
  );
}

export async function startMainQuest(env, questId) {
  // verify quest id exists
  const { results } = await runQuery(
    env,
    `SELECT id, status from main_quest WHERE id = ?`,
    [questId],
  );
  if (results.length === 0) {
    throw new Error(`quest with id - "${questId}" not found.`);
  } else if (results[0].status != "pending") {
    throw new Error(`quest with id - "${questId}" is not pending.`);
  }

  // log quest start
  await runExec(
    env,
    `UPDATE main_quest
    SET status = 'in_progress',
    started_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status = 'pending'`,
    [questId],
  );
}

export async function completeMainQuest(env, questId) {
  // verify quest id exists
  const { results } = await runQuery(
    env,
    `SELECT id, status from main_quest WHERE id = ?`,
    [questId],
  );

  if (results.length === 0) {
    throw new Error(`quest with id - "${questId}" not found.`);
  } else if (results[0].status != "in_progress") {
    throw new Error(`quest with id - "${questId}" is not in progress.`);
  }

  // log quest completion
  await runExec(
    env,
    `UPDATE main_quest
    SET status = 'completed',
    completed_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status = 'in_progress'`,
    [questId],
  );
}
