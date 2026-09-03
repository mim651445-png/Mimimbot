const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "v",
  version: "4.1.0",
  hasPermssion: 0,
  credits: "Mim Bot",
  description: "YouTube Video Search & Download",
  commandCategory: "media",
  usages: "video <video name>",
  cooldowns: 5
};

// ═══════════════════════════════════════
// 🎨 STYLE
// ═══════════════════════════════════════

const BOX_TOP = "╭━━━━━━━━━━━━━━━━━━━━━━╮";
const BOX_BOTTOM = "╰━━━━━━━━━━━━━━━━━━━━━━╯";

// ═══════════════════════════════════════
// 🎭 RANDOM CAPTION
// ═══════════════════════════════════════

function getCaption(video, query) {

  const title = video.title || "Unknown";
  const duration = video.time || "Unknown";

  const captions = [

`${BOX_TOP}
┃ 🎬 𝗩𝗜𝗗𝗘𝗢 𝗥𝗘𝗔𝗗𝗬
┃
┃ 📌 𝗧𝗶𝘁𝗹𝗲:
┃ ${title}
┃
┃ ⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻:
┃ ${duration}
┃
┃ 🍿 ভিডিও দেখো আর Enjoy করো!
┃ 😎 মুড ভালো রাখো, হাসতে থাকো!
┃
┃ 🤖 𝗠𝗶𝗺 𝗕𝗼𝘁
╰━━━━━━━━━━━━━━━━━━━━━━╯`,

`${BOX_TOP}
┃ 🎥 𝗠𝗜𝗠 𝗕𝗢𝗧
┃
┃ 🔥 তোমার জন্য ভিডিও চলে এসেছে!
┃
┃ 📌 ${title}
┃
┃ 🍿 বসো, ভিডিও চালাও
┃ 😜 আর মজা নাও!
┃
┃ ❤️ Powered By 𝗠𝗶𝗺 𝗕𝗼𝘁
╰━━━━━━━━━━━━━━━━━━━━━━╯`,

`${BOX_TOP}
┃ 😂 𝗠𝗜𝗠 𝗕𝗢𝗧 𝗣𝗥𝗘𝗦𝗘𝗡𝗧𝗦
┃
┃ 🎬 আজকের ভিডিও:
┃ ${title}
┃
┃ 😎 Life ছোট,
┃ 🍿 তাই ভিডিও দেখে Enjoy করো!
┃
┃ 🤖 𝗠𝗶𝗺 𝗕𝗼𝘁
┃ ✨ Always For Entertainment
╰━━━━━━━━━━━━━━━━━━━━━━╯`,

`${BOX_TOP}
┃ 💫 𝗩𝗜𝗗𝗘𝗢 𝗗𝗘𝗟𝗜𝗩𝗘𝗥𝗘𝗗
┃
┃ 📌 𝗧𝗶𝘁𝗹𝗲:
┃ ${title}
┃
┃ ⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻:
┃ ${duration}
┃
┃ 🥰 ভালো লাগলে Enjoy করো!
┃ 😂 না লাগলেও মিম বটের দোষ নাই!
┃
┃ 🤖 𝗠𝗶𝗺 𝗕𝗼𝘁
╰━━━━━━━━━━━━━━━━━━━━━━╯`,

`${BOX_TOP}
┃ 🎬 𝗘𝗡𝗝𝗢𝗬 𝗩𝗜𝗗𝗘𝗢
┃
┃ 📌 ${title}
┃
┃ 🔎 Search Complete
┃ ⚡ Download Complete
┃ ✅ Video Ready
┃
┃ 🍿 এখন শুধু Play করো!
┃
┃ 👑 𝗠𝗶𝗺 𝗕𝗼𝘁
╰━━━━━━━━━━━━━━━━━━━━━━╯`,

`${BOX_TOP}
┃ 🌸 𝗠𝗜𝗠 𝗕𝗢𝗧 𝗩𝗜𝗗𝗘𝗢
┃
┃ 🎵 ${title}
┃
┃ 💖 তোমার Entertainment,
┃ ┃ আমাদের Responsibility!
┃
┃ 🍿 Enjoy The Video
┃ 😎 Stay Happy
┃
┃ 🤖 𝗠𝗶𝗺 𝗕𝗼𝘁
╰━━━━━━━━━━━━━━━━━━━━━━╯`,

`${BOX_TOP}
┃ 🚀 𝗩𝗜𝗗𝗘𝗢 𝗦𝗨𝗖𝗖𝗘𝗦𝗦
┃
┃ 🔎 Search:
┃ ${query}
┃
┃ 🎬 ${title}
┃
┃ ✅ Downloaded Successfully
┃
┃ 😎 এখন ভিডিওটা উপভোগ করো!
┃
┃ 🤖 𝗠𝗶𝗺 𝗕𝗼𝘁 ❤️
╰━━━━━━━━━━━━━━━━━━━━━━╯`

  ];

  return captions[
    Math.floor(Math.random() * captions.length)
  ];
}

