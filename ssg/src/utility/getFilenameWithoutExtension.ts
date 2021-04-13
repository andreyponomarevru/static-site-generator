export function getFilenameWithoutExtension(filename: string) {
  return filename.slice(0, filename.lastIndexOf("."));
}
