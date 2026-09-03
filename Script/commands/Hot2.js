const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

/*
╔══════════════════════════════════════╗
║          🔥 HOT2 VIDEO              ║
║      🔐 ADMIN ONLY VERSION          ║
╚══════════════════════════════════════╝
*/

module.exports.config = {
  name: "hot2",
  version: "3.0.1",

  // 🔐 2 = শুধু Admin ব্যবহার করতে পারবে
  hasPermssion: 2,

  credits: "হৃদয় হাসান শান্ত",
  description: "Stylish Random Video - Admin Only",
  commandCategory: "media",
  usages: "🙈",
  cooldowns: 5
};


/*
╔══════════════════════════════════╗
║          🎬 VIDEO LIST           ║
╚══════════════════════════════════╝
*/

const videos = [
  "https://drive.google.com/uc?id=19Ut381EDTdjYPRnPvy3pQq6oyQ5Y8bq3",
  "https://drive.google.com/uc?id=1BwWdiggrcPRemz3UHtQZ8PxBSexLY_cp",
  "https://drive.google.com/uc?id=1ARSdgb82oP6DsIUi-YxDaZu-XSMOJdz1",
  "https://drive.google.com/uc?id=19A4UI8fCQnFd1Z3aONYNrf2jYsCcoFn4",
  "https://drive.google.com/uc?id=1C2ZX7bRSM04DZ9tKTT3l4oj4Qi2Fbkdt",
  "https://drive.google.com/uc?id=1A1zlmgOTsPoJHmyXDm4T49cmjSbTLgg0",
  "https://drive.google.com/uc?id=18tOHBnG_vrnG_io6Kgj1LPI36-7mDsBy",
  "https://drive.google.com/uc?id=19fhL4nvaVT2ehz93W0DPRVocrczSljaF",
  "https://drive.google.com/uc?id=1AixGc0pxlmpmgHYu5wAbDlYHv2whRqDg",
  "https://drive.google.com/uc?id=1BMuw5bV5I100iACo52fGujoL5vQDlRVA",
  "https://drive.google.com/uc?id=1BenMV3N13x80P-hEG4G8u5opRxm6Vlfc",
  "https://drive.google.com/uc?id=1AUlNoTFOWKSFhRPpjv1KCv48MGpd8r0C",
  "https://drive.google.com/uc?id=1AIeMHRnwQ0SUN0TiPQ32UHyx9eL9cicL",
  "https://drive.google.com/uc?id=1BAMLpNMZQaHhWNKIsjCDFAdTnQvhuQh7",
  "https://drive.google.com/uc?id=1BoUF2w17L9XGnqlqG3JibQr7iP7Anmqs",
  "https://drive.google.com/uc?id=1Bk_ITSsW_RAVKniu69RYVMpqZAT7kABl",
  "https://drive.google.com/uc?id=19erDLH1W5-rOvUHOBNpg0Ur0lS3O88a8",
  "https://drive.google.com/uc?id=1A-yFTjlvltRjyDZEnyQrpmZsYgLQRTbi",
  "https://drive.google.com/uc?id=192VVIzLzmh4hTekLiL_7PeleZUCs5uj3",
  "https://drive.google.com/uc?id=19TcB5dAvlS3-47WWFKvXgZrNlG7l0r0o",
  "https://drive.google.com/uc?id=19gPSfV0_Dx1tE8bOYciUICS7Wk9h4x-l",
  "https://drive.google.com/uc?id=1AHFuEHZ2NhYPaiZDAQZVvZHHuu1DQR13",
  "https://drive.google.com/uc?id=1AcGr8oNrQUxpO8FTBvypImLJu6u0Nehh",
  "https://drive.google.com/uc?id=19cTN8R1si-0a-2HHRl51531B9LeUVGgi",
  "https://drive.google.com/uc?id=1BC7jTudYN-6_BKks4GZwjK3CDFKNtftG",
  "https://drive.google.com/uc?id=19TBwM2CfPgzZ7bNOtbnQxptwHEn03stv",
  "https://drive.google.com/uc?id=1BR50XoBRpCv1oN9WrfPTYx8fNWjSy0Ql"
];


/*
╔══════════════════════════════════╗
║          💬 CAPTIONS             ║
╚══════════════════════════════════╝
*/

