import { stat } from "fs/promises";
import { readdir } from "fs/promises";
import path from "path";

const emptyArray = [];
Object.freeze(emptyArray);
const emptyTask = Promise.resolve(emptyArray);

function matchSuffix(file, suffixes) {
  return suffixes.some(
    (suffix) => file.slice(-suffix.length).toLowerCase() === suffix
  );
}

async function getDirFiles(dirPaths, suffixes, doReaddir, isRecursive) {
  function doGetDirFiles(dirPaths, results) {
    const dirTasks = dirPaths.map((dirPath) => {
      return readdir(dirPath, { withFileTypes: isRecursive }).then((data) => {
        if (isRecursive) {
          let files = data
            .filter((entry) => entry.isFile())
            .map((entry) => entry.name)
            .filter((file) => matchSuffix(file, suffixes))
            .map((file) => path.join(dirPath, file));
          results.push.apply(results, files);

          const subDirPaths = data
            .filter((entry) => entry.isDirectory())
            .map((entry) => path.join(dirPath, entry.name));
          if (subDirPaths.length) return doGetDirFiles(subDirPaths, results);
        } else {
          const files = data
            .filter((file) => matchSuffix(file, suffixes))
            .map((file) => path.join(dirPath, file));
          results.push.apply(results, files);
        }
      });
    });

    return Promise.all(dirTasks);
  }

  if (!suffixes) return emptyTask;
  if (!Array.isArray(suffixes)) suffixes = [suffixes];
  suffixes = suffixes
    .filter(Boolean)
    .map((suffix) => String(suffix).toLowerCase());
  if (!suffixes.length) return emptyTask;

  if (!dirPaths) return emptyTask;
  if (!Array.isArray(dirPaths)) dirPaths = [dirPaths];
  if (!dirPaths.length) return emptyTask;

  const results = [];
  const realDirPaths = [];
  await Promise.all(
    dirPaths.map((dirPath) => {
      return stat(dirPath).then((stats) => {
        if (doReaddir && stats.isDirectory()) {
          realDirPaths.push(dirPath);
        } else if (stats.isFile()) {
          if (matchSuffix(dirPath, suffixes)) results.push(dirPath);
        }
      });
    })
  );

  if (doReaddir) {
    await doGetDirFiles(realDirPaths, results);
  }

  return results;
}

export default getDirFiles;
