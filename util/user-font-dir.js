import os from "os";
import path from "path";
import { isWin, isLinux, isDarwin } from "./osplatform.js";

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
