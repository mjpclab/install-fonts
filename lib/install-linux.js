import execFile from "../util/execFile.js";

async function install(options, srcDstPairs) {
  try {
    await execFile("fc-cache", ["-f"]);
  } catch (err) {}
}

export default install;
