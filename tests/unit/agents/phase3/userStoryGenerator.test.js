const {
  generateUserStories,
} = require("../../../../src/agents/phase3/userStoryGenerator");

jest.mock("@langchain/openai", () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockImplementation(async (messages) => {
        // Get the message content to adapt the response
        const messageContent = messages[1].content;

        // Count the number of features in the message
        const featureLines = messageContent.match(/\*\*.*?\*\*/g) || [];

        // If we have a single feature
        if (featureLines.length === 1) {
          if (messageContent.includes("Mobile Performance")) {
            return {
              content: `Mobile Performance | As a mobile user, I want the app to load quickly and respond smoothly, So that I can use it efficiently on my device. | 8 | Performance optimization to improve mobile user experience. | The app responds quickly to user interactions. | Given I am using the mobile app, And I navigate between screens, When I change pages, Then the app responds within 2 seconds, And animations are smooth without lag. | Depends on backend optimization | 9.2 | Must | Performance Optimization`,
            };
          }
          if (messageContent.includes("Interface Simplification")) {
            return {
              content: `Interface Simplification | As a new user, I want a simplified interface, So that I can easily understand and use the application without confusion. | 5 | Interface refactoring to improve new user experience. | The interface is intuitive and easy to understand. | Given I am a first-time user, And I open the application, When I see the interface, Then I see a clean and intuitive interface, And I can complete basic tasks without help. | No dependencies | 7.8 | Should | User Experience Enhancement`,
            };
          }
          // Default: Dark Mode
          return {
            content: `Dark Mode | As a user, I want to toggle between light and dark themes, So that I can reduce eye strain in low-light environments. | 3 | User interface allowing to change the application theme to improve visual comfort. | The user can access settings and activate dark mode. | Given I am on the settings page, And dark mode is available, When I click the theme toggle button, Then the interface switches to dark mode, And all UI elements adapt to the dark theme. | No dependencies | 8.5 | Must | User Experience Enhancement`,
          };
        }

        // Otherwise, return the complete response (default behavior)
        return {
          content: `Dark Mode | As a user, I want to toggle between light and dark themes, So that I can reduce eye strain in low-light environments. | 3 | User interface allowing to change the application theme to improve visual comfort. | The user can access settings and activate dark mode. | Given I am on the settings page, And dark mode is available, When I click the theme toggle button, Then the interface switches to dark mode, And all UI elements adapt to the dark theme. | No dependencies | 8.5 | Must | User Experience Enhancement
Mobile Performance | As a mobile user, I want the app to load quickly and respond smoothly, So that I can use it efficiently on my device. | 8 | Performance optimization to improve mobile user experience. | The app responds quickly to user interactions. | Given I am using the mobile app, And I navigate between screens, When I change pages, Then the app responds within 2 seconds, And animations are smooth without lag. | Depends on backend optimization | 9.2 | Must | Performance Optimization
Interface Simplification | As a new user, I want a simplified interface, So that I can easily understand and use the application without confusion. | 5 | Interface refactoring to improve new user experience. | The interface is intuitive and easy to understand. | Given I am a first-time user, And I open the application, When I see the interface, Then I see a clean and intuitive interface, And I can complete basic tasks without help. | No dependencies | 7.8 | Should | User Experience Enhancement`,
        };
      }),
    })),
  };
});

