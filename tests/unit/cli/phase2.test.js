const { runPhase2Pipeline } = require("../../../src/agents/phase2/pipeline");
const path = require("path");

// Mock the pipeline
jest.mock("../../../src/agents/phase2/pipeline");

describe("Phase 2 CLI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    runPhase2Pipeline.mockResolvedValue();
  });

  it("should run pipeline with correct file paths", async () => {
    // Mock console.log and console.error
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    console.log = jest.fn();
    console.error = jest.fn();

    // Import the CLI module
    const { main } = require("../../../src/cli/phase2");

    // Call main function directly
    await main();

    // Verify pipeline was called with correct paths
    expect(runPhase2Pipeline).toHaveBeenCalledWith(
      expect.stringContaining("themes.md"),
      expect.stringContaining("features.md"),
      expect.stringContaining("features.csv")
    );

    // Verify console output
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("🎯 AI Agent Builder - Phase 2")
    );

    // Restore mocks
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it("should handle pipeline errors gracefully", async () => {
    const error = new Error("Pipeline failed");
    runPhase2Pipeline.mockRejectedValue(error);

    // Mock console and process.exit
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalProcessExit = process.exit;

    console.log = jest.fn();
    console.error = jest.fn();
    process.exit = jest.fn();

    // Import the CLI module
    const { main } = require("../../../src/cli/phase2");

    // Call main function directly
    await main();

    // Verify error handling
    expect(console.error).toHaveBeenCalledWith(
      "❌ Pipeline failed:",
      "Pipeline failed"
    );
    expect(process.exit).toHaveBeenCalledWith(1);

    // Restore mocks
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    process.exit = originalProcessExit;
  });

  it("should use correct file paths", async () => {
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    const { main } = require("../../../src/cli/phase2");

    // Call main function directly
    await main();

    const callArgs = runPhase2Pipeline.mock.calls[0];
    const themesPath = callArgs[0];
    const markdownOutputPath = callArgs[1];
    const csvOutputPath = callArgs[2];

    // Verify paths are relative to the CLI file
    expect(themesPath).toContain("outputs\\themes.md");
    expect(markdownOutputPath).toContain("outputs\\features.md");
    expect(csvOutputPath).toContain("outputs\\features.csv");

    console.log = originalConsoleLog;
  });
});
