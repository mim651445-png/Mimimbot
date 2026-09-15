/**
 * ╔══════════════════════════════════════════════╗
 *            🤖 OTHER BOTS DETECTOR
 *                 Smart Edition
 * ╠══════════════════════════════════════════════╣
 * 👤 Developer : 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎
 * 🛡️ Bot Detection System
 * 🔔 Admin Notification
 * 🧩 ERROR Comments Included
 * ╚══════════════════════════════════════════════╝
 */

const moment = require("moment-timezone");

module.exports.config = {
  name: "otherbots",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "❤️ 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎 ❤️",
  description: "Detect other bot messages",
  commandCategory: "config",
  cooldowns: 0
};

// =====================================================
// ⚙️ SETTINGS
// =====================================================

const TIMEZONE = "Asia/Kuala_Lumpur";

// =====================================================
// 🤖 BOT KEYWORDS
// =====================================================

const BOT_KEYWORDS = [
  "your keyboard level has reached level",
  "Command not found",
  "The command you used",
  "Uy may lumipad",
  "Unsend this message",
  "You are unable to use bot",
  "»» NOTICE «« Update user nicknames",
  "just removed 1 Attachments",
  "message removedcontent",
  "The current preset is",
  "Here Is My Prefix",
  "just removed 1 attachment.",
  "Unable to re-add members",
  "removed 1 message content:",
  "Here's your music, enjoy!🥰",
  "Ye Raha Aapka Music, enjoy!🥰",
  "your keyboard Power level Up",
  "your keyboard hero level has reached level",

  // ERROR signatures
  "Error: Cannot read properties of undefined",
  "Error in onChat: Request failed with status code 500",
  "Error: Failed to fetch list",
  "Error: Request failed with status code 404",
  "Request failed with status code 500.",
  "An error",
  "❌ Error",
  "Error api Response ❌",

  // AI / API responses
  "❌ Please provide a question or prompt.",
  "Hi there! How can I help you today?",
  "Hello! How can I help you today?",
  "Generation failed!",
  "❌ Please provide an image URL",

  // Bot responses
  "What's up?",
  "Wait koro baby 😽",
  "𝗡𝗼𝗽𝗲𝗲🫡",
  "Yes 😀, I am here",
  "𝗛𝗺𝗺🐥",
  "𝗘𝗺𝗻𝗶𝗲😛",
  "𝗛𝗼𝗼𝗼𝗼𝗼𝗼𝗼𝗼𝗼⛹️",
  "𝗩𝗹𝗼🩵🩵",
  "কি দিবো🌚",
  "𝗢𝗸𝗸 𝗯𝗯𝘂🧑‍🍼",
  "𝗣𝗿𝗲𝗴𝗻𝗮𝗻𝘁👋",
  "𝗕𝗮𝗻𝗱𝗼𝗿 𝗵𝗼𝗶𝗹𝗻 𝗻𝗮𝗸𝗶😡",
  "𝗢𝗸😏",
  "𝗞𝗻😴😴",
  "𝗵𝗶𝗵𝗶😏",
  "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑",
  "হ্যা বলো😒, তোমার জন্য কি করতে পারি",
  "আরে Bolo আমার জান",
  "অসম্মান করছিস😰😿",
  "Hop beda😾 Boss বল boss😼",
  "বট বলে চলে যাস কেন😤🥺কী হলো উওর দে🥺",
  "বার বার Disturb করছিস কোনো😾",
  "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒",
  "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস",
  "আমাকে ডেকো না,আমি ব্যাস্ত আছি",
  "কি হলো , মিস্টেক করচ্ছিস নাকি🤣",
  "বলো কি বলবা, সবার সামনে বলবা নাকি",
  "হা বলো, শুনছি আমি 😏",
  "আর কত বার ডাকবি ,শুনছি তো",
  "হুম বলো কি বলবে😒",
  "বলো কি করতে পারি তোমার জন্য",
  "আমি তো অন্ধ কিছু দেখি না🐸 😎",
  "বলো জানু 🌚",
  "তোর কি চোখে পড়ে না আমি ব্যাস্ত আছি😒",
  "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
  "🌻🌺💚আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ",
  "আমি এখন বিজি আছি আমাকে ডাকবেন না",
  "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না",
  "ইসস এতো ডাকো কেনো লজ্জা লাগে তো",
  "রূপের অহংকার করো না",
  "এত অহংকার করে লাভ নেই",
  "দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি"
];

