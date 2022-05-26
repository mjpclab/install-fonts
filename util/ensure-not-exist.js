import fs from "fs";

function ensureNotExist(path) {
  let stat;
  try {
    stat = fs.statSync(path);
  } catch (err) {
    if (err.code === "ENOENT") {
      //fs.mkdirSync(path, { recursive: true });
      return;
    } else {
      throw err;
    }
  }

  if (stat.isFile()) {
    fs.unlinkSync(path);
  } else if (stat.isDirectory()) {
    fs.rmdirSync(path);
  } else {
    throw new Error("path is not a regular file");
  }
}

export default ensureNotExist;
