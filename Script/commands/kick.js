const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "kick",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Group member remove system with kick history",
  commandCategory: "System",
  usages: "kick @mention | reply | UID | profile link | list",
  cooldowns: 3
};

// ═══════════════════════════════════════
// 📁 KICK DATA FILE
// ═══════════════════════════════════════

const DATA_FILE = path.join(__dirname, "kick_data.json");

function createDataFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf8");
    }
  } catch (err) {
    console.error("❌ Cannot create kick_data.json:", err);
  }
}

function readKickData() {
  try {
    createDataFile();

    const data = fs.readFileSync(DATA_FILE, "utf8").trim();

    if (!data) return [];

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("❌ Kick data read error:", err);
    return [];
  }
}

function saveKickData(data) {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(data, null, 2),
      "utf8"
    );
    return true;
  } catch (err) {
    console.error("❌ Kick data save error:", err);
    return false;
  }
}

// ═══════════════════════════════════════
// 🎭 DARK NAME
// ═══════════════════════════════════════

const darkNames = [
  "Shadow_Reaper",
  "Phantom_Walker",
  "Ghost_Rider",
  "Dark_Hunter",
  "Night_Stalker",
  "Void_Keeper",
  "Eclipse_Lord",
  "Silent_Reaper",
  "Midnight_Ghost",
  "Black_Phantom",
  "Dark_Knight",
  "Storm_Reaper"
];

function generateDarkName() {
  return darkNames[Math.floor(Math.random() * darkNames.length)];
}

// ═══════════════════════════════════════
// 💾 ADD TO KICK LIST
// ═══════════════════════════════════════

function addToKickList(info) {
  const list = readKickData();

  const exists = list.find(user => String(user.id) === String(info.id));

  if (exists) {
    return exists.darkName || "Unknown_Dark";
  }

  const newUser = {
    id: info.id,
    name: info.name || "Unknown User",
    darkName: generateDarkName(),
    kickedBy: info.kickedBy || "Unknown",
    groupId: info.groupId || "Unknown",
    groupName: info.groupName || "Unknown Group",
    timestamp: new Date().toISOString()
  };

  list.push(newUser);
  saveKickData(list);

  return newUser.darkName;
}

// ═══════════════════════════════════════
// 👤 GET USER NAME
// ═══════════════════════════════════════

async function getUserName(api, uid) {
  try {
    const info = await api.getUserInfo(uid);

    if (info && info[uid] && info[uid].name) {
      return info[uid].name;
    }

    return "Unknown User";
  } catch (err) {
    return "Unknown User";
  }
}

// ═══════════════════════════════════════
// 🎯 GET TARGET USERS
// ═══════════════════════════════════════

async function getTargets(api, event, args) {
  const targets = [];
  const mentions = event.mentions || {};

  // ─────────────────────────────────────
  // 📌 REPLY
  // ─────────────────────────────────────

  if (
    event.type === "message_reply" &&
    event.messageReply &&
    event.messageReply.senderID
  ) {
    const uid = String(event.messageReply.senderID);

    targets.push({
      id: uid,
      name: await getUserName(api, uid)
    });

    return targets;
  }

  // ─────────────────────────────────────
  // 📌 MENTION
  // ─────────────────────────────────────

  const mentionIDs = Object.keys(mentions);

  if (mentionIDs.length > 0) {
    for (const uid of mentionIDs) {
      targets.push({
        id: String(uid),
        name: mentions[uid] || await getUserName(api, uid)
      });
    }

    return targets;
  }

  // ─────────────────────────────────────
  // 📌 NO ARGUMENT
  // ─────────────────────────────────────

  if (!args || args.length === 0) {
    return [];
  }

  // ─────────────────────────────────────
  // 📋 LIST
  // ─────────────────────────────────────

  if (String(args[0]).toLowerCase() === "list") {
    return "LIST";
  }

  const input = args.join(" ").trim();

  // ─────────────────────────────────────
  // 🔗 FACEBOOK LINK
  // ─────────────────────────────────────

  if (
    input.includes("facebook.com/") ||
    input.includes("fb.com/")
  ) {
    try {
      const uid = await api.getUID(input);

      if (uid) {
        targets.push({
          id: String(uid),
          name: await getUserName(api, uid)
        });
      }
    } catch (err) {
      console.error("❌ UID link error:", err);
    }

    return targets;
  }

  // ─────────────────────────────────────
  // 🆔 DIRECT UID
  // ─────────────────────────────────────

  if (/^\d+$/.test(input)) {
    const uid = String(input);

    targets.push({
      id: uid,
      name: await getUserName(api, uid)
    });

    return targets;
  }

  return [];
}

