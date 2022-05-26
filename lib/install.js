import { isWin, isLinux, isDarwin } from "../util/osplatform.js";
import copyFiles from "../util/copy-files-to-dir.js";
import getFileList from "./get-file-list.js";
import getTargetDir from "./get-target-dir.js";
import installForWin from "./install-win.js";
import installForLinux from "./install-linux.js";
import installForDarwin from "./install-darwin.js";

let osInstall;
if (isWin) {
  osInstall = installForWin;
} else if (isLinux) {
  osInstall = installForLinux;
} else if (isDarwin) {
  osInstall = installForDarwin;
} else {
  osInstall = () => {};
}

async function install(options) {
  const inputFiles = await getFileList(options);
  const targetDir = getTargetDir(options);
  const srcDstPairs = await copyFiles(inputFiles, targetDir);

  await osInstall(options, srcDstPairs);
}

export default install;
