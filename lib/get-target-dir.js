import sysFontDir from "../util/sys-font-dir.js";
import userFontDir from "../util/user-font-dir.js";
import scope from "./scope.js";

function getTargetDir(options) {
  if (String(options.scope).toLocaleLowerCase() === scope.system) {
    return sysFontDir;
  } else {
    return userFontDir;
  }
}

export default getTargetDir;
