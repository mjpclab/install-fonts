import fs from "node:fs";

function ensureDir(path) {
  let stat;
  try {
    stat = fs.statSync(path);
  } catch (err) {
    if (err.code === "ENOENT") {
      fs.mkdirSync(path, { recursive: true });
      return;
    } else {
      throw err;
    }
  }
  if (!stat.isDirectory()) {
    throw new Error("path is not a directory");
  }
}

export default ensureDir;
