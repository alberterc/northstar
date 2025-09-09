import { completeDailyQuest, getDailyQuests } from "../db.js";
import { upperCaseFirstLetter } from "../utils.js";

export function renderDailyQuests(date, quests, dailyQuestMax) {
  const dailyQuestContainerEl = document.getElementById("daily-quest-container");
  if (dailyQuestContainerEl) {
    loadDailyCaption(date);
    loadProgressBar(quests, dailyQuestContainerEl, dailyQuestMax);
    loadDailyCards(quests, dailyQuestContainerEl, dailyQuestMax);
  }
}

function loadProgressBar(quests, questContainerEl, dailyQuestMax) {
  const progressBarEl = questContainerEl.querySelector(".daily-progress");
  if (progressBarEl) {
    const children = Array.from(progressBarEl.children);
    const circles = children.filter((_, i) => i % 2 === 0);
    const lines = children.filter((_, i) => i % 2 !== 0);

    if (quests && quests.length > 0) {
      const finishedQuest = quests.filter(q => q.is_completed === 1).length;
      if (finishedQuest >= 0) {
        for (let i = 1; i <= finishedQuest; i++) {
          circles[i - 1].classList.add("bg-success");
          if (i - 1 < lines.length) lines[i - 1].classList.add("bg-secondary");
          if (i - 2 >= 0) lines[i - 2].classList.add("bg-success");
        }
        if (finishedQuest !== dailyQuestMax) {
          circles[finishedQuest].classList.add("bg-secondary");
        }
      }
    }
  }
}

function loadDailyCards(quests, questContainerEl, dailyQuestMax) {
  const cardContainerEl = questContainerEl.querySelector(".cards-container");
  if (cardContainerEl) {
    const cardTemplate = cardContainerEl.querySelector(".card");
    cardContainerEl.innerHTML = "";
    if (cardTemplate) {
      if (quests && quests.length > 0) {
        quests.forEach(quest => {
          const cardClone = cardTemplate.cloneNode(true);
          if (cardClone && cardClone instanceof HTMLElement) {
            const titleEl = cardClone.querySelector(".title");
            const noteEl = cardClone.querySelector(".note");
            const durationEl = cardClone.querySelector(".duration");
            const completeBtnEl = cardClone.querySelector(".btn-container button");

            cardClone.dataset.id = quest.id;
            if (titleEl && noteEl && durationEl && completeBtnEl) {
              const finishedQuest = quests.filter(q => q.is_completed === 1).length;

              titleEl.textContent = quest.title;
              noteEl.textContent = upperCaseFirstLetter(quest.type);
              durationEl.textContent = quest.duration;
              completeBtnEl.addEventListener("click", () => {
                if (completeBtnEl.disabled) return;
                completeBtnEl.disabled = true;
                completeBtnEl.textContent = "...";

                try {
                  completeDailyQuest(quest.id).then(() => {
                    completeBtnEl.textContent = "Completed";
                    completeBtnEl.classList.add("completed");
                  });
                  refreshDailyQuests(questContainerEl);
                } catch (err) {
                  console.error(err);
                  completeBtnEl.disabled = false;
                  completeBtnEl.textContent = "Complete";
                  alert("Failed to complete quest.");
                }
              });

              if (quest.is_completed === 1) {
                completeBtnEl.disabled = true;
                completeBtnEl.textContent = "Completed";
                completeBtnEl.classList.add("completed");
              }

              if (finishedQuest === dailyQuestMax) {
                completeBtnEl.disabled = true;
                completeBtnEl.classList.add("completed");
              }
            }
          } else {
            alert("Failed to show daily quests.");
          }
          cardContainerEl.appendChild(cardClone);
        });
      }
    }
  }
}

async function refreshDailyQuests(questContainerEl, dailyQuestMax) {
  const quests = await getDailyQuests();
  loadProgressBar(quests, questContainerEl, dailyQuestMax);
}

function loadDailyCaption(date) {
  const captionEl = document.getElementById("daily-quest-caption");
  if (captionEl != null) {
    const textEl = captionEl.getElementsByTagName("span")[0];
    if (textEl != null) {
      textEl.innerText = getDailyMessage(date);
    }
  }
}

function getDailyMessage(date) {
  const messages = [
    "Focus on what matters today.",
    "Small progress is still progress.",
    "Stay consistent, not perfect.",
    "You're building something meaningful.",
  ];
  const idx = date.getDate() % messages.length;
  return messages[idx];
}
