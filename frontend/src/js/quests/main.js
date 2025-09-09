import { completeMainQuest, startMainQuest } from "../db.js";
import { clearElementDataset, formatDateTime, getContextMenuPos } from "../utils.js";

export function renderMainQuests(quests) {
  const mainQuestContainerEl = document.getElementById("main-quest-container");
  if (mainQuestContainerEl) {
    loadMainCards(quests, mainQuestContainerEl);
    createContextMenu(mainQuestContainerEl);
  }
}

function loadMainCards(quests, questContainerEl) {
  if (quests && quests.length > 0) {
    const cardContainerEl = questContainerEl.querySelector(".main-quest-cards-container");
    if (cardContainerEl) {
      const cardTemplate = cardContainerEl.querySelector(".main-quest-card");
      cardContainerEl.innerHTML = "";
      cardContainerEl.classList.replace("hidden", "block");
      if (cardTemplate) {
        quests.forEach(quest => {
          const cardClone = cardTemplate.cloneNode(true);
          if (cardClone && cardClone instanceof HTMLElement) {
            const titleEl = cardClone.querySelector(".quest-title");
            const startedAtEl = cardClone.querySelector(".quest-started-at");
            const durationEl = cardClone.querySelector(".quest-duration");
            const descriptionEl = cardClone.querySelector(".quest-desc");

            cardClone.dataset.questId = quest.id;
            cardClone.dataset.questStatus = quest.status;
            if (titleEl && startedAtEl && durationEl && descriptionEl) {
              titleEl.textContent = quest.title;
              durationEl.textContent = `Estimated Time: ${quest.duration}`;
              descriptionEl.textContent = quest.description;

              if (quest.started_at) {
                startedAtEl.textContent = `Started: ${formatDateTime(quest.started_at)}`;
              }
            }
          } else {
            alert("Failed to show main quests.");
          }
          cardContainerEl.appendChild(cardClone);
        });
      }
    }
  } else {
    const emptyContainerEl = questContainerEl.querySelector(".main-quest-empty-container");
    if (emptyContainerEl) {
      emptyContainerEl.classList.replace("hidden", "block");
    }
  }
}

function createContextMenu(mainQuestContainerEl) {
  const contextMenuEl = mainQuestContainerEl.querySelector("#contextMenu");
  if (contextMenuEl) {
    const ctxBtnCompleteEl = contextMenuEl.querySelector("#ctxBtnComplete");
    const ctxBtnStartEl = contextMenuEl.querySelector("#ctxBtnStart");
    const ctxBtnDeleteEl = contextMenuEl.querySelector("#ctxBtnDelete");

    if (ctxBtnCompleteEl && ctxBtnStartEl && ctxBtnDeleteEl) {
      const cards = mainQuestContainerEl.querySelectorAll(".main-quest-card");
      if (cards) {
        cards.forEach(card => {
          card.addEventListener("contextmenu", e => {
            e.preventDefault();
            if (e.currentTarget.dataset.questStatus === "in_progress") {
              ctxBtnCompleteEl.style.display = "block";
              ctxBtnStartEl.style.display = "none";
            } else if (e.currentTarget.dataset.questStatus === "pending") {
              ctxBtnCompleteEl.style.display = "none";
              ctxBtnStartEl.style.display = "block";
            }

            contextMenuEl.dataset.questId = e.currentTarget.dataset.questId;

            const [x, y] = getContextMenuPos(e, contextMenuEl);
            contextMenuEl.style.top = `${y}px`;
            contextMenuEl.style.left = `${x}px`;
            contextMenuEl.style.display = "block";
          });
        });
      }

      ctxBtnStartEl.addEventListener("click", () => {
        try {
          startMainQuest(contextMenuEl.dataset.questId).then(() => {
            location.reload();
          });
        } catch (err) {
          console.log(err);
          alert("Failed to complete quest.");
        }
        clearContextMenu(contextMenuEl);
      });

      ctxBtnCompleteEl.addEventListener("click", () => {
        try {
          completeMainQuest(contextMenuEl.dataset.questId).then(() => {
            location.reload();
          });
        } catch (err) {
          console.log(err);
          alert("Failed to complete quest.");
        }
        clearContextMenu(contextMenuEl);
      });

      document.addEventListener("click", () => {
        if (contextMenuEl) clearContextMenu(contextMenuEl);
      });
    }
  }
}

function clearContextMenu(contextMenuEl) {
  contextMenuEl.style.display = "none";
  clearElementDataset(contextMenuEl);
}
