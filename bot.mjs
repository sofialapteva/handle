import TeleBot from "telebot";
import * as dotenv from "dotenv";
import * as cron from "node-cron";
dotenv.config();
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on("text", (msg) => {
  msg.reply.text(JSON.stringify(msg));
});

// cron.schedule("0 9 * * MON", () => {
//   bot.sendMessage(12345678, "scheduled message");
// });
export default bot;
