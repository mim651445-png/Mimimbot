const moment = require("moment-timezone");

module.exports.config = {
  name: "Obot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "hriday",
  description: "Smart No-Prefix Auto Reply Bot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 3
};

// ================================
// 💬 RANDOM REPLY LIST
// ================================
const replies = [
  "বেশি Bot Bot করলে leave নিবো কিন্তু 😒😒",
  "এতো ডাকো না, প্রেমে পরে যাবো তো 🙈",
  "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু 😑",
  "হ্যাঁ বলো 😒 তোমার জন্য কী করতে পারি?",
  "কী হয়েছে এতো ডাকো কেন 😒",
  "আরে বলো জান, কেমন আছো? 😚",
  "অসম্মান করছিস কেন 😰😿",
  "বট বলে চলে যাস কেন 😤🥺",
  "জানু বল জানু 😘",
  "এতো ডাকিস কেন 🤬",
  "আমারে এতো ডাকিস না, এখন মজা করার mood এ নাই 😒",
  "বলো কী বলবা, সবার সামনে বলবা নাকি? 🤭",
  "হ্যাঁ বলো, শুনছি আমি 😏",
  "আর কত বার ডাকবি, শুনছি তো 😒",
  "বলো কী করতে পারি তোমার জন্য 😌",
  "আমি তো অন্ধ, কিছু দেখি না 🐸😎",
  "বলো জানু 🌚",
  "একটা কথা বলতে চাইছিলাম 🙂",
  "আসসালামু আলাইকুম বলেন, আপনার জন্য কী করতে পারি..! 🥰",
  "আমাকে এতো ডাকো কেন? 🤔 ভালো-টালো বাসো নাকি? 🤭🙈",
  "উফফ বুঝলাম না, এতো ডাকছেন কেনো 😤",
  "আজকে আমার মন ভালো নেই, তাই আমাকে ডাকবেন না 😪",
  "হুদাই ডাকাডাকি করো কেন 🙂",
  "এই প্রথম বার বট দেখছো নাকি 🥴",
  "খালি ঢং করে আসে আবার Bot বলে চলে যায় 🙁",
  "কী ব্যাপার 😌",
  "তোমার সাথে কথা বলে মনে হচ্ছে আমি কমেডি কিং 😂🎤",
  "ভালোবাসা মানুষের মন বদলায়, তাই ভালো মানুষ হও 🙂",
  "পেটে ইঁদুর দৌড়ায়, কিছু খাওয়াও 😋",
  "আমাকে ডাকলে চকলেট দিতে হবে 😒",
  "আমি এখন বিজি আছি, পরে কথা বলি 😌",
  "দূরে যা, শুধু Bot Bot করিস কেন 😂",
  "তোর কথা তোর বাড়ির কেউ শুনে না, তো আমি কেন শুনবো? 🤔😂",
  "কি হলো, মিস টিস করচ্ছিস নাকি 🤣",
  "তুই রাগ করলে আমার কী? 🤣",
  "দিনশেষে সবাই ভালো থাকুক, এইটাই চাই ❤️",
  "নামাজি মানুষের হাসি খুব সুন্দর লাগে 🌸🥰",
  "জীবন ভিন্ন পথে যায়, কিন্তু শেষ গন্তব্য একই—মাটি 🙂",
  "আজকে সবাই হাসিখুশি থাকো 😊",
  "হুদাই গ্রুপে আছি, কেউ Bot-এর সাথে কথা বলে না 🥺",
  "আগে অনেক খারাপ ছিলাম, এখন ভালো হয়ে গেছি 🙂",
  "এত অহংকার করে লাভ নেই, সময় সবার বদলায় 🙂",
  "তুমি হাসলে গ্রুপটা সুন্দর লাগে 😌",
  "কেউ একজন আমাকে ডাকলো মনে হয় 👀",
  "বলুন কী করতে পারি আপনার জন্য? 😇",
  "আমি কিন্তু সব শুনছি 👀",
  "চুপচাপ থাকলেও সব খবর রাখি 😎",
  "Bot কে ডাকছো যখন, কিছু একটা বলো তো 😒"
];

// ================================
// 🔧 RANDOM REPLY
// ================================
function randomReply() {
  return replies[Math.floor(Math.random() * replies.length)];
}

