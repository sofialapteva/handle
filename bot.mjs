import TeleBot from "telebot";
import * as dotenv from "dotenv";
import * as cron from "node-cron";
dotenv.config();
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.CHAT_ID || 0o0;
// #  ┌──────────── minute
// #  │ ┌────────── hour
// #  │ │ ┌──────── day of month
// #  │ │ │ ┌────── month
// #  │ │ │ │ ┌──── day of week
// #  │ │ │ │ │
// #  │ │ │ │ │
// #  * * * * *

let tasks = [];
bot.sendMessage(chatId, "Started");

bot.on("/start", (msg) => {
  let replyMarkup = bot.keyboard(
    [
      [
        bot.button("contact", "Your contact"),
        bot.button("location", "Your location"),
      ],
      ["/back", "/hide"],
    ],
    { resize: true }
  );
  bot.sendMessage(chatId, "Menu", { replyMarkup });

  replyMarkup = bot.keyboard(
    [
      ["/buttons", "/inlineKeyboard"],
      ["/start", "/hide"],
    ],
    { resize: true }
  );

  bot.sendMessage(chatId, "keyboard", { replyMarkup });
  replyMarkup = bot.inlineKeyboard([
    [
      bot.inlineButton("callback", { callback: "this_is_data" }),
      bot.inlineButton("inline", { inline: "some query" }),
    ],
    [bot.inlineButton("url", { url: "https://telegram.org" })],
  ]);

  return bot.sendMessage(msg.from.id, "Inline keyboard example.", {
    replyMarkup,
  });
});

bot.on("/schedule", (msg) => {
  bot.sendMessage(chatId, "Wake up!");
  const wakeUp = cron.schedule("30 6 * * *", () => {
    bot.sendMessage(chatId, "Wake up!");
  });
  const exercise = cron.schedule("* * * * * *", () => {
    bot.sendMessage(chatId, Date.now() + "");
  });
  tasks.push({ id: chatId, task: wakeUp }, { id: chatId, task: exercise });
});

// Inline button callback
bot.on("callbackQuery", (msg) => {
  console.log(msg.data);
  bot.sendMessage(chatId, msg.data);
});

bot.on("/stop", (msg) => {
  tasks.filter((task) => task.id == chatId).forEach((task) => task.stop());
  tasks = tasks.filter((task) => task.id !== chatId);
});

export default bot;
