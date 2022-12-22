import TeleBot from "telebot";
import * as dotenv from "dotenv";
import * as cron from "node-cron";
dotenv.config();
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

// #  ┌──────────── minute
// #  │ ┌────────── hour
// #  │ │ ┌──────── day of month
// #  │ │ │ ┌────── month
// #  │ │ │ │ ┌──── day of week
// #  │ │ │ │ │
// #  │ │ │ │ │
// #  * * * * *

let tasks = [];

bot.on(["/start"], (msg) => {
  const wakeUp = cron.schedule("30 6 * * *", () => {
    bot.sendMessage(msg.from.id, "Wake up!");
  });
  const exercise = cron.schedule("* * * * *", () => {
    bot.sendMessage(msg.from.id, "Wake up!");
  });
  tasks.push(
    { id: msg.from.id, task: wakeUp },
    { id: msg.from.id, task: exercise }
  );
});

bot.on(["/stop"], (msg) => {
  tasks.filter((task) => task.id == msg.from.id).forEach((task) => task.stop());
  tasks = tasks.filter((task) => task.id !== msg.from.id);
});

export default bot;
