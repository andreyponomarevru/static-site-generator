export function parseDateInFilename(filename: string) {
  const match = filename.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
  const str = match ? match[0] : null;
  if (!str) throw new Error("Can't extract date from file name");
  else {
    const date = new Date(str).toDateString();
    return date;
  }
}
