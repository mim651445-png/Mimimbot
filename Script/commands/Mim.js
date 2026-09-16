/**
 * ╔══════════════════════════════════════════════╗
 * ║              𝐁𝐀𝐁𝐘 𝐁𝐎𝐓 — 𝐕𝟏.𝟎.𝟎             ║
 * ║            Premium Image Reply              ║
 * ║                                              ║
 * ║  Developer : হৃদয় হাসান শান্ত               ║
 * ║  Version   : 1.0.0                          ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");

module.exports.config = {
  name: "mim",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Random Baby Image Reply Bot",
  commandCategory: "noprefix",
  usages: "mim",
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

// ═══════════════════════════════════════════════
// 🖼️ IMAGE DATABASE
// ═══════════════════════════════════════════════

const images = [
  "https://i.imgur.com/WpiXxKY.jpeg",
  "https://i.imgur.com/59VndUy.jpeg",
  "https://i.imgur.com/9pdcRiL.jpeg",
  "https://i.imgur.com/rAMNUy8.jpeg",
  "https://i.imgur.com/SwVPWeV.jpeg",
  "https://i.imgur.com/viW3pN7.jpeg"
];

// ═══════════════════════════════════════════════
// 💬 CAPTION DATABASE
// ═══════════════════════════════════════════════

const captions = [
  "🥺🫶 𝐁𝐚𝐛𝐲 𝐌𝐨𝐝𝐞 𝐎𝐧... 💗",
  "😽🌸 𝐀𝐡𝐚𝐚𝐚... 𝐒𝐮𝐧𝐝𝐨𝐫 𝐁𝐚𝐛𝐲! 🫶",
  "🙈💖 𝐁𝐚𝐛𝐲 𝐌𝐨𝐨𝐝 𝐅𝐫𝐨𝐦 𝐇𝐞𝐚𝐫𝐭! 🌸",
  "🦋✨ 𝐒𝐨 𝐂𝐮𝐭𝐞 𝐘𝐨𝐮 𝐀𝐫𝐞! 🥹💗",
  "😻🫶 𝐁𝐚𝐛𝐲 𝐕𝐢𝐛𝐞𝐬 𝐎𝐧𝐥𝐲! 🌷",
  "🥰💫 𝐇𝐞𝐚𝐫𝐭 𝐓𝐨𝐮𝐜𝐡𝐢𝐧𝐠 𝐌𝐨𝐦𝐞𝐧𝐭! 💕"
];

// ═══════════════════════════════════════════════
// 🎲 RANDOM FUNCTION
// ═══════════════════════════════════════════════

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// ═══════════════════════════════════════════════
// 📦 CONFIG
// ═══════════════════════════════════════════════

module.exports.handleEvent = async function ({ api, event }) {
  try {
    if (!event.body) return;

    const text = event.body.trim().toLowerCase();

    const triggers = [
      "baby",
      "bby",
      "babby",
      "মিম",
      "bot"
    ];

    if (!triggers.includes(text)) return;

    const imageURL = randomItem(images);
    const caption = randomItem(captions);

    // ───────────────────────────────────────────
    // 📥 DOWNLOAD IMAGE
    // ───────────────────────────────────────────

    const response = await axios({
      method: "GET",
      url: imageURL,
      responseType: "stream",
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    // ───────────────────────────────────────────
    // 📤 SEND IMAGE
    // ───────────────────────────────────────────

    return api.sendMessage(
      {
        body:
          `${caption}\n\n` +
          `╭───────────────╮\n` +
          `   🤖 𝐁𝐚𝐛𝐲 𝐁𝐨𝐭\n` +
          `   👑 𝐃𝐞𝐯 : হৃদয় হাসান শান্ত\n` +
          `╰───────────────╯`,
        attachment: response.data
      },
      event.threadID,
      event.messageID
    );

  } catch (error) {

    // ❌ ERROR HANDLER
    console.error(
      "[BABY BOT ERROR]",
      error.message
    );

    return api.sendMessage(
      "❌ 𝐁𝐚𝐛𝐲 𝐁𝐨𝐭 এখন ছবি পাঠাতে পারছে না!\n\n" +
      "🔄 একটু পরে আবার চেষ্টা করুন।",
      event.threadID,
      event.messageID
    );
  }
};

// ═══════════════════════════════════════════════
// 🚀 COMMAND RUNNER
// ═══════════════════════════════════════════════

module.exports.run = async function ({
  api,
  event
}) {
  try {

    const imageURL = randomItem(images);
    const caption = randomItem(captions);

    const response = await axios({
      method: "GET",
      url: imageURL,
      responseType: "stream",
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    return api.sendMessage(
      {
        body:
          `${caption}\n\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `🤖 𝐁𝐚𝐛𝐲 𝐁𝐨𝐭\n` +
          `👑 𝐃𝐞𝐯 : হৃদয় হাসান শান্ত\n` +
          `⚡ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : 𝟏.𝟎.𝟎\n` +
          `━━━━━━━━━━━━━━━━━━`,
        attachment: response.data
      },
      event.threadID,
      event.messageID
    );

  } catch (error) {

    console.error(
      "[BABY BOT RUN ERROR]",
      error.message
    );

    return api.sendMessage(
      "❌ Image loading failed!\n" +
      "🔄 Please try again later.",
      event.threadID,
      event.messageID
    );
  }
};
