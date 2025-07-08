const { chunkArray } = require("../../../src/utils/chunkArray");

describe("chunkArray", () => {
  it("should split an array into chunks of the given size", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const chunks = chunkArray(arr, 3);
    expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it("should return the whole array as one chunk if chunkSize >= array.length", () => {
    const arr = [1, 2, 3];
    expect(chunkArray(arr, 5)).toEqual([[1, 2, 3]]);
  });

  it("should throw if input is not an array", () => {
    expect(() => chunkArray("not an array", 2)).toThrow(TypeError);
  });

  it("should throw if chunkSize is not positive", () => {
    expect(() => chunkArray([1, 2, 3], 0)).toThrow(RangeError);
    expect(() => chunkArray([1, 2, 3], -1)).toThrow(RangeError);
  });

  it("should use default chunk size 20", () => {
    const arr = Array.from({ length: 25 }, (_, i) => i + 1);
    const chunks = chunkArray(arr);
    expect(chunks.length).toBe(2);
    expect(chunks[0].length).toBe(20);
    expect(chunks[1].length).toBe(5);
  });
});
