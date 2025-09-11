import "./style.css";
import { getQuests } from "./js/db.js";
import { renderDailyQuests } from "./js/quests/daily.js";
import { renderMainQuests } from "./js/quests/main.js";
import { renderWeeklyQuests } from "./js/quests/weekly.js";

window.addEventListener("DOMContentLoaded", async () => {
  const quest = (await getQuests()) || {};
  const currDate = new Date();
  const dailyQuestMax = 3;

  const dateEl = document.getElementById("date");
  if (dateEl != null) {
    dateEl.innerText = currDate.toDateString().replace(" ", ", ");
  }

  renderMainQuests(quest.main);
  renderDailyQuests(currDate, quest.daily, dailyQuestMax);
  renderWeeklyQuests(quest.weekly);
});
