const fs = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "Obot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "💙 𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐚𝐬𝐚𝐧 𝐒𝐡𝐚𝐧𝐭𝐨 💙",
  description: "Smart No-Prefix Auto Reply Bot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5
};

module.exports.handleEvent = async function ({
  api,
  event,
  args,
  Threads,
  Users
}) {

  try {
    const { threadID, messageID, body } = event;

    if (!body) return;

    const text = body.trim().toLowerCase();

    const name = await Users.getNameUser(event.senderID);

    // =========================================================
    // 🤖 RANDOM AUTO REPLIES
    // =========================================================

    const replies = [
      "হ্যাঁ বলো 😌 তোমার জন্য কী করতে পারি?",
      "এত ডাকো কেন? 😒",
      "বলো, শুনছি আমি 😏",
      "কী হয়েছে? এভাবে ডাকছো কেন? 🤔",
      "হুদাই ডাকাডাকি করো কেন? 😂",
      "আমি এখানে আছি, বলো কী বলবে 😄",
      "একটু শান্ত হও, তারপর বলো 😌",
      "বারবার ডাকলে কিন্তু লজ্জা লাগে 🙈",
      "তোমার কথা শুনছি, বলো 😊",
      "ওই যে, আবার আমাকে ডাকছে! 😑",
      "কী ব্যাপার? আমাকে মনে পড়লো নাকি? 😆",
      "বলো বন্ধু, কী খবর? 🌸",
      "আজকে এত ডাকাডাকি কেন? 😂",
      "আমি তো এখানেই আছি 😎",
      "বলো কী করতে পারি তোমার জন্য?",
      "আসসালামু আলাইকুম 🌸 বলুন, কী করতে পারি?",
      "ওয়ালাইকুমুস সালাম 🖤",
      "ভালো আছো তো? 😊",
      "মন খারাপ নাকি? 🥺",
      "হাসো তো একটু 😄",
      "এত সিরিয়াস কেন? একটু হাসো 😂",
      "তোমার মেসেজ পেলাম 😌",
      "কী অবস্থা সবার? 😎",
      "গ্রুপে এত চুপচাপ কেন? 🤔",
      "আমি কিন্তু সব দেখছি 👀",
      "বট বলে অবহেলা করো না কিন্তু 😒",
      "আমাকে ডাকলে উত্তর দিতেই হবে নাকি? 😂",
      "ঠিক আছে, বলো কী দরকার 😌",
      "আমি প্রস্তুত, প্রশ্ন করুন 😎"
    ];

    const randomReply =
      replies[Math.floor(Math.random() * replies.length)];

    // =========================================================
    // 💙 SPECIAL REPLIES
    // =========================================================

    if (
      text === "miss you" ||
      text === "miss u"
    ) {
      return api.sendMessage(
        "আমাকে মিস করার জন্য ধন্যবাদ 😂💙",
        threadID,
        messageID
      );
    }

    if (
      text === "morning" ||
      text === "good morning"
    ) {
      return api.sendMessage(
        "🌞 GOOD MORNING!\nদাত ব্রাশ করে নাস্তা করে নাও 😄",
        threadID,
        messageID
      );
    }

    if (
      text === "good night" ||
      text === "night"
    ) {
      return api.sendMessage(
        "🌙 GOOD NIGHT!\nভালো করে ঘুমাও 😴✨",
        threadID,
        messageID
      );
    }

    if (
      text === "sim" ||
      text === "simsimi"
    ) {
      return api.sendMessage(
        "Simsimi কমান্ড ব্যবহার করতে `baby` কমান্ড চেষ্টা করতে পারো 🤖",
        threadID,
        messageID
      );
    }

    if (
      text === "oi keray" ||
      text === "ওই কিরে"
    ) {
      return api.sendMessage(
        "ওই যে! 😄 কী হয়েছে বলো?",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 👑 OWNER / CREATOR
    // =========================================================

    if (
      text === "owner" ||
      text === "ceo" ||
      text === "admin" ||
      text === "boter admin"
    ) {
      return api.sendMessage(
        "👑 𝐎𝐖𝐍𝐄𝐑\n\n💙 𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐚𝐬𝐚𝐧 𝐒𝐡𝐚𝐧𝐭𝐨\n✨ হৃদয় হাসান শান্ত",
        threadID,
        messageID
      );
    }

    if (
      text === "tor boss ke" ||
      text === "admin ke"
    ) {
      return api.sendMessage(
        "👑 My Creator: হৃদয় হাসান শান্ত\n💙 Hridoy Hasan Shanto",
        threadID,
        messageID
      );
    }

    if (
      text === "hridoy" ||
      text === "hriday" ||
      text === "হৃদয়" ||
      text === "হৃদয়" ||
      text === "হৃদয় হাসান শান্ত" ||
      text === "হৃদয় হাসান শান্ত"
    ) {
      return api.sendMessage(
        "💙 হৃদয় হাসান শান্ত এখন কাজে ব্যস্ত আছেন।\nআপনার কথা আমাকে বলতে পারেন 😊",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 🤖 BOT NAME
    // =========================================================

    if (
      text === "name" ||
      text === "tor nam ki" ||
      text === "তোমার নাম কি" ||
      text === "তোর নাম কি"
    ) {
      return api.sendMessage(
        "🤖 আমার নাম — 𝐎𝐁𝐨𝐭\n\n👑 Creator: 𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐚𝐬𝐚𝐧 𝐒𝐡𝐚𝐧𝐭𝐨 💙",
        threadID,
        messageID
      );
    }

    // =========================================================
    // ❤️ LOVE / FRIENDLY
    // =========================================================

    if (
      text === "kiss me"
    ) {
      return api.sendMessage(
        "😂 না না, আগে ভালো বন্ধু হও!",
        threadID,
        messageID
      );
    }

    if (
      text === "tnx" ||
      text === "ধন্যবাদ" ||
      text === "thank you" ||
      text === "thanks"
    ) {
      return api.sendMessage(
        "You're welcome! 😊💙",
        threadID,
        messageID
      );
    }

    if (
      text === "gf" ||
      text === "bf"
    ) {
      return api.sendMessage(
        "😂 আগে ভালো মানুষ হও, তারপর এসব চিন্তা করো!",
        threadID,
        messageID
      );
    }

    if (
      text === "tumi khaiso" ||
      text === "khaicho" ||
      text === "তুমি খাইছো"
    ) {
      return api.sendMessage(
        "আমি তো বট 🤖 খাবার খাই না! তুমি ঠিকমতো খেয়ে নাও 😊",
        threadID,
        messageID
      );
    }

    if (
      text === "tumi ki amake bhalobaso" ||
      text === "tmi ki amake vlo basho"
    ) {
      return api.sendMessage(
        "আমি সবার সাথে বন্ধুর মতো থাকি 😊💙",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 😊 HOW ARE YOU
    // =========================================================

    if (
      text === "kmon acho" ||
      text === "how are you" ||
      text === "how are you?"
    ) {
      return api.sendMessage(
        "আমি ভালো আছি 😊 তুমি কেমন আছো?",
        threadID,
        messageID
      );
    }

    if (
      text === "mon kharap" ||
      text === "tmr ki mon kharap"
    ) {
      return api.sendMessage(
        "মন খারাপ করো না 🥺 সব ঠিক হয়ে যাবে ইনশাআল্লাহ 💙",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 👋 BYE
    // =========================================================

    if (
      text === "by" ||
      text === "bye" ||
      text === "বাই" ||
      text === "jaiga" ||
      text === "যাই গা" ||
      text === "pore kotha hbe"
    ) {
      return api.sendMessage(
        "ঠিক আছে 😊 পরে আবার কথা হবে। ভালো থেকো 💙",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 🤫 STOP
    // =========================================================

    if (
      text === "chup" ||
      text === "stop" ||
      text === "চুপ কর" ||
      text === "chup kor"
    ) {
      return api.sendMessage(
        "আচ্ছা আচ্ছা 🤐 আমি চুপ!",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 🕌 ISLAMIC GREETING
    // =========================================================

    if (
      text === "আসসালামু আলাইকুম" ||
      text === "assalamualaikum" ||
      text === "assalamu alaikum" ||
      text === "salam"
    ) {
      return api.sendMessage(
        "🌸 ওয়ালাইকুমুস সালাম ওয়া রহমাতুল্লাহি ওয়া বারাকাতুহু 🌸",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 🤖 AI
    // =========================================================

    if (
      text === "ai"
    ) {
      return api.sendMessage(
        "🤖 AI ব্যবহার করতে `/ai` কমান্ড লিখুন।",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 📸 PIC
    // =========================================================

    if (
      text === "pic de" ||
      text === "ss daw"
    ) {
      return api.sendMessage(
        "📸 ছবি পাঠানোর কমান্ড ব্যবহার করুন।",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 😄 EMOJI / DOT
    // =========================================================

    if (
      text === "...." ||
      text === "..." ||
      text === ".........." ||
      text === "😠" ||
      text === "🤬" ||
      text === "😾"
    ) {
      return api.sendMessage(
        "😂 এত রাগ কেন? একটু শান্ত হও!",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 😂 FUNNY
    // =========================================================

    if (
      text === "kire"
    ) {
      return api.sendMessage(
        "হ্যাঁ বলো 😄 কী খবর?",
        threadID,
        messageID
      );
    }

    if (
      text === "bc" ||
      text === "mc"
    ) {
      return api.sendMessage(
        "SAME TO YOU 😊",
        threadID,
        messageID
      );
    }

    // =========================================================
    // 🕊️ RANDOM NO-PREFIX REPLY
    // =========================================================

    if (
      text === "obot" ||
      text === "bot" ||
      text === "বট"
    ) {
      return api.sendMessage(
        {
          body: `${name}, ${randomReply}\n\n💙 — 𝐎𝐁𝐨𝐭 | 𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐚𝐬𝐚𝐧 𝐒𝐡𝐚𝐧𝐭𝐨`
        },
        threadID,
        messageID
      );
    }

    // =========================================================
    // 📌 /BOT TRIGGER
    // =========================================================

    if (
      body.startsWith("/Bot") ||
      body.startsWith("/bot")
    ) {
      return api.sendMessage(
        {
          body:
            `${name}, ${randomReply}\n\n` +
            `╭──────────────╮\n` +
            `   🤖 𝐎𝐁𝐨𝐭 𝐑𝐞𝐩𝐥𝐲\n` +
            `   👑 𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐚𝐬𝐚𝐧 𝐒𝐡𝐚𝐧𝐭𝐨\n` +
            `╰──────────────╯`
        },
        threadID,
        messageID
      );
    }

  } catch (error) {
    console.error("❌ OBot Error:", error);
  }
};


// =============================================================
// 🚀 COMMAND RUN
// =============================================================

module.exports.run = function ({
  api,
  event,
  client,
  __GLOBAL
}) {
  // No command action
};