// =====================================================
// 🧹 TEXT NORMALIZER
// =====================================================

function normalizeText(text) {
  try {
    return String(text || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  } catch (error) {
    // ERROR: Text normalization failed
    console.error(
      "[OTHERBOTS ERROR] normalizeText:",
      error
    );

    return "";
  }
}

// =====================================================
// 🔍 BOT MESSAGE DETECTOR
// =====================================================

function detectBotMessage(body) {
  try {
    const text = normalizeText(body);

    if (!text) return false;

    return BOT_KEYWORDS.some(keyword =>
      text.includes(normalizeText(keyword))
    );

  } catch (error) {
    // ERROR: Bot message detection failed
    console.error(
      "[OTHERBOTS ERROR] detectBotMessage:",
      error
    );

    return false;
  }
}

// =====================================================
// 👑 ADMIN CHECK
// =====================================================

function isAdminBot(senderID) {
  try {
    const admins = global.config?.ADMINBOT;

    if (!Array.isArray(admins)) {
      return false;
    }

    return admins
      .map(String)
      .includes(String(senderID));

  } catch (error) {
    // ERROR: Admin check failed
    console.error(
      "[OTHERBOTS ERROR] isAdminBot:",
      error
    );

    return false;
  }
}

// =====================================================
// 🔔 ADMIN NOTIFICATION
// =====================================================

async function notifyAdmins(api, message) {
  try {
    const admins = global.config?.ADMINBOT;

    if (!Array.isArray(admins)) {
      return;
    }

    for (const adminID of admins) {
      try {
        await api.sendMessage(
          message,
          adminID
        );

      } catch (error) {
        // ERROR: Individual admin notification failed
        console.error(
          `[OTHERBOTS ERROR] Admin notification failed: ${adminID}`,
          error
        );
      }
    }

  } catch (error) {
    // ERROR: Admin notification system failed
    console.error(
      "[OTHERBOTS ERROR] notifyAdmins:",
      error
    );
  }
}

// =====================================================
// 🤖 EVENT HANDLER
// =====================================================

module.exports.handleEvent = async function({
  event,
  api,
  Users
}) {

  try {

    const {
      threadID,
      messageID,
      body,
      senderID
    } = event;

    // -------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------

    if (!body || !senderID || !threadID) {
      return;
    }

    // -------------------------------------------------
    // IGNORE OWN BOT MESSAGE
    // -------------------------------------------------

    try {
      if (
        String(senderID) ===
        String(api.getCurrentUserID())
      ) {
        return;
      }

    } catch (error) {
      // ERROR: Failed to get current bot ID
      console.error(
        "[OTHERBOTS ERROR] getCurrentUserID:",
        error
      );

      return;
    }

    // -------------------------------------------------
    // IGNORE ALREADY BANNED USER
    // -------------------------------------------------

    try {
      if (
        global.data.userBanned &&
        global.data.userBanned.has(senderID)
      ) {
        return;
      }

    } catch (error) {
      // ERROR: Banned-user check failed
      console.error(
        "[OTHERBOTS ERROR] userBanned check:",
        error
      );
    }

    // -------------------------------------------------
    // ADMIN PROTECTION
    // -------------------------------------------------

    if (isAdminBot(senderID)) {
      return;
    }

    // -------------------------------------------------
    // DETECT OTHER BOT
    // -------------------------------------------------

    const detected = detectBotMessage(body);

    if (!detected) {
      return;
    }

    // -------------------------------------------------
    // TIME
    // -------------------------------------------------

    let time;

    try {
      time = moment
        .tz(TIMEZONE)
        .format("DD/MM/YYYY HH:mm:ss");

    } catch (error) {
      // ERROR: Time generation failed
      console.error(
        "[OTHERBOTS ERROR] Time generation:",
        error
      );

      time = "Unknown";
    }

    // -------------------------------------------------
    // GET USER NAME
    // -------------------------------------------------

    let userName = "Unknown User";

    try {

      userName =
        await Users.getNameUser(senderID);

    } catch (error) {
      // ERROR: Failed to get username
      console.error(
        "[OTHERBOTS ERROR] getNameUser:",
        error
      );
    }

    // -------------------------------------------------
    // CONSOLE LOG
    // -------------------------------------------------

    console.log(
      "\n" +
      "╔══════════════════════════════════════╗\n" +
      "║       🚨 OTHER BOT DETECTED          ║\n" +
      "╠══════════════════════════════════════╣\n" +
      `║ 👤 Name : ${userName}\n` +
      `║ 🆔 ID   : ${senderID}\n` +
      `║ 🕒 Time : ${time}\n` +
      "╚══════════════════════════════════════╝\n"
    );

    // -------------------------------------------------
    // CREATE BAN MAP
    // -------------------------------------------------

    try {

      if (!global.data.userBanned) {
        global.data.userBanned = new Map();
      }

    } catch (error) {
      // ERROR: Failed to create userBanned map
      console.error(
        "[OTHERBOTS ERROR] userBanned map:",
        error
      );

      return;
    }

    // -------------------------------------------------
    // BAN INFORMATION
    // -------------------------------------------------

    const reason =
      "Auto-detected as other bot";

    try {

      global.data.userBanned.set(
        senderID,
        {
          reason,
          dateAdded: time
        }
      );

    } catch (error) {
      // ERROR: Failed to add user to ban map
      console.error(
        "[OTHERBOTS ERROR] Ban map set:",
        error
      );

      return;
    }

    // -------------------------------------------------
    // SAVE USER DATA
    // -------------------------------------------------

    try {

      const userData =
        await Users.getData(senderID);

      if (userData) {

        userData.banned = 1;
        userData.reason = reason;
        userData.dateAdded = time;

        await Users.setData(
          senderID,
          userData
        );
      }

    } catch (error) {
      // ERROR: Failed to save banned user data
      console.error(
        "[OTHERBOTS ERROR] Users.setData:",
        error
      );
    }

    // -------------------------------------------------
    // USER NOTIFICATION
    // -------------------------------------------------

    const replyMessage =
      `╭━━━〔 🤖 BOT DETECTED 〕━━━╮\n` +
      `┃ 👤 ${userName}\n` +
      `┃\n` +
      `┃ 🚫 Bot message detect হয়েছে।\n` +
      `┃ আপনাকে automatically ban করা হয়েছে।\n` +
      `┃\n` +
      `┃ 👨‍💻 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎\n` +
      `┃\n` +
      `┃ 📋 Type: /ban list\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`;

    try {

      await api.sendMessage(
        replyMessage,
        threadID,
        null,
        messageID
      );

    } catch (error) {
      // ERROR: Failed to send user notification
      console.error(
        "[OTHERBOTS ERROR] User notification:",
        error
      );
    }

    // -------------------------------------------------
    // ADMIN ALERT
    // -------------------------------------------------

    const adminMessage =
      `╭━━━〔 🚨 BOT ALERT 〕━━━╮\n` +
      `┃ 🤖 Other Bot Detected\n` +
      `┃\n` +
      `┃ 👤 Name: ${userName}\n` +
      `┃ 🆔 User ID: ${senderID}\n` +
      `┃ 💬 Thread ID: ${threadID}\n` +
      `┃ 🕒 Time: ${time}\n` +
      `┃\n` +
      `┃ 🚫 Status: AUTO BANNED\n` +
      `┃ 📌 Reason: ${reason}\n` +
      `┃\n` +
      `┃ 👨‍💻 Developer:\n` +
      `┃ 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`;

    await notifyAdmins(
      api,
      adminMessage
    );

  } catch (error) {

    // ERROR: Main handleEvent crashed
    console.error(
      "[OTHERBOTS ERROR] handleEvent:",
      error
    );

  }
};

// =====================================================
// 📌 COMMAND
// =====================================================

module.exports.run = async function({
  event,
  api
}) {

  try {

    const message =
      `╭━━━〔 🤖 OTHER BOTS 〕━━━╮\n` +
      `┃ 🛡️ Smart Bot Detector\n` +
      `┃\n` +
      `┃ Other bot-এর message\n` +
      `┃ detect করার system.\n` +
      `┃\n` +
      `┃ ⚡ Version: 2.0.1\n` +
      `┃ 👨‍💻 Developer:\n` +
      `┃ 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`;

    await api.sendMessage(
      message,
      event.threadID
    );

  } catch (error) {

    // ERROR: Command execution failed
    console.error(
      "[OTHERBOTS ERROR] run command:",
      error
    );

  }
};
