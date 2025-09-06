// export async function insertQuest(type, data) {
//   try {
//     const res = await fetch("/api/inert", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ type, data }),
//     });
//     const result = await res.json();
//     if (!res.ok) {
//       throw new Error(result.error || "Unknown error occured when inserting data");
//     }
//     return result;
//   } catch (err) {
//     console.log(`Failed to insert quest: ${err.message}`);
//   }
// }

export async function getQuests() {
  try {
    const res = await fetch("/api/all-quests", {
      method: "GET",
    });
    const result = await res.json();
    if (!res.ok && !result.success) {
      throw new Error(result.error || "Unknown error occured when getting data.");
    }
    return result.data;
  } catch (err) {
    console.log(`Failed to get quests: ${err.message}`);
  }
}

export async function getMainQuests(questStatus = "", isExclude = false) {
  try {
    const res = await fetch("/api/main-quests", {
      method: "GET",
      body: JSON.stringify({ quest_status: questStatus, is_exclude: isExclude }),
    });
    const result = await res.json();
    if (!res.ok && !result.success) {
      throw new Error(result.error || "Unknown error occured when getting data.");
    }
    return result.data;
  } catch (err) {
    console.log(`Failed to get quests: ${err.message}`);
  }
}

export async function getDailyQuests() {
  try {
    const res = await fetch("/api/daily-quests", {
      method: "GET",
    });
    const result = await res.json();
    if (!res.ok && !result.success) {
      throw new Error(result.error || "Unknown error occured when getting data.");
    }
    return result.data;
  } catch (err) {
    console.log(`Failed to get quests: ${err.message}`);
  }
}

export async function startMainQuest(questId) {
  try {
    const res = await fetch("/api/main-quests", {
      method: "PATCH",
      body: JSON.stringify({ id: questId, update_type: "start" }),
    });
    const result = await res.json();
    if (!res.ok && !result.success) {
      throw new Error(result.error || "Unknown error occured when updating data.");
    }
  } catch (err) {
    console.log(`Failed to update quest: ${err.message}`);
  }
}

export async function completeMainQuest(questId) {
  try {
    const res = await fetch("/api/main-quests", {
      method: "PATCH",
      body: JSON.stringify({ id: questId, update_type: "complete" }),
    });
    const result = await res.json();
    if (!res.ok && !result.success) {
      throw new Error(result.error || "Unknown error occured when updating data.");
    }
  } catch (err) {
    console.log(`Failed to update quest: ${err.message}`);
  }
}

export async function completeDailyQuest(questId) {
  try {
    const res = await fetch("/api/daily-quests", {
      method: "PATCH",
      body: JSON.stringify({ id: questId }),
    });
    const result = await res.json();
    if (!res.ok && !result.success) {
      throw new Error(result.error || "Unknown error occured when updating data.");
    }
  } catch (err) {
    console.log(`Failed to update quest: ${err.message}`);
  }
}

export async function completeWeeklyQuest(questId) {
  try {
    const res = await fetch("/api/weekly-quests", {
      method: "PATCH",
      body: JSON.stringify({ id: questId }),
    });
    const result = await res.json();
    if (!res.ok && !result.success) {
      throw new Error(result.error || "Unknown error occured when updating data.");
    }
  } catch (err) {
    console.log(`Failed to update quest: ${err.message}`);
  }
}
