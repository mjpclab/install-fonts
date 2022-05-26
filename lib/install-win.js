import path from "path";
import { execFileSync } from "child_process";
import getFileMainName from "../util/get-file-main-name.js";
import scope from "./scope.js";

async function install(options, srcDstPairs) {
  const dstFiles = srcDstPairs.map((pair) => pair[1]).filter(Boolean);
  const isSystemScope = options.scope === scope.system;
  const regRoot = isSystemScope ? "HKLM" : "HKCU";
  const regPath =
    regRoot + String.raw`\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts`;

  dstFiles.forEach((file) => {
    const basename = path.basename(file);
    const fontName = getFileMainName(basename) + " (TrueType)";
    const targetFile = isSystemScope ? basename : file;
    execFileSync("reg", [
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

export default install;
