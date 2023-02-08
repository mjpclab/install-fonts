import fs from "node:fs";
import path from "node:path";
import ensureDir from "./ensure-dir.js";

function copyFilesToDir(srcFiles, dstPath) {
  ensureDir(dstPath);
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

  return Promise.allSettled(copyTasks).then((results) => {
    const reasons = [];
    const values = [];

    results.forEach((r) => {
      if (r.status === "rejected") {
        reasons.push(r.reason);
      } else {
        values.push(r.value);
      }
    });

    if (reasons.length > 0) {
      throw new Error(reasons.join("\n"));
    } else {
      return values;
    }
  });
}

export default copyFilesToDir;
