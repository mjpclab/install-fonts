import process from "node:process";
import path from "node:path";
import { isWin, isLinux, isDarwin } from "./os-platform.js";

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
  fontDir = "/usr/share/fonts/js-install-fonts";
} else if (isDarwin) {
  fontDir = "/Library/Fonts";
} else {
  fontDir = "/dev/null";
}

export default fontDir;
