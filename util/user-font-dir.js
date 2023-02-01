import os from "node:os";
import path from "node:path";
import { isWin, isLinux, isDarwin } from "./os-platform.js";

let fontDir;
if (isWin) {
  fontDir = path.join(os.homedir(), "Fonts");
} else if (isLinux) {
  fontDir = path.join(os.homedir(), ".local/share/fonts");
} else if (isDarwin) {
  fontDir = path.join(os.homedir(), "Library/Fonts");
} else {
  fontDir = "/dev/null";
}

export default fontDir;
