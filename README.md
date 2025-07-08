# AI Agent Builder - Product Owner Assistant

## 🎯 Overview

A comprehensive AI agent system designed to transform raw user feedback into actionable user stories for Product Owners. Built with LangChain and OpenAI, this system provides a 3-phase pipeline to streamline the feedback-to-backlog process.

## 🚀 Features

### Phase 1: Thematic Synthesis

- **Input**: Raw user feedback
- **Process**: Group feedback by themes and generate summaries
- **Output**: Structured thematic lines

### Phase 2: Feature Extraction & Prioritization ✅

- **Input**: Thematic lines from Phase 1
- **Process**: Extract features and prioritize using multiple methods
- **Output**: Prioritized features with scores (MoSCoW, RICE, Kano)
- **Status**: Complete with 3 prioritization methods

### Phase 3: User Story Generation

- **Input**: Prioritized features from Phase 2
- **Process**: Transform features into structured user stories
- **Output**: Ready-to-use user stories for backlog (Jira, Notion, Linear)

## 📁 Project Structure

```
AI_PO_THIGA/
├── src/
│   ├── agents/          # AI agents for each phase
│   ├── cli/             # Command line interfaces
│   └── utils/           # Utility functions
├── tests/               # Unit and integration tests
├── docs/                # Documentation
├── data/                # Input data and examples
├── outputs/             # Generated results
└── scripts/             # Utility scripts
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ai-po-thiga.git
   cd ai-po-thiga
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your OpenAI API key
   ```

## 🔧 Configuration

### Required Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.3
```

### Optional Configuration

```env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langchain_api_key_here
NODE_ENV=development
LOG_LEVEL=info
```

## 🎯 Usage

### Phase 1: Process Raw Feedback

```bash
npm run phase1 -- --input data/feedback.csv --output outputs/themes.md
```

### Phase 2: Extract and Prioritize Features

```bash
npm run phase2 -- --input outputs/themes.md --output outputs/features.md
```

### Phase 3: Generate User Stories

```bash
npm run phase3 -- --input outputs/features.md --output outputs/user-stories.md
```

### Complete Pipeline

```bash
npm run pipeline -- --input data/feedback.csv
```

## 📊 Example Output

### Phase 1: Thematic Lines

```markdown
### Dark Mode Request

Users frequently request a dark mode option for better visual comfort during evening usage.

### Mobile Performance Issues

Multiple users report slow application performance on mobile devices.
```

### Phase 2: Prioritized Features

```markdown
#### 🌓 Dark Mode

- **Description**: Users request dark theme for visual comfort
- **Priority**: Must (MoSCoW) | Score: 126 (RICE)
- **Impact**: High
```

### Phase 3: User Stories

```markdown
### 📅 User Story: Implement Dark Mode Toggle

**EPIC**: User Interface Enhancement
**Summary**: Allow users to switch between light and dark themes
**Estimation**: 5 story points
**Acceptance Criteria**:

- Given I am in settings
- When I select dark mode
- Then the interface switches to dark theme
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📚 Documentation

- [Phase 1 Documentation](docs/PHASE_1_FEEDBACK_INGESTION.md)
- [Phase 2 Documentation](docs/PHASE_2_FEATURE_EXTRACTION.md) ✅
- [Phase 2 Quick Start](README_PHASE_2.md) ✅
- [API Reference](docs/api.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## 🔄 Development

```bash
# Start development server
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Thiga Technical Test
- Powered by OpenAI GPT-4
- Built with LangChain framework

---

**Project Status**: Development in Progress  
**Last Updated**: July 2025
