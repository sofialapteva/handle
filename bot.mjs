import TeleBot from "telebot";
import * as dotenv from "dotenv";
dotenv.config();
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on("text", (msg) => msg.reply.text(msg.text));

export default bot;
