export interface Settings {
  //// SETUP ////

  /**
   *
   */
  feeds: Array<FeedSettings>;

  /**
   * Directory used as storage
   *   Defaults to `data`
   */
  dataDirectory?: string;

  /**
   * Directory used to store rss feeds
   *   Defaults to `www`
   */
  feedsWwwDirectory?: string;
}

export interface FeedSettings {
  id: string;
  url: string;
  maxEntries: number;
  filters: {
    titleMatch: string; // RegExp
  };
  append: boolean;
}
