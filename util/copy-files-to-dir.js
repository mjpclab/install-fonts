import fs from "fs";
import path from "path";
import ensureDir from "./ensure-dir.js";

function copyFilesToDir(srcFiles, dstPath) {
  ensureDir(dstPath);
  if (!Array.isArray(srcFiles)) srcFiles = [srcFiles];

  const copyTasks = srcFiles.map((srcFile) => {
    const basename = path.basename(srcFile);
    const dstFile = path.join(dstPath, basename);

    return new Promise((resolve) => {
      const rdStream = fs.createReadStream(srcFile);
      const wrStream = fs.createWriteStream(dstFile);
      wrStream.on("close", () => resolve([srcFile, dstFile]));
      wrStream.on("error", () => resolve([srcFile]));
      rdStream.pipe(wrStream);
    }).catch((err) => {});
  });

  return Promise.all(copyTasks);
}

export default copyFilesToDir;