// ═══════════════════════════════════════
// 🎬 MAIN COMMAND
// ═══════════════════════════════════════

module.exports.run = async function ({ api, event, args }) {

  const threadID = event.threadID;
  const messageID = event.messageID;
  const query = args.join(" ").trim();

  if (!query) {
    return api.sendMessage(
`${BOX_TOP}
┃ 🎬 𝗠𝗜𝗠 𝗕𝗢𝗧 𝗩𝗜𝗗𝗘𝗢
┃
┃ ❌ ভিডিওর নাম লিখুন!
┃
┃ ✦ Example:
┃ ➜ video Tum Hi Ho
┃ ➜ video Arijit Singh
┃ ➜ video Funny Video
┃
${BOX_BOTTOM}`,
      threadID,
      messageID
    );
  }

  const cacheDir = path.join(__dirname, "cache");

  let filePath = null;
  let statusMsg = null;

  try {

    // ═══════════════════════════════
    // 🔎 SEARCHING
    // ═══════════════════════════════

    statusMsg = await api.sendMessage(
`${BOX_TOP}
┃ 🔎 𝗠𝗜𝗠 𝗕𝗢𝗧 𝗦𝗘𝗔𝗥𝗖
┃
┃ 🎵 Query:
┃ ${query}
┃
┃ ⏳ YouTube থেকে খোঁজা হচ্ছে...
┃
┃ 🤖 Please Wait...
${BOX_BOTTOM}`,
      threadID,
      messageID
    );

    // ═══════════════════════════════
    // 🔍 SEARCH API
    // ═══════════════════════════════

    const searchURL =
      "https://betadash-search-download.vercel.app/yt?search=" +
      encodeURIComponent(query);

    const searchRes = await axios.get(searchURL, {
      timeout: 30000
    });

    const results = searchRes.data;

    if (!Array.isArray(results) || !results.length) {
      throw new Error("কোনো ভিডিও পাওয়া যায়নি।");
    }

    const video = results[0];

    if (!video || !video.url) {
      throw new Error("ভিডিও URL পাওয়া যায়নি।");
    }

    // ═══════════════════════════════
    // 🧹 REMOVE SEARCH MESSAGE
    // ═══════════════════════════════

    try {
      if (statusMsg?.messageID) {
        await api.unsendMessage(statusMsg.messageID);
      }
    } catch (_) {}

    // ═══════════════════════════════
    // 🎬 VIDEO FOUND
    // ═══════════════════════════════

    statusMsg = await api.sendMessage(
`${BOX_TOP}
┃ 🎬 𝗩𝗜𝗗𝗘𝗢 𝗙𝗢𝗨𝗡𝗗
┃
┃ 📌 ${video.title || "Unknown"}
┃
┃ ⏱️ ${video.time || "Unknown"}
┃
┃ 📥 Download শুরু হচ্ছে...
┃
┃ ⚡ একটু অপেক্ষা করুন...
${BOX_BOTTOM}`,
      threadID,
      messageID
    );

    // ═══════════════════════════════
    // 📥 DOWNLOAD API
    // ═══════════════════════════════

    const downloadAPI =
      "https://yt-api-imran.vercel.app/api?url=" +
      encodeURIComponent(video.url);

    const dlRes = await axios.get(downloadAPI, {
      timeout: 60000
    });

    const downloadURL =
      dlRes.data?.downloadUrl ||
      dlRes.data?.url ||
      dlRes.data?.download;

    if (!downloadURL) {
      throw new Error("Download URL পাওয়া যায়নি।");
    }

    // ═══════════════════════════════
    // 📁 CACHE
    // ═══════════════════════════════

    await fs.ensureDir(cacheDir);

    filePath = path.join(
      cacheDir,
      `mim_video_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}.mp4`
    );

    // ═══════════════════════════════
    // ⬇️ DOWNLOAD VIDEO
    // ═══════════════════════════════

    const videoRes = await axios.get(downloadURL, {
      responseType: "arraybuffer",
      timeout: 180000,
      maxContentLength: 100 * 1024 * 1024,
      maxBodyLength: 100 * 1024 * 1024
    });

    await fs.writeFile(filePath, videoRes.data);

    // ═══════════════════════════════
    // 🧹 REMOVE STATUS
    // ═══════════════════════════════

    try {
      if (statusMsg?.messageID) {
        await api.unsendMessage(statusMsg.messageID);
      }
    } catch (_) {}

    // ═══════════════════════════════
    // 📝 RANDOM CAPTION
    // ═══════════════════════════════

    const caption = getCaption(video, query);

    // ═══════════════════════════════
    // 🎥 SEND VIDEO
    // ═══════════════════════════════

    await api.sendMessage(
      {
        body: caption,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      async function () {

        try {
          if (filePath && await fs.pathExists(filePath)) {
            await fs.remove(filePath);
          }
        } catch (_) {}

      },
      messageID
    );

  } catch (error) {

    console.error(
      "[MIM VIDEO ERROR]",
      error?.response?.data ||
      error?.message ||
      error
    );

    // ═══════════════════════════════
    // 🧹 CLEAN STATUS
    // ═══════════════════════════════

    try {
      if (statusMsg?.messageID) {
        await api.unsendMessage(statusMsg.messageID);
      }
    } catch (_) {}

    // ═══════════════════════════════
    // 🗑️ CLEAN CACHE
    // ═══════════════════════════════

    try {
      if (filePath && await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }
    } catch (_) {}

    // ═══════════════════════════════
    // ❌ ERROR
    // ═══════════════════════════════

    return api.sendMessage(
`${BOX_TOP}
┃ ❌ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗙𝗔𝗜𝗟𝗘𝗗
┃
┃ 🎬 Query:
┃ ${query}
┃
┃ ⚠️ ভিডিও ডাউনলোড করা যায়নি।
┃
┃ 🔄 কিছুক্ষণ পরে আবার চেষ্টা করুন।
┃
┃ 🤖 𝗠𝗶𝗺 𝗕𝗼𝘁
${BOX_BOTTOM}`,
      threadID,
      messageID
    );
  }
};

// ═══════════════════════════════════════
// 🚀 PREFIX ছাড়া AUTO DETECT
// ═══════════════════════════════════════

module.exports.handleEvent = async function ({ api, event }) {

  if (!event.body) return;

  // নিজের পাঠানো মেসেজ ignore
  if (
    typeof api.getCurrentUserID === "function" &&
    event.senderID === api.getCurrentUserID()
  ) {
    return;
  }

  const text = event.body.trim();

  if (!/^video\s+/i.test(text)) {
    return;
  }

  const query = text
    .replace(/^video\s+/i, "")
    .trim();

  if (!query) return;

  return module.exports.run({
    api,
    event,
    args: query.split(/\s+/)
  });
};
