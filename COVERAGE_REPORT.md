# Code Coverage Report Guide

## Overview

This document explains how to run tests and check code coverage to ensure quality standards are met (80%+ coverage required).

## Coverage Requirements

The project enforces **80% minimum coverage** across all metrics:
- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

## Running Coverage Reports

### Generate Full Coverage Report
```bash
npm run test:coverage
```

Output will show:
- Coverage summary table
- Detailed file-by-file breakdown
- Uncovered lines identified

### View HTML Coverage Report
After running coverage:
```bash
# On Windows
start coverage/lcov-report/index.html

# On macOS
open coverage/lcov-report/index.html

# On Linux
xdg-open coverage/lcov-report/index.html
```

### Generate and Auto-Open Report
```bash
npm run test:coverage:report
```

## Coverage Metrics Explained

### Statements
- Percentage of statements that have been executed
- Each line of code is a statement
- Goal: 80%+

### Branches
- Percentage of conditional branches covered (if/else, switch, ternary)
- Each code path is a branch
- Goal: 80%+

### Functions
- Percentage of declared functions that have been called
- Goal: 80%+

### Lines
- Percentage of lines that have been executed
- Similar to statements but counts physical lines
- Goal: 80%+

## Test File Structure

### Services Tests
**Location**: `services/*.test.js`

Test coverage includes:
- Input validation
- Required field validation
- Data structure validation
- Error handling
- Response formatting

Files with tests:
- ✅ user.services.test.js
- ✅ library.services.test.js
- ✅ rent.services.test.js
- ✅ search.services.test.js
- ✅ upload.services.test.js
- ✅ book.services.test.js

### Controllers Tests
**Location**: `controllers/*.test.js`

Test coverage includes:
- Request validation
- User extraction from tokens
- Response formatting
- Error handling
- Parameter passing

Files with tests:
- ✅ user.controller.test.js
- ✅ library.controller.test.js
- ✅ payment.controller.test.js
- ✅ rent.controller.test.js
- ✅ search.controller.test.js
- ✅ upload.controller.test.js

### Utils Tests
**Location**: `utils/*.test.js`

Test coverage includes:
- Email validation
- Password strength validation
- Phone number validation
- MongoDB ObjectId validation
- ISBN validation
- Input sanitization

Files with tests:
- ✅ validators.test.js

## Coverage Goals by File

### High Priority (Core Functionality)

| File | Target | Current |
|------|--------|---------|
| utils/validators.js | 90%+ | In Progress |
| services/user.services.js | 85%+ | In Progress |
| services/library.services.js | 85%+ | In Progress |
| controllers/user.controller.js | 80%+ | In Progress |
| controllers/library.controller.js | 80%+ | In Progress |

### Medium Priority (Important Features)

| File | Target | Current |
|------|--------|---------|
| services/rent.services.js | 80%+ | In Progress |
| services/payment.services.js | 80%+ | In Progress |
| controllers/payment.controller.js | 80%+ | In Progress |

### Standard Priority (Support Functions)

| File | Target | Current |
|------|--------|---------|
| services/search.services.js | 75%+ | In Progress |
| services/upload.services.js | 75%+ | In Progress |
| controllers/search.controller.js | 75%+ | In Progress |
| controllers/upload.controller.js | 75%+ | In Progress |

## Running Specific Tests

### Run All Tests
```bash
npm test
```

### Run Single Test File
```bash
npm test -- services/user.services.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="email"
```

### Run Tests in Watch Mode
```bash
npm test:watch
```

Press `a` to run all tests, `f` to run failed tests, `q` to quit

## Coverage Reports Locations

After running `npm run test:coverage`, find reports at:

```
coverage/
├── lcov-report/
│   ├── index.html          # Main report
│   ├── services/
│   ├── controllers/
│   ├── utils/
│   └── middlewares/
├── lcov.info               # Raw coverage data
└── coverage-summary.json   # JSON summary
```

