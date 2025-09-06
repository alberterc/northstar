import {
  handleAllQuests,
  handleDailyQuests,
  handleMainQuests,
  handleWeeklyQuests,
} from "./api";
import { rotateDailyQuests, rotateWeeklyQuests } from "./services";
import { jsonResponse } from "./utils/response";

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.startsWith("/api")) {
      const segments = path.split("/").filter(Boolean);
      switch (segments[1]) {
        case "all-quests":
          return handleAllQuests(req, env);
        case "main-quests":
          return handleMainQuests(req, env);
        case "daily-quests":
          return handleDailyQuests(req, env);
        case "weekly-quests":
          return handleWeeklyQuests(req, env);
        default:
          return jsonResponse(false, null, "Not Found", 404);
      }
    }

    // if (url.pathname === "/all-quests") {
    //   return handleAllQuests(req, env);
    // } else if (url.pathname === "/main-quests") {
    //   return handleMainQuests(req, env);
    // } else if (url.pathname === "/daily-quests") {
    //   return handleDailyQuests(req, env);
    // } else if (url.pathname === "/weekly-quests") {
    //   return handleWeeklyQuests(req, env);
    // }
    // return jsonResponse(false, null, "Not Found", 404);

    try {
      return env.ASSETS.fetch(req);
    } catch (err) {
      return jsonResponse(false, null, `Not Found: ${err.message}`, 404);
    }
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
