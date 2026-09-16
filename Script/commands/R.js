/**
 * ╔══════════════════════════════════════════════╗
 * ║              🌚 WARNING BOT 🌚              ║
 * ║                                              ║
 * ║  Developer : হৃদয় হাসান শান্ত                ║
 * ║  Version   : 1.0.0                           ║
 * ║  Platform  : Mirai / GoatBot                 ║
 * ╚══════════════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "🌚",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Random warning message with image/GIF",
  commandCategory: "Noprefix",
  usages: "🌚",
  cooldowns: 3
};

const imageLinks = [
  "https://i.imgur.com/B6G3NlF.jpeg",
  "https://i.imgur.com/T7RtKlp.gif",
  "https://i.imgur.com/BmGxEFs.gif",
  "https://i.imgur.com/MEdpECT.jpeg",
  "https://i.imgur.com/KU8N4Ca.jpeg",
  "https://i.imgur.com/roBS6oX.gif",
  "https://i.imgur.com/SkfGapy.jpeg",
  "https://i.imgur.com/GGQv16z.jpeg",
  "https://i.imgur.com/VAf5Eue.gif",
  "https://i.imgur.com/ZZpapGi.jpeg",
  "https://i.imgur.com/4LvXywY.jpeg",
  "https://i.imgur.com/NZ5iyCh.jpeg",
  "https://i.imgur.com/BkrKZ8b.jpeg",
  "https://i.imgur.com/Yf1LRak.jpeg",
  "https://i.imgur.com/1fsJf6B.jpeg",
  "https://i.imgur.com/MR2h7jw.jpeg",
  "https://i.imgur.com/K9fFzgm.jpeg",
  "https://i.imgur.com/Se05IOn.jpeg",
  "https://i.imgur.com/h1Yhryc.jpeg",
  "https://i.imgur.com/sUgF4oQ.jpeg",
  "https://i.imgur.com/8oHuIf8.jpeg",
  "https://i.imgur.com/fiH5dUv.jpeg",
  "https://i.imgur.com/FSKnHZt.jpeg",
  "https://i.imgur.com/80YYI12.jpeg",
  "https://i.imgur.com/ibd1j8n.jpeg",
  "https://i.imgur.com/J8vbW7x.jpeg",
  "https://i.imgur.com/fOmuOKl.jpeg",
  "https://i.imgur.com/qDwypw6.jpeg",
  "https://i.imgur.com/9dVyEEe.gif",
  "https://i.imgur.com/d3yM7FX.jpeg",
  "https://i.imgur.com/JToFUJo.jpeg",
  "https://i.imgur.com/aJ5sbvo.jpeg",
  "https://i.imgur.com/09qesDj.gif",
  "https://i.imgur.com/HES8mee.jpeg",
  "https://i.imgur.com/ovETysm.jpeg",
  "https://i.imgur.com/mpCMAYQ.jpeg",
  "https://i.imgur.com/iQV82Jq.jpeg",
  "https://i.imgur.com/qkM2t0l.jpeg",
  "https://i.imgur.com/VAf5Eue.gif"
];

const warningMessages = [
  "বন্ধু😭 ভালো হয়ে যা!😞",
  "ভাই এটা কী বললি🙏",
  "তোকে কি এসব শেখায় কেউ?😠 দয়া করে থাম🙏",
  "ভালো কথা বল 🙃 নয়তো ব্লক করবো🌚",
  "ভাই প্লিজ এসব বাদ দে😞",
  "তোকে নিয়ে মায়া লাগে রে ভাই🥺 ভদ্র হ🥲",
  "দোস্ত, এসব বলা লাগে?😐 একটু ভদ্রতা শেখ🧠",
  "তুই কি রিয়েল লাইফেও এমন?😑",
  "একটু ভদ্র হও🙏"
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function downloadFile(url, filePath) {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    timeout: 30000,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

module.exports.handleEvent = async function ({ api, event }) {
  try {
    if (!event.body) return;

    const body = event.body.trim();

    // 🌚 trigger
    if (body !== "🌚") return;

    const cacheDir = path.join(__dirname, "cache");

    await fs.ensureDir(cacheDir);

    const imageUrl = randomItem(imageLinks);
    const message = randomItem(warningMessages);

    const extension = imageUrl.toLowerCase().includes(".gif")
      ? ".gif"
      : ".jpg";

    const filePath = path.join(
      cacheDir,
      `warning_${Date.now()}${extension}`
    );

    await downloadFile(imageUrl, filePath);

    const msg = {
      body:
       `,
      attachment: fs.createReadStream(filePath)
    };

    api.sendMessage(msg, event.threadID, () => {
      fs.remove(filePath).catch(() => {});
    });

  } catch (error) {
    console.error("🌚.js ERROR:", error);

    try {
      api.sendMessage(
        "⚠️ ছবি/GIF লোড করতে সমস্যা হয়েছে! একটু পরে আবার চেষ্টা করো।",
        event.threadID
      );
    } catch (sendError) {
      console.error("🌚 Send ERROR:", sendError);
    }
  }
};

module.exports.run = async function ({ api, event }) {
  try {
    const cacheDir = path.join(__dirname, "cache");

    await fs.ensureDir(cacheDir);

    const imageUrl = randomItem(imageLinks);
    const message = randomItem(warningMessages);

    const extension = imageUrl.toLowerCase().includes(".gif")
      ? ".gif"
      : ".jpg";

    const filePath = path.join(
      cacheDir,
      `warning_${Date.now()}${extension}`
    );

    await downloadFile(imageUrl, filePath);

    const msg = {
      body:
        `${message}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🌚 𝐖𝐚𝐫𝐧𝐢𝐧𝐠 𝐌𝐨𝐝𝐞\n` +
        `👑 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 : হৃদয় হাসান শান্ত\n` +
        `━━━━━━━━━━━━━━━━━━`,
      attachment: fs.createReadStream(filePath)
    };

    api.sendMessage(msg, event.threadID, () => {
      fs.remove(filePath).catch(() => {});
    });

  } catch (error) {
    console.error("🌚 RUN ERROR:", error);

    api.sendMessage(
      "❌ 🌚 ফাইল রান করতে সমস্যা হয়েছে।",
      event.threadID
    );
  }
};
