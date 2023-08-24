import fs from 'fs/promises';
import { join } from 'path';
import { getSettings } from './settings';

interface StoredData {
  lastPost?: {
    rssGuid: string;
    fediPostId: string;
  };
}

const getFilePath = () => {
  return join(__dirname, '..', getSettings().dataDirectory, 'data.json');
};

// Set data by saving JSON to a file
export const setData = async (data: StoredData) => {
  const filename = getFilePath();
  try {
    const jsonData = JSON.stringify(data, null, 2); // 2-space indentation
    await fs.writeFile(filename, jsonData, 'utf-8');
    console.log(`Data saved to ${filename}`);
  } catch (error) {
    console.error(`Error saving data to ${filename}: ${(error as Error)?.message}`);
    throw error;
  }
};

// Get data by reading JSON from a file
export const getData = async (): Promise<StoredData> => {
  const filename = getFilePath();
  try {
    const jsonData = await fs.readFile(filename, 'utf-8');
    const data = JSON.parse(jsonData);
    return data;
  } catch (error) {
    if ((error as any)?.code === 'ENOENT') {
      return {};
    }

    console.error(`Error reading data from ${filename}: ${(error as Error)?.message}`);
    throw error;
  }
};
