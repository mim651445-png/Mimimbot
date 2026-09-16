/**
 * ╔════════════════════════════════════════════════════╗
 * ║                    𝐁𝐀𝐁𝐘 𝐀𝐈 🤖                   ║
 * ║              Messenger Chat AI Module             ║
 * ║                                                    ║
 * ║  Developer : হৃদয় হাসান শান্ত                      ║
 * ║  Version   : 2.0.0                                ║
 * ║  Credit    : হৃদয় হাসান শান্ত                      ║
 * ╚════════════════════════════════════════════════════╝
 */

const axios = require("axios");

// =====================================================
// ERROR: If axios is missing, install it with:
// npm install axios
// =====================================================

const triggers = [
    "baby",
    "bby",
    "babu",
    "বট",
    "jan",
    "bot",
    "জান",
    "জানু",
    "বেবি",
    "mim",
    "নিঝুম",
    "মিম"
];

// =====================================================
// API BASE URL
// =====================================================

const baseApiUrl = async () => {
    try {
        const response = await axios.get(
            "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json",
            { timeout: 15000 }
        );

        if (!response.data || !response.data.mahmud) {
            throw new Error("Base API URL not found.");
        }

        return String(response.data.mahmud).replace(/\/+$/, "");
    } catch (error) {
        // ERROR: Could not load base API URL
        console.error(
            "[BABY ERROR] Base API:",
            error.response?.data || error.message
        );
        throw new Error("Baby API is currently unavailable.");
    }
};

// =====================================================
// RANDOM REPLIES
// =====================================================

const randomReplies = [
    "Bolo baby 🥺",
    "কি বলবে বলো 😼",
    "হুম, বলো শুনছি 🤭",
    "আমাকে ডাকছো কেন? 😑",
    "জি বলো 🐤",
    "কী খবর? 😌",
    "আচ্ছা বলো তো 😺",
    "হুমম... আমি শুনছি 👀",
    "এত ডাকাডাকি কেন? 😹",
    "বলো, কী দরকার? 🤍",
    "হঠাৎ আমাকে মনে পড়লো? 🙄",
    "Assalamualaikum 🐤",
    "খাওয়া-দাওয়া করছো? 😋",
    "আজ কেমন আছো? 🌸",
    "বলো কী করতে পারি তোমার জন্য 😌",
    "আরে বলো, কী হয়েছে? 🤭",
    "আমি এখানে আছি 😼",
    "কী নিয়ে কথা বলবে? 👀",
    "হুম, শুনছি তো 🫶",
    "একটু আস্তে ডাকো 😹"
];

// =====================================================
// HELPER: SEND MESSAGE
// =====================================================

function send(api, message, threadID, messageID) {
    return new Promise((resolve) => {
        api.sendMessage(
            message,
            threadID,
            (err, info) => resolve({ err, info }),
            messageID
        );
    });
}

// =====================================================
// HELPER: SAVE REPLY
// =====================================================

function saveReply(info, author, text) {
    try {
        if (
            info &&
            info.messageID &&
            global.GoatBot &&
            global.GoatBot.onReply &&
            typeof global.GoatBot.onReply.set === "function"
        ) {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: "baby",
                type: "reply",
                messageID: info.messageID,
                author,
                text
            });
        }
    } catch (error) {
        // ERROR: Reply map could not be saved
        console.error("[BABY ERROR] Save reply:", error.message);
    }
}

// =====================================================
// HELPER: GET AI RESPONSE
// =====================================================

async function getBotResponse(text, attachments = []) {
    try {
        const baseURL = await baseApiUrl();

        const response = await axios.post(
            `${baseURL}/api/hinata`,
            {
                text,
                style: 3,
                attachments
            },
            {
                timeout: 30000
            }
        );

        if (response.data && response.data.message) {
            return response.data.message;
        }

        // ERROR: API returned no message
        return "দুঃখিত 🥹 কোনো উত্তর পাওয়া যায়নি।";
    } catch (error) {
        // ERROR: AI response request failed
        console.error(
            "[BABY ERROR] AI:",
            error.response?.data || error.message
        );

        return "Baby API এখন একটু ব্যস্ত 🥹 পরে আবার চেষ্টা করো।";
    }
}

