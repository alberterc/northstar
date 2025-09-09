import {
  completeWeeklyQuest,
  getWeeklyQuests,
  insertWeeklyQuest,
} from "../services";
import { jsonResponse } from "../utils/response";

export async function handleWeeklyQuests(req, env) {
  if (req.method === "GET") {
    try {
      const data = await getWeeklyQuests(env);
      return jsonResponse(
        true,
        data.results.length > 0 ? data.results : [],
        null,
      );
    } catch (err) {
      return jsonResponse(false, null, err.message, 404);
    }
  } else if (req.method === "POST") {
    try {
      const body = await req.text();
      if (!body) {
        throw new Error("Empty Body");
      }
      data = JSON.parse(body);
    } catch (err) {
      return jsonResponse(false, null, `Invalid JSON: ${err.message}`, 500);
    }
    try {
      await insertWeeklyQuest(env, data);
      return jsonResponse(true, "Quest insert successful", null);
    } catch (err) {
      return jsonResponse(false, null, `Insert failed: ${err.message}`, 500);
    }
  } else if (req.method === "PATCH") {
    let questId;
    try {
      const body = await req.text();
      if (!body) {
        throw new Error("Empty body");
      }
      let data = JSON.parse(body);
      questId = data.id;
      if (!questId) {
        throw new Error("Empty id");
      }
    } catch (err) {
      return jsonResponse(false, null, `Invalid JSON: ${err.message}`, 500);
    }
    try {
      if (questId) {
        await completeWeeklyQuest(env, questId);
        return jsonResponse(true, { message: "Quest update successful" }, null);
      }
    } catch (err) {
      return jsonResponse(false, null, `Update failed: ${err.message}`, 500);
    }
  }

  return jsonResponse(false, null, "Not Found", 404);
}
