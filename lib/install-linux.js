import { execFileSync } from "child_process";

function install(options, srcDstPairs) {
  try {
    execFileSync("fc-cache", ["-f"]);
  } catch (err) {}
}

export default install;
