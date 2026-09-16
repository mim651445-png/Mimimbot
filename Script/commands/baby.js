/**
 * ╔════════════════════════════════════════════════════╗
 * ║                 𝐁𝐀𝐁𝐘 𝐀𝐈 — 𝐕𝟒.𝟕                  ║
 * ║          Fast Messenger AI Chat Module            ║
 * ║                                                    ║
 * ║  Developer : হৃদয় হাসান শান্ত                      ║
 * ║  Version   : 4.7                                   ║
 * ║  Features  : Always Active / Font Style / AI Chat ║
 * ╚════════════════════════════════════════════════════╝
 */

const axios = require("axios");

// =====================================================
// TRIGGERS
// =====================================================

const triggers = [
    "baby",
    "bby",
    "babu",
    "bbu",
    "jan",
    "bot",
    "জান",
    "জানু",
    "বেবি",
    "Ẫḱtẫř Miḿ",
    "Mim",
    "hinata"
];

// =====================================================
// API BASE URL
// =====================================================

const baseApiUrl = async () => {
    try {
        const response = await axios.get(
            "https://raw.githubusercontent.com/mahmud-aura/HINATA/main/baseApiUrl.json",
            { timeout: 15000 }
        );

        if (!response.data?.mahmud) {
            throw new Error("API URL not found.");
        }

        return String(response.data.mahmud).replace(/\/+$/, "");
    } catch (error) {
        // ERROR: Failed to load API base URL
        console.error(
            "[BABY ERROR] Base API:",
            error.response?.data || error.message
        );
        throw new Error("Baby API is unavailable.");
    }
};

// =====================================================
// SAFE REPLY SAVE
// =====================================================

function saveReply(info, author, text) {
    try {
        if (
            info?.messageID &&
            global.GoatBot?.onReply &&
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
        // ERROR: Could not save reply handler
        console.error("[BABY ERROR] Reply:", error.message);
    }
}

// =====================================================
// API REQUEST
// =====================================================

async function getBabyResponse(text, attachments = []) {
    try {
        const baseURL = await baseApiUrl();

        const response = await axios.post(
            `${baseURL}/api/baby?text=${encodeURIComponent(text)}&font=3`,
            { attachments },
            { timeout: 30000 }
        );

        return response.data?.reply ||
            "দুঃখিত 🥹 কোনো response পাওয়া যায়নি।";
    } catch (error) {
        // ERROR: Baby API request failed
        console.error(
            "[BABY ERROR] API:",
            error.response?.data || error.message
        );

        return "Baby এখন একটু ব্যস্ত 🥹 একটু পরে আবার বলো।";
    }
}

// =====================================================
// RANDOM REPLIES
// =====================================================

const randomMessage = [
    "বলো কি বলবা, সবার সামনে বলবা নাকি? 🤭🤏",
    "হটাৎ আমাকে মনে পড়লো? 🙄",
    "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤",
    "খাওয়া দাওয়া করসো? 🙄",
    "আরে Bolo, কেমন আছো? 😚",
    "আমাকে ডাকলে আমি শুনছি 😼",
    "বলো, কী করতে পারি তোমার জন্য? 😌",
    "হুমম... বলো তো 👀",
    "এত ডাকাডাকি কেন? 😹",
    "আমি এখানে আছি 🫶",
    "হঠাৎ আমাকে মনে পড়লো নাকি? 🤭",
    "বলো Baby, কী হয়েছে? 🥺",
    "জি বলো 🐤",
    "কী খবর তোমার? 🌸",
    "আমাকে ডাকছো কেন? 😑",
    "হুম, শুনছি তো 😼",
    "আজ কেমন আছো? 😊",
    "একটু আস্তে ডাকো 😹",
    "বলো, কী নিয়ে কথা বলবে? 👀"
];

// =====================================================
// CONFIG
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

    version: "4.7",
    author: "হৃদয় হাসান শান্ত",

    countDown: 0,
    role: 0,

    description:
        "Always active fast AI chat with multiple font styles.",

    category: "chat",

    guide: {
        en:
            "{pn} [anyMessage]\n" +
            "teach [YourMessage] - [Reply]\n" +
            "remove [YourMessage] - [index]\n" +
            "rm [YourMessage] - [index]\n" +
            "msg [YourMessage]\n" +
            "list\n" +
            "list all [page]\n" +
            "edit [YourMessage] - [NewMessage]"
    }
};

