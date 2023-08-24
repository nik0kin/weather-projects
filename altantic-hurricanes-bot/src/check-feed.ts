// import { writeFileSync } from 'fs';
import { join } from 'path';
import Parser from 'rss-parser';
import { downloadImage } from './download-image';
import { getData, setData } from './fs-data-store';
import { getSettings } from './settings';

type RssItem = {
  [key: string]: any;
} & Parser.Item;

const feedUrl = 'https://rss.nikok.in/nhc/altantic-tropical-weather-outlook.xml';

const parser = new Parser();

export const checkFeed = async () => {
  // read RSS feed
  const feed = await parser.parseURL(feedUrl);

  // sort items
  const sortedItems = feed.items.sort((itemA, itemB) => {
    return new Date(itemB.date).getTime() - new Date(itemA.date).getTime();
  });
  const newestOutlook = sortedItems[0];

  if (!newestOutlook || !newestOutlook.guid)
    throw new Error('Missing outlook or guid ' + new Date());

  // check if it's been handled already
  const { lastPost } = await getData();
  if (lastPost?.rssGuid !== newestOutlook.guid) {
    await handleNewPost(newestOutlook);
  } else {
    // if nothing has been posted lately, boost last toot
    await boostLastPost();
  }
};

const silent = true;

const handleNewPost = async (outlookPost: RssItem) => {
  console.log('New Outlook ' + outlookPost.pubDate);

  await downloadImage(
    'https://www.nhc.noaa.gov/xgtwo/two_atl_7d0.png',
    join(__dirname, '..', getSettings().dataDirectory, 'two_atl_7d0.png'),
  );

  console.log(outlookPost);

  const postContent = outlookPost.contentSnippet || '';
  const postDate = postContent.split('\n')[6];

  let activeSystems: string = '';
  const disturbancesOther: string[] = [];

  const contentSplitByParagraph = postContent.split('\n\n');

  contentSplitByParagraph.forEach((paragraph) => {
    if (paragraph.includes('Active Systems:\n')) {
      activeSystems = paragraph;
    } else if (paragraph.includes(':\n')) {
      disturbancesOther.push(paragraph.split(':\n')[0]);
    }
  });

  const message =
    `Altantic 7-Day Tropical Weather Outlook - ${postDate}\n\n` +
    `${activeSystems}\n\n` +
    (disturbancesOther ? `Disturbances:\n- ${disturbancesOther.join('\n- ')}\n\n` : '') +
    'Latest Outlook: https://www.nhc.noaa.gov/gtwo.php';
  let postId = '';
  if (!silent) {
    // post fedi status
  } else {
    postId = 'silent';
    console.log(message);
  }

  // save lastPost data to store
  setData({
    lastPost: {
      rssGuid: outlookPost.guid || '',
      fediPostId: postId
    }
  });
};

const boostLastPost = async () => {
  console.log('TODO check if we should boost')
};
