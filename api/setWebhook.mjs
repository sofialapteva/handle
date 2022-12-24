import { setWebhook } from "./telebot.mjs";
import bot from "../bot.mjs";

export default setWebhook(bot, "api/telegram.mjs");
