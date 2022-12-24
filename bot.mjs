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
cron.schedule("* * * * * *", () => {
  bot.sendMessage(chatId, Date.now() + "");
});

bot.on("/start", (msg) => {
  let replyMarkup = bot.keyboard([["/cron", "/stop"]], { resize: true });
  bot.sendMessage(chatId, "Menu", { replyMarkup });
});

// Inline button callback
bot.on("callbackQuery", (msg) => {
  if (msg.data === "cron") {
    const wakeUp = cron.schedule("30 6 * * *", () => {
      bot.sendMessage(chatId, "Wake up!");
    });
    const exercise = cron.schedule("* * * * * *", () => {
      bot.sendMessage(chatId, Date.now() + "");
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
