/**
 * ╔══════════════════════════════════════════════╗
 *              🎀 MIM.JS v2.0
 *          FULL SMART AUTO REPLY
 * ╠══════════════════════════════════════════════╣
 * 🤖 AI API Reply
 * 💬 Smart No-Prefix Reply
 * 🎲 Random Reply
 * 🎓 Teach System
 * 🔁 Reply Chain
 * 🏷️ Mention Support
 * 🛡️ Error Handling
 * ⏱️ Cooldown System
 * ⚡ Fast Response
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");

// ═════════════════════════════════════════════
// ⚙️ SETTINGS
// ═════════════════════════════════════════════

const BASE_API_URL = "https://noobs-api.top/dipto/baby";

const SETTINGS = {
  timeout: 15000,
  font: 1,
  maxLength: 1500,
  cooldown: 2
};

// ═════════════════════════════════════════════
// 🎀 MIM TRIGGERS
// ═════════════════════════════════════════════

const MIM_TRIGGERS = [
  "mim",
  "mimi",
  "মিম",
  "মিমি"
];

// ═════════════════════════════════════════════
// 🧠 SMART WORDS
// ═════════════════════════════════════════════

const SMART_WORDS = [
  "হাই",
  "হ্যালো",
  "hello",
  "hi",
  "hey",
  "কেমন আছো",
  "কেমন আছ",
  "কি খবর",
  "কী খবর",
  "কে তুমি",
  "তুমি কে",
  "কি করো",
  "কী করো",
  "শুভ সকাল",
  "শুভ রাত্রি",
  "good morning",
  "good night",
  "thanks",
  "thank you",
  "ধন্যবাদ"
];

// ═════════════════════════════════════════════
// 🎲 RANDOM REPLIES
// ═════════════════════════════════════════════

const RANDOM_REPLIES = [
  "জি বলুন, Mim শুনছি 🎀",
  "হুম, আমাকে ডাকছিলে? 👀",
  "হাই! কেমন আছো? 🥰",
  "হ্যালো! Mim এখানে আছি 🤖🎀",
  "কী খবর তোমার? 😌",
  "জি বলুন, কী দরকার? 😇",
  "আমি Online আছি ⚡",
  "Mim হাজির! 🎀✨",
  "এত ডাকছো কেন? 😂",
  "হুম বলো, শুনছি 👀",
  "কী ব্যাপার? 😌",
  "আমি কিন্তু সব শুনতেছি 👀",
  "জি বস! 🫡",
  "বলুন, কী সাহায্য লাগবে? 🤖",
  "আজকে Mim একদম Active 🔥",
  "হুমম... বলো তো 🎀",
  "আমি তো এখানেই আছি 😎",
  "Mim Ready! 💬✨",
  "ডাক দিলে তো আসতেই হবে 😌🎀"
];

// ═════════════════════════════════════════════
// 🚨 ERROR REPLIES
// ═════════════════════════════════════════════

const ERROR_REPLIES = [
  "⚠️ Mim একটু Busy আছে, আবার চেষ্টা করো।",
  "😵‍💫 API একটু সমস্যা করছে!",
  "🔄 একটু পরে আবার বলো।",
  "⚡ Mim এখন উত্তর দিতে পারছে না।",
  "🥲 Connection Problem! আবার চেষ্টা করো।"
];

// ═════════════════════════════════════════════
// ⏱️ COOLDOWN CACHE
// ═════════════════════════════════════════════

const cooldowns = new Map();

function isCooldown(senderID) {
  const now = Date.now();
  const last = cooldowns.get(senderID) || 0;

  if (now - last < SETTINGS.cooldown * 1000) {
    return true;
  }

  cooldowns.set(senderID, now);
  return false;
}

// ═════════════════════════════════════════════
// 🎲 RANDOM PICK
// ═════════════════════════════════════════════

function randomReply(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// ═════════════════════════════════════════════
// ✂️ TEXT LIMIT
// ═════════════════════════════════════════════

function limitText(text) {
  if (!text) return "";

  text = String(text).trim();

  if (text.length > SETTINGS.maxLength) {
    return text.substring(0, SETTINGS.maxLength);
  }

  return text;
}

// ═════════════════════════════════════════════
// 🤖 API REQUEST
// ═════════════════════════════════════════════

async function callAPI(params = {}) {

  const response = await axios.get(BASE_API_URL, {
    params,
    timeout: SETTINGS.timeout
  });

  return response.data;
}

// ═════════════════════════════════════════════
// 🔁 TRACK REPLY
// ═════════════════════════════════════════════

function trackReply(info, senderID) {

  if (
    global.GoatBot &&
    global.GoatBot.onReply &&
    info &&
    info.messageID
  ) {

    global.GoatBot.onReply.set(info.messageID, {
      commandName: "mim",
      messageID: info.messageID,
      author: senderID
    });
  }
}

// ═════════════════════════════════════════════
// 📤 SEND MIM MESSAGE
// ═════════════════════════════════════════════

function sendMimReply(
  api,
  body,
  threadID,
  messageID,
  senderID,
  mentions = []
) {

  return api.sendMessage(
    {
      body,
      ...(mentions.length ? { mentions } : {})
    },
    threadID,
    (err, info) => {

      if (!err && info) {
        trackReply(info, senderID);
      }

    },
    messageID
  );
}

// ═════════════════════════════════════════════
// 🎀 MODULE
// ═════════════════════════════════════════════

module.exports = {

  config: {
    name: "mim",
    aliases: ["mimi", "মিম", "মিমি"],
    version: "2.0.0",
    author: "হৃদয় হাসান শান্ত",
    countDown: SETTINGS.cooldown,
    role: 0,

    description:
      "🎀 Mim Full Smart AI Auto Reply System",

    category: "fun",

    guide: {
      en:
        "{pn} [text]\n" +
        "{pn} teach question - answer"
    }
  },

  // ═══════════════════════════════════════════
  // ▶️ COMMAND
  // ═══════════════════════════════════════════

  onStart: async function ({
    api,
    event,
    args,
    usersData
  }) {

    const {
      threadID,
      messageID,
      senderID
    } = event;

    try {

      if (isCooldown(senderID)) {
        return;
      }

      let name = "বন্ধু";

      try {
        name = await usersData.getName(senderID);
      } catch {}

      // ═══════════════════════════════════════
      // 🎀 EMPTY COMMAND
      // ═══════════════════════════════════════

      if (!args.length) {

        return sendMimReply(
          api,

          `╭─━━━━━━━━━━━━─╮
      🎀 MIM ONLINE
╰─━━━━━━━━━━━━─╯

👤 ${name}

💬 কিছু বলো...
🤖 Mim তোমার কথা শুনছে!

╰─━━━━━━━━━━━━─╯`,

          threadID,
          messageID,
          senderID,

          [
            {
              tag: name,
              id: senderID
            }
          ]
        );
      }

      // ═══════════════════════════════════════
      // 🎓 TEACH SYSTEM
      // ═══════════════════════════════════════

      if (
        args[0] &&
        args[0].toLowerCase() === "teach"
      ) {

        const input = args
          .slice(1)
          .join(" ")
          .trim();

        if (!input.includes("-")) {

          return api.sendMessage(
            `╭─━━━━━━━━━━━━─╮
       🎓 MIM TEACH
╰─━━━━━━━━━━━━─╯

❌ Format ভুল!

✅ সঠিক Format:

mim teach প্রশ্ন - উত্তর

📝 Example:

mim teach তুমি কেমন - আমি ভালো আছি 🎀`,

            threadID,
            messageID
          );
        }

        const parts = input.split(
          /\s*-\s*/,
          2
        );

        const question =
          parts[0]?.trim();

        const answer =
          parts[1]?.trim();

        if (!question || !answer) {

          return api.sendMessage(
            "❌ প্রশ্ন এবং উত্তর দুটোই দিতে হবে।",
            threadID,
            messageID
          );
        }

        const data = await callAPI({
          teach: question,
          reply: answer,
          senderID
        });

        return api.sendMessage(

          `╭─━━━━━━━━━━━━─╮
       🎀 MIM TEACH
╰─━━━━━━━━━━━━─╯

❓ প্রশ্ন:
${question}

💬 উত্তর:
${answer}

━━━━━━━━━━━━━━━

✅ ${data?.message || "Successfully Added!"}

🎀 এখন Mim এই উত্তরটি মনে রাখবে।`,

          threadID,
          messageID
        );
      }

      // ═══════════════════════════════════════
      // 🤖 AI COMMAND
      // ═══════════════════════════════════════

      const text = limitText(
        args.join(" ")
      );

      const data = await callAPI({
        text,
        senderID,
        font: SETTINGS.font
      });

      if (!data?.reply) {

        return api.sendMessage(
          randomReply(ERROR_REPLIES),
          threadID,
          messageID
        );
      }

      return sendMimReply(
        api,
        `🎀 Mim:\n\n${data.reply}`,
        threadID,
        messageID,
        senderID
      );

    } catch (error) {

      console.error(
        "[MIM COMMAND ERROR]",
        error?.message || error
      );

      return api.sendMessage(
        randomReply(ERROR_REPLIES),
        threadID,
        messageID
      );
    }
  },

  // ═══════════════════════════════════════════
  // 🔁 ON REPLY
  // ═══════════════════════════════════════════

  onReply: async function ({
    api,
    event
  }) {

    if (!event?.body) return;

    const {
      body,
      senderID,
      threadID,
      messageID
    } = event;

    try {

      if (
        typeof api.getCurrentUserID === "function" &&
        api.getCurrentUserID() == senderID
      ) {
        return;
      }

      if (isCooldown(senderID)) {
        return;
      }

      let text = limitText(body);

      if (!text) return;

      const data = await callAPI({
        text,
        senderID,
        font: SETTINGS.font
      });

      if (!data?.reply) return;

      return sendMimReply(
        api,
        `🎀 Mim:\n\n${data.reply}`,
        threadID,
        messageID,
        senderID
      );

    } catch (error) {

      console.error(
        "[MIM REPLY ERROR]",
        error?.message || error
      );
    }
  },

  // ═══════════════════════════════════════════
  // 💬 NO PREFIX AUTO REPLY
  // ═══════════════════════════════════════════

  onChat: async function ({
    api,
    event,
    usersData
  }) {

    if (!event?.body) return;

    const {
      body,
      senderID,
      threadID,
      messageID
    } = event;

    const textBody = body.trim();

    if (!textBody) return;

    // ═══════════════════════════════════════
    // 🤖 BOT SELF CHECK
    // ═══════════════════════════════════════

    try {

      if (
        typeof api.getCurrentUserID === "function" &&
        api.getCurrentUserID() == senderID
      ) {
        return;
      }

    } catch {}

    // ═══════════════════════════════════════
    // 🎀 TRIGGER CHECK
    // ═══════════════════════════════════════

    const triggerRegex =
      /^(mim|mimi|মিম|মিমি)(?:\s+|$)/i;

    const hasMimTrigger =
      triggerRegex.test(textBody);

    // ═══════════════════════════════════════
    // 🧠 SMART WORD CHECK
    // ═══════════════════════════════════════

    const lower =
      textBody.toLowerCase();

    const isSmartWord =
      SMART_WORDS.some(word => {

        const w =
          word.toLowerCase();

        return (
          lower === w ||
          lower.startsWith(w + " ")
        );
      });

    if (
      !hasMimTrigger &&
      !isSmartWord
    ) {
      return;
    }

    // ═══════════════════════════════════════
    // ⏱️ COOLDOWN
    // ═══════════════════════════════════════

    if (isCooldown(senderID)) {
      return;
    }

    // ═══════════════════════════════════════
    // 🎀 MIM TRIGGER
    // ═══════════════════════════════════════

    if (hasMimTrigger) {

      const query =
        textBody
          .replace(
            /^(mim|mimi|মিম|মিমি)\s*/i,
            ""
          )
          .trim();

      // ═══════════════════════════════════
      // 🎲 ONLY MIM
      // ═══════════════════════════════════

      if (!query) {

        try {

          let name = "বন্ধু";

          try {
            name =
              await usersData.getName(senderID);
          } catch {}

          const random =
            randomReply(RANDOM_REPLIES);

          return sendMimReply(

            api,

            `「 ${name} 」\n\n🎀 ${random}`,

            threadID,
            messageID,
            senderID,

            [
              {
                tag: name,
                id: senderID
              }
            ]
          );

        } catch (error) {

          console.error(
            "[MIM RANDOM ERROR]",
            error?.message || error
          );

          return;
        }
      }

      // ═══════════════════════════════════
      // 🤖 MIM + TEXT
      // ═══════════════════════════════════

      try {

        const queryText =
          limitText(query);

        const data =
          await callAPI({
            text: queryText,
            senderID,
            font: SETTINGS.font
          });

        if (!data?.reply) {

          return sendMimReply(
            api,
            randomReply(ERROR_REPLIES),
            threadID,
            messageID,
            senderID
          );
        }

        return sendMimReply(
          api,
          `🎀 Mim:\n\n${data.reply}`,
          threadID,
          messageID,
          senderID
        );

      } catch (error) {

        console.error(
          "[MIM AI ERROR]",
          error?.message || error
        );

        return sendMimReply(
          api,
          randomReply(ERROR_REPLIES),
          threadID,
          messageID,
          senderID
        );
      }
    }

    // ═══════════════════════════════════════
    // 🧠 SMART NO PREFIX AI
    // ═══════════════════════════════════════

    if (isSmartWord) {

      try {

        const data =
          await callAPI({
            text: limitText(textBody),
            senderID,
            font: SETTINGS.font
          });

        if (!data?.reply) {

          return sendMimReply(
            api,
            randomReply(RANDOM_REPLIES),
            threadID,
            messageID,
            senderID
          );
        }

        return sendMimReply(
          api,
          `🎀 Mim:\n\n${data.reply}`,
          threadID,
          messageID,
          senderID
        );

      } catch (error) {

        console.error(
          "[MIM SMART ERROR]",
          error?.message || error
        );

        return sendMimReply(
          api,
          randomReply(RANDOM_REPLIES),
          threadID,
          messageID,
          senderID
        );
      }
    }
  }
};
