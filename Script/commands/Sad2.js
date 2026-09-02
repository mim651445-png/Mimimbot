const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 💔 SAD VIDEO COMMAND
module.exports.config = {
  name: "sad2",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Random Sad Video + Caption + Reaction + Typing",
  commandCategory: "media",
  usages: "sad",
  cooldowns: 5
};

// 🎬 MAIN FUNCTION
module.exports.run = async function ({ api, event }) {

  // 💔 RANDOM SAD CAPTIONS
  const captions = [
    "কিছু অনুভূতি বলা যায় না, শুধু অনুভব করা যায়… 🥀",
    "হাসির আড়ালেও অনেক গল্প লুকিয়ে থাকে… 😔",
    "সময় বদলায়, মানুষ বদলায়, স্মৃতিগুলো থেকে যায়… 💔",
    "কিছু মানুষ থেকে যায় শুধু স্মৃতির পাতায়… 🥀",
    "নীরবতাও কখনো কখনো অনেক কিছু বলে যায়… 🌙",
    "সব ঠিক আছে বললেও, মনটা সবসময় ঠিক থাকে না… 💭",
    "কিছু গল্প শেষ হয়, কিন্তু স্মৃতিগুলো শেষ হয় না… 💔",
    "পুরোনো স্মৃতিগুলো মাঝে মাঝে মন থামিয়ে দেয়… 😔"
  ];

  // 🎨 RANDOM STYLISH FOOTER
  const footers = [
    "╭━━━〔 🥀 SAD VIBES 〕━━━╮\n   └─ হৃদয় হাসান শান্ত 🖤",
    "╭━━〔 💔 EMOTIONAL ZONE 〕━━╮\n   └─ 𝗛𝗥𝗜𝗗𝗢𝗬 𝗕𝗢𝗧 🤖",
    "╭━━━〔 🌙 MIDNIGHT FEELINGS 〕━━━╮\n   └─ 𝐇𝐫𝐢𝐝𝐨𝐲 𝐁𝐨𝐭 🥀",
    "╭━━〔 🥀 BROKEN VIBES 〕━━╮\n   └─ 𝙷𝚁𝙸𝙳𝙾𝚈 𝙱𝙾𝚃 💔",
    "╭━━━〔 💭 FEELINGS 〕━━━╮\n   └─ হৃদয় হাসান শান্ত 🌚"
  ];

  // 🎥 SAD VIDEO LIST
  const videos = [
    "https://drive.google.com/uc?id=16KeE4J7L2Pd8cCKIBvlwEPP07A92b-eb",
    "https://drive.google.com/uc?id=16MhNPi_H0-tEe5PQrrqkx_l7SrC_l0kd",
    "https://drive.google.com/uc?id=15w4cvYmKrCW2Hul2AcvPEk5S4b-CH3EE",
    "https://drive.google.com/uc?id=16Xa6thSHdEGCiypaetbAEqVCwEAzFnKX",
    "https://drive.google.com/uc?id=16BnRPvKQd7gd3YLR_rB9QNZymotMqHu7",
    "https://drive.google.com/uc?id=15fDe2735O50z-3G4yQ5tDT9J873x5izm",
    "https://drive.google.com/uc?id=16HgiGU7_Cdh8NtpsKi92dTJmALJCV8jD",
    "https://drive.google.com/uc?id=16KTSrInqvioGnT7RrAskjHYqz8R6RgNY",
    "https://drive.google.com/uc?id=162yWrNRRTeN4tFEjQEtsR4p-4gWbTFaS",
    "https://drive.google.com/uc?id=16-q768c6nXstZEjQhWa1pZUPL2Xpjwo9",
    "https://drive.google.com/uc?id=15bfkP01mTzXutgP_0Z1iyud7SXqq-jOt",
    "https://drive.google.com/uc?id=15WnvdFOQIhKQ1nlZgsABXaf6Q2nQexGW",
    "https://drive.google.com/uc?id=16GTgYVSIDduUs4VTxadIzPPyp9KA_102",
    "https://drive.google.com/uc?id=15Y2GnA-Kcox8Mw6jioxHc1G1yP4pihnC",
    "https://drive.google.com/uc?id=16-qsG6oldtJiGq11Q3bFxKzuZJRFnoPT",
    "https://drive.google.com/uc?id=15W8ETDBXrn_JvealPwPFQ2CjvZp437-g",
    "https://drive.google.com/uc?id=15StZMKfsTdAhhECdKjS6FUFwG_OIHa7W",
    "https://drive.google.com/uc?id=16lOXxs-Z9u-mxttFnwWzdUHvrP55aHnZ",
    "https://drive.google.com/uc?id=162Qn-pcnc9iijg5dv59S9DTTQOofL4Fy",
    "https://drive.google.com/uc?id=1680rf1wQ2TrRuSLHtTwFC7GYctJAnHaX",
    "https://drive.google.com/uc?id=16-XtMXpa4r1iFJTBS2N68ARMuDH2IWpG",
    "https://drive.google.com/uc?id=15bO3lguAxsMZPvKkcvlsM6ObXOfJMz79"
  ];

  // 🎲 RANDOM DATA
  const caption =
    captions[Math.floor(Math.random() * captions.length)];

  const footer =
    footers[Math.floor(Math.random() * footers.length)];

  const videoUrl =
    videos[Math.floor(Math.random() * videos.length)];

  // 📁 CACHE DIRECTORY
  const cacheDir = path.join(__dirname, "cache");

  await fs.ensureDir(cacheDir);

  // 🎥 UNIQUE CACHE FILE
  const filePath = path.join(
    cacheDir,
    `sad_${Date.now()}.mp4`
  );

  try {

    // 👀 TYPING INDICATOR
    if (api.sendTypingIndicator) {
      await api.sendTypingIndicator(event.threadID, true);
    }

    // ⏳ SMALL LOADING DELAY
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 📥 DOWNLOAD VIDEO
    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream",
      timeout: 60000
    });

    // 💾 CREATE FILE
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    // ⏳ WAIT FOR DOWNLOAD
    await new Promise((resolve, reject) => {

      writer.on("finish", resolve);

      writer.on("error", reject);

      response.data.on("error", reject);

    });

    // ⌨️ STOP TYPING
    if (api.sendTypingIndicator) {
      await api.sendTypingIndicator(event.threadID, false);
    }

    // ❤️ REACTION BEFORE VIDEO
    try {
      if (api.setMessageReaction) {
        await api.setMessageReaction(
          "🥀",
          event.messageID,
          () => {},
          true
        );
      }
    } catch (reactionError) {
      console.log("Reaction skipped:", reactionError.message);
    }

    // ✨ FINAL MESSAGE
    const finalMessage =
      `╭━━━〔 💔 SAD MOMENT 〕━━━╮\n` +
      `\n${caption}\n` +
      `\n${footer}\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯`;

    // 📤 SEND VIDEO + STYLISH CAPTION
    await api.sendMessage(
      {
        body: finalMessage,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID
    );

    // 🗑️ DELETE CACHE
    setTimeout(async () => {

      try {

        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath);
        }

      } catch (error) {
        console.error("🗑️ Cache Delete Error:", error);
      }

    }, 5000);

  } catch (error) {

    console.error("❌ SAD VIDEO ERROR:", error);

    // ⌨️ STOP TYPING ON ERROR
    try {
      if (api.sendTypingIndicator) {
        await api.sendTypingIndicator(event.threadID, false);
      }
    } catch (e) {}

    // 🧹 CLEAN CACHE
    try {
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }
    } catch (e) {}

    // ❌ ERROR MESSAGE
    await api.sendMessage(
      "❌ ভিডিও পাঠানো সম্ভব হয়নি। কিছুক্ষণ পর আবার চেষ্টা করুন। 🥀",
      event.threadID
    );
  }
};
