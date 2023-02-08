import { stat, mkdir } from "node:fs/promises";

async function ensureDir(path) {
  let result;
  try {
    result = await stat(path);
  } catch (err) {
    if (err.code === "ENOENT") {
      await mkdir(path, { recursive: true });
      return;
    } else {
      throw err;
    }
  }
  if (!result.isDirectory()) {
    throw new Error("path is not a directory");
  }
}

export default ensureDir;
