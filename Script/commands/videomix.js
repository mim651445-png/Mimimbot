const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

/* =====================================================
   🎬 VIDEO MIX — MIRAI / GOATBOT STYLE
   ===================================================== */

module.exports.config = {
  name: "videomix",
  version: "12.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Random category video with stylish caption",
  commandCategory: "video",
  usages: "videomix",
  cooldowns: 10
};


/* =====================================================
   🎭 CATEGORY WISE CAPTIONS
   ===================================================== */

const captions = {

  status: [
    "✨ জীবনের প্রতিটা মুহূর্ত একটা নতুন গল্প...",
    "🖤 নীরবতাও কখনো অনেক কথা বলে...",
    "🥀 কিছু কথা শুধু অনুভব করা যায়...",
    "💫 সময় সবকিছুর উত্তর দিয়ে দেয়..."
  ],

  sad: [
    "🥀 হাসির আড়ালেও অনেক গল্প লুকিয়ে থাকে...",
    "💔 কিছু কষ্ট কাউকে বলা যায় না...",
    "🖤 নীরবতাই কখনো সবচেয়ে বড় উত্তর...",
    "😔 সময় মানুষকে অনেক কিছু শিখিয়ে দেয়..."
  ],

  baby: [
    "🧸 ছোট্ট মুহূর্ত, বড় একটা হাসি! 🥰",
    "👶 Baby mood activated! 💕",
    "🍼 Cute moment for you! 😍",
    "💗 এই ভিডিওটা দেখলে মন ভালো হবেই! 🧸"
  ],

  love: [
    "❤️ ভালোবাসা সুন্দর, যদি মানুষটা সঠিক হয়...",
    "💞 কিছু মানুষ মনে থাকে, দূরে থাকলেও...",
    "🌸 ভালোবাসার গল্পগুলো সবসময় স্পেশাল...",
    "🥰 Love is a beautiful feeling! ❤️"
  ],

  ff: [
    "🔥 Free Fire mood activated!",
    "🎮 Booyah এর পথে! 🔥",
    "⚡ Game on, fear off!",
    "💀 Rush mode activated! 🔥"
  ],

  shairi: [
    "🌸 কিছু কথা শুধু অনুভব করা যায়...",
    "🥀 ছোট্ট একটা লাইন, হাজার অনুভূতি...",
    "🖤 কথাগুলো ছোট, অনুভূতিটা গভীর...",
    "✨ কিছু শব্দ সরাসরি হৃদয়ে লাগে..."
  ],

  humaiyun: [
    "🌙 কিছু গল্প মনে থেকে যায়...",
    "🥀 স্মৃতিগুলো নীরব, কিন্তু অনেক গভীর...",
    "🖤 কিছু গল্পের শেষ হয় না...",
    "✨ একটু আবেগ, একটু স্মৃতি..."
  ],

  islam: [
    "🕌 আল্লাহর উপর ভরসা রাখুন, সব ঠিক হয়ে যাবে। 🤲",
    "🤲 দোয়া করুন, আল্লাহ সবসময় আমাদের সাথে আছেন।",
    "🌙 আল্লাহর স্মরণেই অন্তরের শান্তি।",
    "🕋 আল্লাহ আমাদের সবাইকে হেদায়েত দিন। 🤍"
  ],

  anime: [
    "⚡ Anime mood activated! 🔥",
    "🌸 Every story has a hero...",
    "⚔️ Never give up! 🔥",
    "🌙 Some stories feel like real life..."
  ],

  short: [
    "🎬 Short video, big vibe! ✨",
    "🔥 Just a quick video for you!",
    "🎥 Scroll বন্ধ করো, আগে এটা দেখো! 😎",
    "⚡ Short time, full enjoy!"
  ],

  event: [
    "🎉 Special moment, special vibe!",
    "✨ Let's celebrate the moment! 🎊",
    "🎈 Good moments become great memories!",
    "🥳 Event mood ON!"
  ],

  prefix: [
    "🤖 Bot prefix mood!",
    "⚙️ Bot is ready to run!",
    "✨ Command mode activated!",
    "🤖 Smart Bot, smart reply!"
  ],

  cpl: [
    "🔥 Couple mood is here!",
    "❤️ Couple moments are always special!",
    "🥰 Two hearts, one beautiful vibe!",
    "💞 Sweet moment, sweet memory!"
  ],

  time: [
    "⏰ Time never stops...",
    "⌛ Time changes everything...",
    "🕐 Make every moment count!",
    "✨ আজকের মুহূর্তটাই সবচেয়ে গুরুত্বপূর্ণ।"
  ],

  lofi: [
    "🎧 Lofi vibes, quiet mind...",
    "🌙 Just music, silence and peace...",
    "🎶 Let the music speak...",
    "🖤 Lofi + Night = Peace..."
  ],

  happy: [
    "😊 Smile more, worry less!",
    "✨ Happiness is a small moment!",
    "🥰 Keep smiling, keep shining!",
    "💫 আজকে শুধু হাসির দিন!"
  ],

  football: [
    "⚽ Football is more than a game!",
    "🔥 Game on, fear off!",
    "🏆 Play with heart, win with passion!",
    "⚡ One team, one dream!"
  ],

  funny: [
    "😂 Mood off? Then watch this!",
    "🤣 হাসি আটকাতে পারলে তুমি Legend!",
    "😹 This video comes with free laughter!",
    "😂 জীবন ছোট, হাসি বড়!"
  ]
};


