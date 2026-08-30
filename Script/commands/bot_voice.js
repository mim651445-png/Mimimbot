const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "bot_voice",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "Farhan-Khan | Converted by ChatGPT",
  description: "Ultra Smart Voice Reply",
  commandCategory: "system",
  usages: "",
  cooldowns: 1
};

module.exports.handleEvent = async function ({
  api,
  event
}) {
  if (!event.body) return;

  const input = event.body.toLowerCase().trim();

  const botVoices = [
    "https://files.catbox.moe/hhldox.mp3",
    "https://files.catbox.moe/faql6m.mp3",
    "https://files.catbox.moe/gzq54t.mp3",
    "https://files.catbox.moe/v4l3im.mp3",
    "https://files.catbox.moe/x8ina4.mp3",
    "https://files.catbox.moe/3u6shs.mp3"
  ];

  const voiceMap = {
    "bby": botVoices,
    "ডিম ": botVoices,
    "mim": botVoices,
    "@mim mim": botVoices,
    "মিম": botVoices
  };

  const firstWord = input.split(" ")[0];

  if (!voiceMap[firstWord]) return;

  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);

  try {
    let audioUrl = voiceMap[firstWord];

    if (Array.isArray(audioUrl)) {
      audioUrl = audioUrl[Math.floor(Math.random() * audioUrl.length)];
    }

    const fileName = Buffer.from(audioUrl).toString("hex") + ".mp3";
    const filePath = path.join(cacheDir, fileName);

    if (!fs.existsSync(filePath)) {
      const res = await axios.get(audioUrl, {
        responseType: "arraybuffer"
      });
      fs.writeFileSync(filePath, Buffer.from(res.data));
    }

    api.sendMessage(
      {
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => {},
      event.messageID
    );

  } catch (e) {
    console.log(e);
  }
};

module.exports.run = async function () {};
