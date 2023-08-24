import { writeFile } from 'fs/promises';

// node 18 fetch. TODO fixup tsconfig.json to use without any
const fetch = (global as any).fetch;

export const downloadImage = async (url: string, path: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(path, buffer);
};
