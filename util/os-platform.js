import os from "node:os";

const osPlatform = os.platform();
const isWin = osPlatform === "win32";
const isLinux = osPlatform === "linux";
const isDarwin = osPlatform === "darwin";

export { isWin, isLinux, isDarwin };
