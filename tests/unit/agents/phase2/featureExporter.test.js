const {
  exportFeatures,
} = require("../../../../src/agents/phase2/featureExporter");
const {
  writeFeaturesToMarkdown,
} = require("../../../../src/utils/markdownWriter");
const { writeFeaturesToCSV } = require("../../../../src/utils/csvWriter");

// Mock the utility functions
jest.mock("../../../../src/utils/markdownWriter");
jest.mock("../../../../src/utils/csvWriter");

describe("exportFeatures", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    writeFeaturesToMarkdown.mockResolvedValue();
    writeFeaturesToCSV.mockResolvedValue();
  });

  it("should export features to both markdown and CSV formats", async () => {
    const mockResults = {
      features: [
        {
          name: "Dark Mode",
          description: "Users want dark theme",
          objective: "Improve user experience",
          examples: "Toggle switch, auto-detect",
          impact: "high",
        },
        {
          name: "Mobile Performance",
          description: "App is slow on mobile",
          objective: "Improve mobile experience",
          examples: "Faster loading, smoother animations",
          impact: "high",
        },
      ],
      moscow: {
        must: ["Dark Mode"],
        should: ["Mobile Performance"],
        could: [],
        wont: [],
        justification: "Dark mode is essential for user experience",
      },
      rice: [
        {
          name: "Dark Mode",
          rice: {
            reach: 8,
            impact: 9,
            confidence: 8,
            effort: 3,
            score: 192,
            justification: "High user demand",
          },
        },
        {
          name: "Mobile Performance",
          rice: {
            reach: 9,
            impact: 8,
            confidence: 7,
            effort: 4,
            score: 126,
            justification: "Critical for mobile users",
          },
        },
      ],
      kano: [
        {
          name: "Dark Mode",
          kano: {
            type: "must-have",
            justification: "Users expect dark theme",
          },
        },
        {
          name: "Mobile Performance",
          kano: {
            type: "performance",
            justification: "Better performance improves satisfaction",
          },
        },
      ],
      summary: {
        totalFeatures: 2,
        moscowMust: 1,
        moscowShould: 1,
        topRiceScore: 192,
        kanoMustHave: 1,
        kanoPerformance: 1,
        kanoExcitement: 0,
      },
    };

    const markdownPath = "test-output.md";
    const csvPath = "test-output.csv";

    await exportFeatures(mockResults, markdownPath, csvPath);

    // Verify both export functions were called
    expect(writeFeaturesToMarkdown).toHaveBeenCalledWith(
      mockResults,
      markdownPath
    );
    expect(writeFeaturesToCSV).toHaveBeenCalledWith(mockResults, csvPath);
    expect(writeFeaturesToMarkdown).toHaveBeenCalledTimes(1);
    expect(writeFeaturesToCSV).toHaveBeenCalledTimes(1);
  });

  it("should throw error for invalid results", async () => {
    const invalidResults = null;
    const markdownPath = "test-output.md";
    const csvPath = "test-output.csv";

    await expect(
      exportFeatures(invalidResults, markdownPath, csvPath)
    ).rejects.toThrow("Results must contain features array");

    // Verify no export functions were called
    expect(writeFeaturesToMarkdown).not.toHaveBeenCalled();
    expect(writeFeaturesToCSV).not.toHaveBeenCalled();
  });

  it("should throw error for results without features", async () => {
    const invalidResults = { moscow: {}, rice: [], kano: [] };
    const markdownPath = "test-output.md";
    const csvPath = "test-output.csv";

    await expect(
      exportFeatures(invalidResults, markdownPath, csvPath)
    ).rejects.toThrow("Results must contain features array");

    // Verify no export functions were called
    expect(writeFeaturesToMarkdown).not.toHaveBeenCalled();
    expect(writeFeaturesToCSV).not.toHaveBeenCalled();
  });

  it("should handle empty features array", async () => {
    const mockResults = {
      features: [],
      moscow: { must: [], should: [], could: [], wont: [], justification: "" },
      rice: [],
      kano: [],
      summary: {
        totalFeatures: 0,
        moscowMust: 0,
        moscowShould: 0,
        topRiceScore: 0,
        kanoMustHave: 0,
        kanoPerformance: 0,
        kanoExcitement: 0,
      },
    };

    const markdownPath = "test-output.md";
    const csvPath = "test-output.csv";

    await exportFeatures(mockResults, markdownPath, csvPath);

    // Verify both export functions were called even with empty features
    expect(writeFeaturesToMarkdown).toHaveBeenCalledWith(
      mockResults,
      markdownPath
    );
    expect(writeFeaturesToCSV).toHaveBeenCalledWith(mockResults, csvPath);
  });
});
