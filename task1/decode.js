function doDecode(data, string, shift) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < string.length; i++) {
    let char = /[A-Z]/.test(string[i]);
    if (char) {
      string[i] = string[i].toLowerCase();
      string[i] = alphabet[(string[i].charCodeAt(0) - 97 - shift) % 26];
      string[i] = string[i].toUpperCase();
    }
    char = /[a-z]/.test(string[i]);
    if (char) {
      string[i] = alphabet[(string[i].charCodeAt(0) - 97 - shift) % 26];
    }
  }
}
module.exports = doDecode;
