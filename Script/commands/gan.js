const fs = require("fs");
const axios = require("axios");
const path = require("path");

let lastPlayed = -1;

// 🔐 AUTHOR LOCK (DO NOT CHANGE)
const AUTHOR_LOCK = "FARHAN-KHAN";

module.exports.config = {
  name: "gan",
  version: "1.0.2",
  hasPermssion: 0,
  credits: AUTHOR_LOCK,
  description: "Play random song",
  commandCategory: "media",
  usages: "",
  cooldowns: 1
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  // 🔐 AUTHOR LOCK
  if (module.exports.config.credits !== AUTHOR_LOCK) {
    return api.sendMessage(
      "⛔ Author lock failed! File modified.",
      threadID,
      messageID
    );
  }

  const songLinks = [
    "https://files.catbox.moe/etsdn9.mp3",
    "https://files.catbox.moe/ayepdz.mp3",
    "https://files.catbox.moe/oaecnx.mp3",
    "https://files.catbox.moe/xtpf61.mp3",
    "https://files.catbox.moe/12grz0.mp3",
    "https://files.catbox.moe/aaqddo.mp3",
    "https://files.catbox.moe/k3acvx.mp3",
    "https://files.catbox.moe/nry1qv.mp3",
    "https://files.catbox.moe/23e8u1.mp3",
    "https://files.catbox.moe/y8dzik.mp3",
    "https://files.catbox.moe/z9d2e6.mp3",
    "https://files.catbox.moe/23e8u1.mp3",
    "https://files.catbox.moe/0xscc8.mp3",
    "https://files.catbox.moe/q4m2ad.mp3",
    "https://files.catbox.moe/y8bg4r.mp3",
    "https://files.catbox.moe/q61co1.mp3",
    "https://files.catbox.moe/euq7fo.mp3",
    "https://files.catbox.moe/x5f56o.mp3",
    "https://files.catbox.moe/avlqok.mp3",
    "https://files.catbox.moe/v0twt3.mp3",
    "https://files.catbox.moe/qmpvpt.mp3"
  ];

  if (!songLinks.length) {
    return api.sendMessage("❌ No songs found!", threadID, messageID);
  }

  let index;
  do {
    index = Math.floor(Math.random() * songLinks.length);
  } while (index === lastPlayed && songLinks.length > 1);

  lastPlayed = index;

  const filePath = path.join(__dirname, "cache", `song_${index}.mp3`);

  try {
    const response = await axios({
      url: songLinks[index],
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: "🎶 Here's your random song 🎧",
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        },
        messageID
      );
    });

    writer.on("error", () => {
      api.sendMessage("❌ Failed to send song!", threadID, messageID);
    });

  } catch (e) {
    api.sendMessage("⚠️ Failed to download song!", threadID, messageID);
  }
};
