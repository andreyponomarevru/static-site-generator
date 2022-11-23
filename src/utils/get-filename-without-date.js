module.exports = {
  getFilenameWithoutDate: function (filename) {
    const withoutDate = filename.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}-(.*)$/);

    const newFilename = withoutDate ? withoutDate[1] : null;
    if (!withoutDate) {
      throw new Error(`${__filename}: Can't parse filename ${filename}`);
    } else {
      return newFilename;
    }
  },
};