## Interpreting Coverage Reports

### Color Coding in HTML Report
- **Green**: Covered code (executed in tests)
- **Red**: Uncovered code (not executed)
- **Orange**: Partially covered (some branches missed)

### Example: File View
```
Line     | Branch | Function | Coverage
---------|--------|----------|----------
95       | -      | -        | ✓ Executed
96       | -      | ✓        | ✓ Executed
97       | ✗      | -        | ✗ Not Executed
98       | ◐      | -        | ◐ Partially Executed
```

## Improving Coverage

### 1. Identify Uncovered Lines
Look for red lines in the HTML report

### 2. Write Tests
Add test cases that execute those lines:

```javascript
describe('Uncovered Functionality', () => {
  test('should handle specific case', () => {
    const result = functionWithoutCoverage(input);
    expect(result).toBe(expected);
  });
});
```

### 3. Run Tests Again
```bash
npm run test:coverage
```

### 4. Verify Improvement
Check if coverage percentage increased

## Tips for High Coverage

### 1. Test Happy Path
```javascript
test('should succeed with valid input', () => {
  const result = myFunction(validInput);
  expect(result).toBeTruthy();
});
```

### 2. Test Error Cases
```javascript
test('should fail with invalid input', () => {
  expect(() => myFunction(invalidInput)).toThrow();
});
```

### 3. Test Edge Cases
```javascript
test('should handle null input', () => {
  const result = myFunction(null);
  expect(result).toBe(fallbackValue);
});
```

### 4. Test Conditions
```javascript
test('should handle if condition true', () => {
  const result = myFunction(true);
  expect(result).toBe(expectedValue);
});

test('should handle if condition false', () => {
  const result = myFunction(false);
  expect(result).toBe(otherExpectedValue);
});
```

## Coverage Thresholds

The project enforces these thresholds (defined in jest.config.js):

```javascript
coverageThreshold: {
  global: {
    branches: 80,      // 80% of branches covered
    functions: 80,     // 80% of functions covered
    lines: 80,         // 80% of lines covered
    statements: 80,    // 80% of statements covered
  }
}
```

**If tests don't meet threshold, `npm test` will fail.**

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Tests with Coverage
  run: npm run test:coverage
  
- name: Check Coverage Threshold
  run: npm test -- --coverage --collectCoverageFrom='src/**/*.js'
```

### Pre-commit Hook
```bash
#!/bin/bash
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

## Troubleshooting

### Issue: Coverage Not Generated
**Solution**: Ensure jest.config.js has `collectCoverageFrom` configured

### Issue: Tests Pass but Coverage Low
**Solution**: Add tests for uncovered branches and error cases

### Issue: HTML Report Not Opening
**Solution**: Manually open `coverage/lcov-report/index.html` in browser

### Issue: Module Not Found in Tests
**Solution**: Ensure ES6 imports match export syntax:
```javascript
// userModel.js
export default users;

// user.services.test.js
import users from '../models/userModel';
```

## Coverage Maintenance

### Regular Checks
- Run coverage report before commits
- Monitor coverage trends over time
- Set up CI/CD to fail on coverage drop

### Coverage Goals
- Initial target: 80%
- Stretch goal: 90%
- Maintain or improve with each PR

## Additional Resources

- [Jest Coverage Documentation](https://jestjs.io/docs/coverage)
- [Testing Best Practices](./BEST_PRACTICES.md)
- [Testing Guide](./TESTING.md)

## Quick Commands Reference

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test -- services/user.services.test.js

# Run tests matching pattern
npm test -- --testNamePattern="validation"

# Run with verbose output
npm test -- --verbose

# Debug tests
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Summary

✅ **80%+ coverage is required and enforced**
✅ **Test files created for all services and controllers**
✅ **Clear coverage reporting available**
✅ **CI/CD ready for coverage validation**

Run `npm run test:coverage` to see current coverage status!
