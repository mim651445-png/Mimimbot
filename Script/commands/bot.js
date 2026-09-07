/**
 * ╔══════════════════════════════════════════════╗
 *              🎀 MIM.JS v1.0
 *          FULL SMART AUTO REPLY
 * ╠══════════════════════════════════════════════╣
 * 🤖 AI API Reply
 * 💬 Smart No-Prefix Reply
 * 🎲 Random Reply
 * 🎓 Teach System
 * 🔁 Reply System
 * 🏷️ Mention Support
 * 🛡️ Error Handling
 * ⚡ Fast Response
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");

const BASE_API_URL = "https://noobs-api.top/dipto/baby";

const SETTINGS = {
  timeout: 15000,
  font: 1,
  maxLength: 1500
};

// ═════════════════════════════════════════════
// 🎀 MIM TRIGGERS
// ═════════════════════════════════════════════

const MIM_TRIGGERS = [
  "mim",
  "mimi",
  "মিম"
];

// ═════════════════════════════════════════════
// 💬 SMART AUTO REPLY WORDS
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
// 🎲 RANDOM MIM REPLIES
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
  "আমাকে মনে পড়েছে নাকি? 😏",
  "আমি কিন্তু সব শুনতেছি 👀",
  "একটু আস্তে ডাকো 😴😂",
  "জি বস! 🫡",
  "বলুন, কী সাহায্য লাগবে? 🤖",
  "আজকে Mim একদম Active 🔥",
  "হুমম... বলো তো 🎀",
  "আমি তো এখানেই আছি 😎",
  "Mim Ready! 💬✨"
];

// ═════════════════════════════════════════════
// 🔧 API REQUEST
// ═════════════════════════════════════════════

async function callAPI(params = {}) {
  const response = await axios.get(BASE_API_URL, {
    params,
    timeout: SETTINGS.timeout
  });

  return response.data;
}

// ═════════════════════════════════════════════
// 🔁 SAVE REPLY
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
// 📤 SEND MESSAGE
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
// 🎀 MIM MODULE
// ═════════════════════════════════════════════

module.exports = {

  config: {
    name: "mim",
    aliases: ["mimi", "মিম"],
    version: "1.0.0",
    author: "Mim",
    countDown: 0,
    role: 0,
    description: "🎀 Mim Full Smart AI Auto Reply",
    category: "fun",
    guide: {
      en: "{pn} [text]\n{pn} teach question - answer"
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

      const name = await usersData.getName(senderID);

      // ───────────────────────────────────────
      // Empty Command
      // ───────────────────────────────────────

      if (!args.length) {

        return sendMimReply(
          api,
          `「 ${name} 」\n\n🎀 Mim Online আছে!\n💬 কিছু বলুন...`,
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

      if (args[0].toLowerCase() === "teach") {

        const input = args
          .slice(1)
          .join(" ")
          .trim();

        if (!input.includes("-")) {

          return api.sendMessage(
            "⚠️ সঠিক Format:\n\nmim teach প্রশ্ন - উত্তর",
            threadID,
            messageID
          );
        }

        const parts = input.split(
          /\s*-\s*/,
          2
        );

        const question = parts[0]?.trim();
        const answer = parts[1]?.trim();

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

❓ প্রশ্ন: ${question}
💬 উত্তর: ${answer}

✅ ${data?.message || "Successfully Added!"}`,
          threadID,
          messageID
        );
      }

      // ═══════════════════════════════════════
      // 🤖 NORMAL AI COMMAND
      // ═══════════════════════════════════════

      let text = args.join(" ").trim();

      if (text.length > SETTINGS.maxLength) {
        text = text.substring(
          0,
          SETTINGS.maxLength
        );
      }

      const data = await callAPI({
        text,
        senderID,
        font: SETTINGS.font
      });

      if (!data?.reply) {

        return api.sendMessage(
          "⚠️ Mim কোনো উত্তর পায়নি।",
          threadID,
          messageID
        );
      }

      return sendMimReply(
        api,
        data.reply,
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
        "⚠️ Mim API Busy! একটু পরে আবার চেষ্টা করুন।",
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

      let text = body.trim();

      if (!text) return;

      if (text.length > SETTINGS.maxLength) {
        text = text.substring(
          0,
          SETTINGS.maxLength
        );
      }

      const data = await callAPI({
        text,
        senderID,
        font: SETTINGS.font
      });

      if (!data?.reply) return;

      return sendMimReply(
        api,
        data.reply,
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
  // 💬 NO-PREFIX SMART AUTO REPLY
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

    const lower = textBody.toLowerCase();

    // ═══════════════════════════════════════
    // 🎀 MIM TRIGGER
    // ═══════════════════════════════════════

    const triggerRegex =
      /^(mim|mimi|মিম)(?:\s+|$)/i;

    const hasMimTrigger =
      triggerRegex.test(textBody);

    // ═══════════════════════════════════════
    // 🧠 SMART WORD CHECK
    // ═══════════════════════════════════════

    const isSmartWord =
      SMART_WORDS.some(word => {

        const w = word.toLowerCase();

        return (
          lower === w ||
          lower.startsWith(w + " ")
        );
      });

    if (!hasMimTrigger && !isSmartWord) {
      return;
    }

    // ═══════════════════════════════════════
    // 🎀 MIM + TEXT
    // ═══════════════════════════════════════

    if (hasMimTrigger) {

      const query = textBody
        .replace(
          /^(mim|mimi|মিম)\s*/i,
          ""
        )
        .trim();

      // ─────────────────────────────────────
      // শুধু Mim লিখলে Random Reply
      // ─────────────────────────────────────

      if (!query) {

        try {

          const name =
            await usersData.getName(senderID);

          const random =
            RANDOM_REPLIES[
              Math.floor(
                Math.random() *
                RANDOM_REPLIES.length
              )
            ];

          return sendMimReply(
            api,
            `「 ${name} 」\n\n${random}`,
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

      // ─────────────────────────────────────
      // Mim + Text → AI
      // ─────────────────────────────────────

      try {

        let queryText = query;

        if (
          queryText.length >
          SETTINGS.maxLength
        ) {
          queryText =
            queryText.substring(
              0,
              SETTINGS.maxLength
            );
        }

        const data = await callAPI({
          text: queryText,
          senderID,
          font: SETTINGS.font
        });

        if (!data?.reply) return;

        return sendMimReply(
          api,
          data.reply,
          threadID,
          messageID,
          senderID
        );

      } catch (error) {

        console.error(
          "[MIM AI ERROR]",
          error?.message || error
        );

        return;
      }
    }

    // ═══════════════════════════════════════
    // 🧠 SMART NO-PREFIX AI REPLY
    // ═══════════════════════════════════════

    if (isSmartWord) {

      try {

        const data = await callAPI({
          text: textBody,
          senderID,
          font: SETTINGS.font
        });

        if (!data?.reply) {

          const random =
            RANDOM_REPLIES[
              Math.floor(
                Math.random() *
                RANDOM_REPLIES.length
              )
            ];

          return sendMimReply(
            api,
            random,
            threadID,
            messageID,
            senderID
          );
        }

        return sendMimReply(
          api,
          data.reply,
          threadID,
          messageID,
          senderID
        );

      } catch (error) {

        const random =
          RANDOM_REPLIES[
            Math.floor(
              Math.random() *
              RANDOM_REPLIES.length
            )
          ];

        return sendMimReply(
          api,
          random,
          threadID,
          messageID,
          senderID
        );
      }
    }
  }
};
