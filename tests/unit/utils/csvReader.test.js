const fs = require("fs");
const path = require("path");
const { readMessagesFromCSV } = require("../../../src/utils/csvReader");

describe("readMessagesFromCSV", () => {
  const testCsvPath = path.join(__dirname, "test_feedback.csv");
  const csvContent = `id,message\n1,Hello world\n2,\n3,Dark mode please\n4,Hello world\n5,  \n6,Dark mode please\n7,Performance is slow\n`;

  beforeAll(() => {
    fs.writeFileSync(testCsvPath, csvContent);
  });

  afterAll(() => {
    fs.unlinkSync(testCsvPath);
  });

  it("should return only unique, non-empty messages", async () => {
    const messages = await readMessagesFromCSV(testCsvPath);
    expect(messages.sort()).toEqual(
      ["Dark mode please", "Hello world", "Performance is slow"].sort()
    );
  });

  it("should return an empty array if all messages are empty", async () => {
    const emptyCsvPath = path.join(__dirname, "empty_feedback.csv");
    fs.writeFileSync(emptyCsvPath, "id,message\n1,\n2,  \n");
    const messages = await readMessagesFromCSV(emptyCsvPath);
    expect(messages).toEqual([]);
    fs.unlinkSync(emptyCsvPath);
  });
});
