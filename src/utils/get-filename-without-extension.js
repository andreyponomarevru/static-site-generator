module.exports = {
  getFilenameWithoutExtension: function (filename) {
    return filename.slice(0, filename.lastIndexOf("."));
  },
};
