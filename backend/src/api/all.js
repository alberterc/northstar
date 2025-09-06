import {
  getDailyQuests,
  getMainQuestsExcl,
  getWeeklyQuests,
} from "../services";
import { jsonResponse } from "../utils/response";

export async function handleAllQuests(req, env) {
  if (req.method === "GET") {
    const mainData = await getMainQuestsExcl(env, "completed");
    const dailyData = await getDailyQuests(env);
    const weeklyData = await getWeeklyQuests(env);

    const main = mainData.results.length ? mainData.results : [];
    const daily = dailyData.results.length ? dailyData.results : [];
    const weekly = weeklyData.results.length ? weeklyData.results : [];

    return jsonResponse(true, { main, daily, weekly }, null);
  }

  return jsonResponse(false, null, "Not Found", 404);
}