// ═══════════════════════════════════════
// 📋 SHOW KICK LIST
// ═══════════════════════════════════════

async function showKickList(api, event) {
  const list = readKickData();

  if (list.length === 0) {
    return api.sendMessage(
      "╭━━━〔 📭 KICK LIST 〕━━━╮\n" +
      "┃\n" +
      "┃ ❌ এখনো কোনো ইউজার কিক করা হয়নি।\n" +
      "┃\n" +
      "╰━━━━━━━━━━━━━━━━━━━━╯",
      event.threadID,
      event.messageID
    );
  }

  let msg =
    "╭━━━〔 🔥 KICKED USERS 〕━━━╮\n\n";

  list.forEach((user, index) => {
    msg +=
      `🆔 ${index + 1}. ${user.name}\n` +
      `👤 UID: ${user.id}\n` +
      `🌑 DarkName: ${user.darkName}\n` +
      `━━━━━━━━━━━━━━━━━━\n`;
  });

  msg +=
    `\n📊 Total Kicked: ${list.length}\n` +
    "╰━━━━━━━━━━━━━━━━━━━━╯";

  return api.sendMessage(
    msg,
    event.threadID,
    event.messageID
  );
}

// ═══════════════════════════════════════
// 🚀 MAIN COMMAND
// ═══════════════════════════════════════

