const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "video",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "YouTube Video Search & Download",
  commandCategory: "media",
  usages: "video <video name>",
  cooldowns: 5
};

// ═══════════════════════════════════════
// 🎬 VIDEO SEARCH + DOWNLOAD
// ═══════════════════════════════════════

module.exports.run = async function ({ api, event, args }) {

  const threadID = event.threadID;
  const messageID = event.messageID;

  const query = args.join(" ").trim();

  if (!query) {
    return api.sendMessage(
`╭━━━〔 🎬 VIDEO SEARCH 〕━━━╮
┃
┃ ❌ ভিডিওর নাম লিখুন!
┃
┃ ✦ Example:
┃   video Tum Hi Ho
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
      threadID,
      messageID
    );
  }

  const cacheDir = path.join(__dirname, "cache");
  let filePath = null;
  let statusMsg = null;

  try {

    // 🔎 SEARCHING
    statusMsg = await api.sendMessage(
`╭━━━〔 🔎 SEARCHING 〕━━━╮
┃
┃ 🎬 Search: ${query}
┃
┃ ⏳ YouTube থেকে খোঁজা হচ্ছে...
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
      threadID,
      messageID
    );

    // ═══════════════════════════════
    // 🔍 SEARCH
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

    // 🔄 UPDATE STATUS
    try {
      if (statusMsg?.messageID) {
        await api.unsendMessage(statusMsg.messageID);
      }
    } catch (e) {}

    statusMsg = await api.sendMessage(
`╭━━━〔 🎬 VIDEO FOUND 〕━━━╮
┃
┃ 📌 ${video.title || "Unknown"}
┃
┃ ⏳ Download শুরু হচ্ছে...
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
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
      throw new Error("Download link পাওয়া যায়নি।");
    }

    // ═══════════════════════════════
    // 📁 CACHE
    // ═══════════════════════════════

    await fs.ensureDir(cacheDir);

    filePath = path.join(
      cacheDir,
      `video_${Date.now()}.mp4`
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

    // Remove status
    try {
      if (statusMsg?.messageID) {
        await api.unsendMessage(statusMsg.messageID);
      }
    } catch (e) {}

    // ═══════════════════════════════
    // 🎬 FINAL VIDEO
    // ═══════════════════════════════

    const caption =
`╭━━━〔 🎬 𝗩𝗜𝗗𝗘𝗢 〕━━━╮
┃
┃ 📌 𝗧𝗶𝘁𝗹𝗲:
┃ ${video.title || "Unknown"}
┃
┃ ⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻:
┃ ${video.time || "Unknown"}
┃
┃ 🔎 𝗦𝗲𝗮𝗿𝗰𝗵:
┃ ${query}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

✅ 𝗩𝗶𝗱𝗲𝗼 𝗥𝗲𝗮𝗱𝘆!
🤖 𝗠𝗶𝗿𝗮𝗶 𝗕𝗼𝘁
👑 𝗛𝗿𝗶𝗱𝗼𝘆 𝗛𝗮𝘀𝗮𝗻 𝗦𝗵𝗮𝗻𝘁𝗼`;

    await api.sendMessage(
      {
        body: caption,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      async function () {
        try {
          if (filePath && fs.existsSync(filePath)) {
            await fs.unlink(filePath);
          }
        } catch (e) {}
      },
      messageID
    );

  } catch (error) {

    console.error(
      "[VIDEO ERROR]",
      error?.response?.data || error.message
    );

    // Remove status
    try {
      if (statusMsg?.messageID) {
        await api.unsendMessage(statusMsg.messageID);
      }
    } catch (e) {}

    // Remove cache
    try {
      if (filePath && fs.existsSync(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (e) {}

    return api.sendMessage(
`╭━━━〔 ❌ ERROR 〕━━━╮
┃
┃ ভিডিও ডাউনলোড করা যায়নি।
┃
┃ 🔄 কিছুক্ষণ পরে আবার চেষ্টা করুন।
┃
┃ 📌 Query: ${query}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
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

  const text = event.body.trim();

  if (!/^video\s+/i.test(text)) return;

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
