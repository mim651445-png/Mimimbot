/**
 * ╔══════════════════════════════════════════════════════╗
 * ║              👋 JOIN NOTIFY SYSTEM                  ║
 * ║          Welcome Image + Profile + Caption          ║
 * ║                                                      ║
 * ║             👑 হৃদয় হাসান শান্ত                     ║
 * ╚══════════════════════════════════════════════════════╝
 */

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");


/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 ⚙️ COMMAND CONFIG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

module.exports.config = {
  name: "joinNotify",

  // ⚠️ এই নাম পরিবর্তন করবেন না
  // পরিবর্তন করলে event command কাজ নাও করতে পারে
  eventType: ["log:subscribe"],

  version: "4.1.0",

  credits: "👑 হৃদয় হাসান শান্ত",

  description:
    "Welcome image with API frame, profile circles, text overlay and caption"
};


/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🌐 API CONFIG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

const API_JSON_URL =
  "https://raw.githubusercontent.com/Rahat-Islam10/-Rahat-Boss-/refs/heads/main/api.json";


/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🎨 TEXT LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

const TEXT_LAYOUT = {

  addedName: {
    x: 809.9,
    y: 494.2,
    fontSize: 89,
    color: "#0f2f2b",
    bold: true,
    italic: false
  },

  groupName: {
    x: 1096.4,
    y: 620.1,
    fontSize: 48,
    color: "#6b7280",
    bold: true,
    italic: false
  },

  memberCount: {
    x: 1089.9,
    y: 736.4,
    fontSize: 56,
    color: "#6b7280",
    bold: true,
    italic: false
  },

  adderName: {
    x: 1017.6,
    y: 791.3,
    fontSize: 56,
    color: "#6b7280",
    bold: true,
    italic: false
  }

};


/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  ✏️ DRAW TEXT FUNCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function drawAnchoredText(ctx, text, layout) {

  if (!text) text = "";

  const {
    x,
    y,
    fontSize,
    color,
    bold,
    italic
  } = layout;

  const style =
    `${italic ? "italic " : ""}` +
    `${bold ? "bold " : ""}` +
    `${fontSize}px Arial`;

  ctx.font = style;
  ctx.fillStyle = color;

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  const firstCharWidth =
    ctx.measureText(text[0] || "").width;

  const startX =
    x - firstCharWidth / 2;

  ctx.fillText(text, startX, y);
}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    📡 GET API LIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function getApiList(commandName) {

  try {

    const res = await axios.get(
      API_JSON_URL,
      {
        timeout: 15000
      }
    );

    const data = res.data || {};
    const cmdData = data[commandName];

    if (!cmdData || !cmdData.api) {
      return [];
    }

    return [
      cmdData.api,
      ...(cmdData.backupApis || [])
    ].filter(Boolean);

  } catch (error) {

    console.error(
      "❌ API JSON Error:",
      error.message
    );

    throw error;
  }
}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              🖼️ FETCH WELCOME IMAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function fetchFromAPI(
  uid,
  name,
  adderId,
  adderName,
  groupName,
  memberCount,
  credit,
  apiList
) {

  for (const base of apiList) {

    const cleanBase =
      base.replace(/\/+$/, "");

    const url =
      `${cleanBase}/api/frame` +
      `?uid=${uid}` +
      `&name=${encodeURIComponent(name)}` +
      `&adderId=${adderId}` +
      `&adderName=${encodeURIComponent(adderName)}` +
      `&groupName=${encodeURIComponent(groupName)}` +
      `&memberCount=${memberCount}` +
      `&credit=${encodeURIComponent(credit)}`;

    try {

      const res = await axios.get(
        url,
        {
          timeout: 30000,
          responseType: "json"
        }
      );

      if (
        res.data &&
        res.data.image &&
        res.data.caption
      ) {

        return {

          image: Buffer.from(
            res.data.image,
            "base64"
          ),

          caption: res.data.caption
        };
      }

    } catch (error) {

      console.error(
        `⚠️ API Failed: ${cleanBase}`,
        error.message
      );

      continue;
    }
  }

  throw new Error(
    "কোনো ওয়ার্কিং Welcome API পাওয়া যায়নি"
  );
}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    👋 JOIN EVENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

