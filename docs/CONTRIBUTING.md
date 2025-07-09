# 🤝 Contributing to Fixelo

Thank you for your interest in contributing to Fixelo! This document provides guidelines and information for contributors.

## 🌟 How to Contribute

### Types of Contributions

We welcome several types of contributions:

1. **🐛 Bug Reports** - Help us identify and fix issues
2. **✨ Feature Requests** - Suggest new functionality
3. **📖 Documentation** - Improve or add documentation
4. **🔧 Code Contributions** - Fix bugs or implement features
5. **🎨 Design Improvements** - Enhance UI/UX
6. **🧪 Testing** - Add or improve tests
7. **🌍 Translations** - Add or improve translations

### Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/fixelo.git
   cd fixelo
   ```

2. **Set Up Development Environment**
   ```bash
   npm install
   npm run dev
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style

We use strict TypeScript and consistent formatting:

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

### Code Quality Checks

Before submitting, ensure your code passes:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm run test

# Test coverage
npm run test:coverage
```

### Project Structure

```
fixelo/
├── apps/
│   ├── api/           # NestJS API server
│   ├── web/           # Next.js web application
│   ├── mobile/        # React Native apps
│   └── admin/         # AdminJS panel
├── libs/
│   ├── common/        # Shared constants and types
│   ├── prisma/        # Database schema and client
│   └── utils/         # Utility functions
├── docs/              # Documentation
└── infra/             # Infrastructure configs
```

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Components**: `PascalCase`
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Database**: `snake_case`

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues to avoid duplicates
2. Test with the latest version
3. Provide minimal reproduction steps

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Additional Context**
Any other context about the problem.
```

## ✨ Feature Requests

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How would you like it to work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context or screenshots.
```

## 💻 Code Contributions

### Development Workflow

1. **Create Issue** (if it doesn't exist)
2. **Fork & Clone** the repository
3. **Create Branch** from `main`
4. **Make Changes** with tests
5. **Test Thoroughly**
6. **Submit Pull Request**

### Pull Request Process

1. **Update Documentation** if needed
2. **Add Tests** for new functionality
3. **Ensure CI Passes** (tests, linting, type-checking)
4. **Request Review** from maintainers
5. **Address Feedback** promptly

### Pull Request Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

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

## 🧪 Testing Guidelines

### Testing Strategy

- **Unit Tests**: Test individual functions/components
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows
- **Mobile Tests**: Test mobile app functionality

### Writing Tests

```typescript
// Unit test example
describe('UserService', () => {
  it('should create a new user', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    const result = await userService.create(userData);
    
    expect(result).toBeDefined();
    expect(result.email).toBe(userData.email);
  });
});

// Integration test example
describe('POST /api/users', () => {
  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'john@example.com' })
      .expect(201);
    
    expect(response.body.email).toBe('john@example.com');
  });
});
```

### Test Coverage

Maintain high test coverage:
- **Minimum**: 80% overall coverage
- **Critical paths**: 95% coverage
- **New features**: 100% coverage

## 📖 Documentation

### Documentation Standards

- **Clear and Concise**: Easy to understand
- **Code Examples**: Include working examples
- **Up-to-Date**: Keep documentation current
- **Multilingual**: Support EN/PT/ES where applicable

### Documentation Types

1. **API Documentation**: Swagger/OpenAPI specs
2. **User Guides**: How to use features
3. **Developer Guides**: Technical implementation
4. **Architecture Docs**: System design and decisions

### Writing Documentation

```markdown
# Feature Name

## Overview
Brief description of the feature.

## Usage
How to use the feature with examples.

## API Reference
Detailed API documentation.

## Examples
Working code examples.

## Troubleshooting
Common issues and solutions.
```

## 🌍 Internationalization

### Adding Translations

1. **Add Translation Keys**
   ```json
   // apps/web/locales/en/common.json
   {
     "welcome": "Welcome to Fixelo",
     "search": "Search services"
   }
   ```

2. **Translate to Other Languages**
   ```json
   // apps/web/locales/pt/common.json
   {
     "welcome": "Bem-vindo ao Fixelo",
     "search": "Buscar serviços"
   }
   
   // apps/web/locales/es/common.json
   {
     "welcome": "Bienvenido a Fixelo",
     "search": "Buscar servicios"
   }
   ```

3. **Use in Components**
   ```typescript
   import { useTranslation } from 'next-i18next';
   
   const { t } = useTranslation('common');
   return <h1>{t('welcome')}</h1>;
   ```

### Translation Guidelines

- **Consistent Terminology**: Use same terms throughout
- **Cultural Sensitivity**: Consider local customs
- **Professional Tone**: Maintain professional language
- **Context Awareness**: Consider UI space limitations

## 🔒 Security Guidelines

### Security Best Practices

1. **Input Validation**: Validate all user inputs
2. **Authentication**: Secure JWT implementation
3. **Authorization**: Proper role-based access control
4. **Data Encryption**: Encrypt sensitive data
5. **SQL Injection**: Use parameterized queries
6. **XSS Prevention**: Sanitize user content

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead, email security issues to: security@fixelo.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 📱 Mobile Development

### React Native Guidelines

1. **Platform-Specific Code**: Use platform checks when needed
2. **Performance**: Optimize for mobile performance
3. **Accessibility**: Implement accessibility features
4. **Testing**: Test on both iOS and Android

### Mobile Testing

```bash
# Start development server
npm run dev:mobile

