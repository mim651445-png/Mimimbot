const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
  const response = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return response.data.mahmud;
};

module.exports.config = {
  name: "tokai",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Mention, reply অথবা UID দিয়ে Tokai Image তৈরি করে",
  commandCategory: "fun",
  usages: "tokai @mention / reply / UID",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, mentions, messageReply } = event;

  let uid;

  // 👤 Mention থাকলে
  if (mentions && Object.keys(mentions).length > 0) {
    uid = Object.keys(mentions)[0];

  // 💬 Reply থাকলে
  } else if (messageReply && messageReply.senderID) {
    uid = messageReply.senderID;

  // 🔢 UID দিলে
  } else if (args && args[0]) {
    uid = args[0];

  // ❌ কিছু না দিলে
  } else {
    return api.sendMessage(
      "╭━━━〔 ⚠️ TOKAI 〕━━━╮\n" +
      "┃ 👤 একজনকে Mention করো\n" +
      "┃ 💬 অথবা কোনো মেসেজে Reply দাও\n" +
      "┃ 🔢 অথবা UID লিখে দাও\n" +
      "╰━━━━━━━━━━━━━━━━╯",
      threadID,
      messageID
    );
  }

  const filePath = path.join(
    __dirname,
    `tokai_${uid}_${Date.now()}.png`
  );

  try {
    // ⏳ Processing
    await api.sendMessage(
      "⏳ টোকাই বানানোর কাজ চলছে... 😎\n" +
      "╰─ অপেক্ষা করো একটু! 🤭",
      threadID
    );

    const apiUrl = await baseApiUrl();
    const url = `${apiUrl}/api/tokai?user=${encodeURIComponent(uid)}`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 30000
    });

    await fs.writeFile(filePath, response.data);

    // 📸 Send image
    return api.sendMessage(
      {
        body:
          "╭━━━〔 😂 TOKAI 〕━━━╮\n" +
          "┃ এই টোকাই তুই টোকাই! 🤣\n" +
          "┃ টোকাইগিরি আর কয়দিন করবি? 😎🤨\n" +
          "╰━━━━━━━━━━━━━━━━╯",
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      async () => {
        try {
          if (await fs.pathExists(filePath)) {
            await fs.unlink(filePath);
          }
        } catch (e) {}
      },
      messageID
    );

  } catch (error) {
    console.error("TOKAI ERROR:", error);

    try {
      if (await fs.pathExists(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (e) {}

    return api.sendMessage(
      "❌ টোকাই ইমেজ তৈরি করা যাচ্ছে না!\n\n" +
      "🔧 API অথবা Server বর্তমানে সমস্যায় থাকতে পারে।",
      threadID,
      messageID
    );
  }
};
