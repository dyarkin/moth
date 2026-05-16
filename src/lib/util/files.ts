/*
We delibirately abstract from js-runtime specific methods so we can migrate to a different runtime with ease if it's needed
*/

export async function readFileText(filePath: string): Promise<string> {
  try {
    return await Bun.file(filePath).text();
  } catch (e) {
    throw new Error(`Failed to read file: ${filePath}. Error: ${e}`);
  }
}
