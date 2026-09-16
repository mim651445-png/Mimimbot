/**
 * ╔══════════════════════════════════════════════╗
 * ║              𝐌𝐈𝐌 𝐁𝐎𝐓 — 𝐕𝟐.𝟎.𝟎             ║
 * ║          Premium Image Reply Bot             ║
 * ║                                              ║
 * ║  Developer : হৃদয় হাসান শান্ত               ║
 * ║  Version   : 2.0.0                          ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");

module.exports.config = {
  name: "mim",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Random Mim Image Reply Bot",
  commandCategory: "noprefix",
  usages: "mim",
  cooldowns: 3,

  dependencies: {
    axios: ""
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
// 💬 MIM CAPTION DATABASE
// ═══════════════════════════════════════════════

const captions = [

  "🥺⎯͢⎯⃝🩷😽 চি্ঁরা্ঁ মু্ঁরি্ঁ দ্ঁই্ঁ খা্ঁলা্ঁই্ঁতো্ঁ জা্ঁমা্ঁই্ঁ তু্ঁমি্ঁ ক্ঁই্ঁ 🥺⎯͢⎯⃝🩷🐰",

  "🥀🦋 পিপ  পিপ সাইড প্লিজ....!! 🥀🦋\nশাশুড়ি ছেলে'কে খুজতেছি 𝐒𝐨 𝐍𝐨 ডিস্টার্ব প্লিজ.....!! 🤣😃",

  "🤡🐸🙏 কেউ চলে গেলে কাঁদবেন নাহ্,,\nঘুরে দাঁড়াবেন দাঁড়িয়ে আরেক টা পাটাবেন,,,,!! 😹",

  "😾\n<(  ) \\\n   _/  \\_ 🧺\n\n\"এই খানে মন রাখছিলাম কে নিছস ক\" 😐.........🔪",

  "😹⎯͢⎯⃝ 😹 ⋆⃝⋆≛⃝᛫😜\nপ্র্ঁচুর্ঁ গ্ঁরম্ঁ\nএ্ঁক্ঁ লি্ঁটা্ঁর্ঁ ঠা্ঁন্ডা্ঁ ভা্ঁলো্ঁবা্ঁসা্ঁ হ্ঁবে্ঁ কি্ঁ ⎯⃝🫰😒🐸🍒",

  "⎯͢⎯⃝😒⋆⃝⋆\nউ্ঁম্মা্ঁহ্...\nমা্ঁই্ঁন্ড্ ক্ঁর্‌লে্ঁ ফে্ঁর্‌ত্ দে্ঁ...!! 😤💋⋆⃝⋆",

  "🥺🫶 𝐌𝐢𝐦 𝐌𝐨𝐝𝐞 𝐎𝐧... 💗",

  "😽🌸 𝐀𝐡𝐚𝐚𝐚... 𝐌𝐢𝐦 𝐕𝐢𝐛𝐞𝐬! 🫶",

  "🙈💖 𝐌𝐢𝐦 𝐌𝐨𝐨𝐝 𝐅𝐫𝐨𝐦 𝐇𝐞𝐚𝐫𝐭! 🌸",

  "🦋✨ 𝐒𝐨 𝐂𝐮𝐭𝐞 𝐌𝐢𝐦! 🥹💗",

  "😻🫶 𝐌𝐢𝐦 𝐕𝐢𝐛𝐞𝐬 𝐎𝐧𝐥𝐲! 🌷",

  "🥰💫 𝐌𝐢𝐦 𝐌𝐨𝐦𝐞𝐧𝐭! 💕"

];

// ═══════════════════════════════════════════════
// 🎲 RANDOM FUNCTION
// ═══════════════════════════════════════════════

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// ═══════════════════════════════════════════════
// 📥 GET IMAGE
// ═══════════════════════════════════════════════

async function getImage() {
  const imageURL = randomItem(images);

  return axios({
    method: "GET",
    url: imageURL,
    responseType: "stream",
    timeout: 15000,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });
}

// ═══════════════════════════════════════════════
// 🤖 HANDLE EVENT
// ═══════════════════════════════════════════════

module.exports.handleEvent = async function ({
  api,
  event
}) {
  try {

    if (!event.body) return;

    const text = event.body
      .trim()
      .toLowerCase();

    const triggers = [
      "mim",
      "mimi",
      "মিম",
      "baby",
      "bby",
      "babby",
      "bot"
    ];

    if (!triggers.includes(text)) return;

    const response = await getImage();
    const caption = randomItem(captions);

    return api.sendMessage(
      {
        body:
          `${caption}\n\n` +
          `╭───────────────╮\n` +
          `   🩷 𝐌𝐢𝐦 𝐁𝐨𝐭\n` +
          `   👑 𝐃𝐞𝐯 : হৃদয় হাসান শান্ত\n` +
          `   ⚡ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : 𝟐.𝟎.𝟎\n` +
          `╰───────────────╯`,

        attachment: response.data
      },

      event.threadID,
      event.messageID
    );

  } catch (error) {

    console.error(
      "[MIM BOT ERROR]",
      error.message
    );

    return api.sendMessage(
      "❌ 𝐌𝐢𝐦 𝐁𝐨𝐭 এখন ছবি পাঠাতে পারছে না!\n\n" +
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

    const response = await getImage();
    const caption = randomItem(captions);

    return api.sendMessage(
      {
        body:
          `${caption}\n\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `🩷 𝐌𝐢𝐦 𝐁𝐨𝐭\n` +
          `👑 𝐃𝐞𝐯 : হৃদয় হাসান শান্ত\n` +
          `⚡ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : 𝟐.𝟎.𝟎\n` +
          `━━━━━━━━━━━━━━━━━━`,

        attachment: response.data
      },

      event.threadID,
      event.messageID
    );

  } catch (error) {

    console.error(
      "[MIM BOT RUN ERROR]",
      error.message
    );

    return api.sendMessage(
      "❌ 𝐌𝐢𝐦 𝐈𝐦𝐚𝐠𝐞 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐅𝐚𝐢𝐥𝐞𝐝!\n" +
      "🔄 Please try again later.",

      event.threadID,
      event.messageID
    );
  }
};
