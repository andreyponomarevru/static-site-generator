function formatISOstr(timestamp) {
  const dateStr = new Date(timestamp).toDateString();
  const str1 = dateStr.match(/\b[A-Za-z]{3,3}\b/g);
  const str2 = dateStr.match(/\b\d{1,2}\b/);
  const str3 = dateStr.match(/\b\d{4,4}\b/);
  const month = str1[1];
  const day = str2[0];
  const year = str3[0];

  const formatted = { day, month, year };
  return formatted;
}

module.exports.formatISOstr = formatISOstr;