module.exports.run = async function ({
  api,
  event
}) {

  try {

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🔍 EVENT CHECK
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (
      !event.logMessageData ||
      !event.logMessageData.addedParticipants
    ) {
      return;
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🤖 BOT ADDED CHECK
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    const botID =
      api.getCurrentUserID();

    const botAdded =
      event.logMessageData.addedParticipants.some(
        user =>
          user.userFbId == botID
      );

    if (botAdded) {

      const botPrefix =
        global.config.PREFIX || "/";

      const botName =
        global.config.BOTNAME ||
        "👑 হৃদয় হাসান শান্ত";

      try {

        await api.changeNickname(
          `[ ${botPrefix} ] • ${botName}`,
          event.threadID,
          botID
        );

      } catch (error) {

        console.error(
          "⚠️ Nickname Change Error:",
          error.message
        );
      }

      return api.sendMessage(
        "╭━━━━━━━━━━━━━━━━━━╮\n" +
        "      🤖 𝗕𝗢𝗧 𝗝𝗢𝗜𝗡𝗘𝗗\n" +
        "╰━━━━━━━━━━━━━━━━━━╯\n\n" +
        "💚 গ্রুপে এড দেওয়ার জন্য\n" +
        "   ধন্যবাদ তোমাকে! 🙃🫣\n\n" +
        "👑 𝗢𝗪𝗡𝗘𝗥: হৃদয় হাসান শান্ত",
        event.threadID
      );
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    📌 GROUP INFO
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    const threadID =
      event.threadID;

    const threadInfo =
      await api.getThreadInfo(threadID);

    const groupName =
      threadInfo.threadName ||
      "এই গ্রুপ";

    const memberCount =
      threadInfo.participantIDs.length;

    const addedUsers =
      event.logMessageData.addedParticipants;


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    👤 ADDER INFO
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    const adderID =
      event.author;

    let adderName =
      "Unknown";

    try {

      const adderInfo =
        await api.getUserInfo(adderID);

      if (
        adderInfo &&
        adderInfo[adderID] &&
        adderInfo[adderID].name
      ) {

        adderName =
          adderInfo[adderID].name;
      }

    } catch (error) {

      console.error(
        "⚠️ Adder Info Error:",
        error.message
      );
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🌐 LOAD API
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    let apiList;

    try {

      apiList =
        await getApiList("welcome");

    } catch (error) {

      return api.sendMessage(
        `╭━━━━━━━━━━━━━━━━━━╮\n` +
        `     ⚠️ 𝗔𝗣𝗜 𝗘𝗥𝗥𝗢𝗥\n` +
        `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
        `❌ API লিস্ট লোড করা যায়নি।\n` +
        `\n` +
        `📌 Error: ${error.message}`,
        threadID
      );
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🏷️ MENTIONS
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    const mentions =
      addedUsers.map(user => ({
        tag: user.fullName,
        id: user.userFbId
      }));


    const attachments = [];
    let finalCaption = "";


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🖼️ CREATE IMAGE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    for (const user of addedUsers) {

      const uid =
        user.userFbId;

      const name =
        user.fullName;

      let baseImage;
      let caption;


      try {

        const result =
          await fetchFromAPI(
            uid,
            name,
            adderID,
            adderName,
            groupName,
            memberCount,
            module.exports.config.credits,
            apiList
          );

        baseImage =
          result.image;

        caption =
          result.caption;

        if (!finalCaption) {
          finalCaption =
            caption;
        }

      } catch (error) {

        console.error(
          `❌ Welcome API Failed (${name}):`,
          error.message
        );

        continue;
      }


      /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🎨 CANVAS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

      const outPath =
        path.join(
          __dirname,
          `welcome_${uid}.png`
        );

      try {

        const img =
          await loadImage(baseImage);

        const canvas =
          createCanvas(
            1586,
            992
          );

        const ctx =
          canvas.getContext("2d");


        /* Background */
        ctx.drawImage(
          img,
          0,
          0,
          1586,
          992
        );


        /* Text Overlay */

        drawAnchoredText(
          ctx,
          name,
          TEXT_LAYOUT.addedName
        );

        drawAnchoredText(
          ctx,
          groupName,
          TEXT_LAYOUT.groupName
        );

        drawAnchoredText(
          ctx,
          String(memberCount),
          TEXT_LAYOUT.memberCount
        );

        drawAnchoredText(
          ctx,
          adderName,
          TEXT_LAYOUT.adderName
        );


        /* Save Image */

        fs.writeFileSync(
          outPath,
          canvas.toBuffer("image/png")
        );


        attachments.push(
          fs.createReadStream(outPath)
        );

      } catch (error) {

        console.error(
          "❌ Canvas Render Error:",
          error.message
        );
      }
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    ❌ NO IMAGE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    if (attachments.length === 0) {

      return api.sendMessage(
        "╭━━━━━━━━━━━━━━━━━━╮\n" +
        "   ⚠️ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗙𝗔𝗜𝗟𝗘𝗗\n" +
        "╰━━━━━━━━━━━━━━━━━━╯\n\n" +
        "❌ Welcome image তৈরি করা যায়নি।\n" +
        "🔄 কিছুক্ষণ পর আবার চেষ্টা করুন।",
        threadID
      );
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    📤 SEND MESSAGE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    try {

      await api.sendMessage(
        {
          body:
            finalCaption ||
            "👋 Welcome to the group! ❤️",

          mentions,

          attachment:
            attachments
        },
        threadID
      );

    } catch (error) {

      console.error(
        "⚠️ Attachment Send Error:",
        error.message
      );

      /* Fallback: Text Only */

      await api.sendMessage(
        {
          body:
            finalCaption ||
            "👋 Welcome to the group! ❤️",

          mentions
        },
        threadID
      );
    }


    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🧹 AUTO CLEANUP
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    setTimeout(
      () => {

        for (const user of addedUsers) {

          const filePath =
            path.join(
              __dirname,
              `welcome_${user.userFbId}.png`
            );

          try {

            if (
              fs.existsSync(filePath)
            ) {

              fs.unlinkSync(
                filePath
              );
            }

          } catch (error) {

            console.error(
              "⚠️ File Delete Error:",
              error.message
            );
          }
        }

      },
      120000
    );


  } catch (error) {

    /*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🚨 MAIN ERROR
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    console.error(
      "❌ joinNotify Main Error:",
      error
    );

    try {

      await api.sendMessage(
        "╭━━━━━━━━━━━━━━━━━━╮\n" +
        "       🚨 𝗘𝗥𝗥𝗢𝗥\n" +
        "╰━━━━━━━━━━━━━━━━━━╯\n\n" +
        "⚠️ Welcome system-এ একটি সমস্যা হয়েছে।\n" +
        "🔧 Console log চেক করুন।\n\n" +
        "👑 𝗖𝗿𝗲𝗱𝗶𝘁: হৃদয় হাসান শান্ত",
        event.threadID
      );

    } catch (sendError) {

      console.error(
        "❌ Error Message Send Failed:",
        sendError.message
      );
    }
  }
};


/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 👑 END OF JOIN NOTIFY
              হৃদয় হাসান শান্ত
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