module.exports.run = async function ({
  api,
  event,
  args
}) {
  try {
    createDataFile();

    // ───────────────────────────────────
    // 🎯 GET TARGET
    // ───────────────────────────────────

    const targets = await getTargets(api, event, args);

    // 📋 LIST
    if (targets === "LIST") {
      return await showKickList(api, event);
    }

    // ❌ NO TARGET
    if (!targets || targets.length === 0) {
      return api.sendMessage(
        "╭━━━〔 ⚠️ KICK HELP 〕━━━╮\n\n" +
        "👉 কাউকে Kick করতে:\n\n" +
        "🔹 @Mention করুন\n" +
        "🔹 কারো মেসেজে Reply করুন\n" +
        "🔹 UID দিন\n" +
        "🔹 Facebook Profile Link দিন\n\n" +
        "📋 Kick List দেখতে:\n" +
        "👉 kick list\n\n" +
        "╰━━━━━━━━━━━━━━━━━━━━╯",
        event.threadID,
        event.messageID
      );
    }

    // ───────────────────────────────────
    // 👥 THREAD INFO
    // ───────────────────────────────────

    const threadInfo = await api.getThreadInfo(
      event.threadID
    );

    if (!threadInfo) {
      return api.sendMessage(
        "❌ গ্রুপের তথ্য পাওয়া যাচ্ছে না।",
        event.threadID,
        event.messageID
      );
    }

    const adminIDs = Array.isArray(threadInfo.adminIDs)
      ? threadInfo.adminIDs.map(a => String(a.id))
      : [];

    // ───────────────────────────────────
    // 🤖 BOT ADMIN CHECK
    // ───────────────────────────────────

    const botID = String(api.getCurrentUserID());

    if (!adminIDs.includes(botID)) {
      return api.sendMessage(
        "╭━━━〔 🤖 BOT ADMIN 〕━━━╮\n\n" +
        "❌ আমাকে আগে Group Admin করতে হবে!\n\n" +
        "তারপর আবার Kick command ব্যবহার করুন।\n\n" +
        "╰━━━━━━━━━━━━━━━━━━━━╯",
        event.threadID,
        event.messageID
      );
    }

    // ───────────────────────────────────
    // 👑 USER ADMIN CHECK
    // ───────────────────────────────────

    const senderID = String(event.senderID);

    if (!adminIDs.includes(senderID)) {
      return api.sendMessage(
        "╭━━━〔 🚫 ACCESS DENIED 〕━━━╮\n\n" +
        "❌ শুধু Group Admin এই command ব্যবহার করতে পারবে!\n\n" +
        "╰━━━━━━━━━━━━━━━━━━━━╯",
        event.threadID,
        event.messageID
      );
    }

    // ───────────────────────────────────
    // 👥 PARTICIPANTS
    // ───────────────────────────────────

    const participants = Array.isArray(threadInfo.participantIDs)
      ? threadInfo.participantIDs.map(String)
      : [];

    // ───────────────────────────────────
    // 🔄 PROCESS TARGETS
    // ───────────────────────────────────

    let kicked = 0;
    let failed = 0;

    for (const target of targets) {
      const uid = String(target.id);
      const name = target.name || "Unknown User";

      // 🛡️ SELF CHECK
      if (uid === senderID) {
        failed++;

        await api.sendMessage(
          `⚠️ ${name}\n\nনিজেকে Kick করা যাবে না! 😅`,
          event.threadID
        );

        continue;
      }

      // 👑 ADMIN CHECK
      if (adminIDs.includes(uid)) {
        failed++;

        await api.sendMessage(
          `👑 ${name}\n\nসরি, Group Admin-কে Kick করা যাবে না!`,
          event.threadID
        );

        continue;
      }

      // 👥 MEMBER CHECK
      if (
        participants.length > 0 &&
        !participants.includes(uid)
      ) {
        failed++;

        await api.sendMessage(
          `⚠️ ${name}\n\nএই User বর্তমানে গ্রুপে নেই।`,
          event.threadID
        );

        continue;
      }

      // ─────────────────────────────────
      // 🚫 REMOVE USER
      // ─────────────────────────────────

      try {
        await api.removeUserFromGroup(
          uid,
          event.threadID
        );

        // 💾 SAVE HISTORY
        const darkName = addToKickList({
          id: uid,
          name: name,
          kickedBy: senderID,
          groupId: event.threadID,
          groupName: threadInfo.threadName || "Unknown Group"
        });

        kicked++;

        await api.sendMessage(
          "╭━━━〔 ✅ KICK SUCCESS 〕━━━╮\n\n" +
          `👤 User: ${name}\n` +
          `🆔 UID: ${uid}\n` +
          `🌑 DarkName: ${darkName}\n\n` +
          "🚫 Group থেকে Remove করা হয়েছে।\n" +
          "╰━━━━━━━━━━━━━━━━━━━━╯",
          event.threadID
        );

      } catch (kickError) {
        failed++;

        console.error(
          "❌ Remove User Error:",
          kickError
        );

        await api.sendMessage(
          `❌ ${name}-কে Kick করা যায়নি।\n\n` +
          "সম্ভবত Bot-এর Admin Permission নেই অথবা API Error হয়েছে।",
          event.threadID
        );
      }
    }

    // ───────────────────────────────────
    // 📊 FINAL RESULT
    // ───────────────────────────────────

    if (targets.length > 1) {
      await api.sendMessage(
        "╭━━━〔 📊 KICK RESULT 〕━━━╮\n\n" +
        `✅ Successful: ${kicked}\n` +
        `❌ Failed: ${failed}\n\n` +
        "╰━━━━━━━━━━━━━━━━━━━━╯",
        event.threadID
      );
    }

  } catch (error) {
    console.error(
      "🚨 KICK COMMAND ERROR:",
      error
    );

    return api.sendMessage(
      "╭━━━〔 ❌ ERROR 〕━━━╮\n\n" +
      "কমান্ড চালানোর সময় একটি সমস্যা হয়েছে।\n\n" +
      `🔧 ${error.message || "Unknown Error"}\n\n` +
      "╰━━━━━━━━━━━━━━━━━━━━╯",
      event.threadID,
      event.messageID
    );
  }
};

// ═══════════════════════════════════════
// 📦 INITIALIZE
// ═══════════════════════════════════════

createDataFile();
