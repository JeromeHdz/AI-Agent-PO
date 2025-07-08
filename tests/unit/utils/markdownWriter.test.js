const fs = require("fs");
const path = require("path");
const { writeThemesToMarkdown } = require("../../../src/utils/markdownWriter");

describe("writeThemesToMarkdown", () => {
  const testFilePath = path.join(__dirname, "test_themes.md");

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it("should write themes to markdown file with correct format", async () => {
    const themes = [
      "Users want a dark mode for better comfort at night.",
      "Several users complain about slow performance on mobile.",
      "Some find the interface confusing at first.",
    ];

    await writeThemesToMarkdown(themes, testFilePath);

    expect(fs.existsSync(testFilePath)).toBe(true);
    const content = fs.readFileSync(testFilePath, "utf8");
    expect(content).toContain("# Synthèse des retours utilisateurs");
    expect(content).toContain(
      "- Users want a dark mode for better comfort at night."
    );
    expect(content).toContain(
      "- Several users complain about slow performance on mobile."
    );
    expect(content).toContain("- Some find the interface confusing at first.");
  });

  it("should throw error if themes is not an array", async () => {
    await expect(
      writeThemesToMarkdown("not an array", testFilePath)
    ).rejects.toThrow(TypeError);
  });
});
