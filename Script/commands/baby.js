/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║                    𝐁𝐀𝐁𝐘 𝐀𝐈 — 𝐕𝟏.𝟑.𝟐                     ║
 * ║              Premium Messenger AI Chat Bot               ║
 * ║                                                            ║
 * ║  Developer : হৃদয় হাসান শান্ত                              ║
 * ║  Version   : 1.3.2                                        ║
 * ║  Type      : AI / Auto Teach / Reply Bot                  ║
 * ╚════════════════════════════════════════════════════════════╝
 */

const axios = require("axios");

let simsim = "";
let count_req = 0;
let botUID = null;

const triggerLocks = new Set();

/* ============================================================
   // ERROR SAFE HANDLE REPLY
   ============================================================ */

function ensureHandleReply() {
  try {
    if (!global.client) {
      global.client = {};
    }

    if (!Array.isArray(global.client.handleReply)) {
      global.client.handleReply = [];
    }

    return global.client.handleReply;
  } catch (err) {
    console.log("❌ ERROR: handleReply initialization failed:", err.message);
    return [];
  }
}

/* ============================================================
   // ERROR SAFE TYPING INDICATOR
   ============================================================ */

async function sendTypingIndicatorV2(sendTyping, threadID) {
  try {
    /*
      // ERROR FIX:
      // পুরোনো code-এ mqttClient সরাসরি ব্যবহার করা হয়েছিল।
      // কিন্তু অনেক Mirai/GoatBot setup-এ mqttClient global থাকে না।
      // তাই না থাকলে typing effect skip করবে এবং bot crash করবে না।
    */

    const client =
      global.mqttClient ||
      global.client?.mqttClient ||
      global.api?.mqttClient;

    if (!client || typeof client.publish !== "function") {
      return;
    }

    const wsContent = {
      app_id: 2220391788200892,

      payload: JSON.stringify({
        label: 3,

        payload: JSON.stringify({
          thread_key: String(threadID),

          is_group_thread: Number(
            String(threadID).length >= 16
          ),

          is_typing: Number(Boolean(sendTyping)),

          attribution: 0
        }),

        version: 5849951561777440
      }),

      request_id: ++count_req,

      type: 4
    };

    await new Promise((resolve, reject) => {
      client.publish(
        "/ls_req",
        JSON.stringify(wsContent),
        {},
        (err) => {
          if (err) {
            return reject(err);
          }

          resolve();
        }
      );
    });
  } catch (err) {
    /*
      // ERROR:
      // Typing indicator fail করলেও main bot response বন্ধ হবে না।
    */

    console.log(
      "⚠️ ERROR: Typing indicator skipped:",
      err.message
    );
  }
}

/* ============================================================
   // ERROR SAFE API LOADER
   ============================================================ */

(async () => {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/abdullahrx07/X-api/main/MaRiA/baseApiUrl.json",
      {
        timeout: 10000
      }
    );

    if (res.data && res.data.mari) {
      simsim = String(res.data.mari).replace(/\/+$/, "");

      console.log(
        "✅ Baby API loaded successfully:",
        simsim
      );
    } else {
      console.log(
        "❌ ERROR: Baby API URL was not found."
      );
    }
  } catch (err) {
    console.log(
      "❌ ERROR: Baby API loading failed:",
      err.message
    );
  }
})();

/* ============================================================
   BOT UID
   ============================================================ */

function getBotUID(api) {
  if (botUID) {
    return botUID;
  }

  try {
    if (
      api &&
      typeof api.getCurrentUserID === "function"
    ) {
      botUID = api.getCurrentUserID();
    }
  } catch (err) {
    console.log(
      "⚠️ ERROR: Could not get bot UID:",
      err.message
    );
  }

  return botUID;
}

/* ============================================================
   CONFIG
   ============================================================ */

module.exports.config = {
  name: "baby",

  aliases: [
    "maria",
    "bot"
  ],

  premium: false,

  version: "1.3.2",

  hasPermssion: 0,

  credits: "হৃদয় হাসান শান্ত",

  description:
    "AI auto teach with Teach, List, React, Edit, Remove, Msg & AutoTeach support.",

  commandCategory: "chat",

  usages:
    "[query]\n" +
    "list\n" +
    "teach [Question] - [Reply]\n" +
    "react [Question] - [Emoji]\n" +
    "edit [Question] - [OldReply] - [NewReply]\n" +
    "remove/rm [Question] - [Reply]\n" +
    "del (reply to bot wrong answer)\n" +
    "msg [trigger]\n" +
    "msg [trigger] -20\n" +
    "autoteach on/off\n" +
    "autoteach on/off global",

  cooldowns: 0,

  prefix: false
};

/* ============================================================
   COMMAND RUN
   ============================================================ */