const captions = [
  "🔥 আজকের মুডটা একটু অন্যরকম! 😎",
  "👀 শেষ পর্যন্ত দেখো কিন্তু! 🔥",
  "😏 বেশি কিছু বলবো না... ভিডিওটাই দেখো!",
  "🙈 চুপচাপ দেখো, কাউকে বলো না! 🤫",
  "🎬 আজকের স্পেশাল ভিডিও — Enjoy! ❤️",
  "😎 𝗠𝗢𝗢𝗗 𝗢𝗡 • 𝗩𝗜𝗗𝗘𝗢 𝗣𝗟𝗔𝗬 🔥",
  "👑 𝗝𝗨𝗦𝗧 𝗙𝗢𝗥 𝗬𝗢𝗨 ❤️",
  "🔥 Random Video Drop 😎",
  "👀 ভিডিওটা মিস করো না!",
  "🥰 ভালো লাগলে একটা ❤️ React দিও!"
];


/*
╔══════════════════════════════════╗
║        📥 DOWNLOAD SYSTEM        ║
╚══════════════════════════════════╝
*/

async function downloadVideo(url, filePath) {

  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
    timeout: 120000,
    maxContentLength: 200 * 1024 * 1024,
    maxBodyLength: 200 * 1024 * 1024
  });

  const writer = fs.createWriteStream(filePath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {

    writer.on("finish", resolve);

    writer.on("error", reject);

    response.data.on("error", reject);
  });
}


/*
╔══════════════════════════════════╗
║             🚀 RUN               ║
║          🔐 ADMIN ONLY           ║
╚══════════════════════════════════╝
*/

module.exports.run = async function ({ api, event }) {

  const { threadID, messageID } = event;

  const cacheDir = path.join(__dirname, "cache");

  await fs.ensureDir(cacheDir);

  const filePath = path.join(
    cacheDir,
    `hot_${Date.now()}.mp4`
  );

  try {

    /*
    ⏳ Loading Reaction
    */

    api.setMessageReaction(
      "⏳",
      messageID,
      () => {},
      true
    );


    /*
    🎲 Random Video নির্বাচন
    */

    const video =
      videos[Math.floor(Math.random() * videos.length)];


    /*
    💬 Random Caption নির্বাচন
    */

    const caption =
      captions[Math.floor(Math.random() * captions.length)];


    /*
    📥 Video Download
    */

    await downloadVideo(video, filePath);


    /*
    🔥 Success Reaction
    */

    api.setMessageReaction(
      "🔥",
      messageID,
      () => {},
      true
    );


    /*
    📤 Video Send
    */

    api.sendMessage(
      {
        body:
`╭━━━〔 👑 𝗛𝗢𝗧 𝗩𝗜𝗗𝗘𝗢 〕━━━╮

${caption}

╰━━━〔 🔥 𝗘𝗡𝗝𝗢𝗬 〕━━━╯

👑 𝗕𝗢𝗧 : 𝗛𝗥𝗜𝗗𝗢𝗬 𝗕𝗢𝗧
💫 𝗖𝗥𝗘𝗗𝗜𝗧𝗦 : হৃদয় হাসান শান্ত
🔐 𝗔𝗗𝗠𝗜𝗡 𝗢𝗡𝗟𝗬`,
        attachment: fs.createReadStream(filePath)
      },

      threadID,

      () => {

        /*
        🗑️ 15 সেকেন্ড পর Cache File Delete
        */

        setTimeout(async () => {

          try {
            await fs.remove(filePath);
          } catch (e) {}

        }, 15000);
      }
    );

  } catch (error) {

    /*
    ╔══════════════════════════════════╗
    ║            ❌ ERROR              ║
    ╚══════════════════════════════════╝
    */

    console.error(
      "HOT2.JS ERROR:",
      error.message
    );


    /*
    ❌ Error Reaction
    */

    api.setMessageReaction(
      "❌",
      messageID,
      () => {},
      true
    );


    /*
    ⚠️ Error Message
    */

    api.sendMessage(
`╭━━━〔 ❌ 𝗘𝗥𝗥𝗢𝗥 〕━━━╮

⚠️ ভিডিও পাঠানো সম্ভব হয়নি!

🔄 কিছুক্ষণ পর আবার চেষ্টা করুন।

🔐 এই কমান্ডটি শুধু Admin-এর জন্য।

╰━━━〔 𝗛𝗥𝗜𝗗𝗢𝗬 𝗕𝗢𝗧 〕━━━╯`,
      threadID
    );


    /*
    🗑️ Error হলেও Cache পরিষ্কার করা
    */

    try {
      await fs.remove(filePath);
    } catch (e) {}

  }
};
