/**
 * ╔════════════════════════════════════════════════════════╗
 * ║                                                        ║
 * ║                 🩸 GROUP HIDE v3.0 ⛓️                 ║
 * ║                                                        ║
 * ║              🤫  M I R A I  S T Y L E  🤫            ║
 * ║                                                        ║
 * ║  👑 Creator  : হৃদয় হাসান শান্ত                        ║
 * ║  🤖 Platform : Mirai Bot                               ║
 * ║  ⚡ Version  : 3.0.0                                   ║
 * ║  🩸 Style    : Long Blank Message                     ║
 * ║                                                        ║
 * ╚════════════════════════════════════════════════════════╝
 */

module.exports.config = {
  name: "hide",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "হৃদয় হাসান শান্ত",
  description: "Stylish group hide/blank message",
  commandCategory: "Fun",
  usages: "🤫",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {

  /*
   * ╔══════════════════════════════════════╗
   * ║       🩸 HIDE MESSAGE SYSTEM        ║
   * ╚══════════════════════════════════════╝
   *
   * 🤫 Hidden Style Activated
   */

  const gap = "\n".repeat(80);

  const hideMessage =
`🩸
⛓️
${gap}
🩸
⛓️
${gap}
🩸
⛓️
${gap}
🩸
⛓️
${gap}
🩸
⛓️`;

  try {
    await api.sendMessage(hideMessage, event.threadID);
  } catch (error) {
    console.error("GROUP HIDE ERROR:", error);
  }
};
