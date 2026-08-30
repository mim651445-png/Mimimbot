const axios = require("axios");

// ======================================================
// 🤖 BABY / MARIA AI CHAT BOT
// Clean & Stable Version
// ======================================================

let simsim = "";
let requestCount = 0;

const triggerLocks = new Set();
let botUID = null;

// ======================================================
// 🔗 LOAD API
// ======================================================

(async () => {
  try {
    const { data } = await axios.get(
      "https://raw.githubusercontent.com/abdullahrx07/X-api/main/MaRiA/baseApiUrl.json",
      { timeout: 10000 }
    );

    if (data?.mari) {
      simsim = data.mari;
      console.log("✅ Baby AI API loaded");
    } else {
      console.log("❌ Baby AI API URL not found");
    }
  } catch (error) {
    console.log("❌ API loading failed:", error.message);
  }
})();

// ======================================================
// 🆔 GET BOT UID
// ======================================================

function getBotUID(api) {
  if (botUID) return botUID;

  try {
    if (typeof api.getCurrentUserID === "function") {
      botUID = api.getCurrentUserID();
    }
  } catch (error) {
    console.log("⚠️ Cannot get bot UID:", error.message);
  }

  return botUID;
}

// ======================================================
// ⌨️ TYPING INDICATOR
// ======================================================

async function sendTypingIndicator(status, threadID) {
  try {
    const mqttClient =
      global.mqttClient ||
      global.client?.mqttClient ||
      global.client?.api?.mqttClient;

    if (!mqttClient?.publish) return;

    const payload = {
      app_id: 2220391788200892,
      payload: JSON.stringify({
        label: 3,
        payload: JSON.stringify({
          thread_key: String(threadID),
          is_group_thread: +(String(threadID).length >= 16),
          is_typing: Number(status),
          attribution: 0
        }),
        version: 5849951561777440
      }),
      request_id: ++requestCount,
      type: 4
    };

    await new Promise((resolve, reject) => {
      mqttClient.publish(
        "/ls_req",
        JSON.stringify(payload),
        {},
        error => (error ? reject(error) : resolve())
      );
    });
  } catch (error) {
    console.log("⚠️ Typing indicator:", error.message);
  }
}

// ======================================================
// ⏱️ TIMEOUT HELPER
// ======================================================

