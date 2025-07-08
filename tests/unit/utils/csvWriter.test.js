const {
  writeThemesToCSV,
  writeFeaturesToCSV,
  writeCSV,
} = require("../../../src/utils/csvWriter");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// Mock csv-writer
jest.mock("csv-writer", () => ({
  createObjectCsvWriter: jest.fn(),
}));

describe("writeThemesToCSV", () => {
  let mockCsvWriter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCsvWriter = {
      writeRecords: jest.fn().mockResolvedValue(),
    };
    createCsvWriter.mockReturnValue(mockCsvWriter);
  });

  it("should write themes to CSV file", async () => {
    const themes = [
      "Users want dark mode for better visibility",
      "Mobile app performance needs improvement",
      "Interface should be more intuitive",
    ];

    await writeThemesToCSV(themes, "test-themes.csv");

    expect(createCsvWriter).toHaveBeenCalledWith({
      path: "test-themes.csv",
      header: [
        { id: "id", title: "ID" },
        { id: "theme", title: "Theme" },
      ],
    });

    expect(mockCsvWriter.writeRecords).toHaveBeenCalledWith([
      { id: 1, theme: "Users want dark mode for better visibility" },
      { id: 2, theme: "Mobile app performance needs improvement" },
      { id: 3, theme: "Interface should be more intuitive" },
    ]);
  });

  it("should throw error for non-array input", async () => {
    await expect(writeThemesToCSV("not an array", "test.csv")).rejects.toThrow(
      "Themes must be an array"
    );
  });

  it("should handle empty themes array", async () => {
    await writeThemesToCSV([], "empty-themes.csv");

    expect(mockCsvWriter.writeRecords).toHaveBeenCalledWith([]);
  });
});

describe("writeFeaturesToCSV", () => {
  let mockCsvWriter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCsvWriter = {
      writeRecords: jest.fn().mockResolvedValue(),
    };
    createCsvWriter.mockReturnValue(mockCsvWriter);
  });

  it("should write features with prioritization to CSV", async () => {
    const results = {
      features: [
        {
          name: "Dark Mode",
          description: "Users want dark theme",
          objective: "Improve user experience",
          examples: "Toggle switch, auto-detect",
          impact: "high",
          rice: {
            reach: 8,
            impact: 9,
            confidence: 8,
            effort: 3,
            score: 192,
            justification: "High user demand",
          },
          kano: {
            type: "must-have",
            justification: "Users expect dark theme",
          },
        },
        {
          name: "Mobile Performance",
          description: "App is slow on mobile",
          objective: "Improve mobile experience",
          examples: "Faster loading, smoother animations",
          impact: "high",
          rice: {
            reach: 9,
            impact: 8,
            confidence: 7,
            effort: 4,
            score: 126,
            justification: "Critical for mobile users",
          },
          kano: {
            type: "performance",
            justification: "Better performance improves satisfaction",
          },
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
    };

    await writeFeaturesToCSV(results, "test-features.csv");

    expect(createCsvWriter).toHaveBeenCalledWith({
      path: "test-features.csv",
      header: [
        { id: "id", title: "ID" },
        { id: "name", title: "Feature Name" },
        { id: "description", title: "Description" },
        { id: "objective", title: "Objective" },
        { id: "examples", title: "Examples" },
        { id: "impact", title: "Impact" },
        { id: "moscow", title: "MoSCoW" },
        { id: "rice_reach", title: "RICE Reach" },
        { id: "rice_impact", title: "RICE Impact" },
        { id: "rice_confidence", title: "RICE Confidence" },
        { id: "rice_effort", title: "RICE Effort" },
        { id: "rice_score", title: "RICE Score" },
        { id: "rice_justification", title: "RICE Justification" },
        { id: "kano_type", title: "Kano Type" },
        { id: "kano_justification", title: "Kano Justification" },
      ],
    });

    expect(mockCsvWriter.writeRecords).toHaveBeenCalledWith([
      {
        id: 1,
        name: "Dark Mode",
        description: "Users want dark theme",
        objective: "Improve user experience",
        examples: "Toggle switch, auto-detect",
        impact: "high",
        moscow: "Must",
        rice_reach: 8,
        rice_impact: 9,
        rice_confidence: 8,
        rice_effort: 3,
        rice_score: 192,
        rice_justification: "High user demand",
        kano_type: "must-have",
        kano_justification: "Users expect dark theme",
      },
      {
        id: 2,
        name: "Mobile Performance",
        description: "App is slow on mobile",
        objective: "Improve mobile experience",
        examples: "Faster loading, smoother animations",
        impact: "high",
        moscow: "Should",
        rice_reach: 9,
        rice_impact: 8,
        rice_confidence: 7,
        rice_effort: 4,
        rice_score: 126,
        rice_justification: "Critical for mobile users",
        kano_type: "performance",
        kano_justification: "Better performance improves satisfaction",
      },
    ]);
  });

  it("should throw error for invalid results", async () => {
    await expect(writeFeaturesToCSV({}, "test.csv")).rejects.toThrow(
      "Results must contain features array"
    );

    await expect(
      writeFeaturesToCSV({ features: null }, "test.csv")
    ).rejects.toThrow("Results must contain features array");
  });
});

describe("writeCSV", () => {
  let mockCsvWriter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCsvWriter = {
      writeRecords: jest.fn().mockResolvedValue(),
    };
    createCsvWriter.mockReturnValue(mockCsvWriter);
  });

  it("should write generic data to CSV", async () => {
    const data = [
      { name: "John", age: 30, city: "New York" },
      { name: "Jane", age: 25, city: "Los Angeles" },
    ];

    const headers = [
      { id: "name", title: "Name" },
      { id: "age", title: "Age" },
      { id: "city", title: "City" },
    ];

    await writeCSV(data, "test-generic.csv", headers);

    expect(createCsvWriter).toHaveBeenCalledWith({
      path: "test-generic.csv",
      header: headers,
    });

    expect(mockCsvWriter.writeRecords).toHaveBeenCalledWith(data);
  });

  it("should throw error for non-array input", async () => {
    await expect(writeCSV("not an array", "test.csv", [])).rejects.toThrow(
      "Data must be an array"
    );
  });
});