/* =====================================================
   🎲 RANDOM CAPTION
   ===================================================== */

function getCaption(category) {
  const list = captions[category] || captions.status;
  return list[Math.floor(Math.random() * list.length)];
}


/* =====================================================
   🤖 BOT PROFILE
   ===================================================== */

const botProfile = {
  name: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓",
  owner: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐀𝐒𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎",
  version: "12.0.0"
};


/* =====================================================
   🚀 MAIN COMMAND
   ===================================================== */

module.exports.run = async function ({ api, event }) {

  const cacheDir = path.join(__dirname, "cache");

  const videoPath = path.join(
    cacheDir,
    `videomix_${event.senderID}_${Date.now()}.mp4`
  );

  try {

    /* Cache folder */
    await fs.ensureDir(cacheDir);


    /* Loading reaction */
    try {
      api.setMessageReaction(
        "⏳",
        event.messageID,
        () => {},
        true
      );
    } catch (e) {}


    /* =================================================
       🌐 GET API
       ================================================= */

    const apiResponse = await axios.get(
      "https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json",
      {
        timeout: 10000
      }
    );

    const videoAPI = apiResponse.data.api;

    if (!videoAPI) {
      throw new Error("Video API not found");
    }


    /* =================================================
       🎞️ VIDEO CATEGORIES
       ================================================= */

    const categories = [
      "status",
      "sad",
      "baby",
      "love",
      "ff",
      "shairi",
      "humaiyun",
      "islam",
      "anime",
      "short",
      "event",
      "prefix",
      "cpl",
      "time",
      "lofi",
      "happy",
      "football",
      "funny"
    ];


    /* Random category */
    const category =
      categories[
        Math.floor(Math.random() * categories.length)
      ];


    /* =================================================
       📡 GET VIDEO INFORMATION
       ================================================= */

    const videoResponse = await axios.get(
      `${videoAPI}/video/${category}`,
      {
        timeout: 15000
      }
    );

    if (
      !videoResponse.data ||
      !videoResponse.data.data
    ) {
      throw new Error("Video URL not found");
    }

    const videoURL = videoResponse.data.data;

    const totalVideo =
      videoResponse.data.count || "Unknown";

    const sourceName =
      videoResponse.data.shaon || "Video API";


    /* =================================================
       🎭 CAPTION
       ================================================= */

    const caption = getCaption(category);


    /* =================================================
       ⬇️ DOWNLOAD VIDEO
       ================================================= */

    const videoFile = await axios.get(
      videoURL,
      {
        responseType: "arraybuffer",
        timeout: 60000,
        maxContentLength: 100 * 1024 * 1024,
        maxBodyLength: 100 * 1024 * 1024
      }
    );

    await fs.writeFile(
      videoPath,
      videoFile.data
    );


    /* Success reaction */
    try {
      api.setMessageReaction(
        "🎬",
        event.messageID,
        () => {},
        true
      );
    } catch (e) {}


    /* =================================================
       💬 FINAL MESSAGE
       ================================================= */

    const messageBody =

`╭━━━〔 🎬 𝐕𝐈𝐃𝐄𝐎 𝐌𝐈𝐗 〕━━━╮
┃
┃ ✨ ${caption}
┃
┣━━━━━━━━━━━━━━━━━━
┃ 🎞️ 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘
┃ ➜ ${category.toUpperCase()}
┃
┃ 🎬 𝐓𝐎𝐓𝐀𝐋 𝐕𝐈𝐃𝐄𝐎
┃ ➜ ${totalVideo}
┃
┣━━━━━━━━━━━━━━━━━━
┃ 👑 𝐒𝐎𝐔𝐑𝐂𝐄
┃ ➜ ${sourceName}
┃
┃ 🤖 ${botProfile.name}
┃ 👤 ${botProfile.owner}
┃ ⚙️ 𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : ${botProfile.version}
┃ 🟢 𝐒𝐓𝐀𝐓𝐔𝐒 : 𝐎𝐍𝐋𝐈𝐍𝐄
┃
╰━━━〔 𓆩🖤𓆪 〕━━━╯`;


    /* =================================================
       📤 SEND VIDEO
       ================================================= */

    return api.sendMessage(
      {
        body: messageBody,
        attachment: fs.createReadStream(videoPath)
      },

      event.threadID,

      () => {

        /* Auto delete cache */
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }

      },

      event.messageID
    );

  } catch (error) {

    console.error(
      "[VIDEOMIX ERROR]",
      error.message
    );


    /* Delete broken cache */
    if (fs.existsSync(videoPath)) {
      try {
        fs.unlinkSync(videoPath);
      } catch (e) {}
    }


    /* Error reaction */
    try {
      api.setMessageReaction(
        "❌",
        event.messageID,
        () => {},
        true
      );
    } catch (e) {}


    /* Error message */
    return api.sendMessage(
`╭━━━〔 ❌ 𝐕𝐈𝐃𝐄𝐎 𝐌𝐈𝐗 〕━━━╮
┃
┃ ⚠️ ভিডিও আনতে সমস্যা হয়েছে!
┃
┃ 🔄 কিছুক্ষণ পর আবার চেষ্টা করুন।
┃
┃ 🤖 𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓
╰━━━━━━━━━━━━━━━━━━╯`,
      event.threadID,
      event.messageID
    );
  }
};
