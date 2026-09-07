const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "mim",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Random Picture + Stylish Caption",
  commandCategory: "fun",
  usages: "mim",
  cooldowns: 3
};

const images = [
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

const captions = [
  `╭━━━〔 🥹 𝗠𝗜𝗠 𝗡𝗔 𝗠𝗘𝗬𝗘 〕━━━╮
┃ 👀 মিম নাকি মেয়ে...?
┃ 🫣 চোখ বলে এক কথা,
┃ ❤️ মন বলে আরেক কথা!
╰━━━━━━━━━━━━━━━━━━━━╯`,

  `╭━━━〔 🌚 𝗦𝗣𝗘𝗖𝗜𝗔𝗟 𝗣𝗜𝗖 〕━━━╮
┃ 😂 মিম ভাবছিলাম...
┃ 🥹 পরে দেখি ব্যাপারটা সিরিয়াস!
┃ 👀 তোমার কী মনে হয়?
╰━━━━━━━━━━━━━━━━━━━━╯`,

  `╭━━━〔 👀 𝗖𝗛𝗘𝗖𝗞 𝗧𝗜𝗠𝗘 〕━━━╮
┃ 🫣 ভালো করে দেখো...
┃ 🤭 তারপর বলো—
┃ 🔥 মিম নাকি মেয়ে?
╰━━━━━━━━━━━━━━━━━━━━╯`,

  `╭━━━〔 🤣 𝗤𝗨𝗘𝗦𝗧 𝗧𝗜𝗠𝗘 〕━━━╮
┃ 🌚 এই ছবির আসল রহস্য কী?
┃ 👀 মিম নাকি মেয়ে?
┃ 💬 উত্তর দাও তো!
╰━━━━━━━━━━━━━━━━━━━━╯`,

  `╭━━━〔 🥹 𝗩𝗜𝗕𝗘 𝗖𝗛𝗘𝗖𝗞 〕━━━╮
┃ 🌸 ছবি তো random...
┃ ✨ কিন্তু vibe একদম অন্যরকম!
┃ 👀 একবার তাকিয়ে যাও!
╰━━━━━━━━━━━━━━━━━━━━╯`,

  `╭━━━〔 🙈 𝗖𝗔𝗥𝗘𝗙𝗨𝗟 〕━━━╮
┃ 👀 বেশি তাকাইও না...
┃ 😂 পরে আবার ক্রাশ খেয়ে বসো!
┃ 🫣 সাবধান কিন্তু!
╰━━━━━━━━━━━━━━━━━━━━╯`,

  `╭━━━〔 🔥 𝗧𝗢𝗗𝗔𝗬'𝗦 𝗣𝗜𝗖 〕━━━╮
┃ 📸 আজকের random ছবি!
┃ 🫣 বিচার করার দায়িত্ব তোমাদের!
┃ 😎 দেখি কে কী বলে!
╰━━━━━━━━━━━━━━━━━━━━╯`,

  `╭━━━〔 😹 𝗙𝗨𝗡 𝗧𝗜𝗠𝗘 〕━━━╮
┃ 🌚 মিম বললে মিম...
┃ 👀 মেয়ে বললে মেয়ে...
┃ 🤣 সিদ্ধান্ত তোমার!
╰━━━━━━━━━━━━━━━━━━━━╯`,

  `╭━━━〔 🌸 𝗦𝗢𝗙𝗧 𝗩𝗜𝗕𝗘 〕━━━╮
┃ 🥹 ছবিটা দেখে কিছু বলার নেই...
┃ ✨ শুধু একবার তাকিয়ে যাও!
┃ ❤️ ভালো লাগলে react দিও!
╰━━━━━━━━━━━━━━━━━━━━╯`,

  `╭━━━〔 👑 𝗙𝗜𝗡𝗔𝗟 𝗩𝗘𝗥𝗗𝗜𝗖𝗧 〕━━━╮
┃ 🧐 তদন্ত করে জানাও...
┃ 😂 এটা মিম নাকি মেয়ে?
┃ 👀 উত্তর কিন্তু চাই!
╰━━━━━━━━━━━━━━━━━━━━╯`
];

module.exports.run = async function ({ api, event }) {

  const cacheDir = path.join(__dirname, "cache");

  try {
    await fs.ensureDir(cacheDir);

    const image =
      images[Math.floor(Math.random() * images.length)];

    const caption =
      captions[Math.floor(Math.random() * captions.length)];

    const filePath = path.join(
      cacheDir,
      `mim_${Date.now()}.jpg`
    );

    const response = await axios({
      method: "GET",
      url: image,
      responseType: "arraybuffer",
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    await fs.writeFile(
      filePath,
      Buffer.from(response.data)
    );

    const finalMessage =
`${caption}

╭━━━━━━━━━━━━━━━━━━╮
│ 👑 𝗖𝗿𝗲𝗮𝘁𝗼𝗿 : হৃদয় হাসান শান্ত
│ 🤖 𝗦𝘆𝘀𝘁𝗲𝗺 : Random Picture
╰━━━━━━━━━━━━━━━━━━╯`;

    await api.sendMessage(
      {
        body: finalMessage,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => {
        fs.unlink(filePath).catch(() => {});
      },
      event.messageID
    );

  } catch (error) {

    console.error("❌ MIM ERROR:", error);

    return api.sendMessage(
      "❌ ছবি পাঠানো যাচ্ছে না!\n🔄 কিছুক্ষণ পর আবার চেষ্টা করো।",
      event.threadID,
      event.messageID
    );
  }
};
