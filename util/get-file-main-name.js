function getFileMainName(basename) {
  const dotIndex = basename.lastIndexOf(".");
  if (dotIndex < 0) return basename;
  return basename.substring(0, dotIndex);
}

export default getFileMainName;
