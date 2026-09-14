const fs = require("fs-extra");
const path = require("path");
const request = require("request");

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//        ⚡ HRIDAY PREFIX SYSTEM ⚡
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermssion: 0,

  credits: "💫 হৃদয় হাসান শান্ত 💫",

  description:
    "Display system prefix, group prefix and bot information",

  commandCategory: "INFORMATION",

  usages: "",

  cooldowns: 5
};

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 TRIGGER WORDS
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const triggerWords = [

  "prefix",
  "mprefix",
  "mpre",
  "pre",
  "prefix?",
  "bot prefix",
  "what is the prefix",
  "what prefix",
  "what prefix bot",

  "bot name",
  "what is bot",
  "what is the bot",

  "how to use bot",
  "how use bot",
  "how use the bot",

  "bot not working",
  "bot is offline",
  "bot offline",
  "bot not talking",

  "where is bot",
  "where are the bots",
  "bot dead",
  "bots dead",

  "prefx",
  "prfix",
  "perfix",
  "freefix",

  "daulenh",
  "dấu lệnh",

  "where prefix",
  "show prefix",
  "show bot prefix",
  "show my prefix"

];

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 RANDOM ICON
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function randomIcon() {

  const icons = [
    "⚡",
    "✨",
    "💫",
    "🌟",
    "🚀",
    "🤖",
    "💎",
    "🎀"
  ];

  return icons[
    Math.floor(
      Math.random() * icons.length
    )
  ];
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 HANDLE EVENT
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports.handleEvent = async ({
  event,
  api,
  Threads
}) => {

  try {

    const {
      threadID,
      messageID,
      body
    } = event;

    if (!body) return;

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📂 THREAD DATA
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    let dataThread;

    try {

      dataThread =
        await Threads.getData(
          threadID
        );

    } catch (e) {

      dataThread = {
        data: {},
        threadInfo: {}
      };

    }

    const data =
      dataThread?.data || {};

    const threadSetting =
      global.data.threadData.get(
        String(threadID)
      ) || {};

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ⚡ PREFIX
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const systemPrefix =
      global.config.PREFIX || "/";

    const groupPrefix =
      threadSetting.PREFIX ||
      systemPrefix;

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 👥 GROUP NAME
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const groupName =
      dataThread?.threadInfo?.threadName ||
      data?.threadName ||
      "Unnamed Group";

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🔎 CHECK MESSAGE
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const lowerBody =
      String(body)
        .trim()
        .toLowerCase();

    if (
      !triggerWords.includes(
        lowerBody
      )
    ) {
      return;
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🤖 BOT NAME
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const botName =
      global.config.BOTNAME ||
      "𝐇𝐑𝐈𝐃𝐀𝐘 𝐁𝐎𝐓";

    const ownerName =
      global.config.Xrahat_Name ||
      "হৃদয় হাসান শান্ত";

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 💬 MESSAGE
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const messageBody = `╭━━━━━━━━━━━━━━━━━━━━╮
┃ ${randomIcon()} 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 ${randomIcon()}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🤖 𝐁𝐎𝐓: ${botName}
┃ 👑 𝐎𝐖𝐍𝐄𝐑: ${ownerName}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🌐 𝐒𝐘𝐒𝐓𝐄𝐌 𝐏𝐑𝐄𝐅𝐈𝐗
┃ ➜ ${systemPrefix}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 💬 𝐆𝐑𝐎𝐔𝐏 𝐏𝐑𝐄𝐅𝐈𝐗
┃ ➜ ${groupPrefix}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 👥 𝐆𝐑𝐎𝐔𝐏
┃ ➜ ${groupName}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ⚡ 𝐔𝐒𝐀𝐆𝐄
┃ ➜ ${groupPrefix}help
┃ ➜ ${groupPrefix}help <command>
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 💫 𝐃𝐄𝐕: হৃদয় হাসান শান্ত
╰━━━━━━━━━━━━━━━━━━━━╯`;

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🖼️ PREFIX GIF
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const gifs =
      (
        global.client &&
        Array.isArray(
          global.client.prefixGifs
        )
      )
        ? global.client.prefixGifs
        : [];

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📩 SEND WITHOUT GIF
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if (gifs.length === 0) {

      return api.sendMessage(
        messageBody,
        threadID,
        messageID
      );

    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎲 RANDOM GIF
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const gifUrl =
      gifs[
        Math.floor(
          Math.random() *
          gifs.length
        )
      ];

    const gifPath =
      path.join(
        __dirname,
        `prefix_${Date.now()}_${Math.floor(
          Math.random() * 99999
        )}.gif`
      );

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📥 DOWNLOAD GIF
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    request(
      {
        url: encodeURI(gifUrl),
        timeout: 15000
      }
    )
      .pipe(
        fs.createWriteStream(
          gifPath
        )
      )

      .on(
        "close",
        () => {

          if (
            !fs.existsSync(
              gifPath
            )
          ) {

            return api.sendMessage(
              messageBody,
              threadID,
              messageID
            );

          }

          api.sendMessage(
            {
              body: messageBody,

              attachment:
                fs.createReadStream(
                  gifPath
                )
            },

            threadID,

            (error) => {

              try {

                if (
                  fs.existsSync(
                    gifPath
                  )
                ) {

                  fs.unlinkSync(
                    gifPath
                  );

                }

              } catch (cleanupError) {

                console.error(
                  "[PREFIX] Cleanup error:",
                  cleanupError.message
                );

              }

              if (error) {

                console.error(
                  "[PREFIX] Send error:",
                  error.message
                );

              }

            },

            messageID
          );

        }
      )

      .on(
        "error",
        (error) => {

          console.error(
            "[PREFIX] GIF error:",
            error.message
          );

          try {

            if (
              fs.existsSync(
                gifPath
              )
            ) {

              fs.unlinkSync(
                gifPath
              );

            }

          } catch (e) {}

          api.sendMessage(
            messageBody,
            threadID,
            messageID
          );

        }
      );
  }

  catch (error) {

    console.error(
      "[PREFIX] System error:",
      error
    );

  }
};

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 COMMAND RUN
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports.run = async () => {
  return;
};