module.exports.run = async function ({
  api,
  event,
  args,
  Users
}) {
  const uid = event.senderID;

  let senderName = "User";

  try {
    if (
      Users &&
      typeof Users.getNameUser === "function"
    ) {
      senderName =
        await Users.getNameUser(uid);
    }
  } catch (err) {
    console.log(
      "⚠️ ERROR: Username loading failed:",
      err.message
    );
  }

  const query = args
    .join(" ")
    .toLowerCase()
    .trim();

  try {
    /*
      // ERROR:
      // API এখনো load না হলে request পাঠানো হবে না।
    */

    if (!simsim) {
      return api.sendMessage(
        "❌ API not loaded yet. Please try again in a moment.",
        event.threadID,
        event.messageID
      );
    }

    /* ========================================================
       AUTOTEACH
       ======================================================== */

    if (args[0] === "autoteach") {
      const mode = String(
        args[1] || ""
      ).toLowerCase();

      const scope = String(
        args[2] || ""
      ).toLowerCase();

      if (!["on", "off"].includes(mode)) {
        return api.sendMessage(
          "❌ Use:\nbaby autoteach on\nbaby autoteach off\nbaby autoteach on global\nbaby autoteach off global",
          event.threadID,
          event.messageID
        );
      }

      const status = mode === "on";

      if (scope === "global") {
        try {
          const res = await axios.post(
            `${simsim}/setting`,
            {
              autoTeach: status
            },
            {
              timeout: 10000
            }
          );

          return api.sendMessage(
            `✅ Auto teach is now ${
              status
                ? "ON 🟢"
                : "OFF 🔴"
            } 𝐆𝐋𝐎𝐁𝐀𝐋𝐋𝐘\n\n${
              res.data?.message || ""
            }`,
            event.threadID,
            event.messageID
          );
        } catch (err) {
          return api.sendMessage(
            `❌ ERROR: Global AutoTeach failed.\n${err.message}`,
            event.threadID,
            event.messageID
          );
        }
      }

      try {
        const res = await axios.post(
          `${simsim}/setting`,
          {
            autoTeach: status,
            threadID: event.threadID
          },
          {
            timeout: 10000
          }
        );

        return api.sendMessage(
          `✅ ${
            res.data?.message ||
            `AutoTeach ${status ? "ON" : "OFF"}`
          }\n📌 𝐓𝐡𝐢𝐬 𝐭𝐡𝐫𝐞𝐚𝐝 𝐨𝐧𝐥𝐲`,
          event.threadID,
          event.messageID
        );
      } catch (err) {
        return api.sendMessage(
          `❌ ERROR: Thread AutoTeach failed.\n${err.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    /* ========================================================
       LIST
       ======================================================== */

    if (args[0] === "list") {
      try {
        const res = await axios.get(
          `${simsim}/list`,
          {
            timeout: 10000
          }
        );

        return api.sendMessage(
          `╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬
├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${
            res.data?.totalQuestions || 0
          }
├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${
            res.data?.totalReplies || 0
          }
╰─╼👤 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫: 𝐡𝐫𝐢𝐝𝐨𝐲 𝐡𝐚𝐬𝐬𝐚𝐧 𝐬𝐡𝐚𝐧𝐭𝐨`,
          event.threadID,
          event.messageID
        );
      } catch (err) {
        return api.sendMessage(
          `❌ ERROR: Could not load Baby AI list.\n${err.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    /* ========================================================
       MSG
       ======================================================== */

    if (args[0] === "msg") {
      let trigger = args
        .slice(1)
        .join(" ")
        .trim();

      if (!trigger) {
        return api.sendMessage(
          "❌ Use: baby msg [trigger]\nOr: baby msg [trigger] -20",
          event.threadID,
          event.messageID
        );
      }

      let customLimit = null;

      const limitMatch =
        trigger.match(
          /\s*-(\d+)\s*$/
        );

      if (limitMatch) {
        customLimit = parseInt(
          limitMatch[1],
          10
        );

        trigger = trigger
          .replace(
            /\s*-(\d+)\s*$/,
            ""
          )
          .trim();

        if (!trigger) {
          return api.sendMessage(
            "❌ Use: baby msg [trigger] -20",
            event.threadID,
            event.messageID
          );
        }
      }

      try {
        const res = await axios.get(
          `${simsim}/simsimi-list?ask=${encodeURIComponent(
            trigger
          )}`,
          {
            timeout: 15000
          }
        );

        if (
          !res.data ||
          !Array.isArray(res.data.replies) ||
          res.data.replies.length === 0
        ) {
          return api.sendMessage(
            "❌ No replies found.",
            event.threadID,
            event.messageID
          );
        }

        const REPLY_LIMIT =
          customLimit &&
          customLimit > 0
            ? customLimit
            : 150;

        const allReplies =
          res.data.replies;

        const shownReplies =
          allReplies.slice(
            0,
            REPLY_LIMIT
          );

        const remaining =
          allReplies.length -
          shownReplies.length;

        const formatted =
          shownReplies
            .map(
              (rep, i) =>
                `➤ ${i + 1}. ${rep}`
            )
            .join("\n");

        const limitNote =
          remaining > 0
            ? `\n⚠️ ${REPLY_LIMIT} 𝐭𝐚 𝐫𝐞𝐩𝐥𝐲 𝐝𝐞𝐤𝐡𝐚𝐧𝐨 𝐡𝐨𝐲𝐞𝐜𝐡𝐞, 𝐚𝐫𝐨 ${remaining} 𝐭𝐚 𝐛𝐚𝐤𝐢 𝐚𝐜𝐡𝐞।\n`
            : "";

        const msg =
          `📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}
📋 𝗧𝗼𝘁𝗮𝗹: ${
            res.data.total ||
            allReplies.length
          }
━━━━━━━━━━━━━━
${formatted}
━━━━━━━━━━━━━━
${limitNote}
✏️ Reply with the numbers you want to KEEP.
Example: 2, 7`;

        return api.sendMessage(
          msg,
          event.threadID,
          (err, info) => {
            if (err) {
              console.log(
                "❌ ERROR: msg selection message failed:",
                err.message
              );
              return;
            }

            ensureHandleReply().push({
              name:
                module.exports.config.name,

              messageID:
                info.messageID,

              author:
                event.senderID,

              type: "msgSelect",

              trigger,

              body: msg
            });
          },
          event.messageID
        );
      } catch (err) {
        return api.sendMessage(
          `❌ ERROR: msg command failed.\n${err.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    /* ========================================================
       TEACH
       ======================================================== */

    if (args[0] === "teach") {
      const raw = args
        .slice(1)
        .join(" ");

      const parts =
        raw.split(" - ");

      if (parts.length < 2) {
        return api.sendMessage(
          "❌ Use: baby teach [Question] - [Reply]",
          event.threadID,
          event.messageID
        );
      }

      const ask =
        parts.shift().trim();

      const ans =
        parts.join(" - ").trim();

      if (!ask || !ans) {
        return api.sendMessage(
          "❌ Question and Reply cannot be empty.",
          event.threadID,
          event.messageID
        );
      }

      try {
        const res = await axios.get(
          `${simsim}/teach?ask=${encodeURIComponent(
            ask
          )}&ans=${encodeURIComponent(
            ans
          )}&senderID=${encodeURIComponent(
            uid
          )}&senderName=${encodeURIComponent(
            senderName
          )}`,
          {
            timeout: 15000
          }
        );

        return api.sendMessage(
          `✅ ${
            res.data?.message ||
            "Successfully taught."
          }`,
          event.threadID,
          event.messageID
        );
      } catch (err) {
        return api.sendMessage(
          `❌ ERROR: Teach failed.\n${err.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    /* ========================================================
       REACT
       ======================================================== */

    if (args[0] === "react") {
      const rawQuery = args
        .slice(1)
        .join(" ");

      const parts =
        rawQuery.split(" - ");

      if (parts.length < 2) {
        return api.sendMessage(
          "❌ Use: baby react [Question] - [Emoji]",
          event.threadID,
          event.messageID
        );
      }

      const ask =
        parts.shift().trim();

      const emoji =
        parts.join(" - ").trim();

      if (!ask || !emoji) {
        return api.sendMessage(
          "❌ Question and Emoji cannot be empty.",
          event.threadID,
          event.messageID
        );
      }

      try {
        const res = await axios.get(
          `${simsim}/teachReact?ask=${encodeURIComponent(
            ask
          )}&emoji=${encodeURIComponent(
            emoji
          )}&senderName=${encodeURIComponent(
            senderName
          )}`,
          {
            timeout: 15000
          }
        );

        return api.sendMessage(
          `✅ ${
            res.data?.message ||
            "Reaction added."
          }`,
          event.threadID,
          event.messageID
        );
      } catch (err) {
        return api.sendMessage(
          `❌ ERROR: React failed.\n${err.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    /* ========================================================
       EDIT
       ======================================================== */

    if (args[0] === "edit") {
      const raw =
        args.slice(1).join(" ");

      const parts =
        raw.split(" - ");

      if (parts.length < 3) {
        return api.sendMessage(
          "❌ Use: baby edit [Question] - [OldReply] - [NewReply]",
          event.threadID,
          event.messageID
        );
      }

      const ask =
        parts.shift().trim();

      const oldR =
        parts.shift().trim();

      const newR =
        parts.join(" - ").trim();

      try {
        const res = await axios.get(
          `${simsim}/edit?ask=${encodeURIComponent(
            ask
          )}&old=${encodeURIComponent(
            oldR
          )}&new=${encodeURIComponent(
            newR
          )}`,
          {
            timeout: 15000
          }
        );

        return api.sendMessage(
          res.data?.message ||
            "✅ Reply edited.",
          event.threadID,
          event.messageID
        );
      } catch (err) {
        return api.sendMessage(
          `❌ ERROR: Edit failed.\n${err.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    /* ========================================================
       REMOVE / RM
       ======================================================== */

    if (
      ["remove", "rm"].includes(
        args[0]
      )
    ) {
      const raw =
        args
          .slice(1)
          .join(" ");

      const parts =
        raw.split(" - ");

      if (parts.length < 2) {
        return api.sendMessage(
          "❌ Use: baby remove [Question] - [Reply]",
          event.threadID,
          event.messageID
        );
      }

      const ask =
        parts.shift().trim();

      const ans =
        parts.join(" - ").trim();

      try {
        const res = await axios.get(
          `${simsim}/delete?ask=${encodeURIComponent(
            ask
          )}&ans=${encodeURIComponent(
            ans
          )}`,
          {
            timeout: 15000
          }
        );

        return api.sendMessage(
          res.data?.message ||
            "✅ Reply removed.",
          event.threadID,
          event.messageID
        );
      } catch (err) {
        return api.sendMessage(
          `❌ ERROR: Remove failed.\n${err.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    /* ========================================================
       DEL
       ======================================================== */

    if (args[0] === "del") {
      return api.sendMessage(
        '❌ Reply to Baby AI\'s wrong answer with "baby del" to delete it.',
        event.threadID,
        event.messageID
      );
    }

    /* ========================================================
       EMPTY QUERY
       ======================================================== */

    if (!query) {
      const texts = [
        "Hey baby 💖",
        "Yes, I'm here 😘",
        "হ্যাঁ বলো 😊",
        "বলো, শুনছি 😌"
      ];

      return api.sendMessage(
        texts[
          Math.floor(
            Math.random() *
              texts.length
          )
        ],
        event.threadID,
        event.messageID
      );
    }

    return await deliverSimsimiResponse({
      api,
      event,
      query,
      senderName
    });
  } catch (e) {
    console.log(
      "❌ ERROR: baby.run:",
      e
    );

    return api.sendMessage(
      `❌ ERROR: ${e.message}`,
      event.threadID,
      event.messageID
    );
  }
};

/* ============================================================
   HANDLE REPLY
   ============================================================ */

module.exports.handleReply =
  async function ({
    api,
    event,
    Users,
    handleReply
  }) {
    let senderName = "User";

    try {
      senderName =
        await Users.getNameUser(
          event.senderID
        );
    } catch (err) {
      console.log(
        "⚠️ ERROR: Username error:",
        err.message
      );
    }

    const text =
      typeof event.body === "string"
        ? event.body.trim()
        : "";

    const lowered =
      text.toLowerCase();

    /* ========================================================
       ATTACHMENT REACTION
       ======================================================== */

    if (
      event.attachments &&
      event.attachments.length > 0
    ) {
      const type =
        event.attachments[0].type;

      let reaction = null;

      if (type === "photo") {
        reaction = "🫩";
      } else if (
        type === "animated_image"
      ) {
        reaction = "😵‍💫";
      } else if (
        type === "video"
      ) {
        reaction = "🤔";
      } else if (
        type === "audio"
      ) {
        reaction = "🤕";
      }

      if (reaction) {
        try {
          if (
            typeof api.setMessageReaction ===
            "function"
          ) {
            await api.setMessageReaction(
              reaction,
              event.messageID,
              () => {},
              true
            );
          }
        } catch (err) {
          console.log(
            "⚠️ ERROR: Attachment reaction:",
            err.message
          );
        }

        return;
      }
    }

    if (!text || !simsim) {
      return;
    }

    /* ========================================================
       DELETE BY REPLY
       ======================================================== */

    if (
      lowered === "del" ||
      lowered === "baby del" ||
      lowered === "!baby del"
    ) {
      try {
        /*
          // ERROR FIX:
          // handleReply.body না থাকলে messageID fallback ব্যবহার করা যাবে না,
          // তাই clear error message দেখানো হচ্ছে।
        */

        const originalReply =
          handleReply?.body;

        if (!originalReply) {
          return api.sendMessage(
            "❌ ERROR: Couldn't read the original Baby AI reply.",
            event.threadID,
            event.messageID
          );
        }

        const res =
          await axios.get(
            `${simsim}/deleteByReply?reply=${encodeURIComponent(
              originalReply
            )}`,
            {
              timeout: 15000
            }
          );

        return api.sendMessage(
          res.data?.message ||
            "✅ Reply deleted.",
          event.threadID,
          event.messageID
        );
      } catch (err) {
        return api.sendMessage(
          `❌ ERROR: Delete failed.\n${err.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    /* ========================================================
       MSG SELECT
       ======================================================== */

    if (
      handleReply?.type ===
      "msgSelect"
    ) {
      if (
        event.senderID !==
        handleReply.author
      ) {
        return;
      }

      const numbers = text
        .split(",")
        .map(n =>
          parseInt(
            n.trim(),
            10
          )
        )
        .filter(
          n =>
            Number.isInteger(n) &&
            n > 0
        );

      if (
        numbers.length === 0
      ) {
        return api.sendMessage(
          "❌ Send numbers like: 2, 7",
          event.threadID,
          event.messageID
        );
      }

      try {
        const res =
          await axios.post(
            `${simsim}/keepOnly`,
            {
              ask:
                handleReply.trigger,

              keepIndexes:
                numbers
            },
            {
              timeout: 15000
            }
          );

        return api.sendMessage(
          res.data?.message ||
            "✅ Replies updated.",
          event.threadID,
          event.messageID
        );
      } catch (err) {
        return api.sendMessage(
          `❌ ERROR: keepOnly failed.\n${err.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    /* ========================================================
       NORMAL REPLY → SIMSIMI
       ======================================================== */

    try {
      return await deliverSimsimiResponse({
        api,
        event,
        query: lowered,
        senderName
      });
    } catch (err) {
      return api.sendMessage(
        `❌ ERROR: ${err.message}`,
        event.threadID,
        event.messageID
      );
    }
  };

/* ============================================================
   GREETINGS
   ============================================================ */

const greetingReplies = [

  "বেশি bot Bot করলে leave নিবো কিন্তু😒😒",

  "শুনবো না😼 তুমি আমার বস হৃদয়কে প্রেম করাই দাও নাই🥺 পচা তুমি🥺",

  "এতো ডেকো না, প্রেম এ পরে যাবো তো🙈",

  "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑",

  "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?",

  "কী হয়ছে এতো ডাকো কেন😒",

  "I love you janu🥰",

  "আরে Bolo আমার জান, কেমন আছো?😚",

  "অসম্মান করছিস😰😿",

  "বট বলে চলে যাস কেন😤🥺 কী হলো উত্তর দে🥺",

  "জানু বল জানু 😘",

  "বার বার Disturb করছিস কোনো😾, আমার বস হৃদয়ের সাথে ব্যস্ত আছি😋",

  "এতো ডাকিস কেন🤬",

  "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒",

  "চিপায় আছি ডিস্টার্ব করিস না🙊🙁",

  "তোর কথা তোর বাড়ি কেউ শুনে না, তো আমি কেন শুনবো?🤔😂",

  "আমাকে ডেকো না, আমি ব্যস্ত আছি",

  "কি হলো, মিস্টেক করচ্ছিস নাকি🤣",

  "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",

  "হা বলো, শুনছি আমি 😏",

  "আর কত বার ডাকবি, শুনছি তো",

  "হুম বলো কি বলবে😒",

  "বলো কি করতে পারি তোমার জন্য",

  "আমি তো অন্ধ কিছু দেখি না🐸😎",

  "বলো জানু 🌚",

  "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",

  "jang hanga korba😒😬",

  "একটা কথা বলতে চাইছিলাম🙂",

  "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি..!🥰",

  "আমাকে এতো ডাকো কেন?🤔 ভালো-টালো বাসো নাকি🤭🙈",

  "🌻🌺💚আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻",

  "আমি এখন বস হৃদয় এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻",

  "আমাকে না ডেকে আমার বস হৃদয়কে কে একটা জি এফ দাও-😽🫶🌺",

  "জান🥺 তুমি এখন শুধু বট বলে চলে যাও 😒 ভুলে গেলা নাকি🙂❓",

  "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈",

  "ভালোবাসা কাকে বলে🙊❓",

  "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧",

  "🙂শুনলাম কালকে বলে আপনার বিয়ে???",

  "আমার বস হৃদয় এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭",

  "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻",

  "জান হাঙ্গা করবা-🙊😝🌻",

  "জান মেয়ে হলে চিপায় আসো ইউটিউব থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽",

  "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼",

  "আমার বস হৃদয় এর পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶 আমার বস হৃদয়ের জন্য সবাই দোয়া করবেন-💝",

  "ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস হৃদয়ের ইনবক্সে চলে যাও-🙊🥱🌻",

  "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",

  "জান বাল ফালাইবা-🙂🥱🙆‍♂️",

  "যেদিন আমলনামা খুলবে, সেদিন অজুহাত নয়—আমলই কথা বলবে📖",

  "oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂",

  "আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস হৃদয়কে দান করেন-🥱🐰🍒",

  "ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧",

  "আমার পেটে ইঁদুর দৌড়ায়, কিছু খাওয়াও 😋🧀",

  "বলুন কী করতে পারি আপনার জন্য",

  "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇",

  "আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗",

  "কি ব্যাপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻",

  "দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧",

  "তাবিজ কইরা হইলেও প্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱🌻",

  "ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয়-🥱-ওমা এখন দেখি কাহিনী অন্যরকম-😦🙂🌻",

  "আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস হৃদয় ধরতে পারছে না-🐸🥲",

  "চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️",

  "যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂 আমার বস হৃদয়ের সাথে প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗",

  "আগে অনেক খারাপ ছিলাম এখন ভালো হয়ে গেছি🙂",

  "রূপের অহংকার করো না-🙂❤️চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜",

  "সুন্দর মাইয়া মানেই-🥱 আমার বস হৃদয় এর বউ-😽🫶 আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗",

  "এত অহংকার করে লাভ নেই-🌸 মৃত্যুটা নিশ্চিত শুধু সময়টা অ'নিশ্চিত-🖤🙂",

  "দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸",

  "হুদাই আপনারে শয়তানে লারে-😝😑☹️",

  "তোমার সাথে কথা বলে মনে হচ্ছে আমি কমেডি কিং 😂🎤",

  "🥺আজ তুমি কবরবাসীদের জন্য দোয়া করছ, কাল কেউ তোমার জন্য করবে😔",

  "🤲 গার্লফ্রেন্ডের ভালোবাসার চেয়ে সৃষ্টিকর্তার ভালোবাসা বেশি নিরাপদ ও চিরস্থায়ী😄",

  "🥀 মানুষের ভালোবাসা বদলায়, কিন্তু সৃষ্টিকর্তার ভালোবাসা কখনো বদলায় না🙂",

  "ইস কেউ যদি বলতো-🙂-আমার শুধু তোমাকেই লাগবে-💜🌸",

  "বলো তো, চাঁদে যদি বিয়ে করি, হানিমুনে যাবো কিভাবে? 🌝🚀",

  "একদিন সে ঠিকই ফিরে তাকাবে-😇-আর মুচকি হেসে বলবে তোমার বস হৃদয়ের মতো আর কেউ ভালবাসেনি-🙂😅",

  "হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧",

  "কি'রে গ্রুপে দেখি একটাও বেডি নাই-🙊",

  "দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস হৃদয় এর মনটা ছাড়া-🥴😑😏",

  "আজ থেকে আর কাউকে পাত্তা দিমু না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸",

  "বেশি Bot Bot করলে leave নিবো কিন্তু😒😒",

  "এই প্রথম বার বট দেখছো নাকি🥴",

  "হুদাই ডাকাডাকি করো কেন🙂",

  "এত কাছেও এসো না, প্রেম এ পরে যাবো তো 🙈",

  "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",

  "সাদিয়াকে চিনো কী??",

  "হা বলো😒,কি করতে পারি😐😑?",

  "আমাকে ডাকলে চকলেট দিতে হবে😒",

  "মেয়ে হলে বস হৃদয় এর সাথে প্রেম করো🙈??",

  "আরে Bolo আমার জান, কেমন আসো?😚",

  "অসম্মান করচ্ছিছ কেন,😰😿",

  "Hop bedi😾, Boss বল boss😼",

  "আমি তো সিরিয়াস নই, আমি শুধু মজা করি 🤪🎈",

  "এইটা তুমি করতে পারলে 🫩🥹",

  "বার বার Disturb করেছিস কোনো😾, আমার বস হৃদয় এর সাথে ব্যাস্ত আসি😋",

  "আরে আমি মজা করার mood এ নাই😒",

  "তোমাকে ওইদিন দেখলাম রাস্তায় দাঁড়িয়ে আছো🥴",

  "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣",

  "তোর কথা তোর বাড়ি কেউ শুনে না, তো আমি কোনো শুনবো?🤔😂",

  "আমাকে ডেকো না, আমি ব্যাস্ত আসি",

  "কি হলো, মিস টিস করচ্ছিস নাকি🤣",

  "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",

  "কালকে দেখা করিস তো একটু - খেলাধুলা করবো👀",

  "হা বলো, শুনছি আমি 😏",

  "খালি ঢং করে আসে আবার বট বলে চলে যায়🙁😔",

  "আর কত বার ডাকবি, শুনছি তো",

  "মাইয়া হলে আমার বস হৃদয় কে Ummmmha দে 😒",

  "বলো কি করতে পারি তোমার জন্য",

  "আমি তো অন্ধ কিছু দেখি না🐸 😎",

  "কী হয়ছে😌",

  "বলো জানু 🌚",

  "তোর কি চোখে পড়ে না আমি বস হৃদয় এর সাথে ব্যাস্ত আসি😒",

  "༊━━🦋নামাজি মানুষেরা সব থেকে বেশি সুন্দর হয়..!!😇🥀 🦋 কারণ.!! -অজুর পানির মত শ্রেষ্ঠ মেকআপ দুনিয়াতে নেই༊━ღ━༎🥰🥀 🥰-আলহামদুলিল্লাহ-🥰",

  "🌿 জীবন ভিন্ন পথে যায়, কিন্তু শেষ গন্তব্য একই—মাটি🙂",

  "𝐈'𝐝 -তে সব 𝐖𝐨𝐰 𝐖𝐨𝐰 বুইড়া বেডি-🐸",

  "তোমার জন্য আমি খাওয়া-দাওয়া বাদ দিছি🥺",

  "অনুমতি দিলে 𝚈𝚘𝚞𝚃𝚞𝚋𝚎-এ কল দিতাম..!😒",

  "🍒---আমি সেই গল্পের বই-🙂 -যে বই সবাই পড়তে পারলেও-😌 -অর্থ বোঝার ক্ষমতা কারো নেই..!☺️🥀💔",

  "~কার জন্য এতো মায়া...!😌🥀 ~এই শহরে আপন বলতে...!😔🥀 ~শুধুই তো নিজের ছায়া...!😥🥀",

  "কারেন্ট একদম বেডি'গো মতো- 🤧 -খালি ঢং করে আসে আবার চলে যায়-😤😾🔪",

  "রাত যত গভীর হয়, বাস্তবতা তত ভয়ংকর হয়ে ওঠে\nকী ভাবছো তোমাকেই বলছি🤧🙊",

  "দুনিয়ার সবাই প্রেম করে.!🤧 -আর মানুষ আমার বস হৃদয় কে সন্দেহ করে.!🐸",

  "আমার থেকে ভালো অনেক পাবা-🙂 -কিন্তু সব ভালো তে কি আর ভালোবাসা থাকে..!💔🥀",

  "পুরুষকে সবচেয়ে বেশি কষ্ট দেয় তার শখের নারী...!🥺💔👈",

  "দুনিয়া থেকে চলে যাওয়ার আগে এমন কিছু করে যেও যাতে সবাই তোমাকে মনে করে🙂❤️‍🩹",

  "অবহেলা করিস না-😑😪 - যখন নিজেকে বদলে ফেলবো -😌 - তখন আমার চেয়েও বেশি কষ্ট পাবি..!🙂💔",

  "বন্ধুর সাথে ছেকা খাওয়া গান শুনতে শুনতে-🤧 -এখন আমিও বন্ধুর 𝙴𝚇 কে অনেক 𝙼𝙸𝚂𝚂 করি-🤕🥺",

  "৯৯টাকায় ৯৯জিবি ৯৯বছর-☺️🐸 -অফারটি পেতে এখনই আমাকে প্রোপস করুন-🤗😂👈",

  "প্রিয়-🥺 -তোমাকে না পেলে আমি সত্যি-😪 -আরেকজন কে-😼 -পটাতে বাধ্য হবো-😑🤧",

  "কিরে🫵 তরা নাকি prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺",

  "যেই আইডির মায়ায় পড়ে ভুল্লি আমারে.!🥴- তুই কি জানিস সেই আইডিটাও আমি চালাইরে.!🙂"

];

/* ============================================================
   GREETING SENDER
   ============================================================ */

async function sendGreeting(
  api,
  event
) {
  const reply =
    greetingReplies[
      Math.floor(
        Math.random() *
          greetingReplies.length
      )
    ];

  try {
    await sendTypingIndicatorV2(
      true,
      event.threadID
    );

    /*
      // ERROR FIX:
      // ৫ সেকেন্ডের পরিবর্তে ১.৫ সেকেন্ড।
      // এতে bot অযথা আটকে থাকবে না।
    */

    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          1500
        )
    );

    await sendTypingIndicatorV2(
      false,
      event.threadID
    );
  } catch (err) {
    console.log(
      "⚠️ ERROR: Greeting typing:",
      err.message
    );
  }

  try {
    const info =
      await sendMessageAsync(
        api,
        reply,
        event.threadID
      );

    ensureHandleReply().push({
      name:
        module.exports.config.name,

      messageID:
        info.messageID,

      author:
        event.senderID,

      type: "simsimi",

      body: reply
    });

    return info;
  } catch (err) {
    console.log(
      "❌ ERROR: Greeting send failed:",
      err.message
    );

    return null;
  }
}

/* ============================================================
   TIMEOUT
   ============================================================ */

function withTimeout(
  promise,
  ms,
  label
) {
  return Promise.race([
    promise,

    new Promise(
      (_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                `${label} timed out after ${ms}ms`
              )
            ),
          ms
        )
    )
  ]);
}

/* ============================================================
   SEND MESSAGE ASYNC
   ============================================================ */

function sendMessageAsync(
  api,
  text,
  threadID,
  replyToID
) {
  return new Promise(
    (resolve, reject) => {
      try {
        const cb = (
          err,
          info
        ) => {
          if (err) {
            return reject(err);
          }

          resolve(info);
        };

        if (replyToID) {
          api.sendMessage(
            text,
            threadID,
            cb,
            replyToID
          );
        } else {
          api.sendMessage(
            text,
            threadID,
            cb
          );
        }
      } catch (err) {
        reject(err);
      }
    }
  );
}

/* ============================================================
   SIMSIMI RESPONSE
   ============================================================ */

async function deliverSimsimiResponse({
  api,
  event,
  query,
  senderName,
  replyToMessageID
}) {
  if (!simsim) {
    throw new Error(
      "Baby API is not loaded."
    );
  }

  const url =
    `${simsim}/simsimi?text=${encodeURIComponent(
      query
    )}` +
    `&senderName=${encodeURIComponent(
      senderName
    )}` +
    `&threadID=${encodeURIComponent(
      event.threadID
    )}` +
    `&senderID=${encodeURIComponent(
      event.senderID
    )}`;

  await sendTypingIndicatorV2(
    true,
    event.threadID
  );

  let res;

  try {
    res = await axios.get(
      url,
      {
        timeout: 30000
      }
    );
  } finally {
    await sendTypingIndicatorV2(
      false,
      event.threadID
    );
  }

  const data =
    res.data || {};

  if (data.rateLimited) {
    return;
  }

  /* ==========================================================
     REACTION
     ========================================================== */

  if (
    data.reaction &&
    event.messageID
  ) {
    try {
      if (
        typeof api.setMessageReaction ===
        "function"
      ) {
        await withTimeout(
          new Promise(
            resolve => {
              api.setMessageReaction(
                data.reaction,
                event.messageID,
                () => resolve(),
                true
              );
            }
          ),
          3000,
          "setMessageReaction"
        );
      }
    } catch (err) {
      console.log(
        "⚠️ ERROR: Reaction send:",
        err.message
      );
    }
  }

  /* ==========================================================
     RESPONSE
     ========================================================== */

  if (data.response) {
    try {
      const info =
        await sendMessageAsync(
          api,
          data.response,
          event.threadID,
          replyToMessageID ||
            event.messageID
        );

      ensureHandleReply().push({
        name:
          module.exports.config.name,

        messageID:
          info.messageID,

        author:
          event.senderID,

        type: "simsimi",

        body: data.response
      });

      return info;
    } catch (e) {
      console.log(
        "❌ ERROR: sendMessage with reply failed:",
        JSON.stringify(e)
      );

      /*
        // ERROR FIX:
        // Reply send fail হলে normal send retry করবে।
      */

      try {
        const info2 =
          await sendMessageAsync(
            api,
            data.response,
            event.threadID
          );

        ensureHandleReply().push({
          name:
            module.exports.config.name,

          messageID:
            info2.messageID,

          author:
            event.senderID,

          type: "simsimi",

          body: data.response
        });

        return info2;
      } catch (e2) {
        console.log(
          "❌ ERROR: sendMessage retry failed:",
          JSON.stringify(e2)
        );
      }
    }
  }

  return null;
}

/* ============================================================
   BOT MENTION
   ============================================================ */

function isBotMentioned(
  event,
  uid
) {
  if (
    !uid ||
    !event.mentions
  ) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(
    event.mentions,
    uid
  );
}

/* ============================================================
   HANDLE EVENT
   ============================================================ */

module.exports.handleEvent =
  async function ({
    api,
    event,
    Users
  }) {
    try {
      const text =
        typeof event.body === "string"
          ? event.body
              .toLowerCase()
              .trim()
          : "";

      if (!simsim) {
        return;
      }

      let senderName = "User";

      try {
        senderName =
          await Users.getNameUser(
            event.senderID
          );
      } catch (err) {
        console.log(
          "⚠️ ERROR: Username loading:",
          err.message
        );
      }

      const triggers = [
        "baby",
        "bby",
        "bot",
        "bbz"
      ];

      const uid =
        getBotUID(api);

      /* ======================================================
         MENTION
         ====================================================== */

      if (
        isBotMentioned(
          event,
          uid
        )
      ) {
        if (
          triggerLocks.has(
            event.threadID
          )
        ) {
          return;
        }

        triggerLocks.add(
          event.threadID
        );

        try {
          return await sendGreeting(
            api,
            event
          );
        } finally {
          triggerLocks.delete(
            event.threadID
          );
        }
      }

      if (!text) {
        return;
      }

      /* ======================================================
         SIMPLE TRIGGERS
         ====================================================== */

      if (
        triggers.includes(text)
      ) {
        if (
          triggerLocks.has(
            event.threadID
          )
        ) {
          return;
        }

        triggerLocks.add(
          event.threadID
        );

        try {
          return await sendGreeting(
            api,
            event
          );
        } finally {
          triggerLocks.delete(
            event.threadID
          );
        }
      }

      /* ======================================================
         PREFIX MESSAGE
         ====================================================== */

      const matchPrefix =
        /^(bot|bby|xan|bbz|baby)\s+/i;

      if (
        matchPrefix.test(text)
      ) {
        const query =
          text
            .replace(
              matchPrefix,
              ""
            )
            .trim();

        if (!query) {
          return;
        }

        if (
          triggerLocks.has(
            event.threadID
          )
        ) {
          return;
        }

        triggerLocks.add(
          event.threadID
        );

        try {
          return await deliverSimsimiResponse(
            {
              api,
              event,
              query,
              senderName
            }
          );
        } catch (err) {
          return api.sendMessage(
            `❌ ERROR: ${err.message}`,
            event.threadID,
            event.messageID
          );
        } finally {
          triggerLocks.delete(
            event.threadID
          );
        }
      }

      /* ======================================================
         AUTO TEACH
         ====================================================== */

      if (
        event.type ===
        "message_reply"
      ) {
        try {
          const setting =
            await axios.get(
              `${simsim}/setting?threadID=${encodeURIComponent(
                event.threadID
              )}`,
              {
                timeout: 10000
              }
            );

          if (
            !setting.data?.autoTeach
          ) {
            return;
          }

          const ask =
            event.messageReply?.body
              ?.toLowerCase()
              .trim();

          const ans =
            event.body
              ?.toLowerCase()
              .trim();

          if (
            !ask ||
            !ans ||
            ask === ans
          ) {
            return;
          }

          setTimeout(
            async () => {
              try {
                await axios.get(
                  `${simsim}/teach?ask=${encodeURIComponent(
                    ask
                  )}&ans=${encodeURIComponent(
                    ans
                  )}&senderName=${encodeURIComponent(
                    senderName
                  )}`,
                  {
                    timeout: 15000
                  }
                );

                console.log(
                  "✅ Auto-taught:",
                  ask,
                  "→",
                  ans,
                  "(thread:",
                  event.threadID + ")"
                );
              } catch (err) {
                console.error(
                  "❌ ERROR: Auto-teach:",
                  err.message
                );
              }
            },
            300
          );
        } catch (err) {
          console.log(
            "❌ ERROR: Auto-teach setting:",
            err.message
          );
        }
      }
    } catch (err) {
      /*
        // ERROR:
        // handleEvent-এর কোনো unexpected error হলেও
        // bot process crash করবে না।
      */

      console.log(
        "❌ ERROR: baby.handleEvent:",
        err.message
      );
    }
  };

/* ============================================================
   EXPORT GREETINGS
   ============================================================ */

module.exports.greetingReplies =
  greetingReplies;

/*
╔════════════════════════════════════════════════════════════╗
║                    𝐁𝐀𝐁𝐘 𝐀𝐈 𝐄𝐍𝐃                         ║
║                                                            ║
║  Developer : হৃদয় হাসান শান্ত                              ║
║  Rahat references : REMOVED                                ║
║  mqttClient crash protection : ENABLED                     ║
║  handleReply protection   : ENABLED                        ║
║  API timeout protection   : ENABLED                        ║
║  AutoTeach                : ENABLED                        ║
║  Typing effect            : SAFE                           ║
╚════════════════════════════════════════════════════════════╝
*/
