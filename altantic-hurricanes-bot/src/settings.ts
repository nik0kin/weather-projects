export interface Settings {
  //// SETUP ////

  /**
   * Directory used as storage
   *   Defaults to `data`
   */
  dataDirectory?: string;
}

let currentSettings: Required<Settings>;

export const setSettings = (s: Required<Settings>) => {
  currentSettings = s;
};
export const getSettings = () => {
  if (currentSettings) return currentSettings;
  else throw new Error('calling getSettings before currentSettings is set');
};
