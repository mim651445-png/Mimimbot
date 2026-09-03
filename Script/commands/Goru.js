const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "বিদেশি_ছবি",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Random foreign travel & nature photo",
  commandCategory: "Random-IMG",
  usages: "",
  cooldowns: 3
};

// 🌍 বিদেশি Travel / Nature ছবি
const imageLinks = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
];

const captions = [
  "🌍 বিদেশের সুন্দর দৃশ্য—মনটাই ভালো হয়ে গেল! ✨",
  "✈️ ঘুরতে যাওয়ার ইচ্ছাটা আবার জেগে উঠলো! 😌",
  "🏔️ প্রকৃতির সৌন্দর্যের কাছে সবকিছুই ছোট! 💚",
  "🌿 একটু শান্তি, একটু প্রকৃতি—ব্যস এতটুকুই চাই! 🥰",
  "🌅 পৃথিবীটা সত্যিই অনেক সুন্দর! ✨",
  "🗺️ একদিন আমিও এমন জায়গায় ঘুরতে যাবো! 😎",
  "✈️ Destination: Somewhere Beautiful 🌍",
  "💫 ছবিটা দেখেই মনে হচ্ছে বিদেশে চলে যাই!"
];

module.exports.run = async function ({ api, event }) {
  const cacheDir = path.join(__dirname, "cache");

  try {
    await fs.ensureDir(cacheDir);

    const filePath = path.join(
      cacheDir,
      `foreign_${Date.now()}.jpg`
    );

    // 🎲 Random image + caption
    const randomImage =
      imageLinks[Math.floor(Math.random() * imageLinks.length)];

    const randomCaption =
      captions[Math.floor(Math.random() * captions.length)];

    // ⏳ Loading message
    const loading = await api.sendMessage(
      "╭━━━━━━━━━━━━━━╮\n" +
      "      🌍 বিদেশি ছবি\n" +
      "╰━━━━━━━━━━━━━━╯\n\n" +
      "🔄 ছবি খোঁজা হচ্ছে...\n" +
      "▒▒▒▒▒▒▒▒▒▒ 0%",
      event.threadID
    );

    // 🔄 Loading animation
    let progress = 0;

    const timer = setInterval(() => {
      progress += 20;

      if (progress >= 100) {
        clearInterval(timer);
        return;
      }

      const filled = "█".repeat(progress / 10);
      const empty = "▒".repeat(10 - progress / 10);

      api.editMessage(
        `${filled}${empty} ${progress}% 🌍`,
        loading.messageID,
        event.threadID
      );
    }, 250);

    // 📥 Download image
    const response = await axios.get(
      randomImage + "?auto=format&fit=crop&w=1200&q=85",
      {
        responseType: "stream",
        timeout: 15000
      }
    );

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // ছোট delay
    await new Promise(resolve => setTimeout(resolve, 700));

    // Loading delete
    try {
      await api.unsendMessage(loading.messageID);
    } catch (e) {}

    // 📸 Send image
    api.sendMessage(
      {
        body:
          "╭━━━━━━━━━━━━━━╮\n" +
          "     🌍 𝗙𝗢𝗥𝗘𝗜𝗚𝗡 𝗩𝗜𝗘𝗪\n" +
          "╰━━━━━━━━━━━━━━╯\n\n" +
          `${randomCaption}\n\n` +
          "━━━━━━━━━━━━━━━━\n" +
          "💚 𝗛𝗿𝗶𝗱𝗼𝘆 𝗕𝗼𝘁\n" +
          "━━━━━━━━━━━━━━━━",
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      async () => {
        // 🗑️ Temporary file delete
        try {
          await fs.unlink(filePath);
        } catch (e) {}

        // ❤️ Reaction
        try {
          await api.setMessageReaction(
            "🌍",
            loading.messageID,
            () => {},
            true
          );
        } catch (e) {}
      }
    );

  } catch (error) {
    console.error("Foreign Image Error:", error);

    try {
      await api.sendMessage(
        "❌ বিদেশি ছবিটি লোড করা সম্ভব হয়নি।\n🔄 কিছুক্ষণ পরে আবার চেষ্টা করো।",
        event.threadID
      );
    } catch (e) {}
  }
};
