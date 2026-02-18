import { Messages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = 'fr';
  const messagesModule = (await import(
    `../messages/${locale}.json`
  )) as Messages;

  return {
    locale,
    messages: messagesModule.default as Messages,
  };
});
