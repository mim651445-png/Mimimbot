const fs = require("fs-extra");
const path = require("path");
const request = require("request");

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//        💫 HRIDAY HELP SYSTEM 💫
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports.config = {
  name: "help",
  version: "4.1.0",
  hasPermssion: 0,
  credits: "💫 হৃদয় হাসান শান্ত 💫",
  description: "Stylish random command help menu",
  commandCategory: "SYSTEM",
  usages: "[command name]",
  cooldowns: 5,

  envConfig: {
    autoUnsend: true,
    delayUnsend: 90
  }
};

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🖼️ HELP IMAGE
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const HELP_IMAGE =
  "https://i.imgur.com/CpXlZRS.jpeg";

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌐 LANGUAGE
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports.languages = {
  en: {
    moduleInfo: `╭━━━━━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🏷️ 𝐍𝐚𝐦𝐞: %1
┃ 📌 𝐔𝐬𝐚𝐠𝐞: %2
┃ 📖 𝐃𝐞𝐬𝐜: %3
┃ 🔐 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: %4
┃ 👨‍💻 𝐂𝐫𝐞𝐝𝐢𝐭: %5
┃ 📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: %6
┃ ⏱️ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰: %7s
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ⚡ 𝐏𝐫𝐞𝐟𝐢𝐱: %8
┃ 🤖 𝐁𝐨𝐭: %9
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 👑 𝐃𝐞𝐯: হৃদয় হাসান শান্ত
╰━━━━━━━━━━━━━━━━━━━━╯`
  }
};

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🖼️ DOWNLOAD HELP IMAGE
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function getHelpImage() {

  const imagePath = path.join(
    __dirname,
    `help_${Date.now()}_${Math.floor(
      Math.random() * 999999
    )}.jpeg`
  );

  try {

    await new Promise((resolve, reject) => {

      request(
        {
          url: HELP_IMAGE,
          encoding: null
        },
        (error, response, body) => {

          if (error)
            return reject(error);

          if (
            !response ||
            response.statusCode !== 200
          ) {
            return reject(
              new Error(
                `HTTP Status: ${
                  response
                    ? response.statusCode
                    : "Unknown"
                }`
              )
            );
          }

          fs.writeFileSync(
            imagePath,
            body
          );

          resolve();
        }
      );

    });

    return {

      attachments: [
        fs.createReadStream(imagePath)
      ],

      cleanup: () => {

        try {

          if (
            fs.existsSync(imagePath)
          ) {
            fs.unlinkSync(imagePath);
          }

        } catch (e) {}

      }

    };

  } catch (error) {

    console.error(
      "[HELP] Image download error:",
      error.message
    );

    return {

      attachments: [],

      cleanup: () => {}

    };
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔀 RANDOM / SHUFFLE SYSTEM
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function shuffleCommands(commands) {

  const arr = [...commands];

  for (
    let i = arr.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      arr[i],
      arr[j]
    ] = [
      arr[j],
      arr[i]
    ];
  }

  return arr;
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 RANDOM ICON
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function randomIcon() {

  const icons = [
    "🔹",
    "🔸",
    "✨",
    "⚡",
    "💫",
    "🌸",
    "🔥",
    "💎",
    "🌟",
    "🎀"
  ];

  return icons[
    Math.floor(
      Math.random() * icons.length
    )
  ];
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 RUN
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports.run = async function ({
  api,
  event,
  args,
  getText
}) {

  const { commands } = global.client;

  const {
    threadID,
    messageID
  } = event;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⚙️ PREFIX
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const threadSetting =
    global.data.threadData.get(
      threadID
    ) || {};

  const prefix =
    threadSetting.PREFIX ||
    global.config.PREFIX ||
    "/";

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔎 COMMAND INFORMATION
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (
    args[0] &&
    commands.has(
      args[0].toLowerCase()
    )
  ) {

    const cmd =
      commands.get(
        args[0].toLowerCase()
      );

    const msg = getText(
      "moduleInfo",

      cmd.config.name,

      cmd.config.usages ||
        "Not Provided",

      cmd.config.description ||
        "Not Provided",

      cmd.config.hasPermssion ??
        cmd.config.role ??
        0,

      cmd.config.credits ||
        "Unknown",

      cmd.config.commandCategory ||
        "OTHER",

      cmd.config.cooldowns ||
        0,

      prefix,

      global.config.BOTNAME ||
        "𝐇𝐑𝐈𝐃𝐀𝐘 𝐁𝐎𝐓"
    );

    try {

      const {
        attachments,
        cleanup
      } = await getHelpImage();

      return api.sendMessage(
        {
          body: msg,
          attachment: attachments
        },
        threadID,

        (err, info) => {

          cleanup();

          if (
            !err &&
            info &&
            module.exports.config
              .envConfig
              .autoUnsend
          ) {

            setTimeout(
              () => {

                if (
                  info.messageID
                ) {

                  api.unsendMessage(
                    info.messageID
                  );

                }

              },

              module.exports.config
                .envConfig
                .delayUnsend *
                1000
            );

          }

        },

        messageID
      );

    } catch (error) {

      console.error(
        "[HELP] Command info error:",
        error
      );

      return api.sendMessage(
        msg,
        threadID,
        messageID
      );
    }
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📂 CREATE COMMAND GROUPS
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const groups = {};
  const categoryDisplay = {};

  for (
    const [name, cmd]
    of commands
  ) {

    const rawCategory =
      (
        cmd.config
          .commandCategory ||
        "OTHER"
      ).trim() || "OTHER";

    const key =
      rawCategory.toLowerCase();

    if (!groups[key]) {

      groups[key] = [];

      categoryDisplay[key] =
        rawCategory.toUpperCase();

    }

    groups[key].push(name);
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎨 HELP HEADER
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  let body = `╭━━━━━━━━━━━━━━━━━━━━╮
┃   🤖 𝐇𝐑𝐈𝐃𝐀𝐘 𝐁𝐎𝐓 🤖
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐌𝐄𝐍𝐔 ✨
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 👨‍💻 𝐃𝐄𝐕: হৃদয় হাসান শান্ত
┃ ⚡ 𝐏𝐑𝐄𝐅𝐈𝐗: ${prefix}
┣━━━━━━━━━━━━━━━━━━━━┫`;

  let firstCategory = true;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔀 RANDOM CATEGORY COMMANDS
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  for (
    const cat of Object.keys(groups)
  ) {

    if (
      !groups[cat] ||
      groups[cat].length === 0
    ) {
      continue;
    }

    if (!firstCategory) {

      body +=
        `\n┣━━━━━━━━━━━━━━━━━━━━┫`;

    }

    body +=
      `\n┃ 📂 『 ${categoryDisplay[cat]} 』`;

    // 🔀 Shuffle commands
    const randomCommands =
      shuffleCommands(
        groups[cat]
      );

    randomCommands.forEach(
      (cmd) => {

        body +=
          `\n┃ ${randomIcon()} ${prefix}${cmd}`;

      }
    );

    firstCategory = false;
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📊 FOOTER
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  body += `
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 📊 𝐓𝐎𝐓𝐀𝐋: ${commands.size} COMMANDS
┃ ⚡ 𝐏𝐑𝐄𝐅𝐈𝐗: ${prefix}
┃ 👑 𝐎𝐖𝐍𝐄𝐑: হৃদয় হাসান শান্ত
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 💡 ${prefix}help <command>
┃ ❤️ Thanks for using Hriday Bot
╰━━━━━━━━━━━━━━━━━━━━╯`;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📤 SEND HELP MENU
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  try {

    const {
      attachments,
      cleanup
    } = await getHelpImage();

    api.sendMessage(
      {
        body: body,
        attachment: attachments
      },

      threadID,

      (err, info) => {

        cleanup();

        if (
          !err &&
          info &&
          module.exports.config
            .envConfig
            .autoUnsend
        ) {

          setTimeout(
            () => {

              if (
                info.messageID
              ) {

                api.unsendMessage(
                  info.messageID
                );

              }

            },

            module.exports.config
              .envConfig
              .delayUnsend *
              1000
          );

        }

      },

      messageID
    );

  } catch (error) {

    console.error(
      "[HELP] Help menu error:",
      error
    );

    api.sendMessage(
      body,
      threadID,
      messageID
    );
  }
};
