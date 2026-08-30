const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ===============================
// 🎙️ VOICE 3 - ADVANCED VERSION
// ===============================

module.exports.config = {
  name: "voice3",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Farhan-Khan + Modified",
  description: "Advanced Auto Voice Reply",
  commandCategory: "system",
  usages: "",
  cooldowns: 1
};

// ===============================
// ⚙️ SETTINGS
// ===============================

const SETTINGS = {
  enableCache: true,
  cooldown: 2,
  maxFileSize: 15 * 1024 * 1024,
  timeout: 30000
};

// ===============================
// 🎵 VOICE DATABASE
// ===============================

const voiceMap = {

  "rabbi": [
    "https://files.catbox.moe/9v2jjl.mp3"
  ],

  "ঘুমা": [
    "https://files.catbox.moe/mofu8n.mp3"
  ],

  "ভয়েস": [
    "https://files.catbox.moe/b973ms.mp4"
  ],

  "😸": [
    "https://files.catbox.moe/bo0o5e.mp3"
  ],

  "নাটেক": [
    "https://files.catbox.moe/8w1wo5.mp3"
  ],

  "🙏": [
    "https://files.catbox.moe/i429lj.mp3"
  ],

  "এহ": [
    "https://files.catbox.moe/6tkyn2.mp3"
  ],

  "ডিলেট": [
    "https://files.catbox.moe/kcemka.mp4"
  ],

  "matha betha": [
    "https://files.catbox.moe/5rdtc6.mp3"
  ],

  "মিম": [
    "https://files.catbox.moe/dz7n65.mp3"
  ],

  "সর বাল": [
    "https://files.catbox.moe/q84p1d.mp3"
  ],

  "কেউ নাই": [
    "https://files.catbox.moe/3u6shs.mp3"
  ],

  "good night": [
    "https://files.catbox.moe/i29m4q.mp3"
  ],

  "গুড নাইট": [
    "https://files.catbox.moe/i29m4q.mp3"
  ],

  "good morning": [
    "https://files.catbox.moe/8gzqx5.mp3"
  ],

  "গুড মর্নিং": [
    "https://files.catbox.moe/8gzqx5.mp3"
  ],

  "i love you": [
    "https://files.catbox.moe/y3fk8i.mp3"
  ],

  "love you": [
    "https://files.catbox.moe/y3fk8i.mp3"
  ],

  "@everyone": [
    "https://files.catbox.moe/3u6shs.mp3"
  ],

  "ভুদা": [
    "https://files.catbox.moe/gnyx0p.mp3"
  ],

  "by": [
    "https://files.catbox.moe/fdqh2m.mp3"
  ],

  "বাই": [
    "https://files.catbox.moe/fdqh2m.mp3"
  ],

  "বায়": [
    "https://files.catbox.moe/fdqh2m.mp3"
  ]
};

// ===============================
// 🔒 COOLDOWN SYSTEM
// ===============================

const cooldownMap = new Map();

function isCooldown(threadID) {
  const last = cooldownMap.get(threadID);

  if (!last) return false;

  return Date.now() - last <
    SETTINGS.cooldown * 1000;
}

function setCooldown(threadID) {
  cooldownMap.set(threadID, Date.now());

  setTimeout(() => {
    cooldownMap.delete(threadID);
  }, SETTINGS.cooldown * 1000);
}

// ===============================
// 🎲 RANDOM URL
// ===============================

function randomItem(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ];
}

// ===============================
// 📁 FILE EXTENSION
// ===============================

function getExtension(url) {
  const cleanUrl = url.split("?")[0].toLowerCase();

  if (cleanUrl.endsWith(".mp4"))
    return ".mp4";

  if (cleanUrl.endsWith(".m4a"))
    return ".m4a";

  if (cleanUrl.endsWith(".wav"))
    return ".wav";

  return ".mp3";
}

// ===============================
// 🎙️ DOWNLOAD VOICE
// ===============================

async function downloadVoice(url, filePath) {

  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: SETTINGS.timeout,
    maxContentLength: SETTINGS.maxFileSize,
    maxBodyLength: SETTINGS.maxFileSize
  });

  await fs.writeFile(
    filePath,
    Buffer.from(response.data)
  );

  return filePath;
}

// ===============================
// 🚀 HANDLE EVENT
// ===============================

module.exports.handleEvent = async function ({
  api,
  event
}) {

  try {

    if (!event || !event.body)
      return;

    if (!event.threadID)
      return;

    const input = String(event.body)
      .trim()
      .toLowerCase();

    if (!input)
      return;

    // Cooldown
    if (isCooldown(event.threadID))
      return;

    let matchedKey = null;

    // Find trigger
    for (const key of Object.keys(voiceMap)) {

      if (
        input.includes(
          key.toLowerCase()
        )
      ) {
        matchedKey = key;
        break;
      }
    }

    if (!matchedKey)
      return;

    setCooldown(event.threadID);

    // Random voice
    const url = randomItem(
      voiceMap[matchedKey]
    );

    // Cache directory
    const cacheDir =
      path.join(__dirname, "cache");

    await fs.ensureDir(cacheDir);

    const extension =
      getExtension(url);

    const safeName =
      Buffer.from(
        matchedKey,
        "utf8"
      ).toString("hex");

    const filePath =
      path.join(
        cacheDir,
        safeName + extension
      );

    // Download if missing
    if (
      SETTINGS.enableCache &&
      await fs.pathExists(filePath)
    ) {

      console.log(
        `[VOICE3] Cache: ${matchedKey}`
      );

    } else {

      console.log(
        `[VOICE3] Downloading: ${matchedKey}`
      );

      await downloadVoice(
        url,
        filePath
      );
    }

    // Send voice/video
    await api.sendMessage(
      {
        attachment:
          fs.createReadStream(filePath)
      },
      event.threadID,
      event.messageID
    );

  } catch (error) {

    console.error(
      "[VOICE3 ERROR]",
      error.message
    );

  }
};

// ===============================
// COMMAND HANDLER
// ===============================

module.exports.run = async function () {};
