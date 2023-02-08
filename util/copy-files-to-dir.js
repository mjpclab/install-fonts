import fs from "node:fs";
import path from "node:path";
import ensureDir from "./ensure-dir.js";
import allResolved from "./all-resolved.js";

async function copyFilesToDir(srcFiles, dstPath) {
  await ensureDir(dstPath);
  if (!Array.isArray(srcFiles)) srcFiles = [srcFiles];

  const copyTasks = srcFiles.map((srcFile) => {
    const basename = path.basename(srcFile);
    const dstFile = path.join(dstPath, basename);

    return new Promise((resolve, reject) => {
      const rdStream = fs.createReadStream(srcFile);
      const wrStream = fs.createWriteStream(dstFile);
      wrStream.on("close", () => resolve([srcFile, dstFile]));
      wrStream.on("error", reject);
      rdStream.pipe(wrStream);
    });
  });

  return allResolved(copyTasks);
}

export default copyFilesToDir;
