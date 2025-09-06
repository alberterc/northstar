import {
  completeMainQuest,
  getMainQuests,
  getMainQuestsExcl,
  insertMainQuest,
  startMainQuest,
} from "../services";
import { jsonResponse } from "../utils/response";

export async function handleMainQuests(req, env) {
  if (req.method === "GET") {
    let questStatus = "";
    let isExclude = false;
    try {
      const body = await req.text();
      if (!body) {
        throw new Error("Empty Body");
      }
      let data = JSON.parse(body);
      questStatus = data.quest_status;
      isExclude = data.is_exclude;
    } catch (err) {
      return jsonResponse(false, null, `Invalid JSON: ${err.message}`, 500);
    }
    try {
      if (isExclude) {
        const res = await getMainQuestsExcl(env, questStatus);
        return jsonResponse(
          true,
          res.results.length > 0 ? res.results : [],
          null,
        );
      } else {
        const res = await getMainQuests(env, questStatus);
        return jsonResponse(
          true,
          res.results.length > 0 ? res.results : [],
          null,
        );
      }
    } catch (err) {
      return jsonResponse(false, null, `Insert failed: ${err.message}`, 500);
    }
  } else if (req.method === "POST") {
    let data = {};
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
      await insertMainQuest(env, data);
      return jsonResponse(true, "Quest insert successful", null);
    } catch (err) {
      return jsonResponse(false, null, `Insert failed: ${err.message}`, 500);
    }
  } else if (req.method === "PATCH") {
    let questId;
    let updateType;
    try {
      const body = await req.text();
      if (!body) {
        throw new Error("Empty body");
      }
      let data = JSON.parse(body);
      questId = data.id;
      updateType = data.update_type;
      if (!questId) {
        throw new Error("Empty id");
      }
      if (!updateType) {
        throw new Error("Empty update type");
      }
    } catch (err) {
      return jsonResponse(false, null, `Invalid JSON: ${err.message}`, 500);
    }
    try {
      if (questId) {
        if (updateType === "start") {
          await startMainQuest(env, questId);
          return jsonResponse(
            true,
            { message: "Quest update successful" },
            null,
          );
        } else if (updateType === "complete") {
          await completeMainQuest(env, questId);
          return jsonResponse(
            true,
            { message: "Quest update successful" },
            null,
          );
        } else {
          return jsonResponse(
            false,
            null,
            `Update failed: Invalid update type.`,
            500,
          );
        }
      }
    } catch (err) {
      return jsonResponse(false, null, `Update failed: ${err.message}`, 500);
    }
  }

  return jsonResponse(false, null, "Not Found", 404);
}
