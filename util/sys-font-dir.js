import process from "process";
import path from "path";
import { isWin, isLinux, isDarwin } from "./osplatform.js";

let fontDir;
if (isWin) {
  let sysRoot = process.env.SystemRoot || process.env.windir;
  if (!sysRoot) {
    sysRoot = process.env.SystemDrive;
    if (sysRoot) sysRoot += "\\Windows";
  }
  if (!sysRoot) {
    sysRoot = "C:\\Windows";
  }
  fontDir = path.join(sysRoot, "Fonts");
} else if (isLinux) {
  fontDir = "/usr/share/fonts/js-install-font";
} else if (isDarwin) {
  fontDir = "/Library/Fonts";
} else {
  fontDir = "/dev/null";
}

export default fontDir;
