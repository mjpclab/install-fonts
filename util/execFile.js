import util from "node:util";
import { execFile as execFileCallback } from "node:child_process";

const execFile = util.promisify(execFileCallback);
export default execFile;