describe("generateUserStories", () => {
  it("should generate comprehensive user stories with full template", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
        moscow: "Must",
        epic: { name: "User Experience Enhancement" },
      },
      {
        name: "Mobile Performance",
        description: "App is slow on mobile devices",
        impact: "high",
        moscow: "Must",
        epic: { name: "Performance Optimization" },
      },
    ];

    const result = await generateUserStories(features);

    expect(result).toHaveLength(2);
    expect(result[0].userStory.title).toBe("Dark Mode");
    expect(result[0].userStory.story).toContain("As a user");
    expect(result[0].userStory.story).toContain("I want");
    expect(result[0].userStory.story).toContain("So that");
    expect(result[0].userStory.acceptanceCriteria).toContain("The user can");
    expect(result[0].userStory.bddTests).toContain("Given");
    expect(result[0].userStory.bddTests).toContain("When");
    expect(result[0].userStory.bddTests).toContain("Then");
    expect(result[0].userStory.storyPoints).toBe(3);
    expect(result[0].userStory.priority).toBe("Must");
    expect(result[0].userStory.epic).toBe("User Experience Enhancement");
    expect(result[0].userStory.value).toBe(8.5);
  });

  it("should return empty array for empty input", async () => {
    const result = await generateUserStories([]);

    expect(result).toEqual([]);
  });

  it("should handle single feature", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
        moscow: "Must",
        epic: { name: "User Experience Enhancement" },
      },
    ];

    const result = await generateUserStories(features);

    expect(result).toHaveLength(1);
    expect(result[0].userStory.title).toBe("Dark Mode");
    expect(result[0].userStory.story).toContain("As a user");
    expect(result[0].userStory.storyPoints).toBe(3);
    expect(result[0].userStory.priority).toBe("Must");
  });

  it("should preserve original feature data", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        objective: "Improve user experience",
        examples: "Toggle switch in settings",
        impact: "high",
        moscow: "Must",
        epic: { name: "User Experience Enhancement" },
      },
    ];

    const result = await generateUserStories(features);

    expect(result[0].name).toBe("Dark Mode");
    expect(result[0].description).toBe(
      "Users want dark theme for visual comfort"
    );
    expect(result[0].objective).toBe("Improve user experience");
    expect(result[0].examples).toBe("Toggle switch in settings");
    expect(result[0].impact).toBe("high");
    expect(result[0].epic.name).toBe("User Experience Enhancement");
    expect(result[0].userStory).toBeDefined();
  });

  it("should handle features with RICE data", async () => {
    const features = [
      {
        name: "Mobile Performance",
        description: "App is slow on mobile devices",
        impact: "high",
        moscow: "Must",
        rice: { score: 89.6, effort: 6 },
        epic: { name: "Performance Optimization" },
      },
    ];

    const result = await generateUserStories(features);

    expect(result[0].rice.score).toBe(89.6);
    expect(result[0].rice.effort).toBe(6);
    expect(result[0].userStory.priority).toBe("Must");
    expect(result[0].userStory.storyPoints).toBe(8);
  });

  it("should handle features with Kano data", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
        moscow: "Must",
        kano: { type: "Delighter", score: 0.8 },
        epic: { name: "User Experience Enhancement" },
      },
    ];

    const result = await generateUserStories(features);

    expect(result[0].kano.type).toBe("Delighter");
    expect(result[0].kano.score).toBe(0.8);
    expect(result[0].userStory.priority).toBe("Must");
  });

  it("should include all template fields", async () => {
    const features = [
      {
        name: "Interface Simplification",
        description: "Interface is confusing for newcomers",
        impact: "moderate",
        moscow: "Should",
        epic: { name: "User Experience Enhancement" },
      },
    ];

    const result = await generateUserStories(features);

    expect(result[0].userStory.description).toBeDefined();
    expect(result[0].userStory.dependencies).toBeDefined();
    expect(result[0].userStory.value).toBeDefined();
    expect(result[0].userStory.mockups).toBe("");
    expect(result[0].userStory.taggingPlan).toBe("");
    expect(result[0].userStory.performanceCriteria).toBe("");
    expect(result[0].userStory.uiuxCriteria).toBe("");
    expect(result[0].userStory.dataCriteria).toBe("");
  });

  it("should generate INVEST-compliant stories", async () => {
    const features = [
      {
        name: "Interface Simplification",
        description: "Interface is confusing for newcomers",
        impact: "moderate",
        moscow: "Should",
        epic: { name: "User Experience Enhancement" },
      },
    ];

    const result = await generateUserStories(features);

    expect(result[0].userStory.story).toContain("As a");
    expect(result[0].userStory.story).toContain("I want");
    expect(result[0].userStory.story).toContain("So that");
    expect(result[0].userStory.bddTests).toContain("Given");
    expect(result[0].userStory.bddTests).toContain("When");
    expect(result[0].userStory.bddTests).toContain("Then");
  });
});
