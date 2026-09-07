/**
 * ╔══════════════════════════════════════════╗
 *        🤖 OBot v3.1 Picture Edition
 * ╠══════════════════════════════════════════╣
 * 👑 Creator : হৃদয় হাসান শান্ত
 * 🤖 Bot     : OBot
 * ⚡ Version : 3.1.0
 * 🖼️ System  : Full Picture System
 * ╚══════════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ═════════════════════════════════════════════
// ⚙️ CONFIG
// ═════════════════════════════════════════════

module.exports.config = {
  name: "Obot",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Smart No-Prefix Auto Reply + Picture System",
  commandCategory: "Noprefix",
  usages: "obot | pic | pp",
  cooldowns: 2
};

// ═════════════════════════════════════════════
// 🖼️ RANDOM PICTURE LINKS
// ═════════════════════════════════════════════

const RANDOM_PICS = [
  "https://i.imgur.com/plwEiFz.jpeg",
  "https://i.imgur.com/Y8L9D87.jpeg",
  "https://i.imgur.com/wfCLM6J.jpeg",
  "https://i.imgur.com/jdpT7ko.jpeg",
  "https://i.imgur.com/E2SruZr.jpeg",
  "https://i.imgur.com/XgzxkNZ.jpeg",
  "https://i.imgur.com/Sj88I9M.jpeg",
  "https://i.imgur.com/HD44K0U.jpeg",
  "https://i.imgur.com/aQusOfn.jpeg",
  "https://i.imgur.com/35czHnR.jpeg"
];

// ═════════════════════════════════════════════
// 💬 RANDOM REPLIES
// ═════════════════════════════════════════════

const replies = [
  "বেশি Bot Bot করলে কিন্তু Leave নিয়ে নেবো 😒😂",
  "এতো ডাকো না, মাথা ঘুরে যায় 😵‍💫",
  "হ্যাঁ বলো 😌 তোমার কথা শুনছি 👀",
  "কী হয়েছে? এতো ডাকো কেন? 😒",
  "বলো বন্ধু, কী করতে পারি? 🤖✨",
  "আমি কিন্তু সব শুনছি 👀",
  "Bot বলে ডাকছো যখন, কিছু একটা বলো তো 😑",
  "আরে বলো, আমি Online আছি 😎",
  "কেউ একজন আমাকে ডাকলো মনে হয় 👀",
  "চুপচাপ থাকলেও সব খবর রাখি 😎",
  "তোমার ডাক শুনে হাজির হয়ে গেলাম 🤖",
  "কী ব্যাপার? আমাকে মনে পড়লো নাকি? 😂",
  "আমি এখনো Active আছি 😎🔥",
  "হুদাই ডাকাডাকি না করে আসল কথা বলো 😂",
  "বলো কী বলবা, শুনছি আমি 😏",
  "তোমার জন্য OBot হাজির 😎",
  "গ্রুপে এত ডাকাডাকি কেন ভাই? 😂",
  "আমি কিন্তু ঘুমাচ্ছিলাম 😴 এখন বলো!",
  "তোমার Message পেলাম 📩🤖",
  "OBot এখানে উপস্থিত 😎✨",
  "কেউ কি আমাকে খুঁজছিল? 👀",
  "ডাক শুনে দৌড়ে চলে এলাম 🏃‍♂️😂",
  "আমি আছি, কথা বলো 😌",
  "আজকে সবাই ভালো থাকো ❤️🌸"
];

// ═════════════════════════════════════════════
// 🎲 RANDOM FUNCTIONS
// ═════════════════════════════════════════════

function randomReply() {
  return replies[
    Math.floor(Math.random() * replies.length)
  ];
}

function randomPic() {
  return RANDOM_PICS[
    Math.floor(Math.random() * RANDOM_PICS.length)
  ];
}

// ═════════════════════════════════════════════
// 🧹 CLEAN TEXT
// ═════════════════════════════════════════════

function cleanText(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

// ═════════════════════════════════════════════
// 👤 GET USER NAME
// ═════════════════════════════════════════════

async function getUserName(Users, senderID) {
  if (!Users || !senderID) {
    return "বন্ধু";
  }

  try {
    const name = await Users.getNameUser(senderID);

    if (name) {
      return name;
    }
  } catch (error) {
    console.log(
      "OBot Name Error:",
      error.message
    );
  }

  return "বন্ধু";
}

// ═════════════════════════════════════════════
// 🖼️ SEND RANDOM PICTURE
// ═════════════════════════════════════════════

async function sendRandomPicture(
  api,
  threadID,
  messageID,
  caption
) {
  let filePath = null;

  try {
    const imageUrl = randomPic();

    const cacheDir = path.join(
      __dirname,
      "cache"
    );

    await fs.ensureDir(cacheDir);

    filePath = path.join(
      cacheDir,
      `obot_${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}.jpg`
    );

    const response = await axios.get(
      imageUrl,
      {
        responseType: "arraybuffer",
        timeout: 20000
      }
    );

    await fs.writeFile(
      filePath,
      Buffer.from(response.data)
    );

    await api.sendMessage(
      {
        body: caption,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      messageID
    );

    // 🧹 Auto Delete After 30 Seconds
    setTimeout(async () => {
      try {
        await fs.remove(filePath);
      } catch (e) {}
    }, 30000);

  } catch (error) {
    console.error(
      "❌ OBot Picture Error:",
      error.message
    );

    if (filePath) {
      try {
        await fs.remove(filePath);
      } catch (e) {}
    }

    return api.sendMessage(
      "❌ পিক পাঠাতে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করো।",
      threadID,
      messageID
    );
  }
}

// ═════════════════════════════════════════════
// 👤 PROFILE PICTURE
// ═════════════════════════════════════════════

async function sendProfilePicture(
  api,
  event,
  Users
) {
  const threadID = event.threadID;
  const messageID = event.messageID;

  try {
    let targetID = event.senderID;

    // Reply করা মেসেজের User ID
    if (
      event.messageReply &&
      event.messageReply.senderID
    ) {
      targetID =
        event.messageReply.senderID;
    }

    if (!targetID) {
      return api.sendMessage(
        "❌ User ID পাওয়া যায়নি।",
        threadID,
        messageID
      );
    }

    const info = await api.getUserInfo(
      targetID
    );

    const user = info[targetID];

    if (!user) {
      return api.sendMessage(
        "❌ User information পাওয়া যায়নি।",
        threadID,
        messageID
      );
    }

    const profileUrl =
      user.profileUrl ||
      user.thumbSrc ||
      user.imageSrc;

    const name =
      user.name ||
      await getUserName(
        Users,
        targetID
      );

    if (!profileUrl) {
      return api.sendMessage(
        `❌ ${name}-এর profile picture পাওয়া যায়নি।`,
        threadID,
        messageID
      );
    }

    let attachment;

    if (
      global.utils &&
      typeof global.utils.getStreamFromURL === "function"
    ) {
      attachment =
        await global.utils.getStreamFromURL(
          profileUrl
        );
    }

    if (!attachment) {
      return api.sendMessage(
        "❌ Profile picture stream তৈরি করা যায়নি।",
        threadID,
        messageID
      );
    }

    return api.sendMessage(
      {
        body:
`╭━━━━━━━━━━━━━━━━━━╮
       👤 PROFILE
╰━━━━━━━━━━━━━━━━━━╯

📛 Name : ${name}
🆔 ID   : ${targetID}

━━━━━━━━━━━━━━━━━━━━
🤖 OBot v3.1
👑 Creator : হৃদয় হাসান শান্ত
━━━━━━━━━━━━━━━━━━━━`,
        attachment
      },
      threadID,
      messageID
    );

  } catch (error) {
    console.error(
      "❌ Profile Picture Error:",
      error.message
    );

    return api.sendMessage(
      "❌ Profile picture আনতে সমস্যা হয়েছে।",
      threadID,
      messageID
    );
  }
}

// ═════════════════════════════════════════════
// 🤖 EVENT HANDLER
// ═════════════════════════════════════════════

module.exports.handleEvent = async function ({
  api,
  event,
  Users
}) {
  try {
    if (!event || !event.body) {
      return;
    }

    const threadID = event.threadID;
    const messageID = event.messageID;

    if (!threadID) {
      return;
    }

    const body =
      String(event.body).trim();

    const text =
      cleanText(body);

    if (!text) {
      return;
    }

    // ═══════════════════════════════════════
    // 🖼️ RANDOM PIC
    // ═══════════════════════════════════════

    if (
      text === "pic" ||
      text === "picture" ||
      text === "photo" ||
      text === "পিক" ||
      text === "ছবি"
    ) {
      const name =
        await getUserName(
          Users,
          event.senderID
        );

      return sendRandomPicture(
        api,
        threadID,
        messageID,
`🖼️ ${name}, তোমার জন্য একটি Random Picture 🤖✨

👑 Creator : হৃদয় হাসান শান্ত
⚡ OBot v3.1`
      );
    }

    // ═══════════════════════════════════════
    // 👤 PROFILE PIC
    // ═══════════════════════════════════════

    if (
      text === "pp" ||
      text === "profile" ||
      text === "profile pic" ||
      text === "profile picture" ||
      text === "প্রোফাইল" ||
      text === "প্রোফাইল পিক"
    ) {
      return sendProfilePicture(
        api,
        event,
        Users
      );
    }

    // ═══════════════════════════════════════
    // 🌸 SALAM
    // ═══════════════════════════════════════

    const salam = [
      "আসসালামু আলাইকুম",
      "assalamualaikum",
      "assalamu alaikum",
      "salam"
    ];

    if (salam.includes(text)) {
      return api.sendMessage(
        "🌸 ওয়ালাইকুমুস-সালাম ওয়া রাহমাতুল্লাহ ❤️",
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════
    // 🌅 MORNING
    // ═══════════════════════════════════════

    if (
      text === "morning" ||
      text === "good morning" ||
      text === "সুপ্রভাত"
    ) {
      return api.sendMessage(
        "🌅 GOOD MORNING!\nফ্রেশ হয়ে নাস্তা করে নাও 😌❤️",
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════
    // ❤️ MISS YOU
    // ═══════════════════════════════════════

    if (
      text === "miss you" ||
      text === "i miss you"
    ) {
      return api.sendMessage(
        "😂 এমন পচা কথা বলো না!\nআমি তো OBot 🤖",
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════
    // 😘 KISS
    // ═══════════════════════════════════════

    if (
      text === "kiss" ||
      text === "kiss me"
    ) {
      return api.sendMessage(
        "উফফ! 😒 আমি তো শুধু একটা Bot 😂🤖",
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════
    // 🛑 STOP
    // ═══════════════════════════════════════

    if (
      text === "stop" ||
      text === "chup" ||
      text === "chup kor" ||
      text === "চুপ" ||
      text === "চুপ কর"
    ) {
      return api.sendMessage(
        "ঠিক আছে 😌 চুপ থাকলাম...\nআবার ডাকলে কিন্তু চলে আসবো 😂🤖",
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════
    // ❤️ THANKS
    // ═══════════════════════════════════════

    if (
      text === "thanks" ||
      text === "thank you" ||
      text === "tnx" ||
      text === "ধন্যবাদ"
    ) {
      return api.sendMessage(
        "You're Welcome 😌❤️\nOBot সবসময় Active 🤖✨",
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════
    // 👋 BYE
    // ═══════════════════════════════════════

    if (
      text === "bye" ||
      text === "by" ||
      text === "বাই" ||
      text === "যাই"
    ) {
      return api.sendMessage(
        "এত তাড়াতাড়ি যাচ্ছো কেন? 😂\nআবার এসো কিন্তু 👋❤️",
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════
    // 🍚 FOOD
    // ═══════════════════════════════════════

    if (
      text === "tumi khaiso" ||
      text === "khaicho" ||
      text === "তুমি খাইছো" ||
      text === "খাইছো"
    ) {
      return api.sendMessage(
        "আমি তো Bot 🤖 খেতে পারি না 😂\nতুমি আগে খেয়ে নাও 🍚😋",
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════
    // ❤️ LOVE
    // ═══════════════════════════════════════

    if (
      text === "tumi ki amake bhalobaso" ||
      text === "tmi ki amake vlo basho" ||
      text === "তুমি কি আমাকে ভালোবাসো"
    ) {
      return api.sendMessage(
        "আমি তো Bot 🤖❤️\nতবে তোমাদের ভালো কথাগুলো শুনতে ভালো লাগে 😌",
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════
    // 👑 OWNER
    // ═══════════════════════════════════════

    if (
      text === "owner" ||
      text === "ceo" ||
      text === "creator" ||
      text === "admin" ||
      text === "মালিক"
    ) {
      return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━╮
       👑 OWNER INFO
╰━━━━━━━━━━━━━━━━━━╯

👑 Name : হৃদয় হাসান শান্ত
🤖 Bot  : OBot
⚡ Version : 3.1.0
🖼️ Picture System : ON
💬 Auto Reply : ON

━━━━━━━━━━━━━━━━━━━━
       ❤️ OBot SYSTEM
━━━━━━━━━━━━━━━━━━━━`,
        threadID,
        messageID
      );
    }

    // ═══════════════════════════════════════
    // 🤖 BOT NAME
    // ═══════════════════════════════════════

    if (
      text === "obot" ||
      text === "o bot" ||
      text === "মিম" ||
      text === "@mim mim"
    ) {
      const name =
        await getUserName(
          Users,
          event.senderID
        );

      return sendRandomPicture(
        api,
        threadID,
        messageID,
`╭━━━━━━━━━━━━━━━━━━╮
       🤖 OBot ONLINE
╰━━━━━━━━━━━━━━━━━━╯

👤 ${name}

💬 ${randomReply()}

🖼️ Random Picture Included
⚡ Version : 3.1.0
👑 Creator : হৃদয় হাসান শান্ত`
      );
    }

    // ═══════════════════════════════════════
    // 🤖 /BOT
    // ═══════════════════════════════════════

    if (
      text.startsWith("/bot") ||
      text.startsWith("/obot")
    ) {
      const name =
        await getUserName(
          Users,
          event.senderID
        );

      return api.sendMessage(
`🤖 ${name}, ${randomReply()}

⚡ OBot v3.1.0`,
        threadID,
        messageID
      );
    }

  } catch (error) {
    console.error(
      "❌ OBot v3.1 Error:",
      error
    );
  }
};

// ═════════════════════════════════════════════
// 🚀 COMMAND RUN
// ═════════════════════════════════════════════

module.exports.run = async function ({
  api,
  event
}) {
  return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━╮
       🤖 OBot v3.1
╰━━━━━━━━━━━━━━━━━━╯

✅ No-Prefix Reply : ON
🖼️ Random Picture  : ON
👤 Profile Picture : ON
🎲 Random Reply    : ON
🌸 Greeting System : ON
⚡ Smart System     : ON

👑 Creator :
হৃদয় হাসান শান্ত

━━━━━━━━━━━━━━━━━━━━
       🚀 OBot ACTIVE
━━━━━━━━━━━━━━━━━━━━

📌 Commands:
• pic / পিক
• pp / profile
• obot
• owner

━━━━━━━━━━━━━━━━━━━━
       ❤️ Enjoy OBot
━━━━━━━━━━━━━━━━━━━━`,
    event.threadID,
    event.messageID
  );
};
