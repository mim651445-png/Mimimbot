const fs = global.nodemodule["fs-extra"];
const path = global.nodemodule["path"];

// Spam guard
const guardSpam = require("../../includes/guardSpam.js");

module.exports.config = {
  name: "autoreplybot",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "💫 হৃদয় হাসান শান্ত 💫",
  description: "Smart Auto Response Bot with Safe Trigger System",
  commandCategory: "No Prefix",
  usages: "[any trigger]",
  cooldowns: 3
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    const {
      threadID,
      messageID,
      senderID,
      body
    } = event;

    if (!body || !senderID || !threadID) return;

    const name = await Users.getNameUser(senderID);
    const msg = body.toLowerCase().trim();

    const responses = {

      // 💕 Love / Fun
      "miss you":
        "🥺 আমিও তোমাকে মিস করি! 💖",

      "kiss de":
        "😄 হাহা! আগে ভালো করে কথা বলো 🙈",

      "kiss me":
        "🤗 Virtual hug পাঠালাম! 💖",

      "i love you":
        "❤️ Thank you! তুমি অনেক সুন্দর মনের মানুষ 😊",

      "love you":
        "❤️ ভালোবাসা রইলো! 😊",

      "babi":
        "😊 হুম দুষ্টু তুমি! 🙈",

      // 👋 General
      "thanks":
        "😊 Welcome! সাহায্য করতে পেরে ভালো লাগলো ❤️",

      "by":
        "👋 Bye! ভালো থেকো, আবার কথা হবে 😊",

      "help":
        "🤖 Help লাগলে বলো, আমি আছি! 😎",

      "pro":
        "😎 Nice vibe! 🔥",

      // 😂 Fun
      "👍":
        "এত বুড়ো আঙ্গুল দেখাস কেন",

      "🙄🙄🙄":
        "🙄🙄🙄",

      "chup":
        "😄 চুপ কীভাবে করতে হয় সেটাও শেখাতে হবে নাকি? 🙄",

      "murgi":
        "🐔 মুরগি ডাকলে কিন্তু আমি পালিয়ে যাবো! 😂",

      "heda":
        "😄 Okay boss! 👀",

      "boda":
        "😂 হাহা! ঠিক আছে!",

      // 🤖 Bot Identity
      "owner":
        "👑 Owner: হৃদয় হাসান শান্ত\n💫 Hriday Hasan Shanto",

      "admin":
        "👑 𝐇𝐫𝐢𝐝𝐚𝐲 𝐇𝐚𝐬𝐚𝐧 𝐒𝐡𝐚𝐧𝐭𝐨 👑",

      "hriday":
        "🤖 Bot Owner: হৃদয় হাসান শান্ত 💫",

      "হৃদয়":
        "👑 বলো, হৃদয় হাসান শান্ত-এর Bot হাজির! 🤖",

      "tor nam ki":
        "🤖 আমার নাম হলো 𝐇𝐫𝐢𝐝𝐚𝐲 𝐁𝐨𝐭 💫",

      // 💬 Conversation
      "ami hriday":
        "হ্যাঁ 😄 বলো বস, কী লাগবে? 👀",

      "আমি হৃদয়":
        "হ্যাঁ 😄 বলো, কী লাগবে? 🤖",

      "kire ki koros":
        "😄 তোমার সাথেই তো কথা বলছি! 👀",

      "kire bot":
        "হ্যাঁ বস 😎 বলো কী খবর?",

      // 🕌 Islamic
      "assalamualaikum":
        "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ 💖",

      // 📸 Media
      "pic de":
        "📸 এখন ছবি পাঠানোর ফিচার এখানে নেই 😅",

      // 🔗 Project
      "fork2":
        "🚀 Bot Project by Hriday Hasan Shanto\n🔗 GitHub Project"
    };

    if (!responses[msg]) return;

    // 🛡️ Spam Protection
    let spamBanned = false;

    try {
      spamBanned = await guardSpam({
        api,
        Users,
        senderID,
        threadID,
        messageID,
        triggerKey: "autoreply:" + msg
      });
    } catch (err) {
      console.log(
        "[AutoReplyBot] Spam guard error:",
        err.message
      );
    }

    if (spamBanned) return;

    // 🤖 Send Reply
    return api.sendMessage(
      responses[msg],
      threadID,
      messageID
    );

  } catch (error) {
    console.error(
      "[AutoReplyBot] Error:",
      error
    );
  }
};

module.exports.run = async function ({
  api,
  event,
  args,
  Users
}) {
  return this.handleEvent({
    api,
    event,
    Users
  });
};
