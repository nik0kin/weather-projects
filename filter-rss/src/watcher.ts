/* eslint-disable no-console */
import { mkdirSync } from 'fs';
import { join } from 'path';
import schedule from 'node-schedule';
import { Settings } from './settings';
import { handleFeed } from './handle-feed';

export async function startWatcher(userSettings: Settings) {
  const settings: Required<Settings> = {
    dataDirectory: 'data',
    feedsWwwDirectory: 'www',
    ...userSettings,
  };

  // Make sure directories exist
  mkdirSync(join(__dirname, '..', settings.dataDirectory), { recursive: true });
  mkdirSync(join(__dirname, '..', settings.feedsWwwDirectory), { recursive: true });

  // Start node-schedule for each feed
  settings.feeds.forEach(async (feed) => {
    await handleFeed(feed, settings);
    const job = schedule.scheduleJob('*/10 * * * *', function () {
      handleFeed(feed, settings);
    });
    console.log('Started watch for [' + feed.id + '] ' + feed.url);
  });
}