// ================================
// 🤖 EVENT HANDLER
// ================================
module.exports.handleEvent = async function ({
  api,
  event,
  Users
}) {
  try {
    if (!event || !event.body) return;

    const threadID = event.threadID;
    const messageID = event.messageID;

    if (!threadID) return;

    // Text clean
    const body = String(event.body).trim();
    const text = body.toLowerCase();

    if (!text) return;

    // ================================
    // ❤️ MISS YOU
    // ================================
    if (text === "miss you") {
      return api.sendMessage(
        "পচা কথা বলবেন না 😂 গন্ধ আসে!",
        threadID,
        messageID
      );
    }

    // ================================
    // 😘 KISS
    // ================================
    if (text === "kiss me") {
      return api.sendMessage(
        "তুমি পঁচা 😒 তোমাকে কিস দিবো না 🤭",
        threadID,
        messageID
      );
    }

    // ================================
    // 👋 SALAM
    // ================================
    const salamTriggers = [
      "আসসালামু আলাইকুম",
      "assalamualaikum",
      "assalamu alaikum",
      "salam"
    ];

    if (salamTriggers.includes(text)) {
      return api.sendMessage(
        "ওয়ালাইকুমুস-সালাম ওয়া রাহমাতুল্লাহ 🖤🌸",
        threadID,
        messageID
      );
    }

    // ================================
    // 🌅 MORNING
    // ================================
    if (text === "morning" || text === "good morning") {
      return api.sendMessage(
        "GOOD MORNING 🌅 দাত ব্রাশ করে নাস্তা করে নাও 😚",
        threadID,
        messageID
      );
    }

    // ================================
    // 🤖 BOT NAME
    // ================================
    if (
      text === "bot" ||
      text === "obot" ||
      text === "বট"
    ) {
      let name = "বন্ধু";

      try {
        if (Users && event.senderID) {
          name = await Users.getNameUser(event.senderID);
        }
      } catch (e) {
        name = "বন্ধু";
      }

      return api.sendMessage(
        `${name}, ${randomReply()}`,
        threadID,
        messageID
      );
    }

    // ================================
    // 🛑 STOP
    // ================================
    if (
      text === "chup" ||
      text === "stop" ||
      text === "চুপ কর" ||
      text === "chup kor"
    ) {
      return api.sendMessage(
        "তুই আগে চুপ কর 😒 হুদাই ডাকাডাকি করিস 😂",
        threadID,
        messageID
      );
    }

    // ================================
    // 👑 OWNER / ADMIN
    // ================================
    if (
      text === "owner" ||
      text === "ceo" ||
      text === "admin"
    ) {
      return api.sendMessage(
        "👑 OWNER: Hriday\n❤️ My Creator: Hriday",
        threadID,
        messageID
      );
    }

    // ================================
    // 🤖 AI
    // ================================
    if (text === "ai") {
      return api.sendMessage(
        "🤖 AI ব্যবহার করতে টাইপ করুন: /ai",
        threadID,
        messageID
      );
    }

    // ================================
    // 👤 NAME
    // ================================
    if (
      text === "name" ||
      text === "tor nam ki" ||
      text === "তোর নাম কি"
    ) {
      return api.sendMessage(
        "🤖 MY NAME IS: OBot\n👑 Created by: Hriday",
        threadID,
        messageID
      );
    }

    // ================================
    // ❤️ THANK YOU
    // ================================
    if (
      text === "tnx" ||
      text === "thanks" ||
      text === "thank you" ||
      text === "ধন্যবাদ"
    ) {
      return api.sendMessage(
        "You're welcome 😌❤️",
        threadID,
        messageID
      );
    }

    // ================================
    // 😂 REACTION
    // ================================
    if (
      text === "...." ||
      text === "..." ||
      text === "😠" ||
      text === "🤬" ||
      text === "😾"
    ) {
      return api.sendMessage(
        "তুই রাগ করলে আমার কী? 🤣 আমি তোকে ভয় পাই নাকি? 🙄",
        threadID,
        messageID
      );
    }

    // ================================
    // 😔 MON KHARAP
    // ================================
    if (
      text === "mon kharap" ||
      text === "tmr ki mon kharap"
    ) {
      return api.sendMessage(
        "আমার সাদা মনে কোনো কাদা নাই 🌝😂",
        threadID,
        messageID
      );
    }

    // ================================
    // 👋 BYE
    // ================================
    if (
      text === "by" ||
      text === "bye" ||
      text === "বাই" ||
      text === "jaiga" ||
      text === "যাই গা" ||
      text === "pore kotha hbe"
    ) {
      return api.sendMessage(
        "কিরে তুই কই যাস? চল একসাথে যাই 🌚😂",
        threadID,
        messageID
      );
    }

    // ================================
    // 🍚 FOOD
    // ================================
    if (
      text === "tumi khaiso" ||
      text === "khaicho" ||
      text === "তুমি খাইছো"
    ) {
      return api.sendMessage(
        "হ্যাঁ, তুমি খাইছো তো? 😋🍚",
        threadID,
        messageID
      );
    }

    // ================================
    // ❤️ LOVE QUESTION
    // ================================
    if (
      text === "tumi ki amake bhalobaso" ||
      text === "tmi ki amake vlo basho"
    ) {
      return api.sendMessage(
        "আমি তো Bot 😌 তবে তোমাদের ভালো কথাগুলো শুনতে ভালো লাগে ❤️",
        threadID,
        messageID
      );
    }

    // ================================
    // 👑 BOSS
    // ================================
    if (
      text === "ami rahat" ||
      text === "kire"
    ) {
      return api.sendMessage(
        "হ্যাঁ বস 😎 কেমন আছেন?",
        threadID,
        messageID
      );
    }

    // ================================
    // 💬 /BOT TRIGGER
    // ================================
    if (
      body.startsWith("/Bot") ||
      body.startsWith("/bot")
    ) {
      let name = "বন্ধু";

      try {
        if (Users && event.senderID) {
          name = await Users.getNameUser(event.senderID);
        }
      } catch (e) {
        name = "বন্ধু";
      }

      return api.sendMessage(
        `${name}, ${randomReply()}`,
        threadID,
        messageID
      );
    }

  } catch (error) {
    console.error("OBot Error:", error);
  }
};

// ================================
// 🚀 COMMAND RUN
// ================================
module.exports.run = function ({ api, event }) {
  return api.sendMessage(
    "🤖 OBot Active!\n\nNo-Prefix Auto Reply চালু আছে ✅",
    event.threadID,
    event.messageID
  );
};
