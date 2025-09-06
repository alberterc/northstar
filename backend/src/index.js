import {
  handleAllQuests,
  handleDailyQuests,
  handleMainQuests,
  handleWeeklyQuests,
} from "./api";
import { rotateDailyQuests, rotateWeeklyQuests } from "./services";

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);

    if (url.pathname === "/all-quests") {
      return handleAllQuests(req, env);
    } else if (url.pathname === "/main-quests") {
      return handleMainQuests(req, env);
    } else if (url.pathname === "/daily-quests") {
      return handleDailyQuests(req, env);
    } else if (url.pathname === "/weekly-quests") {
      return handleWeeklyQuests(req, env);
    }
    return jsonResponse(false, null, "Not Found", 404);
  },

  async scheduled(event, env, ctx) {
    const cron = event.cron;

    if (cron === env.CRON.DAILY_MIDNIGHT) {
      console.log("Running daily quest rotation...");
      await rotateDailyQuests(env);
    } else if (cron === env.CRON.WEEKLY_MIDNIGHT) {
      console.log("Running weekly quest rotation...");
      await rotateWeeklyQuests(env);
    }
  },
};
