# Contributing to AI Agent Builder

Thank you for your interest in contributing to the AI Agent Builder project! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- Git

### Setup Development Environment
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/ai-po-thiga.git`
3. Install dependencies: `npm install`
4. Copy environment file: `cp env.example .env`
5. Configure your `.env` file with your API keys

## 📝 Development Workflow

### Branch Naming Convention
- `feature/phase1-synthesis` - New features
- `bugfix/phase2-prioritization` - Bug fixes
- `docs/readme-update` - Documentation updates
- `test/phase3-stories` - Test additions

### Commit Message Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(phase1): add thematic synthesis agent
fix(phase2): resolve prioritization scoring issue
docs(readme): update installation instructions
test(phase3): add user story generation tests
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Writing Tests
- Place test files in the `tests/` directory
- Follow the naming convention: `*.test.js`
- Use Jest as the testing framework
- Aim for >80% code coverage

## 📋 Code Standards

### Code Style
- Use ESLint for code linting
- Use Prettier for code formatting
- Follow the existing code style

### Running Linters
```bash
# Check for linting issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

## 🏗️ Architecture Guidelines

### Agent Development
- Each agent should be in its own file under `src/agents/`
- Follow the single responsibility principle
- Include proper error handling
- Add comprehensive logging

### CLI Development
- CLI commands should be in `src/cli/`
- Use Commander.js for argument parsing
- Include help text for all commands
- Add input validation

### Utility Functions
- Place utility functions in `src/utils/`
- Make functions pure when possible
- Include JSDoc comments
- Add unit tests for utilities

## 📚 Documentation

### Code Documentation
- Use JSDoc comments for all functions
- Include parameter types and return values
- Add examples for complex functions

### API Documentation
- Document all public APIs
- Include request/response examples
- Keep documentation up to date

## 🔄 Pull Request Process

1. **Create a feature branch** from `develop`
2. **Make your changes** following the guidelines above
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Run tests** and ensure they pass
6. **Submit a pull request** to the `develop` branch

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Test addition

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Error messages or logs

## 💡 Feature Requests

When requesting features, please include:
- Clear description of the feature
- Use case and benefits
- Implementation suggestions (if any)
- Priority level

## 📞 Getting Help

- Create an issue for bugs or feature requests
- Join our discussions for general questions
- Check existing documentation first

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AI Agent Builder! 🚀 