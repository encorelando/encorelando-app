# EncoreLando Testing Infrastructure

This directory contains the testing infrastructure for the EncoreLando mobile-first concert discovery application. The testing implementation follows the comprehensive testing strategy outlined in `/docs/dev/testing-strategy.md`.

## Directory Structure

The testing structure follows our application architecture:

```
src/
├── test/                 # Test configuration and utilities
│   ├── setupTests.js     # Jest setup and global mocks
│   ├── testUtils.js      # Testing utilities and helpers
│   └── __mocks__/        # Mock implementations for imports
│
├── services/__tests__/   # Tests for API service layer
├── hooks/__tests__/      # Tests for custom React hooks
├── components/__tests__/ # Tests for UI components
```

## Test Types

1. **Unit Tests**: Test individual units of code in isolation (functions, components)
2. **Integration Tests**: Test how units work together (hooks with services, components with hooks)
3. **Component Tests**: Test UI components with different props and states
4. **Accessibility Tests**: Ensure components meet accessibility standards

## Testing Tools

- **Jest**: Core testing framework
- **React Testing Library**: Component testing with a focus on user interaction
- **jest-axe**: Accessibility testing
- **MSW (Mock Service Worker)**: API mocking (future implementation)

## Mock Strategy

- **Supabase Client**: Mocked at the service level to isolate API tests
- **Component Dependencies**: Mocked to isolate component tests
- **Browser APIs**: Mocked when needed (localStorage, matchMedia, etc.)

## Accessibility Testing

All component tests include accessibility checking using jest-axe to ensure WCAG compliance:

```javascript
it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Mobile-First Testing

Our testing approach emphasizes mobile-first design requirements:

1. **Touch Optimization**: Tests verify components have appropriate touch target sizes
2. **Responsive Behavior**: Components are tested with different viewport sizes
3. **Performance**: Services are tested for optimal mobile data patterns

## Running Tests

You can run tests using the following npm scripts:

- `npm test`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report
- `npm run test:unit`: Run unit tests only
- `npm run test:services`: Run service layer tests only
- `npm run test:components`: Run component tests only
- `npm run test:hooks`: Run custom hook tests only
- `npm run test:ci`: Run tests for CI environment

## Coverage Requirements

We aim for the following coverage metrics:

- **Service Layer**: 90%+ coverage
- **UI Components**: 80%+ coverage
- **Custom Hooks**: 80%+ coverage
- **Utility Functions**: 90%+ coverage

## Test Utilities

The `testUtils.js` file provides helpful utilities for testing:

- Mock data for testing (concerts, artists, venues, etc.)
- Custom render function with router and other providers
- Viewport size utilities for responsive testing
- Supabase response mocking helpers

## CI/CD Integration

Tests are automatically run in our CI/CD pipeline on GitHub Actions:

1. On every pull request to the main or develop branch
2. On every push to the main or develop branch
3. Coverage reports are generated and stored as artifacts

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component/function does, not how it's implemented
2. **Mobile-First Verification**: Always test mobile behavior first
3. **Accessibility**: Include axe testing for all components
4. **Mock External Dependencies**: Use mocks for external services and APIs
5. **Isolate Tests**: Each test should be independent and not rely on others

## Adding New Tests

When adding new tests, follow these guidelines:

1. Place tests in the appropriate `__tests__` directory
2. Use the naming convention `[filename].test.js`
3. Mock dependencies to isolate the unit being tested
4. Include mobile-first and accessibility testing
5. Aim for the coverage requirements specified above
