import path from "node:path";
import execFile from "../util/execFile.js";
import getFileMainName from "../util/get-file-main-name.js";
import allResolved from "../util/all-resolved.js";
import scope from "./scope.js";

async function install(options, srcDstPairs) {
  const dstFiles = srcDstPairs.map((pair) => pair[1]).filter(Boolean);
  const isSystemScope = options.scope === scope.system;
  const regRoot = isSystemScope ? "HKLM" : "HKCU";
  const regPath =
    regRoot + "\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts";

  const regTasks = dstFiles.map(async (file) => {
    const basename = path.basename(file);
    const fontName = getFileMainName(basename) + " (TrueType)";
    const targetFile = isSystemScope ? basename : file;
    await execFile("reg", [
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
  await allResolved(regTasks);
}

export default install;
