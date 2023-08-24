/* eslint-disable no-console */
import { readFileSync } from 'fs';
import { join } from 'path';

import { startWatcher } from './watcher';
import { Settings } from './settings';

let settings: Settings;

// bootstrap
try {
  settings = JSON.parse(readFileSync(join(__dirname, '..', 'config.json'), { encoding: 'utf8' }));
} catch (e) {
  const errorMsg = 'Failed loading config.json';
  console.error(errorMsg, e);
  throw new Error(errorMsg);
}

startWatcher(settings);
