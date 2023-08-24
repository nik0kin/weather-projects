/* eslint-disable no-console */
import { mkdirSync } from 'fs';
import { join } from 'path';
import schedule from 'node-schedule';
import { Settings, setSettings } from './settings';
import { checkFeed } from './check-feed';

export async function startWatcher(userSettings: Settings) {
  const settings: Required<Settings> = {
    dataDirectory: 'data',
    ...userSettings,
  };
  setSettings(settings);

  // Make sure directories exist
  mkdirSync(join(__dirname, '..', settings.dataDirectory), { recursive: true });

  console.log('Checking feed for NHC Altantic Outlook RSS changes');
  await checkFeed();

  // Start node-schedule to check the rss feed
  /* const job = */ schedule.scheduleJob('*/5 * * * *', function () {
    checkFeed();
  });
  console.log('Started scheduled checks for NHC Altantic Outlook RSS changes');
}
