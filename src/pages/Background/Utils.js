export const Utils = function () {};

Utils.htonl = function (h) {
  // Mask off 8 bytes at a time then shift them into place
  return [
    (h & 0xff000000) >>> 24,
    (h & 0x00ff0000) >>> 16,
    (h & 0x0000ff00) >>> 8,
    (h & 0x000000ff) >>> 0,
  ];
};
/**
 * Convert a 32-bit quantity (long integer) from network byte order to host byte order (Big-Endian to Little-Endian).
 *
 * @param {Array|Buffer} buffer Array of octets or a nodejs Buffer to read value from
 * @returns {number}
 */
Utils.ntohl = function (n) {
  return (
    (((0xff & n[0]) << 24) +
      ((0xff & n[1]) << 16) +
      ((0xff & n[2]) << 8) +
      (0xff & n[3])) >>>
    0
  );
};
/**
 * Convert a 16-bit quantity (short integer) from host byte order to network byte order (Little-Endian to Big-Endian).
 *
 * @param {number} budder Value to convert
 * @returns {Array|Buffer} v Array of octets or a nodejs Buffer
 */
Utils.htons = function (h) {
  // Mask off 8 bytes at a time then shift them into place
  return [(h & 0xff00) >>> 8, (h & 0x00ff) >>> 0];
};
/**
 * Convert a 16-bit quantity (short integer) from network byte order to host byte order (Big-Endian to Little-Endian).
 *
 * @param {Array|Buffer} b Array of octets or a nodejs Buffer to read value from
 * @returns {number}
 */
Utils.ntohs = function (n, big) {
  if (big) {
    return (((0xff & n[1]) << 8) + (0xff & n[0])) >>> 0;
  } else {
    return (((0xff & n[0]) << 8) + (0xff & n[1])) >>> 0;
  }
};

Utils.ab2str = function (buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
};

Utils.str2ab = function (str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

Utils.bytes2int = function (x) {
  var val = 0;
  if (typeof x === 'undefined' || x === null) {
    return undefined;
  } else {
    for (var i = 0; i < x.length; ++i) {
      val += x[i];
      if (i < x.length - 1) {
        val = val << 8;
      }
    }
  }
  return val;
};

Utils.removeNullBytes = function (str) {
  return str
    .split('')
    .filter((char) => char.codePointAt(0))
    .join('');
};

Utils.escapeUnicode = function (str) {
  return [...str]
    .map((c) =>
      /^[\x00-\x7F]$/.test(c)
        ? c
        : c
            .split('')
            .map((a) => '\\u' + a.charCodeAt().toString(16).padStart(4, '0'))
            .join('')
    )
    .join('');
};
