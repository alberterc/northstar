export function getDB(env) {
  return env.DB;
}

export async function runQuery(env, sql, params = []) {
  try {
    return await getDB(env)
      .prepare(sql)
      .bind(...params)
      .all();
  } catch (err) {
    throw new Error(`Query failed: ${err.message}`);
  }
}

export async function runExec(env, sql, params = []) {
  try {
    await getDB(env)
      .prepare(sql)
      .bind(...params)
      .run();
  } catch (err) {
    throw new Error(`Exec failed: ${err.message}`);
  }
}
