import TeleBot from "telebot";
import * as dotenv from "dotenv";
import * as cron from "node-cron";
dotenv.config();
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.CHAT_ID;
// #  ┌──────────── minute
// #  │ ┌────────── hour
// #  │ │ ┌──────── day of month
// #  │ │ │ ┌────── month
// #  │ │ │ │ ┌──── day of week
// #  │ │ │ │ │
// #  │ │ │ │ │
// #  * * * * *

let tasks = [];
let replyMarkup = bot.keyboard([["/cron", "/stop"]], { resize: true });

bot.on("/start", (msg) => {
  cron.schedule("30 6 * * *", () => {
    bot.sendMessage(chatId, "Wake up!");
  });
});
// Inline button callback
bot.on("callbackQuery", (msg) => {
  bot.sendMessage(chatId, msg.data);
  if (msg.data === "cron") {
    const wakeUp = cron.schedule("30 6 * * *", () => {
      bot.sendMessage(chatId, "Wake up!");
    });
    const exercise = cron.schedule("* * * * * *", () => {
      bot.sendMessage(chatId, Date.now() + " each second");
    });
    tasks.push({ id: chatId, task: wakeUp }, { id: chatId, task: exercise });
    bot.sendMessage(chatId, "Starting cron work");
  }

  if (msg.data === "stop") {
    tasks.filter((task) => task.id == chatId).forEach((task) => task.stop());
    tasks = tasks.filter((task) => task.id !== chatId);
    bot.sendMessage(chatId, "Stopping cron work");
  }
});

export default bot;
