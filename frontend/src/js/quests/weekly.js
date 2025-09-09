import { completeWeeklyQuest } from "../db.js";
import { upperCaseFirstLetter } from "../utils.js";

export function renderWeeklyQuests(quests) {
  const weeklyQuestContainerEl = document.getElementById("weekly-quest-container");
  if (weeklyQuestContainerEl) {
    loadWeeklyCards(quests, weeklyQuestContainerEl);
  }
}

function loadWeeklyCards(quests, questContainerEl) {
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
              titleEl.textContent = quest.title;
              noteEl.textContent = upperCaseFirstLetter(quest.type);
              durationEl.textContent = quest.duration;
              completeBtnEl.addEventListener("click", () => {
                if (completeBtnEl.disabled) return;
                completeBtnEl.disabled = true;
                completeBtnEl.textContent = "...";

                try {
                  completeWeeklyQuest(quest.id).then(() => {
                    completeBtnEl.textContent = "Completed";
                    completeBtnEl.classList.add("complete");
                  });
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
            }
          } else {
            alert("Failed to show weekly quests.");
          }
          cardContainerEl.appendChild(cardClone);
        });
      }
    }
  }
}
