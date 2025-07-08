const { runPhase3Pipeline } = require("../../../../src/agents/phase3/pipeline");
const path = require("path");

// Mock fs with promises.writeFile
jest.mock("fs", () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    writeFile: jest.fn().mockResolvedValue(),
  },
}));

// Mock the utilities
jest.mock("../../../../src/utils/csvReader", () => ({
  readCSV: jest.fn(),
}));

jest.mock("../../../../src/utils/csvWriter", () => ({
  writeCSV: jest.fn(),
}));

// Mock the user story generator
jest.mock("../../../../src/agents/phase3/userStoryGenerator", () => ({
  generateUserStories: jest.fn(),
}));

describe("Phase 3 Pipeline", () => {
  const mockFeatures = [
    {
      name: "Dark Mode",
      description: "Users want dark theme for visual comfort",
      impact: "high",
      moscow: "Must",
      rice: { score: 89.6, effort: 6 },
      epic: { name: "User Experience Enhancement" },
    },
    {
      name: "Mobile Performance",
      description: "App is slow on mobile devices",
      impact: "high",
      moscow: "Must",
      rice: { score: 92.3, effort: 8 },
      epic: { name: "Performance Optimization" },
    },
  ];

  const mockUserStories = [
    {
      name: "Dark Mode",
      description: "Users want dark theme for visual comfort",
      impact: "high",
      moscow: "Must",
      rice: { score: 89.6, effort: 6 },
      epic: { name: "User Experience Enhancement" },
      userStory: {
        title: "Dark Mode",
        story:
          "As a user, I want to toggle between light and dark themes, So that I can reduce eye strain in low-light environments.",
        storyPoints: 3,
        description:
          "User interface allowing to change the application theme to improve visual comfort.",
        acceptanceCriteria:
          "The user can access settings and activate dark mode.",
        bddTests:
          "Given I am on the settings page, And dark mode is available, When I click the theme toggle button, Then the interface switches to dark mode, And all UI elements adapt to the dark theme.",
        dependencies: "No dependencies",
        value: 8.5,
        priority: "Must",
        epic: "User Experience Enhancement",
      },
    },
    {
      name: "Mobile Performance",
      description: "App is slow on mobile devices",
      impact: "high",
      moscow: "Must",
      rice: { score: 92.3, effort: 8 },
      epic: { name: "Performance Optimization" },
      userStory: {
        title: "Mobile Performance",
        story:
          "As a mobile user, I want the app to load quickly and respond smoothly, So that I can use it efficiently on my device.",
        storyPoints: 8,
        description:
          "Performance optimization to improve mobile user experience.",
        acceptanceCriteria: "The app responds quickly to user interactions.",
        bddTests:
          "Given I am using the mobile app, And I navigate between screens, When I change pages, Then the app responds within 2 seconds, And animations are smooth without lag.",
        dependencies: "Depends on backend optimization",
        value: 9.2,
        priority: "Must",
        epic: "Performance Optimization",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should run the complete Phase 3 pipeline successfully", async () => {
    const { readCSV } = require("../../../../src/utils/csvReader");
    const { writeCSV } = require("../../../../src/utils/csvWriter");
    const {
      generateUserStories,
    } = require("../../../../src/agents/phase3/userStoryGenerator");

    // Setup mocks
    readCSV.mockResolvedValue(mockFeatures);
    generateUserStories.mockResolvedValue(mockUserStories);
    writeCSV.mockResolvedValue();

    // Mock console.log to capture output
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const result = await runPhase3Pipeline("test-input.csv", "test-output");

    // Verify mocks were called correctly
    expect(readCSV).toHaveBeenCalledWith("test-input.csv");
    expect(generateUserStories).toHaveBeenCalledWith(mockFeatures);
    expect(writeCSV).toHaveBeenCalled();

    // Verify fs.promises.writeFile was called for markdown
    const fs = require("fs");
    expect(fs.promises.writeFile).toHaveBeenCalled();

    // Verify result structure
    expect(result).toHaveProperty("userStories");
    expect(result).toHaveProperty("csvPath");
    expect(result).toHaveProperty("markdownPath");
    expect(result).toHaveProperty("summary");
    expect(result.userStories).toEqual(mockUserStories);

    // Verify output data structure
    const writeCSVCall = writeCSV.mock.calls[0];
    const outputData = writeCSVCall[0]; // First argument is the data
    const outputPath = writeCSVCall[1]; // Second argument is the path
    const headers = writeCSVCall[2]; // Third argument is the headers

    expect(outputData).toHaveLength(2);
    expect(outputData[0]).toHaveProperty("title", "Dark Mode");
    expect(outputData[0]).toHaveProperty("userStory");
    expect(outputData[0]).toHaveProperty("storyPoints", 3);
    expect(outputData[0]).toHaveProperty("priority", "Must");
    expect(outputData[0]).toHaveProperty("epic", "User Experience Enhancement");

    consoleSpy.mockRestore();
  });

  it("should handle empty features input", async () => {
    const { readCSV } = require("../../../../src/utils/csvReader");
    readCSV.mockResolvedValue([]);

    await expect(runPhase3Pipeline("test-input.csv")).rejects.toThrow(
      "No features found in input file"
    );
  });

  it("should handle empty user stories output", async () => {
    const { readCSV } = require("../../../../src/utils/csvReader");
    const {
      generateUserStories,
    } = require("../../../../src/agents/phase3/userStoryGenerator");

    readCSV.mockResolvedValue(mockFeatures);
    generateUserStories.mockResolvedValue([]);

    await expect(runPhase3Pipeline("test-input.csv")).rejects.toThrow(
      "No user stories generated"
    );
  });

  it("should create output directory if it doesn't exist", async () => {
    const { readCSV } = require("../../../../src/utils/csvReader");
    const {
      generateUserStories,
    } = require("../../../../src/agents/phase3/userStoryGenerator");
    const { writeCSV } = require("../../../../src/utils/csvWriter");

    readCSV.mockResolvedValue(mockFeatures);
    generateUserStories.mockResolvedValue(mockUserStories);
    writeCSV.mockResolvedValue();

    await runPhase3Pipeline("test-input.csv", "new-output-dir");

    const fs = require("fs");
    expect(fs.existsSync).toHaveBeenCalledWith("new-output-dir");
    expect(fs.mkdirSync).toHaveBeenCalledWith("new-output-dir", {
      recursive: true,
    });
  });

  it("should generate correct output file paths", async () => {
    const { readCSV } = require("../../../../src/utils/csvReader");
    const {
      generateUserStories,
    } = require("../../../../src/agents/phase3/userStoryGenerator");
    const { writeCSV } = require("../../../../src/utils/csvWriter");

    readCSV.mockResolvedValue(mockFeatures);
    generateUserStories.mockResolvedValue(mockUserStories);
    writeCSV.mockResolvedValue();

    const result = await runPhase3Pipeline("test-input.csv", "test-output");

    expect(result.csvPath).toBe(path.join("test-output", "user_stories.csv"));
    expect(result.markdownPath).toBe(
      path.join("test-output", "user_stories.md")
    );
  });

  it("should include all required fields in output data", async () => {
    const { readCSV } = require("../../../../src/utils/csvReader");
    const {
      generateUserStories,
    } = require("../../../../src/agents/phase3/userStoryGenerator");
    const { writeCSV } = require("../../../../src/utils/csvWriter");

    readCSV.mockResolvedValue(mockFeatures);
    generateUserStories.mockResolvedValue(mockUserStories);
    writeCSV.mockResolvedValue();

    await runPhase3Pipeline("test-input.csv", "test-output");

    const writeCSVCall = writeCSV.mock.calls[0];
    const outputData = writeCSVCall[0]; // First argument is the data

    expect(outputData[0]).toHaveProperty("title");
    expect(outputData[0]).toHaveProperty("userStory");
    expect(outputData[0]).toHaveProperty("storyPoints");
    expect(outputData[0]).toHaveProperty("description");
    expect(outputData[0]).toHaveProperty("acceptanceCriteria");
    expect(outputData[0]).toHaveProperty("bddTests");
    expect(outputData[0]).toHaveProperty("dependencies");
    expect(outputData[0]).toHaveProperty("value");
    expect(outputData[0]).toHaveProperty("priority");
    expect(outputData[0]).toHaveProperty("epic");
    expect(outputData[0]).toHaveProperty("originalDescription");
    expect(outputData[0]).toHaveProperty("impact");
    expect(outputData[0]).toHaveProperty("moscow");
    expect(outputData[0]).toHaveProperty("riceScore");
    expect(outputData[0]).toHaveProperty("riceEffort");
    expect(outputData[0]).toHaveProperty("kanoType");
    expect(outputData[0]).toHaveProperty("kanoScore");
  });

  it("should generate summary with correct statistics", async () => {
    const { readCSV } = require("../../../../src/utils/csvReader");
    const {
      generateUserStories,
    } = require("../../../../src/agents/phase3/userStoryGenerator");
    const { writeCSV } = require("../../../../src/utils/csvWriter");

    readCSV.mockResolvedValue(mockFeatures);
    generateUserStories.mockResolvedValue(mockUserStories);
    writeCSV.mockResolvedValue();

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await runPhase3Pipeline("test-input.csv", "test-output");

    // Check that summary was logged
    const logCalls = consoleSpy.mock.calls;
    const summaryCall = logCalls.find(
      (call) => call[0] && call[0].includes("PHASE 3 SUMMARY")
    );
    expect(summaryCall).toBeDefined();

    consoleSpy.mockRestore();
  });
});
