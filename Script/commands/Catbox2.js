const axios = require("axios");

const getBase = async () => {
  const res = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json",
    { timeout: 15000 }
  );

  if (!res.data || !res.data.mahmud) {
    throw new Error("Base API URL পাওয়া যায়নি");
  }

  return res.data.mahmud;
};

module.exports = {
  config: {
    name: "catbox2",
    aliases: ["cb", "catbox"],
    version: "2.0.0",
    author: "হৃদয় হাসান শান্ত",
    countDown: 10,
    role: 0,

    description: {
      bn: "ছবি/ভিডিও/মিডিয়া ফাইলকে Catbox লিংকে রূপান্তর করে",
      en: "Convert image/video/media into a Catbox link"
    },

    category: "tools",

    guide: {
      bn: "{pn} — কোনো ছবি বা ভিডিওতে Reply করে ব্যবহার করুন",
      en: "{pn} — Reply to an image or video"
    }
  },

  langs: {
    bn: {
      noMedia:
        "╭━━━〔 ⚠️ CATBOX 〕━━━╮\n" +
        "┃ 📸 একটি ছবি/ভিডিওতে\n" +
        "┃ ↳ Reply করে আবার চেষ্টা করো!\n" +
        "╰━━━━━━━━━━━━━━━━━━╯",

      uploading:
        "╭━━━〔 ⏳ UPLOADING 〕━━━╮\n" +
        "┃ 📤 মিডিয়া আপলোড হচ্ছে...\n" +
        "┃ একটু অপেক্ষা করো 🐱\n" +
        "╰━━━━━━━━━━━━━━━━━━━━╯",

      success:
        "╭━━━〔 ✅ CATBOX LINK 〕━━━╮\n" +
        "┃ 🔗 %1\n" +
        "╰━━━━━━━━━━━━━━━━━━━━━━╯",

      error:
        "╭━━━〔 ❌ ERROR 〕━━━╮\n" +
        "┃ %1\n" +
        "╰━━━━━━━━━━━━━━━━━━╯"
    }
  },

  onStart: async function ({ api, event, message, getLang }) {
    // Reply attachment আছে কিনা চেক
    if (
      event.type !== "message_reply" ||
      !event.messageReply ||
      !event.messageReply.attachments ||
      event.messageReply.attachments.length === 0
    ) {
      return message.reply(getLang("noMedia"));
    }

    try {
      // Loading reaction
      api.setMessageReaction(
        "⏳",
        event.messageID,
        () => {},
        true
      );

      const attachment = event.messageReply.attachments[0];

      if (!attachment.url) {
        throw new Error("মিডিয়া ফাইলের URL পাওয়া যায়নি");
      }

      const attachmentUrl = attachment.url;

      // Upload message
      await message.reply(getLang("uploading"));

      // Base API
      const baseUrl = await getBase();

      // Catbox API request
      const response = await axios.get(
        `${baseUrl}/api/catbox`,
        {
          params: {
            url: attachmentUrl
          },
          timeout: 100000
        }
      );

      if (
        response.data &&
        response.data.status === true &&
        response.data.link
      ) {
        const link = response.data.link;

        // Success reaction
        api.setMessageReaction(
          "✅",
          event.messageID,
          () => {},
          true
        );

        return message.reply(getLang("success", link));
      }

      throw new Error(
        response.data?.error || "API থেকে valid link পাওয়া যায়নি"
      );

    } catch (error) {
      console.error("[CATBOX2 ERROR]", error);

      api.setMessageReaction(
        "❌",
        event.messageID,
        () => {},
        true
      );

      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Unknown error";

      return message.reply(
        getLang("error", errorMessage)
      );
    }
  }
};
