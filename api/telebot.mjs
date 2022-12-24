export const getHost = (hosts = {}, headers = {}) =>
  hosts[process?.env?.VERCEL_ENV] || headers?.["x-forwarded-host"];

export const setWebhookHandler = async (
  bot = {},
  path = "",
  hosts,
  { headers } = {},
  { json = (_) => _ } = {}
) =>
  json(
    await bot
      ?.setWebhook(`https://${getHost(hosts, headers)}/${path}`)
      .catch((_) => _)
  );

export const setWebhook = (bot, path, hosts) =>
  setWebhookHandler.bind(this, bot, path, hosts);

export const startHandler = async (
  bot = {},
  { body = {} } = {},
  { json = (_) => _ } = {}
) =>
  json(body?.update_id ? await bot?.receiveUpdates([body]) : { status: false });

export const start = (bot) => startHandler.bind(this, bot);
