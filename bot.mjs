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

bot.on("/start", (msg) => {
  let replyMarkup = bot.inlineKeyboard([
    [
      bot.inlineButton("schedule", { callback: "schedule" }),
      bot.inlineButton("stop", { callback: "stop" }),
    ],
  ]);

  return bot.sendMessage(chatId, "Menu", { replyMarkup });
});
cron.schedule("* * * * * *", () => {
  bot.sendMessage(chatId, Date.now() + "");
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
  return;
});

// Inline button callback
bot.on(["/schedule", "/stop"], (msg) => {
  return bot.sendMessage(chatId, msg.text + "From callback");
});

bot.on("/stop", (msg) => {
  tasks.filter((task) => task.id == chatId).forEach((task) => task.stop());
  tasks = tasks.filter((task) => task.id !== chatId);
  return;
});

export default bot;