# Test on iOS simulator
npm run ios

# Test on Android emulator
npm run android

# Run mobile tests
npm run test:mobile
```

## 🎨 Design Guidelines

### UI/UX Principles

1. **Consistency**: Follow design system
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Responsiveness**: Mobile-first design
4. **Performance**: Optimize for speed
5. **Usability**: Intuitive user experience

### Design System

- **Colors**: Use defined color palette
- **Typography**: Consistent font usage
- **Spacing**: Follow spacing guidelines
- **Components**: Reuse existing components

## 🔄 Release Process

### Version Management

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Workflow

1. **Create Release Branch**
   ```bash
   git checkout -b release/v1.2.0
   ```

2. **Update Version Numbers**
   ```bash
   npm version minor
   ```

3. **Update Changelog**
   ```markdown
   ## [1.2.0] - 2024-01-15
   
   ### Added
   - New booking system
   - Mobile app improvements
   
   ### Fixed
   - Payment processing issues
   - UI responsiveness
   ```

4. **Create Pull Request**
5. **Merge to Main**
6. **Create Release Tag**
7. **Deploy to Production**

## 🤝 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment:

1. **Be Respectful**: Treat everyone with respect
2. **Be Inclusive**: Welcome people of all backgrounds
3. **Be Constructive**: Provide helpful feedback
4. **Be Patient**: Help others learn and grow
5. **Be Professional**: Maintain professional standards

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Discord/Slack**: Real-time chat (if available)
- **Email**: Direct contact for sensitive issues

## 📊 Performance Guidelines

### Performance Standards

- **API Response Time**: < 200ms average
- **Web Page Load**: < 3 seconds
- **Mobile App Launch**: < 2 seconds
- **Database Queries**: < 100ms average

### Optimization Techniques

1. **Database**: Proper indexing and query optimization
2. **Caching**: Redis for frequently accessed data
3. **CDN**: Static asset delivery
4. **Code Splitting**: Lazy loading for large components
5. **Image Optimization**: Compressed and responsive images

## 🛠️ Development Tools

### Recommended Tools

- **IDE**: VS Code with extensions
- **Database**: Prisma Studio
- **API Testing**: Postman or Insomnia
- **Design**: Figma
- **Version Control**: Git with conventional commits

### VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## 📋 Checklist for Contributors

### Before Starting

- [ ] Read this contributing guide
- [ ] Set up development environment
- [ ] Understand project structure
- [ ] Check existing issues/PRs

### During Development

- [ ] Follow code style guidelines
- [ ] Write tests for new functionality
- [ ] Update documentation
- [ ] Test on multiple platforms/browsers

### Before Submitting

- [ ] Run all tests and ensure they pass
- [ ] Check code coverage
- [ ] Verify linting passes
- [ ] Update relevant documentation
- [ ] Create clear commit messages

## 🎯 Getting Help

### Resources

- **Documentation**: `/docs` folder
- **Examples**: `/examples` folder
- **Tests**: Look at existing tests for patterns
- **Code**: Study existing implementations

### Support Channels

1. **GitHub Issues**: Technical questions
2. **GitHub Discussions**: General questions
3. **Documentation**: Check existing docs first
4. **Community**: Connect with other contributors

## 🙏 Recognition

### Contributors

We recognize all contributors in:
- **README.md**: Contributors section
- **Release Notes**: Acknowledgments
- **GitHub**: Contributor badges
- **Community**: Shout-outs and thanks

### Contribution Types

All contributions are valued:
- 💻 Code
- 📖 Documentation
- 🐛 Bug reports
- 💡 Ideas
- 🎨 Design
- 🌍 Translation
- 🧪 Testing
- 📢 Promotion

## 📄 License

By contributing to Fixelo, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Fixelo! 🚀

For questions about contributing, please open an issue or contact the maintainers.

**Happy coding!** 🎉 