// =====================================================
// COMMAND CONFIG
// =====================================================

module.exports.config = {
    name: "baby",
    aliases: [
        "bby",
        "bbu",
        "jan",
        "janu",
        "wifey",
        "bot",
        "hinata",
        "hina"
    ],
    version: "2.0.0",
    author: "হৃদয় হাসান শান্ত",
    countDown: 0,
    role: 0,
    description: "Fast all-in-one Baby AI Chat",
    category: "chat",

    guide: {
        en:
            "{pn} [message]\n" +
            "teach [question] - [response]\n" +
            "remove [question] - [index]\n" +
            "msg [question]\n" +
            "list\n" +
            "list all\n" +
            "edit [question] - [new response]"
    }
};

// =====================================================
// ON START
// =====================================================

module.exports.onStart = async function ({
    api,
    event,
    args,
    usersData
}) {
    const uid = event.senderID;

    try {
        // ---------------------------------------------
        // ERROR: Empty command
        // ---------------------------------------------

        if (!args || args.length === 0) {
            const reply =
                randomReplies[
                    Math.floor(Math.random() * randomReplies.length)
                ];

            const result = await send(
                api,
                reply,
                event.threadID,
                event.messageID
            );

            if (!result.err) {
                saveReply(result.info, uid, reply);
            }

            return;
        }

        const command = String(args[0]).toLowerCase();

        // ---------------------------------------------
        // TEACH
        // ---------------------------------------------

        if (command === "teach") {
            const input = args.slice(1).join(" ");
            const parts = input.split(" - ");

            const trigger = parts.shift()?.trim();
            const responses = parts.join(" - ").trim();

            if (!trigger || !responses) {
                return send(
                    api,
                    "❌ ব্যবহার:\nteach [question] - [response]",
                    event.threadID,
                    event.messageID
                );
            }

            try {
                const baseURL = await baseApiUrl();

                const response = await axios.post(
                    `${baseURL}/api/jan/teach`,
                    {
                        trigger: trigger.toLowerCase(),
                        responses,
                        userID: uid
                    },
                    { timeout: 30000 }
                );

                let userName = "Unknown User";

                try {
                    if (usersData && typeof usersData.getName === "function") {
                        userName =
                            (await usersData.getName(uid)) ||
                            "Unknown User";
                    }
                } catch {
                    // ERROR: Could not fetch teacher name
                }

                return send(
                    api,
                    `✅ Reply added successfully!\n\n` +
                        `💬 Question: ${trigger}\n` +
                        `📝 Reply: ${responses}\n` +
                        `👤 Teacher: ${userName}\n` +
                        `📊 Total: ${response.data?.count || 0}\n\n` +
                        `👑 Developer: হৃদয় হাসান শান্ত`,
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                // ERROR: Teach API failed
                console.error(
                    "[BABY ERROR] Teach:",
                    error.response?.data || error.message
                );

                return send(
                    api,
                    "❌ Teach request failed. API unavailable.",
                    event.threadID,
                    event.messageID
                );
            }
        }

        // ---------------------------------------------
        // REMOVE
        // ---------------------------------------------

        if (command === "remove" || command === "rm") {
            const input = args.slice(1).join(" ");
            const parts = input.split(" - ");

            const trigger = parts.shift()?.trim();
            const index = parts.shift()?.trim();

            if (
                !trigger ||
                !index ||
                Number.isNaN(Number(index))
            ) {
                return send(
                    api,
                    "❌ ব্যবহার:\nremove [question] - [index]",
                    event.threadID,
                    event.messageID
                );
            }

            try {
                const baseURL = await baseApiUrl();

                const response = await axios.delete(
                    `${baseURL}/api/jan/remove`,
                    {
                        data: {
                            trigger: trigger.toLowerCase(),
                            index: parseInt(index, 10)
                        },
                        timeout: 30000
                    }
                );

                return send(
                    api,
                    `✅ ${response.data?.message || "Reply removed successfully."}`,
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                // ERROR: Remove API failed
                console.error(
                    "[BABY ERROR] Remove:",
                    error.response?.data || error.message
                );

                return send(
                    api,
                    "❌ Remove request failed.",
                    event.threadID,
                    event.messageID
                );
            }
        }

        // ---------------------------------------------
        // LIST
        // ---------------------------------------------

        if (command === "list") {
            try {
                const baseURL = await baseApiUrl();

                const all = String(args[1] || "").toLowerCase() === "all";

                const endpoint = all
                    ? "/list/all"
                    : "/list";

                const response = await axios.get(
                    `${baseURL}/api/jan${endpoint}`,
                    { timeout: 30000 }
                );

                if (!all) {
                    return send(
                        api,
                        response.data?.message ||
                            "📋 No list information found.",
                        event.threadID,
                        event.messageID
                    );
                }

                const data = response.data?.data || {};

                const entries = Object.entries(data)
                    .sort((a, b) => Number(b[1]) - Number(a[1]))
                    .slice(0, 100);

                let message =
                    "╭━━━〔 👑 BABY TEACHERS 〕━━━╮\n\n";

                for (let i = 0; i < entries.length; i++) {
                    const [userID, count] = entries[i];

                    let name = "Unknown User";

                    try {
                        if (
                            usersData &&
                            typeof usersData.getName === "function"
                        ) {
                            name =
                                (await usersData.getName(userID)) ||
                                "Unknown User";
                        }
                    } catch {
                        // ERROR: Teacher name unavailable
                    }

                    message +=
                        `${i + 1}. ${name} — ${count}\n`;
                }

                message +=
                    `\n╰━━━━━━━━━━━━━━━━━━━━╯\n` +
                    `👑 Developer: হৃদয় হাসান শান্ত`;

                return send(
                    api,
                    message,
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                // ERROR: List API failed
                console.error(
                    "[BABY ERROR] List:",
                    error.response?.data || error.message
                );

                return send(
                    api,
                    "❌ Could not load teacher list.",
                    event.threadID,
                    event.messageID
                );
            }
        }

        // ---------------------------------------------
        // EDIT
        // ---------------------------------------------

        if (command === "edit") {
            const input = args.slice(1).join(" ");
            const parts = input.split(" - ");

            const oldTrigger = parts.shift()?.trim();
            const newResponse = parts.join(" - ").trim();

            if (!oldTrigger || !newResponse) {
                return send(
                    api,
                    "❌ ব্যবহার:\nedit [question] - [newResponse]",
                    event.threadID,
                    event.messageID
                );
            }

            try {
                const baseURL = await baseApiUrl();

                await axios.put(
                    `${baseURL}/api/jan/edit`,
                    {
                        oldTrigger: oldTrigger.toLowerCase(),
                        newResponse
                    },
                    { timeout: 30000 }
                );

                return send(
                    api,
                    `✅ Edited successfully!\n\n` +
                        `🔹 Old: ${oldTrigger}\n` +
                        `🔹 New: ${newResponse}\n\n` +
                        `👑 হৃদয় হাসান শান্ত`,
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                // ERROR: Edit API failed
                console.error(
                    "[BABY ERROR] Edit:",
                    error.response?.data || error.message
                );

                return send(
                    api,
                    "❌ Edit request failed.",
                    event.threadID,
                    event.messageID
                );
            }
        }

        // ---------------------------------------------
        // MSG
        // ---------------------------------------------

        if (command === "msg") {
            const searchTrigger = args.slice(1).join(" ").trim();

            if (!searchTrigger) {
                return send(
                    api,
                    "❌ Please provide a message to search.",
                    event.threadID,
                    event.messageID
                );
            }

            try {
                const baseURL = await baseApiUrl();

                const response = await axios.get(
                    `${baseURL}/api/jan/msg`,
                    {
                        params: {
                            userMessage: `msg ${searchTrigger}`
                        },
                        timeout: 30000
                    }
                );

                return send(
                    api,
                    response.data?.message ||
                        "No message found.",
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                // ERROR: MSG API failed
                console.error(
                    "[BABY ERROR] Msg:",
                    error.response?.data || error.message
                );

                return send(
                    api,
                    error.response?.data?.error ||
                        "❌ Message search failed.",
                    event.threadID,
                    event.messageID
                );
            }
        }

        // ---------------------------------------------
        // NORMAL AI CHAT
        // ---------------------------------------------

        const text = args.join(" ").trim();

        if (!text) {
            return send(
                api,
                "Bolo baby 🥺",
                event.threadID,
                event.messageID
            );
        }

        const botResponse = await getBotResponse(
            text.toLowerCase(),
            event.attachments || []
        );

        const result = await send(
            api,
            botResponse,
            event.threadID,
            event.messageID
        );

        if (!result.err) {
            saveReply(result.info, uid, botResponse);
        }
    } catch (error) {
        // ERROR: Main onStart handler
        console.error(
            "[BABY ERROR] onStart:",
            error.response?.data || error.message
        );

        return send(
            api,
            "❌ Baby command error. Please try again.",
            event.threadID,
            event.messageID
        );
    }
};

// =====================================================
// ON REPLY
// =====================================================

module.exports.onReply = async function ({ api, event }) {
    if (event.type !== "message_reply") return;

    try {
        const text =
            String(event.body || "meow")
                .toLowerCase()
                .trim();

        const botResponse = await getBotResponse(
            text,
            event.attachments || []
        );

        const result = await send(
            api,
            botResponse,
            event.threadID,
            event.messageID
        );

        if (!result.err) {
            saveReply(
                result.info,
                event.senderID,
                botResponse
            );
        }
    } catch (error) {
        // ERROR: onReply handler
        console.error(
            "[BABY ERROR] onReply:",
            error.response?.data || error.message
        );

        return send(
            api,
            "❌ Reply processing failed 🥹",
            event.threadID,
            event.messageID
        );
    }
};

// =====================================================
// ON CHAT / NO PREFIX
// =====================================================

module.exports.onChat = async function ({
    api,
    event
}) {
    try {
        if (!event.body) return;

        if (event.type === "message_reply") return;

        const message = String(event.body)
            .toLowerCase()
            .trim();

        if (!message) return;

        const matchedTrigger = triggers.find(
            (word) =>
                message === word ||
                message.startsWith(word + " ")
        );

        if (!matchedTrigger) return;

        const attachments = event.attachments || [];

        // ---------------------------------------------
        // REACTION
        // ---------------------------------------------

        try {
            api.setMessageReaction(
                "🪽",
                event.messageID,
                () => {},
                true
            );
        } catch (error) {
            // ERROR: Reaction failed
            console.error(
                "[BABY ERROR] Reaction:",
                error.message
            );
        }

        // ---------------------------------------------
        // TYPING INDICATOR
        // ---------------------------------------------

        try {
            api.sendTypingIndicator(
                event.threadID,
                true
            );
        } catch (error) {
            // ERROR: Typing indicator failed
            console.error(
                "[BABY ERROR] Typing:",
                error.message
            );
        }

        // ---------------------------------------------
        // ONLY TRIGGER = RANDOM REPLY
        // ---------------------------------------------

        const cleanText = message
            .substring(matchedTrigger.length)
            .trim();

        if (!cleanText && attachments.length === 0) {
            const reply =
                randomReplies[
                    Math.floor(
                        Math.random() *
                            randomReplies.length
                    )
                ];

            const result = await send(
                api,
                reply,
                event.threadID,
                event.messageID
            );

            if (!result.err) {
                saveReply(
                    result.info,
                    event.senderID,
                    reply
                );
            }

            return;
        }

        // ---------------------------------------------
        // TRIGGER + MESSAGE = AI RESPONSE
        // ---------------------------------------------

        const botResponse = await getBotResponse(
            cleanText || message,
            attachments
        );

        const result = await send(
            api,
            botResponse,
            event.threadID,
            event.messageID
        );

        if (!result.err) {
            saveReply(
                result.info,
                event.senderID,
                botResponse
            );
        }
    } catch (error) {
        // ERROR: Main onChat handler
        console.error(
            "[BABY ERROR] onChat:",
            error.response?.data || error.message
        );
    }
};

// =====================================================
// END OF BABY.JS
// Developer: হৃদয় হাসান শান্ত
// =====================================================
