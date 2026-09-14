/**
 * ╔══════════════════════════════════════════════╗
 *              🎀 MIM.JS v2.1
 *          FULL SMART AUTO REPLY
 * ╠══════════════════════════════════════════════╣
 * 🤖 AI API Reply
 * 💬 No-Prefix Auto Reply
 * 🎀 Mim Trigger
 * 🎲 Random Reply
 * 🎓 Teach System
 * 🔁 Reply Chain
 * 🏷️ Mention Support
 * 🛡️ Error Handling
 * ⏱️ Cooldown System
 * ⚡ Fast Response
 * 🔄 Event Fallback
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
  cooldown: 2,

  // true করলে সাধারণ কথাতেও Mim reply দিতে পারবে
  smartAutoReply: true,

  // true করলে Mim/মিম trigger অবশ্যই কাজ করবে
  mimTrigger: true
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
  "হাই মিম",
  "হ্যালো মিম",
  "hello",
  "hi",
  "hey",
  "হেই",
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
  "ধন্যবাদ",
  "ভালো আছো",
  "ভালো আছ",
  "ঘুমাইছো",
  "ঘুমাচ্ছো",
  "খাইছো",
  "খেয়েছো",
  "খেয়েছো"
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
// ⏱️ COOLDOWN
// ═════════════════════════════════════════════

const cooldowns = new Map();

function isCooldown(senderID) {
  if (!senderID) return false;

  const now = Date.now();
  const last = cooldowns.get(senderID) || 0;

  if (now - last < SETTINGS.cooldown * 1000) {
    return true;
  }

  cooldowns.set(senderID, now);

  // Memory clean
  setTimeout(() => {
    const current = cooldowns.get(senderID);

    if (current === now) {
      cooldowns.delete(senderID);
    }
  }, SETTINGS.cooldown * 1000 + 1000);

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
    timeout: SETTINGS.timeout,
    headers: {
      "User-Agent": "MimBot/2.1"
    }
  });

  return response.data;
}

// ═════════════════════════════════════════════
// 🔍 GET API REPLY
// ═════════════════════════════════════════════

function getAPIReply(data) {
  if (!data) return "";

  if (typeof data === "string") {
    return limitText(data);
  }

  const reply =
    data.reply ||
    data.response ||
    data.message ||
    data.answer ||
    data.data?.reply ||
    data.data?.response ||
    "";

  return limitText(reply);
}

// ═════════════════════════════════════════════
// 🤖 BOT SELF CHECK
// ═════════════════════════════════════════════

function isBotMessage(api, senderID) {
  try {
    if (
      typeof api.getCurrentUserID === "function" &&
      api.getCurrentUserID() == senderID
    ) {
      return true;
    }
  } catch (e) {}

  return false;
}

// ═════════════════════════════════════════════
// 🔁 TRACK REPLY
// ═════════════════════════════════════════════

function trackReply(info, senderID) {
  try {
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
  } catch (e) {
    console.error("[MIM TRACK ERROR]", e.message);
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
  return new Promise((resolve) => {
    try {
      api.sendMessage(
        {
          body: limitText(body),
          ...(mentions.length ? { mentions } : {})
        },
        threadID,
        (err, info) => {
          if (!err && info) {
            trackReply(info, senderID);
          }

          resolve(info);
        },
        messageID
      );
    } catch (error) {
      console.error("[MIM SEND ERROR]", error.message);
      resolve(null);
    }
  });
}

// ═════════════════════════════════════════════
// 🎀 GET USER NAME
// ═════════════════════════════════════════════

async function getUserName(usersData, senderID) {
  try {
    if (usersData && typeof usersData.getName === "function") {
      const name = await usersData.getName(senderID);

      if (name) {
        return name;
      }
    }
  } catch (e) {}

  return "বন্ধু";
}

// ═════════════════════════════════════════════
// 🎀 CHECK MIM TRIGGER
// ═════════════════════════════════════════════

function getMimQuery(text) {
  if (!text) return null;

  const regex =
    /^(mim|mimi|মিম|মিমি)(?:\s+|$)/i;

  if (!regex.test(text)) {
    return null;
  }

  return text
    .replace(regex, "")
    .trim();
}

// ═════════════════════════════════════════════
// 🧠 CHECK SMART WORD
// ═════════════════════════════════════════════

function isSmartMessage(text) {
  if (!text) return false;

  const lower = text.toLowerCase().trim();

  return SMART_WORDS.some((word) => {
    const w = word.toLowerCase();

    return (
      lower === w ||
      lower.startsWith(w + " ")
    );
  });
}

// ═════════════════════════════════════════════
// 🎓 TEACH HANDLER
// ═════════════════════════════════════════════

async function teachMim({
  api,
  threadID,
  messageID,
  senderID,
  input
}) {
  try {
    if (!input.includes("-")) {
      return api.sendMessage(
        `╭─━━━━━━━━━━━━─╮
       🎓 MIM TEACH
╰─━━━━━━━━━━━━─╯

❌ Format ভুল!

✅ সঠিক Format:

mim teach প্রশ্ন - উত্তর

📝 Example:

mim teach তুমি কেমন - আমি ভালো আছি 🎀

╰─━━━━━━━━━━━━─╯`,
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

    const result =
      data?.message ||
      data?.reply ||
      "Successfully Added!";

    return api.sendMessage(
      `╭─━━━━━━━━━━━━─╮
       🎀 MIM TEACH
╰─━━━━━━━━━━━━─╯

❓ প্রশ্ন:
${question}

💬 উত্তর:
${answer}

━━━━━━━━━━━━━━━

✅ ${result}

🎀 এখন Mim এই উত্তরটি মনে রাখবে।

╰─━━━━━━━━━━━━─╯`,
      threadID,
      messageID
    );

  } catch (error) {
    console.error(
      "[MIM TEACH ERROR]",
      error.message
    );

    return api.sendMessage(
      randomReply(ERROR_REPLIES),
      threadID,
      messageID
    );
  }
}

// ═════════════════════════════════════════════
// 🤖 AI REPLY
// ═════════════════════════════════════════════

async function getMimAIReply(
  api,
  event,
  text
) {
  const {
    threadID,
    messageID,
    senderID
  } = event;

  try {
    const query = limitText(text);

    if (!query) {
      return sendMimReply(
        api,
        randomReply(RANDOM_REPLIES),
        threadID,
        messageID,
        senderID
      );
    }

    const data = await callAPI({
      text: query,
      senderID,
      font: SETTINGS.font
    });

    const reply = getAPIReply(data);

    if (!reply) {
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
      `╭─━━━━━━━━━━━━─╮
          🎀 MIM
╰─━━━━━━━━━━━━─╯

${reply}

╰─━━━━━━━━━━━━─╯`,
      threadID,
      messageID,
      senderID
    );

  } catch (error) {
    console.error(
      "[MIM AI ERROR]",
      error.message
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

// ═════════════════════════════════════════════
// 🎀 MODULE
// ═════════════════════════════════════════════

module.exports = {

  config: {
    name: "mim",

    aliases: [
      "mimi",
      "মিম",
      "মিমি"
    ],

    version: "2.1.0",

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

      const name =
        await getUserName(
          usersData,
          senderID
        );

      // Empty command
      if (!args.length) {

        return sendMimReply(
          api,

          `╭─━━━━━━━━━━━━─╮
        🎀 MIM ONLINE
╰─━━━━━━━━━━━━─╯

👤 ${name}

💬 কিছু বলো...
🤖 Mim তোমার কথা শুনছে!

━━━━━━━━━━━━━━━
🎀 Type: mim + message
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

      // Teach
      if (
        args[0] &&
        args[0].toLowerCase() === "teach"
      ) {

        const input =
          args
            .slice(1)
            .join(" ")
            .trim();

        return teachMim({
          api,
          threadID,
          messageID,
          senderID,
          input
        });
      }

      // AI
      const text =
        args.join(" ");

      return getMimAIReply(
        api,
        event,
        text
      );

    } catch (error) {

      console.error(
        "[MIM COMMAND ERROR]",
        error.message
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

      if (isBotMessage(api, senderID)) {
        return;
      }

      if (isCooldown(senderID)) {
        return;
      }

      const text =
        limitText(body);

      if (!text) return;

      return getMimAIReply(
        api,
        event,
        text
      );

    } catch (error) {

      console.error(
        "[MIM REPLY ERROR]",
        error.message
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

    try {

      // Bot নিজেকে reply করবে না
      if (isBotMessage(api, senderID)) {
        return;
      }

      const text =
        String(body).trim();

      if (!text) return;

      // ═══════════════════════════════════════
      // 🎀 MIM TRIGGER
      // ═══════════════════════════════════════

      const mimQuery =
        getMimQuery(text);

      if (
        SETTINGS.mimTrigger &&
        mimQuery !== null
      ) {

        if (isCooldown(senderID)) {
          return;
        }

        // শুধু "Mim"
        if (!mimQuery) {

          const name =
            await getUserName(
              usersData,
              senderID
            );

          return sendMimReply(
            api,

            `╭─━━━━━━━━━━━━─╮
        🎀 MIM
╰─━━━━━━━━━━━━─╯

「 ${name} 」

${randomReply(RANDOM_REPLIES)}

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

        // Mim + Text
        return getMimAIReply(
          api,
          event,
          mimQuery
        );
      }

      // ═══════════════════════════════════════
      // 🧠 SMART AUTO REPLY
      // ═══════════════════════════════════════

      if (
        SETTINGS.smartAutoReply &&
        isSmartMessage(text)
      ) {

        if (isCooldown(senderID)) {
          return;
        }

        return getMimAIReply(
          api,
          event,
          text
        );
      }

    } catch (error) {

      console.error(
        "[MIM ONCHAT ERROR]",
        error.message
      );
    }
  },

  // ═══════════════════════════════════════════
  // 🔄 EVENT FALLBACK
  // ═══════════════════════════════════════════
  // কিছু GoatBot setup-এ onChat কাজ না করলে
  // handleEvent fallback হিসেবে রাখা হয়েছে।

  handleEvent: async function ({
    api,
    event,
    usersData
  }) {

    if (!event?.body) return;

    try {

      if (isBotMessage(api, event.senderID)) {
        return;
      }

      const text =
        String(event.body).trim();

      if (!text) return;

      const mimQuery =
        getMimQuery(text);

      // Mim trigger
      if (
        SETTINGS.mimTrigger &&
        mimQuery !== null
      ) {

        if (isCooldown(event.senderID)) {
          return;
        }

        if (!mimQuery) {

          const name =
            await getUserName(
              usersData,
              event.senderID
            );

          return sendMimReply(
            api,
            `「 ${name} 」\n\n🎀 ${randomReply(RANDOM_REPLIES)}`,
            event.threadID,
            event.messageID,
            event.senderID,
            [
              {
                tag: name,
                id: event.senderID
              }
            ]
          );
        }

        return getMimAIReply(
          api,
          event,
          mimQuery
        );
      }

      // Smart words
      if (
        SETTINGS.smartAutoReply &&
        isSmartMessage(text)
      ) {

        if (isCooldown(event.senderID)) {
          return;
        }

        return getMimAIReply(
          api,
          event,
          text
        );
      }

    } catch (error) {

      console.error(
        "[MIM EVENT ERROR]",
        error.message
      );
    }
  }
};