// =====================================================
// ON START
// =====================================================

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const uid = event.senderID;

    try {
        const rawMsg = args.join(" ");
        const msg = rawMsg.toLowerCase();

        // ---------------------------------------------
        // EMPTY COMMAND
        // ---------------------------------------------

        if (!args[0]) {
            const reply =
                randomMessage[
                    Math.floor(
                        Math.random() * randomMessage.length
                    )
                ];

            const result = await new Promise(resolve => {
                api.sendMessage(
                    reply,
                    event.threadID,
                    (err, info) => resolve({ err, info }),
                    event.messageID
                );
            });

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
            const input = rawMsg.replace(/^teach\s+/i, "");

            const [trigger, ...responsesArr] =
                input.split(" - ");

            const responses =
                responsesArr.join(" - ").trim();

            if (!trigger || !responses) {
                return api.sendMessage(
                    "❌ | teach [question] - [response1, response2,...]",
                    event.threadID,
                    event.messageID
                );
            }

            try {
                const baseURL = await baseApiUrl();

                const response = await axios.post(
                    `${baseURL}/api/teach`,
                    {
                        trigger: trigger.trim(),
                        responses,
                        userID: uid
                    },
                    { timeout: 30000 }
                );

                let userName = "Unknown User";

                try {
                    userName =
                        (await usersData.getName(
                            parseInt(uid, 10)
                        )) || "Unknown User";
                } catch {
                    // ERROR: Could not get teacher name
                }

                return api.sendMessage(
                    `✅ Replies added!\n\n` +
                    `💬 Question: "${trigger}"\n` +
                    `📝 Reply: "${responses}"\n` +
                    `👤 Teacher: ${userName}\n` +
                    `📊 Total: ${response.data?.count || 0}\n\n` +
                    `👑 Developer: হৃদয় হাসান শান্ত`,
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                // ERROR: Teach request failed
                console.error(
                    "[BABY ERROR] Teach:",
                    error.response?.data || error.message
                );

                return api.sendMessage(
                    "❌ Teach request failed.",
                    event.threadID,
                    event.messageID
                );
            }
        }

        // ---------------------------------------------
        // REMOVE / RM
        // ---------------------------------------------

        if (command === "remove" || command === "rm") {
            const input = rawMsg.replace(
                /^(remove|rm)\s+/i,
                ""
            );

            const [trigger, index] =
                input.split(" - ");

            if (
                !trigger ||
                !index ||
                isNaN(index)
            ) {
                return api.sendMessage(
                    "❌ | remove [question] - [index]",
                    event.threadID,
                    event.messageID
                );
            }

            try {
                const baseURL = await baseApiUrl();

                const response = await axios.delete(
                    `${baseURL}/api/teach/remove`,
                    {
                        data: {
                            trigger: trigger.trim(),
                            index: parseInt(index, 10)
                        },
                        timeout: 30000
                    }
                );

                return api.sendMessage(
                    response.data?.message ||
                    "✅ Reply removed.",
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                // ERROR: Remove request failed
                console.error(
                    "[BABY ERROR] Remove:",
                    error.response?.data || error.message
                );

                return api.sendMessage(
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
                const isAll =
                    args[1] === "all" ||
                    !isNaN(args[1]);

                const endpoint =
                    isAll ? "/list/all" : "/list";

                const baseURL = await baseApiUrl();

                const response = await axios.get(
                    `${baseURL}/api/teach${endpoint}`,
                    { timeout: 30000 }
                );

                if (!isAll) {
                    return api.sendMessage(
                        response.data?.message ||
                        "No list found.",
                        event.threadID,
                        event.messageID
                    );
                }

                let page =
                    parseInt(
                        !isNaN(args[1])
                            ? args[1]
                            : args[2],
                        10
                    ) || 1;

                const limit = 100;
                const rawData =
                    response.data?.data || {};

                const teachers = [];

                for (
                    const userID of Object.keys(rawData)
                ) {
                    let name = "Unknown";

                    try {
                        name =
                            (await usersData.getName(
                                parseInt(userID, 10)
                            )) || "Unknown";
                    } catch (error) {
                        // ERROR: Teacher name lookup failed
                    }

                    teachers.push({
                        name,
                        value: rawData[userID]
                    });
                }

                teachers.sort(
                    (a, b) => b.value - a.value
                );

                const totalPages =
                    Math.ceil(
                        teachers.length / limit
                    ) || 1;

                if (page < 1) page = 1;
                if (page > totalPages)
                    page = totalPages;

                const start =
                    (page - 1) * limit;

                const paginatedData =
                    teachers.slice(
                        start,
                        start + limit
                    );

                let message =
                    "👑 𝐁𝐀𝐁𝐘 𝐓𝐄𝐀𝐂𝐇𝐄𝐑𝐒\n\n";

                for (
                    let i = 0;
                    i < paginatedData.length;
                    i++
                ) {
                    const teacher =
                        paginatedData[i];

                    message +=
                        `${start + i + 1}. ` +
                        `${teacher.name}: ` +
                        `${teacher.value}\n`;
                }

                message +=
                    `\n📄 Page: ${page}/${totalPages}` +
                    `\n👥 Total Teacher: ${teachers.length}` +
                    `\n👑 Developer: হৃদয় হাসান শান্ত`;

                return api.sendMessage(
                    message,
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                // ERROR: List request failed
                console.error(
                    "[BABY ERROR] List:",
                    error.response?.data || error.message
                );

                return api.sendMessage(
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
            const input = rawMsg.replace(
                /^edit\s+/i,
                ""
            );

            const [
                oldTrigger,
                ...newArr
            ] = input.split(" - ");

            const newResponse =
                newArr.join(" - ").trim();

            if (!oldTrigger || !newResponse) {
                return api.sendMessage(
                    "❌ | edit [question] - [newResponse]",
                    event.threadID,
                    event.messageID
                );
            }

            try {
                const baseURL = await baseApiUrl();

                await axios.put(
                    `${baseURL}/api/teach/edit`,
                    {
                        oldTrigger:
                            oldTrigger.trim(),
                        newResponse
                    },
                    { timeout: 30000 }
                );

                return api.sendMessage(
                    `✅ Edited successfully!\n\n` +
                    `🔹 Question: ${oldTrigger}\n` +
                    `🔹 New Reply: ${newResponse}\n\n` +
                    `👑 Developer: হৃদয় হাসান শান্ত`,
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                // ERROR: Edit request failed
                console.error(
                    "[BABY ERROR] Edit:",
                    error.response?.data || error.message
                );

                return api.sendMessage(
                    "❌ Edit request failed.",
                    event.threadID,
                    event.messageID
                );
            }
        }

        // ---------------------------------------------
        // MSG / MESSAGE
        // ---------------------------------------------

        if (
            command === "message" ||
            command === "msg"
        ) {
            const searchTrigger =
                args.slice(1).join(" ").trim();

            if (!searchTrigger) {
                return api.sendMessage(
                    "❌ Please provide a message to search.",
                    event.threadID,
                    event.messageID
                );
            }

            try {
                const baseURL = await baseApiUrl();

                const response = await axios.get(
                    `${baseURL}/api/teach/msg`,
                    {
                        params: {
                            userMessage:
                                `msg ${searchTrigger}`
                        },
                        timeout: 30000
                    }
                );

                return api.sendMessage(
                    response.data?.message ||
                    "No message found.",
                    event.threadID,
                    event.messageID
                );
            } catch (error) {
                // ERROR: Message search failed
                console.error(
                    "[BABY ERROR] MSG:",
                    error.response?.data || error.message
                );

                return api.sendMessage(
                    error.response?.data?.error ||
                    "❌ Message search failed.",
                    event.threadID,
                    event.messageID
                );
            }
        }

        // ---------------------------------------------
        // NORMAL BABY AI
        // ---------------------------------------------

        const attachments =
            event.attachments || [];

        const response =
            await getBabyResponse(
                msg,
                attachments
            );

        const result =
            await new Promise(resolve => {
                api.sendMessage(
                    response,
                    event.threadID,
                    (err, info) =>
                        resolve({ err, info }),
                    event.messageID
                );
            });

        if (!result.err) {
            saveReply(
                result.info,
                uid,
                response
            );
        }

    } catch (error) {
        // ERROR: Main onStart handler
        console.error(
            "[BABY ERROR] onStart:",
            error.response?.data || error.message
        );

        return api.sendMessage(
            "❌ Baby command error.",
            event.threadID,
            event.messageID
        );
    }
};

// =====================================================
// ON REPLY
// =====================================================

module.exports.onReply = async ({
    api,
    event
}) => {
    if (event.type !== "message_reply")
        return;

    try {
        const text =
            String(event.body || "")
                .toLowerCase();

        const attachments =
            event.attachments || [];

        const response =
            await getBabyResponse(
                text,
                attachments
            );

        const result =
            await new Promise(resolve => {
                api.sendMessage(
                    response,
                    event.threadID,
                    (err, info) =>
                        resolve({ err, info }),
                    event.messageID
                );
            });

        if (!result.err) {
            saveReply(
                result.info,
                event.senderID,
                response
            );
        }

    } catch (error) {
        // ERROR: Reply handler failed
        console.error(
            "[BABY ERROR] onReply:",
            error.response?.data || error.message
        );
    }
};

// =====================================================
// ON CHAT / ALWAYS ACTIVE
// =====================================================

module.exports.onChat = async ({
    api,
    event
}) => {
    try {
        const body =
            event.body
                ? String(event.body).toLowerCase()
                : "";

        if (!body) return;

        const matchedTrigger =
            triggers.find(word =>
                body === word ||
                body.startsWith(word + " ")
            );

        if (!matchedTrigger) return;

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
        }

        // ---------------------------------------------
        // REMOVE TRIGGER
        // ---------------------------------------------

        const text =
            body
                .replace(
                    new RegExp(
                        `^${matchedTrigger}\\s*`,
                        "i"
                    ),
                    ""
                )
                .trim();

        const attachments =
            event.attachments || [];

        // ---------------------------------------------
        // ONLY "BABY" = RANDOM RESPONSE
        // ---------------------------------------------

        if (
            !text &&
            attachments.length === 0
        ) {
            const babyMessage =
                randomMessage[
                    Math.floor(
                        Math.random() *
                        randomMessage.length
                    )
                ];

            const result =
                await new Promise(resolve => {
                    api.sendMessage(
                        babyMessage,
                        event.threadID,
                        (err, info) =>
                            resolve({
                                err,
                                info
                            }),
                        event.messageID
                    );
                });

            if (!result.err) {
                saveReply(
                    result.info,
                    event.senderID,
                    babyMessage
                );
            }

            return;
        }

        // ---------------------------------------------
        // AI RESPONSE
        // ---------------------------------------------

        const response =
            await getBabyResponse(
                text || body,
                attachments
            );

        const result =
            await new Promise(resolve => {
                api.sendMessage(
                    response,
                    event.threadID,
                    (err, info) =>
                        resolve({
                            err,
                            info
                        }),
                    event.messageID
                );
            });

        if (!result.err) {
            saveReply(
                result.info,
                event.senderID,
                response
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