function withTimeout(promise, ms, label = "Operation") {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} timed out`)),
        ms
      )
    )
  ]);
}

// ======================================================
// 📤 SEND MESSAGE PROMISE
// ======================================================

function sendMessage(api, text, threadID, replyToID = null) {
  return new Promise((resolve, reject) => {
    const callback = (error, info) => {
      if (error) return reject(error);
      resolve(info);
    };

    if (replyToID) {
      api.sendMessage(text, threadID, callback, replyToID);
    } else {
      api.sendMessage(text, threadID, callback);
    }
  });
}

// ======================================================
// 💬 RANDOM GREETINGS
// ======================================================

const greetingReplies = [
  "হ্যাঁ বলো 😼 কী দরকার?",
  "ওই যে ডাকলে, বলো শুনছি 👀",
  "হুদাই ডাকাডাকি কেন? 😂",
  "হুম, আমি এখানে আছি 🤖",
  "বলো, কী খবর? 😎",
  "এই যে! এত ডাকো কেন? 😑",
  "কী হয়েছে? বলো তো 🤔",
  "আবার Bot Bot শুরু করছো নাকি? 😂",
  "হ্যাঁ বলো, কী করতে পারি?",
  "একবার ডাকলেই তো শুনি 😌",
  "ওইই, উপস্থিত আছি 🤖",
  "বলো ভাই, কী অবস্থা? 😎",
  "কী ব্যাপার? এত জরুরি নাকি? 👀",
  "শুনছি, বলো 👂",
  "আজকে কী নিয়ে আড্ডা হবে? 😁",
  "আমি কিন্তু সব শুনতে পাচ্ছি 👀",
  "কী খবর সবার? 🌸",
  "হুমম... বলো দেখি 😏",
  "Bot ডাকলে হাজির 😎🤖",
  "এই যে আমি! এখন বলো 😄"
];

// ======================================================
// 👋 SEND GREETING
// ======================================================

async function sendGreeting(api, event) {
  const reply =
    greetingReplies[
      Math.floor(Math.random() * greetingReplies.length)
    ];

  await sendTypingIndicator(true, event.threadID);

  await new Promise(resolve => setTimeout(resolve, 1200));

  await sendTypingIndicator(false, event.threadID);

  try {
    const info = await sendMessage(
      api,
      reply,
      event.threadID,
      event.messageID
    );

    if (global.client?.handleReply && info?.messageID) {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "simsimi",
        body: reply
      });
    }

    return info;
  } catch (error) {
    console.log("❌ Greeting error:", error.message);
  }
}

// ======================================================
// 🤖 MAIN AI RESPONSE
// ======================================================

async function deliverSimsimiResponse({
  api,
  event,
  query,
  senderName
}) {
  if (!simsim) {
    return api.sendMessage(
      "❌ AI API এখনো লোড হয়নি। একটু পরে চেষ্টা করুন।",
      event.threadID,
      event.messageID
    );
  }

  if (!query?.trim()) return;

  const url =
    `${simsim}/simsimi` +
    `?text=${encodeURIComponent(query)}` +
    `&senderName=${encodeURIComponent(senderName || "User")}` +
    `&threadID=${encodeURIComponent(event.threadID)}` +
    `&senderID=${encodeURIComponent(event.senderID)}`;

  await sendTypingIndicator(true, event.threadID);

  let response;

  try {
    response = await axios.get(url, {
      timeout: 20000
    });
  } finally {
    await sendTypingIndicator(false, event.threadID);
  }

  const data = response?.data || {};

  if (data.rateLimited) return;

  // ====================================================
  // 👍 REACTION
  // ====================================================

  if (data.reaction && event.messageID) {
    try {
      await withTimeout(
        new Promise((resolve, reject) => {
          api.setMessageReaction(
            data.reaction,
            event.messageID,
            error => (error ? reject(error) : resolve()),
            true
          );
        }),
        3000,
        "Reaction"
      );
    } catch (error) {
      console.log("⚠️ Reaction error:", error.message);
    }
  }

  // ====================================================
  // 💬 RESPONSE
  // ====================================================

  if (!data.response) return;

  let info;

  try {
    info = await sendMessage(
      api,
      data.response,
      event.threadID,
      event.messageID
    );
  } catch (error) {
    console.log("⚠️ Reply send failed, retrying...");

    info = await sendMessage(
      api,
      data.response,
      event.threadID
    );
  }

  // ====================================================
  // 🔁 SAVE HANDLE REPLY
  // ====================================================

  if (global.client?.handleReply && info?.messageID) {
    global.client.handleReply.push({
      name: module.exports.config.name,
      messageID: info.messageID,
      author: event.senderID,
      type: "simsimi",
      body: data.response
    });
  }

  return info;
}

// ======================================================
// 🔎 CHECK BOT MENTION
// ======================================================

function isBotMentioned(event, uid) {
  if (!uid || !event.mentions) return false;

  return Object.prototype.hasOwnProperty.call(
    event.mentions,
    uid
  );
}

// ======================================================
// ⚙️ CONFIG
// ======================================================

module.exports.config = {
  name: "baby",
  aliases: ["maria", "mim"],
  premium: false,
  version: "2.0.0",
  hasPermssion: 0,
  credits: "rX / Cleaned Version",
  description:
    "AI chat bot with auto teach, teach, edit, remove, react and reply support.",
  commandCategory: "chat",

  usages:
    "[query]\n" +
    "list\n" +
    "teach [Question] - [Reply]\n" +
    "react [Question] - [Emoji]\n" +
    "edit [Question] - [OldReply] - [NewReply]\n" +
    "remove [Question] - [Reply]\n" +
    "del (reply to bot message)\n" +
    "msg [trigger]\n" +
    "autoteach on/off\n" +
    "autoteach on/off global",

  cooldowns: 0,
  prefix: false
};

// ======================================================
// ▶️ COMMAND
// ======================================================

module.exports.run = async function ({
  api,
  event,
  args,
  Users
}) {
  const uid = event.senderID;
  const threadID = event.threadID;

  const senderName = await Users.getNameUser(uid);
  const query = args.join(" ").trim().toLowerCase();

  try {
    if (!simsim) {
      return api.sendMessage(
        "❌ AI API এখনো লোড হয়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
        threadID,
        event.messageID
      );
    }

    // ==================================================
    // ⚙️ AUTOTEACH
    // ==================================================

    if (args[0]?.toLowerCase() === "autoteach") {
      const mode = args[1]?.toLowerCase();
      const scope = args[2]?.toLowerCase();

      if (!["on", "off"].includes(mode)) {
        return api.sendMessage(
          "❌ ব্যবহার:\n" +
          "baby autoteach on\n" +
          "baby autoteach off\n" +
          "baby autoteach on global\n" +
          "baby autoteach off global",
          threadID,
          event.messageID
        );
      }

      const status = mode === "on";

      if (scope === "global") {
        const res = await axios.post(
          `${simsim}/setting`,
          { autoTeach: status },
          { timeout: 10000 }
        );

        return api.sendMessage(
          `✅ Auto Teach ${status ? "ON 🟢" : "OFF 🔴"} globally.`,
          threadID,
          event.messageID
        );
      }

      const res = await axios.post(
        `${simsim}/setting`,
        {
          autoTeach: status,
          threadID
        },
        { timeout: 10000 }
      );

      return api.sendMessage(
        `✅ ${
          res.data?.message ||
          `Auto Teach ${status ? "ON 🟢" : "OFF 🔴"}`
        }\n📌 এই গ্রুপের জন্য প্রযোজ্য।`,
        threadID,
        event.messageID
      );
    }

    // ==================================================
    // 📋 LIST
    // ==================================================

    if (args[0]?.toLowerCase() === "list") {
      const res = await axios.get(
        `${simsim}/list`,
        { timeout: 10000 }
      );

      return api.sendMessage(
        "╭──────────────╮\n" +
        "   🤖 𝐁𝐀𝐁𝐘 𝐀𝐈 𝐒𝐓𝐀𝐓𝐔𝐒\n" +
        "╰──────────────╯\n\n" +
        `📝 Questions: ${res.data?.totalQuestions ?? 0}\n` +
        `💬 Replies: ${res.data?.totalReplies ?? 0}\n\n` +
        "⚡ AI Teaching System Active",
        threadID,
        event.messageID
      );
    }

    // ==================================================
    // 📝 MSG LIST
    // ==================================================

    if (args[0]?.toLowerCase() === "msg") {
      let trigger = args
        .slice(1)
        .join(" ")
        .trim();

      if (!trigger) {
        return api.sendMessage(
          "❌ ব্যবহার:\nbaby msg [trigger]\nঅথবা\nbaby msg [trigger] -20",
          threadID,
          event.messageID
        );
      }

      let customLimit = null;

      const limitMatch =
        trigger.match(/\s*-(\d+)\s*$/);

      if (limitMatch) {
        customLimit = parseInt(
          limitMatch[1],
          10
        );

        trigger = trigger
          .replace(/\s*-(\d+)\s*$/, "")
          .trim();
      }

      const res = await axios.get(
        `${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`,
        { timeout: 15000 }
      );

      const replies = res.data?.replies || [];

      if (!replies.length) {
        return api.sendMessage(
          "❌ এই trigger-এর কোনো reply পাওয়া যায়নি।",
          threadID,
          event.messageID
        );
      }

      const limit =
        customLimit > 0 ? customLimit : 50;

      const shown = replies.slice(0, limit);
      const remaining = replies.length - shown.length;

      const formatted = shown
        .map((reply, index) =>
          `➤ ${index + 1}. ${reply}`
        )
        .join("\n");

      const message =
        `📌 Trigger: ${trigger}\n` +
        `📊 Total: ${res.data?.total ?? replies.length}\n` +
        "━━━━━━━━━━━━━━━━━━\n" +
        formatted +
        "\n━━━━━━━━━━━━━━━━━━\n" +
        (remaining > 0
          ? `⚠️ আরও ${remaining}টি reply আছে।\n`
          : "") +
        `\n✏️ Keep করতে চাইলে সংখ্যা পাঠাও।\nউদাহরণ: 2, 7, 10`;

      return api.sendMessage(
        message,
        threadID,
        (error, info) => {
          if (
            !error &&
            global.client?.handleReply &&
            info?.messageID
          ) {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: uid,
              type: "msgSelect",
              trigger
            });
          }
        },
        event.messageID
      );
    }

    // ==================================================
    // 🎓 TEACH
    // ==================================================

    if (args[0]?.toLowerCase() === "teach") {
      const raw = args.slice(1).join(" ");
      const parts = raw.split(" - ");

      if (parts.length < 2) {
        return api.sendMessage(
          "❌ ব্যবহার:\nbaby teach [Question] - [Reply]",
          threadID,
          event.messageID
        );
      }

      const ask = parts.shift().trim();
      const answer = parts.join(" - ").trim();

      if (!ask || !answer) {
        return api.sendMessage(
          "❌ Question এবং Reply দুটোই দিতে হবে।",
          threadID,
          event.messageID
        );
      }

      const res = await axios.get(
        `${simsim}/teach` +
        `?ask=${encodeURIComponent(ask)}` +
        `&ans=${encodeURIComponent(answer)}` +
        `&senderID=${encodeURIComponent(uid)}` +
        `&senderName=${encodeURIComponent(senderName)}`,
        { timeout: 15000 }
      );

      return api.sendMessage(
        `✅ ${res.data?.message || "Teaching complete."}`,
        threadID,
        event.messageID
      );
    }

    // ==================================================
    // ❤️ REACT
    // ==================================================

    if (args[0]?.toLowerCase() === "react") {
      const raw = args.slice(1).join(" ");
      const parts = raw.split(" - ");

      if (parts.length < 2) {
        return api.sendMessage(
          "❌ ব্যবহার:\nbaby react [Question] - [Emoji]",
          threadID,
          event.messageID
        );
      }

      const ask = parts.shift().trim();
      const emoji = parts.join(" - ").trim();

      const res = await axios.get(
        `${simsim}/teachReact` +
        `?ask=${encodeURIComponent(ask)}` +
        `&emoji=${encodeURIComponent(emoji)}` +
        `&senderName=${encodeURIComponent(senderName)}`,
        { timeout: 15000 }
      );

      return api.sendMessage(
        `✅ ${res.data?.message || "Reaction added."}`,
        threadID,
        event.messageID
      );
    }

    // ==================================================
    // ✏️ EDIT
    // ==================================================

    if (args[0]?.toLowerCase() === "edit") {
      const raw = args.slice(1).join(" ");
      const parts = raw.split(" - ");

      if (parts.length < 3) {
        return api.sendMessage(
          "❌ ব্যবহার:\nbaby edit [Question] - [OldReply] - [NewReply]",
          threadID,
          event.messageID
        );
      }

      const ask = parts[0].trim();
      const oldReply = parts[1].trim();
      const newReply = parts.slice(2).join(" - ").trim();

      const res = await axios.get(
        `${simsim}/edit` +
        `?ask=${encodeURIComponent(ask)}` +
        `&old=${encodeURIComponent(oldReply)}` +
        `&new=${encodeURIComponent(newReply)}`,
        { timeout: 15000 }
      );

      return api.sendMessage(
        res.data?.message || "✅ Updated.",
        threadID,
        event.messageID
      );
    }

    // ==================================================
    // 🗑️ REMOVE
    // ==================================================

    if (
      ["remove", "rm"].includes(
        args[0]?.toLowerCase()
      )
    ) {
      const raw = args
        .slice(1)
        .join(" ");

      const parts = raw.split(" - ");

      if (parts.length < 2) {
        return api.sendMessage(
          "❌ ব্যবহার:\nbaby remove [Question] - [Reply]",
          threadID,
          event.messageID
        );
      }

      const ask = parts[0].trim();
      const answer = parts.slice(1).join(" - ").trim();

      const res = await axios.get(
        `${simsim}/delete` +
        `?ask=${encodeURIComponent(ask)}` +
        `&ans=${encodeURIComponent(answer)}`,
        { timeout: 15000 }
      );

      return api.sendMessage(
        res.data?.message || "✅ Removed.",
        threadID,
        event.messageID
      );
    }

    // ==================================================
    // ❌ DEL
    // ==================================================

    if (args[0]?.toLowerCase() === "del") {
      return api.sendMessage(
        "📌 Bot-এর ভুল reply-এর উপর reply করে:\n\nbaby del\n\nলিখুন।",
        threadID,
        event.messageID
      );
    }

    // ==================================================
    // 👋 EMPTY COMMAND
    // ==================================================

    if (!query || query === "baby") {
      return sendGreeting(api, event);
    }

    // ==================================================
    // 🤖 AI RESPONSE
    // ==================================================

    return await deliverSimsimiResponse({
      api,
      event,
      query,
      senderName
    });

  } catch (error) {
    console.log("❌ Baby command error:", error);

    return api.sendMessage(
      `❌ Error: ${error.message || "Unknown error"}`,
      threadID,
      event.messageID
    );
  }
};

// ======================================================
// 🔁 HANDLE REPLY
// ======================================================

module.exports.handleReply = async function ({
  api,
  event,
  Users,
  handleReply
}) {
  try {
    if (!simsim) return;

    const text =
      event.body?.trim();

    const lowered =
      text?.toLowerCase();

    // ==================================================
    // 📎 ATTACHMENT REACTION
    // ==================================================

    if (
      event.attachments &&
      event.attachments.length > 0
    ) {
      const type =
        event.attachments[0]?.type;

      const reactions = {
        photo: "👍",
        animated_image: "😂",
        video: "🤔",
        audio: "🎵"
      };

      const reaction = reactions[type];

      if (reaction) {
        try {
          await api.setMessageReaction(
            reaction,
            event.messageID,
            () => {},
            true
          );
        } catch (error) {
          console.log(
            "⚠️ Attachment reaction:",
            error.message
          );
        }
      }

      return;
    }

    if (!text) return;

    // ==================================================
    // 🗑️ DELETE BOT REPLY
    // ==================================================

    if (
      lowered === "del" ||
      lowered === "!baby del"
    ) {
      const originalReply =
        handleReply?.body;

      if (!originalReply) {
        return api.sendMessage(
          "❌ Original bot reply পড়া যায়নি।",
          event.threadID,
          event.messageID
        );
      }

      try {
        const res = await axios.get(
          `${simsim}/deleteByReply` +
          `?reply=${encodeURIComponent(originalReply)}`,
          { timeout: 15000 }
        );

        return api.sendMessage(
          res.data?.message ||
          "✅ Reply deleted.",
          event.threadID,
          event.messageID
        );
      } catch (error) {
        return api.sendMessage(
          `❌ Delete failed: ${error.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    // ==================================================
    // 📋 MSG SELECT
    // ==================================================

    if (
      handleReply?.type === "msgSelect"
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
          parseInt(n.trim(), 10)
        )
        .filter(n =>
          Number.isInteger(n) && n > 0
        );

      if (!numbers.length) {
        return api.sendMessage(
          "❌ সংখ্যা এভাবে পাঠাও:\n2, 7, 10",
          event.threadID,
          event.messageID
        );
      }

      try {
        const res = await axios.post(
          `${simsim}/keepOnly`,
          {
            ask: handleReply.trigger,
            keepIndexes: [
              ...new Set(numbers)
            ]
          },
          { timeout: 15000 }
        );

        return api.sendMessage(
          res.data?.message ||
          "✅ Reply list updated.",
          event.threadID,
          event.messageID
        );
      } catch (error) {
        return api.sendMessage(
          `❌ Update failed: ${error.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    // ==================================================
    // 🤖 REPLY → AI
    // ==================================================

    const senderName =
      await Users.getNameUser(
        event.senderID
      );

    return await deliverSimsimiResponse({
      api,
      event,
      query: lowered,
      senderName
    });

  } catch (error) {
    console.log(
      "❌ handleReply error:",
      error.message
    );

    return api.sendMessage(
      `❌ Error: ${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};

// ======================================================
// ⚡ HANDLE EVENT
// ======================================================

module.exports.handleEvent = async function ({
  api,
  event,
  Users
}) {
  try {
    if (!simsim) return;

    const text =
      event.body?.toLowerCase().trim();

    if (!text) return;

    const senderName =
      await Users.getNameUser(
        event.senderID
      );

    const triggers = [
      "baby",
      "bby",
      "bot",
      "bbz"
    ];

    const uid = getBotUID(api);

    // ==================================================
    // 👤 BOT MENTION
    // ==================================================

    if (
      isBotMentioned(event, uid)
    ) {
      if (
        triggerLocks.has(event.threadID)
      ) {
        return;
      }

      triggerLocks.add(event.threadID);

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

    // ==================================================
    // 👋 SIMPLE TRIGGER
    // ==================================================

    if (triggers.includes(text)) {
      if (
        triggerLocks.has(event.threadID)
      ) {
        return;
      }

      triggerLocks.add(event.threadID);

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

    // ==================================================
    // 💬 BOT + QUERY
    // ==================================================

    const prefixRegex =
      /^(bot|bby|xan|bbz|baby)\s+/i;

    if (
      prefixRegex.test(text)
    ) {
      const query =
        text.replace(
          prefixRegex,
          ""
        ).trim();

      if (!query) return;

      if (
        triggerLocks.has(event.threadID)
      ) {
        return;
      }

      triggerLocks.add(event.threadID);

      try {
        return await deliverSimsimiResponse({
          api,
          event,
          query,
          senderName
        });
      } catch (error) {
        return api.sendMessage(
          `❌ Error: ${error.message}`,
          event.threadID,
          event.messageID
        );
      } finally {
        triggerLocks.delete(
          event.threadID
        );
      }
    }

    // ==================================================
    // 🎓 AUTO TEACH
    // ==================================================

    if (
      event.type === "message_reply" &&
      event.messageReply
    ) {
      try {
        const setting =
          await axios.get(
            `${simsim}/setting` +
            `?threadID=${encodeURIComponent(
              event.threadID
            )}`,
            { timeout: 10000 }
          );

        if (
          !setting.data?.autoTeach
        ) {
          return;
        }

        const ask =
          event.messageReply.body
            ?.toLowerCase()
            .trim();

        const answer =
          event.body
            ?.toLowerCase()
            .trim();

        if (
          !ask ||
          !answer ||
          ask === answer
        ) {
          return;
        }

        setTimeout(async () => {
          try {
            await axios.get(
              `${simsim}/teach` +
              `?ask=${encodeURIComponent(ask)}` +
              `&ans=${encodeURIComponent(answer)}` +
              `&senderID=${encodeURIComponent(
                event.senderID
              )}` +
              `&senderName=${encodeURIComponent(
                senderName
              )}`,
              { timeout: 15000 }
            );

            console.log(
              `✅ Auto taught: ${ask} → ${answer}`
            );
          } catch (error) {
            console.log(
              "❌ Auto-teach error:",
              error.message
            );
          }
        }, 300);
      } catch (error) {
        console.log(
          "⚠️ Auto-teach setting error:",
          error.message
        );
      }
    }

  } catch (error) {
    console.log(
      "❌ Baby handleEvent error:",
      error.message
    );
  }
};
