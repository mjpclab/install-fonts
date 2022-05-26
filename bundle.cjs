'use strict';

var os = require('os');
var fs = require('fs');
var path = require('path');
var promises = require('fs/promises');
var process = require('process');
var child_process = require('child_process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var process__default = /*#__PURE__*/_interopDefaultLegacy(process);

const osPlatform = os__default["default"].platform();
const isWin = osPlatform === "win32";
const isLinux = osPlatform === "linux";
const isDarwin = osPlatform === "darwin";

function ensureDir(path) {
  let stat;
  try {
    stat = fs__default["default"].statSync(path);
  } catch (err) {
    if (err.code === "ENOENT") {
      fs__default["default"].mkdirSync(path, { recursive: true });
      return;
    } else {
      throw err;
    }
  }
  if (!stat.isDirectory()) {
    throw new Error("path is not a directory");
  }
}

function copyFilesToDir(srcFiles, dstPath) {
  ensureDir(dstPath);
  if (!Array.isArray(srcFiles)) srcFiles = [srcFiles];

  const copyTasks = srcFiles.map((srcFile) => {
    const basename = path__default["default"].basename(srcFile);
    const dstFile = path__default["default"].join(dstPath, basename);

    return new Promise((resolve) => {
      const rdStream = fs__default["default"].createReadStream(srcFile);
      const wrStream = fs__default["default"].createWriteStream(dstFile);
      wrStream.on("close", () => resolve([srcFile, dstFile]));
      wrStream.on("error", () => resolve([srcFile]));
      rdStream.pipe(wrStream);
    }).catch((err) => {});
  });

  return Promise.all(copyTasks);
}

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
      return promises.readdir(dirPath, { withFileTypes: isRecursive }).then((data) => {
        if (isRecursive) {
          let files = data
            .filter((entry) => entry.isFile())
            .map((entry) => entry.name)
            .filter((file) => matchSuffix(file, suffixes))
            .map((file) => path__default["default"].join(dirPath, file));
          results.push.apply(results, files);

          const subDirPaths = data
            .filter((entry) => entry.isDirectory())
            .map((entry) => path__default["default"].join(dirPath, entry.name));
          if (subDirPaths.length) return doGetDirFiles(subDirPaths, results);
        } else {
          const files = data
            .filter((file) => matchSuffix(file, suffixes))
            .map((file) => path__default["default"].join(dirPath, file));
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
      return promises.stat(dirPath).then((stats) => {
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

  results = results.map((file) => path__default["default"].resolve(file));
  return results;
}

let fontDir$1;
if (isWin) {
  let sysRoot = process__default["default"].env.SystemRoot || process__default["default"].env.windir;
  if (!sysRoot) {
    sysRoot = process__default["default"].env.SystemDrive;
    if (sysRoot) sysRoot += "\\Windows";
  }
  if (!sysRoot) {
    sysRoot = "C:\\Windows";
  }
  fontDir$1 = path__default["default"].join(sysRoot, "Fonts");
} else if (isLinux) {
  fontDir$1 = "/usr/share/fonts/js-install-font";
} else if (isDarwin) {
  fontDir$1 = "/Library/Fonts";
} else {
  fontDir$1 = "/dev/null";
}

var sysFontDir = fontDir$1;

let fontDir;
if (isWin) {
  fontDir = path__default["default"].join(os__default["default"].homedir(), "Fonts");
} else if (isLinux) {
  fontDir = path__default["default"].join(os__default["default"].homedir(), ".local/share/fonts");
} else if (isDarwin) {
  fontDir = path__default["default"].join(os__default["default"].homedir(), "Library/Fonts");
} else {
  fontDir = "/dev/null";
}

var userFontDir = fontDir;

var scope = {
  system: "system",
  user: "user",
};

function getTargetDir(options) {
  if (String(options.scope).toLocaleLowerCase() === scope.system) {
    return sysFontDir;
  } else {
    return userFontDir;
  }
}

function getFileMainName(basename) {
  const dotIndex = basename.lastIndexOf(".");
  if (dotIndex < 0) return basename;
  return basename.substring(0, dotIndex);
}

async function install$3(options, srcDstPairs) {
  const dstFiles = srcDstPairs.map((pair) => pair[1]).filter(Boolean);
  const isSystemScope = options.scope === scope.system;
  const regRoot = isSystemScope ? "HKLM" : "HKCU";
  const regPath =
    regRoot + String.raw`\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts`;

  dstFiles.forEach((file) => {
    const basename = path__default["default"].basename(file);
    const fontName = getFileMainName(basename) + " (TrueType)";
    const targetFile = isSystemScope ? basename : file;
    child_process.execFileSync("reg", [
      "add",
      regPath,
      "/f",
      "/t",
      "REG_SZ",
      "/v",
      fontName,
      "/d",
      targetFile,
    ]);
  });
}

function install$2(options, srcDstPairs) {
  try {
    child_process.execFileSync("fc-cache", ["-f"]);
  } catch (err) {}
}

function install$1(options, srcDstPairs) {
  // noop
}

let osInstall;
if (isWin) {
  osInstall = install$3;
} else if (isLinux) {
  osInstall = install$2;
} else if (isDarwin) {
  osInstall = install$1;
} else {
  osInstall = () => {};
}

async function install(options) {
  const inputFiles = await getFileList(options);
  const targetDir = getTargetDir(options);
  const srcDstPairs = await copyFilesToDir(inputFiles, targetDir);

  await osInstall(options, srcDstPairs);
}

module.exports = install;
