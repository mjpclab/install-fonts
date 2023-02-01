import path from "node:path";
import getDirFiles from "../util/get-dir-files.js";

const suffixes = [".ttf", ".otf"];

async function getFileList(options) {
  let dirFiles;
  let results = [];

  dirFiles = await getDirFiles(options.files, suffixes, false, false);
  results.push.apply(results, dirFiles);

  dirFiles = await getDirFiles(options.dirs, suffixes, true, false);
  results.push.apply(results, dirFiles);

  dirFiles = await getDirFiles(options.recurseDirs, suffixes, true, true);
  results.push.apply(results, dirFiles);

  results = results.map((file) => path.resolve(file));
  return results;
}

export default getFileList;
