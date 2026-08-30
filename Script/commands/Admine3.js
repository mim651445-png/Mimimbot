const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const INDEX_FILE = path.join(CACHE_DIR, "videoIndex.json");

// 🎬 VIDEO LIST
const videoList = [
  {
    url: "https://files.catbox.moe/qgmyk9.mp4",
    file: "video1.mp4"
  },
  {
    url: "https://files.catbox.moe/ygsz4h.mp4",
    file: "video2.mp4"
  },
  {
    url: "https://files.catbox.moe/psl98k.mp4",
    file: "video3.mp4"
  },
  {
    url: "https://files.catbox.moe/rzhmck.mp4",
    file: "video4.mp4"
  },
  {
    url: "https://files.catbox.moe/h1w4ol.mp4",
    file: "video5.mp4"
  }
];

// 👑 ADMIN CONFIG
const ADMIN_UID = "61593296285457";
const ADMIN_NAME = "হৃদয় হাসান শান্ত";

const triggers = [
  "@Šħẫňto Hřiȡẫy Ħẫššẫň",
  "hriday hassan shanto",
  "হৃদয় হাসান শান্ত",
  "হৃদয়",
  "হৃদয় ভাই",
  "boss hriday",
  "রাব্বি ভাই",
  "বট অ্যাডমিন কে"
];

// 💬 CAPTIONS
const captions = [
  "🇲🇾 হৃদয় হাসান শান্তকে বেশি মেনশন দিও না! 😹💔",
  "🥀 হৃদয় হাসান শান্ত অনলাইনে আছে, কিন্তু ভাগ্য এখনো অফলাইনে! 🤧",
  "😎 বস এখন বিজি, প্রেমের আবেদন পরে জমা দিন! 📩😂",
  "💔 এত মেনশন কেন? বসের ইনবক্সে আজও শান্তি নাই! 😹",
  "🤭 বসের জন্য একটা ভালো মনের মানুষ খুঁজে দাও আগে! 😂",
  "🇲🇾 হৃদয় হাসান শান্ত কাজে ব্যস্ত, কিন্তু মেনশন দেখলে হাজির! 😎",
  "🔥 বসকে মেনশন করলে জরিমানা নেই, তবে একটা হাসি দিতে হবে! 😹",
  "🫂 সিঙ্গেল লাইফ চলছে, তাই বেশি ডিস্টার্ব না করাই ভালো! 😂",
  "🥺 মেনশন পেলেই বসের পুরনো স্মৃতি মনে পড়ে যায়! 💔",
  "😹 হৃদয় হাসান শান্ত হাজির! এখন বলেন, কী দরকার?"
];

// 📥 DOWNLOAD VIDEO
async function downloadVideo(video) {
  const filePath = path.join(CACHE_DIR, video.file);

  if (fs.existsSync(filePath)) {
    return filePath;
  }

  try {
    const response = await axios({
      method: "GET",
      url: video.url,
      responseType: "stream",
      timeout: 60000
    });

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(`✅ Downloaded: ${video.file}`);

    return filePath;

  } catch (error) {
    console.log(`❌ Download failed: ${video.file}`);
    console.log(error.message);

    return null;
  }
}

// 🚀 PRELOAD ALL VIDEOS
async function preloadVideos() {
  console.log("📥 Admin3 video preload started...");

  for (const video of videoList) {
    await downloadVideo(video);
  }

  console.log("✅ Admin3 video preload completed.");
}

preloadVideos();

module.exports.config = {
  name: "admin3",
  version: "2.0.0",
  hasPermssion: 0,
  credits: ADMIN_NAME,
  description: "Admin mention video reply",
  commandCategory: "system",
  usages: "",
  cooldowns: 1
};

// 📌 MIRAI EVENT
module.exports.handleEvent = async function ({ api, event }) {
  try {

    const senderID = String(event.senderID || "");
    if (!senderID) return;

    // 👑 Admin নিজে লিখলে reply করবে না
    if (senderID === ADMIN_UID) return;

    const body = String(event.body || "").trim();

    if (!body) return;

    const text = body.toLowerCase();

    // 👤 Mention check
    let mentionFound = false;

    if (event.mentions) {
      const mentionedIDs = Object.keys(event.mentions).map(id => String(id));

      if (mentionedIDs.includes(ADMIN_UID)) {
        mentionFound = true;
      }
    }

    // 🔍 Keyword check
    const keywordFound = triggers.some(trigger =>
      text.includes(trigger.toLowerCase())
    );

    // ❌ কোনো trigger না থাকলে return
    if (!mentionFound && !keywordFound) return;

    // 💬 Random caption
    const caption =
      captions[Math.floor(Math.random() * captions.length)];

    const styledCaption = `
╭━━━━━━━━━━━━━━━━━━╮
      👑 𝗔𝗗𝗠𝗜𝗡 𝗠𝗘𝗡𝗧𝗜𝗢𝗡
╰━━━━━━━━━━━━━━━━━━╯

『 ${caption} 』

╭━━━━━━━━━━━━━━━━━━╮
      🇲🇾 𝗛𝗥𝗜𝗗𝗔𝗬
╰━━━━━━━━━━━━━━━━━━╯
`;

    // 🎬 Read current video index
    let currentIndex = 0;

    if (fs.existsSync(INDEX_FILE)) {
      try {
        const data = JSON.parse(
          fs.readFileSync(INDEX_FILE, "utf8")
        );

        if (
          typeof data.index === "number" &&
          data.index >= 0 &&
          data.index < videoList.length
        ) {
          currentIndex = data.index;
        }

      } catch (e) {
        currentIndex = 0;
      }
    }

    const selectedVideo = videoList[currentIndex];

    // 🔄 Save next video index
    const nextIndex =
      (currentIndex + 1) % videoList.length;

    fs.writeFileSync(
      INDEX_FILE,
      JSON.stringify(
        { index: nextIndex },
        null,
        2
      )
    );

    // 📥 Download video
    const videoPath = await downloadVideo(selectedVideo);

    // ❌ Video unavailable
    if (!videoPath || !fs.existsSync(videoPath)) {
      return api.sendMessage(
        styledCaption,
        event.threadID,
        event.messageID
      );
    }

    // 📤 Send video
    return api.sendMessage(
      {
        body: styledCaption,
        attachment: fs.createReadStream(videoPath)
      },
      event.threadID,
      event.messageID
    );

  } catch (error) {

    console.log("❌ Admin3 Error:", error);

    try {
      return api.sendMessage(
        "❌ Admin mention reply দিতে সমস্যা হয়েছে!",
        event.threadID,
        event.messageID
      );
    } catch (e) {}
  }
};

// 📌 COMMAND SUPPORT
module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "✅ Admin3 চালু আছে!\n\n👑 Admin mention করলে ভিডিও রিপ্লাই করবে।",
    event.threadID,
    event.messageID
  );
};
