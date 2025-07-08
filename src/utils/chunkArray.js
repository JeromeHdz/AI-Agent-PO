/**
 * Splits an array into chunks of a given size.
 * @param {Array} array - The array to split
 * @param {number} chunkSize - The size of each chunk
 * @returns {Array[]} Array of chunks
 */
function chunkArray(array, chunkSize = 20) {
  if (!Array.isArray(array)) throw new TypeError("Input must be an array");
  if (chunkSize <= 0) throw new RangeError("Chunk size must be positive");
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

module.exports = { chunkArray };
