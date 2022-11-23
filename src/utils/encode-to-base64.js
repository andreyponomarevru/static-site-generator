function encodeToBase64(text) {
  return Buffer.from(text).toString("base64");
}

module.exports = { encodeToBase64 };
