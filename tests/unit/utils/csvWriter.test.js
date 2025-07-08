const fs = require("fs");
const path = require("path");
const { writeThemesToCSV } = require("../../../src/utils/csvWriter");

describe("writeThemesToCSV", () => {
  const testFilePath = path.join(__dirname, "test_themes.csv");

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it("should write themes to CSV file with correct format", async () => {
    const themes = [
      "Users want a dark mode for better comfort at night.",
      "Several users complain about slow performance on mobile.",
      "Some find the interface confusing at first.",
    ];

    await writeThemesToCSV(themes, testFilePath);

    expect(fs.existsSync(testFilePath)).toBe(true);
    const content = fs.readFileSync(testFilePath, "utf8");
    expect(content).toContain("theme");
    expect(content).toContain(
      "Users want a dark mode for better comfort at night."
    );
    expect(content).toContain(
      "Several users complain about slow performance on mobile."
    );
    expect(content).toContain("Some find the interface confusing at first.");
  });

  it("should throw error if themes is not an array", async () => {
    await expect(
      writeThemesToCSV("not an array", testFilePath)
    ).rejects.toThrow(TypeError);
  });
});
