import { writeFileSync } from 'fs';
import { join } from 'path';
import Parser from 'rss-parser';
import RSS from 'rss';
import { FeedSettings, Settings } from './settings';

const parser = new Parser();

export const handleFeed = async (feedSettings: FeedSettings, settings: Required<Settings>) => {
  // read RSS feed
  const feed = await parser.parseURL(feedSettings.url);

  // filter items
  const filteredItems = feed.items.filter((item) => {
    return item.title?.match(feedSettings.filters.titleMatch);
  });

  // create updated RSS feeds
  const newFeed = new RSS({
    title: (feed.title || '') + ' - Outlooks only',
    description: feed.description + '<br><br> Filtered & Rebroadcasted by nikok.in for ease of use',
    generator: 'Filtered by filter-rss w/ RSS for Node',
    feed_url: undefined as any,
    site_url: feed.link || '',
    pubDate: feed.pubDate,
    copyright: feed.copyright,
    managingEditor: feed.managingEditor,
    language: feed.language,
    webMaster: feed.webMaster,
    custom_elements: [
      {
        image: Object.entries((feed.image as any) || {}).map(([property, data]) => {
          return { [property]: data };
        }),
      },
    ],
  });

  filteredItems.forEach((item) => {
    newFeed.item({
      title: item.title as any,
      author: item.author,
      description: item.content || '',
      guid: item.guid,
      url: item.link as any,
      date: item.pubDate as any,
      custom_elements: [{ author: item.author }],
    });
  });

  // write updated RSS feeds
  const xml = newFeed
    .xml()
    .replace(/<guid isPermaLink="false"/g, '<guid isPermaLink="true"') // "rss" module has weird isPermaLink logic
    .replace(/\&amp;/g, '&'); // dont mess with guid link
  const writePath = join(__dirname, '..', settings.feedsWwwDirectory, feedSettings.id + '.xml');
  try {
    writeFileSync(writePath, xml, { encoding: 'utf8' });
  } catch (e) {
    const errorMsg = 'Failed to write feed to ' + writePath;
    console.error(errorMsg, e);
    throw new Error(errorMsg);
  }
};
