/**
 * ╔══════════════════════════════════════════╗
 *        👋 𝐇𝐈 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 𝐒𝐘𝐒𝐓𝐄𝐌
 * ╠══════════════════════════════════════════╣
 * 👑 Creator : হৃদয় হাসান শান্ত
 * 🤖 Version : 2.0.0
 * 🎀 System  : Auto Hi Sticker
 * ╚══════════════════════════════════════════╝
 */

module.exports.config = {
  name: "hi",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Auto reply with random hi sticker",
  commandCategory: "QTV BOX",
  usages: "[ hi / hello / hai ]",
  cooldowns: 5
};


// ═════════════════════════════════════════════
// 👋 AUTO HI TRIGGER
// ═════════════════════════════════════════════

module.exports.handleEvent = async ({ event, api, Users }) => {

  try {

    if (!event.body || !event.threadID || !event.senderID)
      return;

    const KEY = [
      "hello",
      "hi",
      "hai",
      "hii",
      "hiii",
      "helo",
      "hello bro",
      "hello bot",
      "hê nhô",
      "chào",
      "chao",
      "hí",
      "híí",
      "hì",
      "hìì",
      "lô",
      "লো",
      "হাই",
      "হাইই",
      "হ্যালো"
    ];

    const text = event.body
      .trim()
      .toLowerCase();

    if (!KEY.includes(text))
      return;


    // ═══════════════════════════════════════════
    // 🎀 THREAD CONTROL
    // ═══════════════════════════════════════════

    const threadData =
      global.data.threadData.get(event.threadID) || {};

    if (
      typeof threadData["hi"] !== "undefined" &&
      threadData["hi"] === false
    ) {
      return;
    }


    // ═══════════════════════════════════════════
    // 🎨 STICKER COLLECTION
    // ═══════════════════════════════════════════

    const stickers = [

      "526214684778630",
      "526220108111421",
      "526220308111401",
      "526220484778050",
      "526220691444696",
      "526220814778017",
      "526220978111334",
      "526221104777988",
      "526221318111300",
      "526221564777942",
      "526221711444594",
      "526221971444568",

      "2041011389459668",
      "2041011569459650",
      "2041011726126301",
      "2041011836126290",
      "2041011952792945",
      "2041012109459596",
      "2041012262792914",
      "2041012406126233",
      "2041012539459553",
      "2041012692792871",
      "2041014432792697",
      "2041014739459333",
      "2041015016125972",
      "2041015182792622",
      "2041015329459274",
      "2041015422792598",
      "2041015576125916",
      "2041017422792398",
      "2041020049458802",
      "2041020599458747",
      "2041021119458695",
      "2041021609458646",
      "2041022029458604",
      "2041022286125245"

    ];


    const sticker =
      stickers[
        Math.floor(Math.random() * stickers.length)
      ];


    // ═══════════════════════════════════════════
    // 👤 USER NAME
    // ═══════════════════════════════════════════

    let name = "Friend";

    try {
      name = await Users.getNameUser(event.senderID);
    } catch (e) {
      name = "Friend";
    }


    const mentions = [
      {
        tag: name,
        id: event.senderID
      }
    ];


    // ═══════════════════════════════════════════
    // 💬 REPLY
    // ═══════════════════════════════════════════

    const messages = [
      `👋 Hey ${name}!`,
      `🌸 Hello ${name}!`,
      `🥹 Hi ${name}!`,
      `✨ Hiii ${name}!`,
      `😎 Hai ${name}!`,
      `🎀 Hello there ${name}!`
    ];

    const reply =
      messages[
        Math.floor(Math.random() * messages.length)
      ];


    const msg = {
      body: `╭━━━〔 👋 𝐇𝐈 〕━━━╮

${reply}

╰━━━━━━━━━━━━━━━━╯`,
      mentions
    };


    // ═══════════════════════════════════════════
    // 📤 SEND MESSAGE + STICKER
    // ═══════════════════════════════════════════

    api.sendMessage(
      msg,
      event.threadID,
      (err) => {

        if (err)
          return console.error("HI MESSAGE ERROR:", err);

        setTimeout(() => {

          api.sendMessage(
            {
              sticker: sticker
            },
            event.threadID
          );

        }, 300);

      },
      event.messageID
    );

  } catch (error) {

    console.error(
      "❌ HI SYSTEM ERROR:",
      error
    );

  }
};


// ═════════════════════════════════════════════
// ⚙️ LANGUAGE
// ═════════════════════════════════════════════

module.exports.languages = {

  vi: {
    on: "Bật",
    off: "Tắt",
    successText: `${this.config.name} thành công`
  },

  en: {
    on: "ON",
    off: "OFF",
    successText: "success!"
  }

};


// ═════════════════════════════════════════════
// 🎛️ COMMAND TOGGLE
// ═════════════════════════════════════════════

module.exports.run = async ({
  event,
  api,
  Threads,
  getText
}) => {

  const {
    threadID,
    messageID
  } = event;

  try {

    const threadData =
      await Threads.getData(threadID);

    const data =
      threadData.data || {};


    if (
      typeof data["hi"] === "undefined"
    ) {
      data["hi"] = true;
    } else {
      data["hi"] = !data["hi"];
    }


    await Threads.setData(threadID, {
      data
    });


    global.data.threadData.set(
      threadID,
      data
    );


    const status =
      data["hi"]
        ? "🟢 ON"
        : "🔴 OFF";


    return api.sendMessage(
      `╭━━━〔 👋 𝐇𝐈 𝐒𝐘𝐒𝐓𝐄𝐌 〕━━━╮

${status}

✨ Auto Hi Sticker:
${data["hi"] ? "✅ Enabled" : "❌ Disabled"}

╰━━━━━━━━━━━━━━━━━━━━╯`,
      threadID,
      messageID
    );

  } catch (error) {

    console.error(
      "❌ HI TOGGLE ERROR:",
      error
    );

    return api.sendMessage(
      "❌ Hi system toggle করতে সমস্যা হয়েছে!",
      threadID,
      messageID
    );

  }
};
