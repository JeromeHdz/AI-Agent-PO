const fs = require("fs");
const path = require("path");
const { exportThemes } = require("../../../../src/agents/phase1/themeExporter");

describe("exportThemes", () => {
  const testMarkdownPath = path.join(__dirname, "test_themes.md");
  const testCsvPath = path.join(__dirname, "test_themes.csv");

  afterEach(() => {
    if (fs.existsSync(testMarkdownPath)) {
      fs.unlinkSync(testMarkdownPath);
    }
    if (fs.existsSync(testCsvPath)) {
      fs.unlinkSync(testCsvPath);
    }
  });

  it("should export themes to both markdown and CSV formats", async () => {
    const themes = [
      "Users want a dark mode for better comfort at night.",
      "Several users complain about slow performance on mobile.",
      "Some find the interface confusing at first.",
    ];

    await exportThemes(themes, testMarkdownPath, testCsvPath);

    // Check markdown file
    expect(fs.existsSync(testMarkdownPath)).toBe(true);
    const markdownContent = fs.readFileSync(testMarkdownPath, "utf8");
    expect(markdownContent).toContain("# Synthèse des retours utilisateurs");

    // Check CSV file
    expect(fs.existsSync(testCsvPath)).toBe(true);
    const csvContent = fs.readFileSync(testCsvPath, "utf8");
    expect(csvContent).toContain("theme");
  });

  it("should throw error if themes is not an array", async () => {
    await expect(
      exportThemes("not an array", testMarkdownPath, testCsvPath)
    ).rejects.toThrow(TypeError);
  });
});
