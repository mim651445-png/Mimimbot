/**
 * ╔══════════════════════════════════════════════╗
 * ║          AUTOREPLY BOT — V6.0.3             ║
 * ║                                              ║
 * ║  Developer : হৃদয় হাসান শান্ত               ║
 * ║  Version   : 6.0.3                           ║
 * ╚══════════════════════════════════════════════╝
 */

module.exports.config = {
  name: "autoreplybot",
  version: "6.0.3",
  hasPermssion: 0,
  credits: "💠 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎 💠",
  description: "Auto response bot with specified triggers",
  commandCategory: "No Prefix",
  usages: "[any trigger]",
  cooldowns: 3
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    if (!event || !event.body) return;

    const threadID = event.threadID;
    const messageID = event.messageID;

    // Clean message
    const msg = String(event.body)
      .toLowerCase()
      .trim();

    if (!msg) return;

    const responses = {

      // English
      "miss you":
        "Aww 🥺 আমিও তোমাকে মিস করি!",

      "kiss de":
        "😄 Haha, এখন না পরে কথা বলি!",

      "👍":
        "🙉👀",

      "help":
        "Prefix তোমার নানি কালকে দিয়ে যাবে 😊",

      "fork2":
        "https://github.com/hriday-hassan-shanto",

      "pro":
        "😎 Nice vibe!",

      "🙄🙄🙄":
        "🙄🙄🙄",

      "owner":
        "👑 Owner: হৃদয় হাসান শান্ত\n💠 Developer: Hridoy Hasan Shanto",

      "admin":
        "💠 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎 💠",

      "babi":
        "😊 দুষ্টু তুমি",

      "chup":
        "😄 চুপ কীভাবে করে 🙄",

      "kiss me":
        "😄 Virtual hug পাঠালাম 🤗",

      "thanks":
        "😊 সাহায্য করতে পেরে ভালো লাগলো!",

      "i love you":
        "❤️ Thank you! You're awesome!",

      "by":
        "Bye 👋 ভালো থেকো",

      "ami hriday":
        "হ্যাঁ 😄 বলো বস",

      "ami হৃদয়":
        "হ্যাঁ 😄 বলো বস",

      "tor nam ki":
        "My name is 💠 হৃদয় হাসান শান্ত Bot 💠",

      "pic de":
        "📸 এখন ছবি শেয়ার করতে পারছি না",

      "murgi":
        "🐔 কাউকে মুরগি দিলে আমি লিভ নিবো 😒",

      "heda":
        "😄 OK",

      "boda":
        "😄 Haha",

      "love you":
        "❤️ Love you too",

      "kire ki koros":
        "😄 তোমার সাথে কথা বলছি",

      "kire bot":
        "হ্যাঁ বলো 👀",

      // Bangla
      "হৃদয়":
        "🤖 Bot Developer: হৃদয় হাসান শান্ত",

      "হৃদয়":
        "🤖 Bot Developer: হৃদয় হাসান শান্ত",

      "আমি হৃদয়":
        "হ্যাঁ 😄 বলো কী লাগবে?",

      "আমি হৃদয়":
        "হ্যাঁ 😄 বলো কী লাগবে?",

      "assalamualaikum":
        "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ 💖"
    };

    // Exact trigger match
    if (!Object.prototype.hasOwnProperty.call(responses, msg)) {
      return;
    }

    // Optional spam protection
    let spamBanned = false;

    try {
      const guardSpam = require("../../includes/hriday_spt.js");

      if (typeof guardSpam === "function") {
        spamBanned = await guardSpam({
          api,
          senderID: event.senderID,
          threadID,
          messageID,
          triggerKey: "autoreply:" + msg
        });
      }
    } catch (error) {
      // Spam protection unavailable হলে bot বন্ধ হবে না
      console.log(
        "[autoreplybot] Spam guard skipped:",
        error.message
      );
    }

    if (spamBanned) return;

    return api.sendMessage(
      responses[msg],
      threadID,
      messageID
    );

  } catch (error) {
    console.error(
      "[autoreplybot ERROR]",
      error
    );
  }
};

module.exports.run = async function ({ api, event }) {
  return module.exports.handleEvent({
    api,
    event
  });
};
