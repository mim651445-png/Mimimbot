const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "b",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "🎬 Stylish Keyword Video Reply System",
  commandCategory: "media",
  usages: "videos1 b",
  cooldowns: 2
};


// ╔════════════════════════════════════════════╗
// ║              🎬 VIDEO DATABASE             ║
// ╚════════════════════════════════════════════╝

const videoMap = {

  "🧛‍♀️": {
    url: "https://files.catbox.moe/tfaki1.mp4",
    caption:
`╭━━━〔 👻 𝐃𝐀𝐈𝐍𝐈 𝐀𝐋𝐄𝐑𝐓 👻 〕━━━╮
┃ 😱 ডাইনি ডাকছো কেন রে ভাই?
┃ 😂 এখন কিন্তু পালানোর সময়!
┃ 🏃‍♂️ দৌড় দে... পিছনে তাকাস না!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "🤣": {
    url: "https://files.catbox.moe/ovinjk.mp4",
    caption:
`╭━━━〔 😂 𝐇𝐀𝐇𝐀 𝐌𝐎𝐃𝐄 🤣 〕━━━╮
┃ 🤣 হাসতে হাসতে অবস্থা শেষ!
┃ 😆 থাম ভাই, পেট ব্যথা হয়ে যাবে!
┃ 😂 হাসি কিন্তু থামছে না!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "🐸": {
    url: "https://files.catbox.moe/wgyhso.mp4",
    caption:
`╭━━━〔 🤨 𝐖𝐇𝐀𝐓?! 😵 〕━━━╮
┃ 😂 এইটা আবার কী কাণ্ড!
┃ 😭 আমি তো কিছুই বুঝলাম না!
┃ 🤦‍♂️ ভাই, একটু বুঝিয়ে বলো!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "😘": {
    url: "https://files.catbox.moe/l5xxyj.mp4",
    caption:
`╭━━━〔 😚 𝐔𝐌𝐌 𝐌𝐎𝐃𝐄 💫 〕━━━╮
┃ 🙈 উম্ম বললেই হবে নাকি!
┃ 😂 আগে ভালো করে কথা বলো!
┃ 😏 এত লজ্জা কিসের?
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "🤷": {
    url: "https://files.catbox.moe/n9iqgv.mp4",
    caption:
`╭━━━〔 🤨 𝐑𝐄𝐀𝐋𝐋𝐘?! 👀 〕━━━╮
┃ 👀 সত্যি না নাকি?
┃ 😂 তাহলে প্রমাণ কোথায়?
┃ 🧐 নাকি শুধু গল্প করতেছো?
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "🫣": {
    url: "https://files.catbox.moe/qetiv0.mp4",
    caption:
`╭━━━〔 🫣 𝐒𝐇𝐘 𝐌𝐎𝐃𝐄 🙈 〕━━━╮
┃ 🙈 লজ্জা পাচ্ছো নাকি?
┃ 😂 মুখ লুকিয়ে লাভ নেই!
┃ 👀 সবাই কিন্তু দেখে ফেলেছে!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "দেখা করবে": {
    url: "https://files.catbox.moe/lmauvs.mp4",
    caption:
`╭━━━〔 👀 𝐌𝐄𝐄𝐓𝐈𝐍𝐆 𝐌𝐎𝐃𝐄 📍 〕━━━╮
┃ 😏 দেখা করবে নাকি?
┃ 😂 আগে জায়গাটা বলো!
┃ 🚶‍♂️ তারপর দেখা যাবে!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "😙": {
    url: "https://files.catbox.moe/quap15.mp4",
    caption:
`╭━━━〔 😙 𝐒𝐌𝐈𝐋𝐄 𝐌𝐎𝐃𝐄 ✨ 〕━━━╮
┃ 👀 এই হাসিটা কিন্তু সন্দেহজনক!
┃ 😂 কিছু একটা নিশ্চয়ই আছে!
┃ 😏 ব্যাপারটা কী বলো তো?
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "😆": {
    url: "https://files.catbox.moe/hies6o.mp4",
    caption:
`╭━━━〔 🤸 𝐅𝐔𝐍 𝐌𝐎𝐃𝐄 🎉 〕━━━╮
┃ 🤣 আজকে তো আনন্দের শেষ নাই!
┃ 😂 নাচো ভাই, নাচো!
┃ 🕺 মুড একদম অন!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "কল": {
    url: "https://files.catbox.moe/785z5x.mp4",
    caption:
`╭━━━〔 📞 𝐂𝐀𝐋𝐋 𝐓𝐈𝐌𝐄 ☎️ 〕━━━╮
┃ 📱 কলের কথা উঠতেই হাজির!
┃ 😂 এত তাড়া কিসের ভাই?
┃ 📞 আগে কল দাও তারপর কথা!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "🏍️": {
    url: "https://files.catbox.moe/ph8b0y.mp4",
    caption:
`╭━━━〔 🏍️ 𝐑𝐈𝐃𝐄 𝐌𝐎𝐃𝐄 💨 〕━━━╮
┃ 💨 বাইক একদম রেডি!
┃ 😎 চল, একটু ঘুরে আসি!
┃ 🏍️ নিরাপদে রাইড করো!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "চিপায়": {
    url: "https://files.catbox.moe/iph1ib.mp4",
    caption:
`╭━━━〔 😂 𝐒𝐓𝐔𝐂𝐊 𝐌𝐎𝐃𝐄 🤣 〕━━━╮
┃ 🤣 চিপায় পড়ে গেছো নাকি!
┃ 🙈 বের হওয়ার রাস্তা খুঁজো!
┃ 😂 অবস্থা কিন্তু ভয়াবহ!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "🥹": {
    url: "https://files.catbox.moe/57fdts.mp4",
    caption:
`╭━━━〔 🥹 𝐄𝐌𝐎𝐓𝐈𝐎𝐍 𝐌𝐎𝐃𝐄 💔 〕━━━╮
┃ 🥺 মন খারাপ করে লাভ নেই!
┃ 🫂 সব ঠিক হয়ে যাবে!
┃ ✨ হাসিখুশি থাকো!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "🫶": {
    url: "https://files.catbox.moe/pys7u5.mp4",
    caption:
`╭━━━〔 🫶 𝐋𝐎𝐕𝐄 𝐕𝐈𝐁𝐄 ❤️ 〕━━━╮
┃ ❤️ ভালোবাসা ছড়িয়ে দাও!
┃ ✨ সবাই ভালো থাকো!
┃ 🫶 হাসিখুশি থাকো সবসময়!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "🎀": {
    url: "https://files.catbox.moe/w48i3n.mp4",
    caption:
`╭━━━〔 ❤️ 𝐋𝐎𝐕𝐄 𝐌𝐎𝐃𝐄 💕 〕━━━╮
┃ 😍 আজকে শুধু ভালোবাসা!
┃ 😂 ঝগড়া-ঝাটি বন্ধ!
┃ ❤️ Love Vibes Only!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "❤️‍🩹": {
    url: "https://files.catbox.moe/0hqphz.mp4",
    caption:
`╭━━━〔 💘 𝐋𝐎𝐕𝐄 𝐋𝐄𝐕𝐄𝐋 𝟐 🔥 〕━━━╮
┃ 😍 কাহিনি তো জমে গেছে!
┃ 😂 এবার সামলাও!
┃ 💘 Love Level: MAX!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "love": {
    url: "https://files.catbox.moe/1f6wdu.mp4",
    caption:
`╭━━━〔 ❤️ 𝐋𝐎𝐕𝐄 𝐕𝐈𝐁𝐄𝐒 ✨ 〕━━━╮
┃ 😎 𝐋𝐨𝐯𝐞 𝐕𝐢𝐛𝐞𝐬 𝐎𝐧!
┃ ✨ আজকে মুডটাই আলাদা!
┃ ❤️ শুধু Love & Smile!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "🤦‍♂️": {
    url: "https://files.catbox.moe/pqdh0d.mp4",
    caption:
`╭━━━〔 😂 𝐑𝐀𝐁𝐁𝐈 𝐌𝐎𝐃𝐄 🤣 〕━━━╮
┃ 👀 রাব্বির বউ কই গেল রে!
┃ 🤣 সবাই মিলে খুঁজে দেখো!
┃ 😂 কাহিনি কিন্তু জমে গেছে!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "mim": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 😲 𝐒𝐔𝐑𝐏𝐑𝐈𝐒𝐄 𝐌𝐎𝐃𝐄 😱 〕━━━╮
┃ 😲 এইটা দেখে অবাক হয়ে গেলে?
┃ 👀 চোখ তো কপালে উঠে গেছে!
┃ 😂 এমন সারপ্রাইজ প্রতিদিন আসে না!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  // ───────── নতুন Caption ─────────

  "রাগ": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 😡 𝐀𝐍𝐆𝐑𝐘 𝐌𝐎𝐃𝐄 🔥 〕━━━╮
┃ 😡 এত রাগ কিসের ভাই?
┃ 😤 আগে শান্ত হও!
┃ 😂 রাগ দিয়ে কিন্তু লাভ নাই!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "কান্না": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 😭 𝐂𝐑𝐘 𝐌𝐎𝐃𝐄 💔 〕━━━╮
┃ 😭 কান্না করছো কেন?
┃ 🫂 মন খারাপ করো না!
┃ ✨ সব ঠিক হয়ে যাবে!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "ঘুম": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 😴 𝐒𝐋𝐄𝐄𝐏 𝐌𝐎𝐃𝐄 🌙 〕━━━╮
┃ 😴 ঘুম পাচ্ছে নাকি?
┃ 🛌 তাহলে ঘুমিয়ে পড়ো!
┃ 🌙 Good Night!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "পাগল": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 🤪 𝐂𝐑𝐀𝐙𝐘 𝐌𝐎𝐃𝐄 🤯 〕━━━╮
┃ 🤪 কে আবার পাগলামি শুরু করলো?
┃ 😂 মাথাটা ঠিক আছে তো?
┃ 🤣 আজকে পুরাই Crazy!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "শান্ত": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 😌 𝐂𝐀𝐋𝐌 𝐌𝐎𝐃𝐄 🕊️ 〕━━━╮
┃ 😌 শান্ত হও ভাই!
┃ 🌿 সবকিছু ধীরে ধীরে ঠিক হবে।
┃ ✨ Keep Calm!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "ভয়": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 😨 𝐅𝐄𝐀𝐑 𝐌𝐎𝐃𝐄 👻 〕━━━╮
┃ 😨 ভয় পেয়েছো নাকি?
┃ 👀 পিছনে তাকিয়ে দেখো!
┃ 😂 আরে মজা করলাম!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "মজা": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 🎉 𝐅𝐔𝐍 𝐌𝐎𝐃𝐄 🤣 〕━━━╮
┃ 😂 আজকে শুধু মজা হবে!
┃ 🎉 হাসি-ঠাট্টা চলতেই থাকবে!
┃ 😎 Enjoy The Moment!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "জোস": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 🔥 𝐄𝐍𝐄𝐑𝐆𝐘 𝐌𝐎𝐃𝐄 ⚡ 〕━━━╮
┃ 🔥 আজকের মুড একদম জোস!
┃ ⚡ Energy Level: MAX!
┃ 😎 Let's Go!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "অবাক": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 😳 𝐒𝐇𝐎𝐂𝐊 𝐌𝐎𝐃𝐄 ⚡ 〕━━━╮
┃ 😳 এটা কী দেখলাম!
┃ 👀 বিশ্বাসই হচ্ছে না!
┃ 😂 পুরাই Shock!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "নাচ": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 💃 𝐃𝐀𝐍𝐂𝐄 𝐌𝐎𝐃𝐄 🎶 〕━━━╮
┃ 💃 নাচ শুরু করে দাও!
┃ 🕺 আজকে কোনো লজ্জা নাই!
┃ 🎶 Music On, Mood On!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "বন্ধু": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 🤝 𝐅𝐑𝐈𝐄𝐍𝐃𝐒 𝐌𝐎𝐃𝐄 💙 〕━━━╮
┃ 🤝 বন্ধুত্ব থাকুক সারাজীবন!
┃ 💙 বন্ধু মানেই অন্যরকম শান্তি!
┃ 😎 Best Friends Forever!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "হাই": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 👋 𝐇𝐄𝐋𝐋𝐎 𝐌𝐎𝐃𝐄 ✨ 〕━━━╮
┃ 👋 হাই ভাই!
┃ 😎 কেমন আছো?
┃ ✨ Welcome To The Chat!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  },

  "বিদায়": {
    url: "https://files.catbox.moe/39b4ua.mp4",
    caption:
`╭━━━〔 👋 𝐆𝐎𝐎𝐃𝐁𝐘𝐄 💫 〕━━━╮
┃ 👋 আজকের মতো বিদায়!
┃ 🫶 আবার দেখা হবে!
┃ ✨ ভালো থেকো!
╰━━━━━━━━━━━━━━━━━━━━━━╯`
  }
};


// ╔════════════════════════════════════════════╗
// ║              🔧 NORMALIZER                 ║
// ╚════════════════════════════════════════════╝

function normalizeText(text) {
  return String(text || "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}


// ╔════════════════════════════════════════════╗
// ║                 🎬 COMMAND                 ║
// ╚════════════════════════════════════════════╝

module.exports.run = async function ({ api, event, args }) {

  const threadID = event?.threadID;
  const messageID = event?.messageID;

  if (!threadID) return;

  let filePath = null;

  try {

    // 📋 SHOW KEYWORDS
    if (!args || args.length === 0) {

      const keywords = Object.keys(videoMap)
        .map((key, index) =>
          `┃ ${String(index + 1).padStart(2, "0")} ┃ ${key}`
        )
        .join("\n");

      return api.sendMessage(
`╭━━━〔 🎬 𝐕𝐈𝐃𝐄𝐎𝐒𝟏 〕━━━╮

┃ 🎥 𝐒𝐓𝐘𝐋𝐈𝐒𝐇 𝐕𝐈𝐃𝐄𝐎 𝐌𝐄𝐍𝐔
┃ ───────────────────
${keywords}
┃
┃ 💡 ব্যবহার:
┃ 👉 videos1 <keyword>
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
        threadID,
        messageID
      );
    }


    // 🔎 SEARCH
    const input = normalizeText(args.join(" "));

    let selected = null;
    let selectedKey = null;

    for (const key of Object.keys(videoMap)) {

      if (normalizeText(key) === input) {
        selected = videoMap[key];
        selectedKey = key;
        break;
      }

    }


    // ❌ NOT FOUND
    if (!selected) {

      return api.sendMessage(
`╭━━━〔 ❌ 𝐍𝐎𝐓 𝐅𝐎𝐔𝐍𝐃 〕━━━╮

┃ 😐 এই নামে কোনো ভিডিও নেই!
┃
┃ 💡 সঠিক Keyword ব্যবহার করো।
┃ 🎬 লিস্ট দেখতে লিখো:
┃ 👉 videos1
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
        threadID,
        messageID
      );
    }


    // 📁 CACHE
    const cacheDir = path.join(__dirname, "cache");

    await fs.ensureDir(cacheDir);

    const fileName =
      Buffer.from(selectedKey, "utf8").toString("hex") + ".mp4";

    filePath = path.join(cacheDir, fileName);


    // 📥 DOWNLOAD
    if (!(await fs.pathExists(filePath))) {

      const response = await axios({
        method: "GET",
        url: selected.url,
        responseType: "arraybuffer",
        timeout: 60000,
        maxContentLength: 100 * 1024 * 1024,
        maxBodyLength: 100 * 1024 * 1024,
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("Downloaded video is empty.");
      }

      await fs.writeFile(
        filePath,
        Buffer.from(response.data)
      );
    }


    // 🎥 SEND VIDEO
    return api.sendMessage(
      {
        body: selected.caption,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      messageID
    );

  } catch (error) {

    console.error("❌ VIDEOS1 ERROR:", error);

    // 🗑️ DELETE BROKEN CACHE
    try {
      if (filePath && await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }
    } catch (cacheError) {
      console.error("❌ CACHE REMOVE ERROR:", cacheError);
    }

    // ⚠️ ERROR MESSAGE
    return api.sendMessage(
`╭━━━〔 ⚠️ 𝐄𝐑𝐑𝐎𝐑 〕━━━╮

┃ ❌ ভিডিও পাঠাতে সমস্যা হয়েছে!
┃
┃ 🔄 কিছুক্ষণ পরে আবার চেষ্টা করো।
┃ 🎬 Keyword ঠিক আছে কিনা দেখো।
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
      threadID,
      messageID
    );
  }
};
