# ArbPay Automation Testing Suite

A Playwright-based end-to-end automation testing framework for the ArbPay application. This project demonstrates automated browser interactions including navigation, authentication, price monitoring, and transaction execution with real-time data validation.

## 📋 Overview

ArbPay Automation is a robust testing solution that automates the complete user journey on the ArbPay platform. It provides intelligent price monitoring capabilities to identify and act upon listings matching specific criteria, with automated purchase execution at target price points (₹1000).

## ✨ Features

- **Automated Navigation** - Seamless browser automation using Playwright's modern testing framework
- **User Authentication** - Secure login automation with credential handling
- **Price Monitoring** - Real-time price filtering to identify target listings
- **Transaction Automation** - One-click automated purchase execution with action confirmation
- **Comprehensive Reporting** - Built-in Playwright test reporting with detailed execution logs
- **Cross-browser Support** - Tests configured to run on Chromium, Firefox, and WebKit browsers
- **Error Handling** - Robust error context and debugging capabilities

## 🛠️ Tech Stack

- **Playwright** - Modern E2E testing framework for web automation
- **Node.js** - JavaScript runtime environment
- **npm** - Package management and dependency handling

## 📁 Project Structure

```
├── tests/
│   └── ArbPay.spec.js              # Main test specifications
├── playwright.config.js             # Playwright configuration
├── package.json                     # Project dependencies and scripts
├── playwright-report/               # Automated test reports
├── test-results/                    # Test execution results
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd "Automation Testing - PlayWright"
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## 🧪 Running Tests

### Run all tests:

```bash
npm test
```

### Run tests in headed mode (see browser):

```bash
npx playwright test --headed
```

### Run specific test file:

```bash
npx playwright test tests/ArbPay.spec.js
```

### Run tests in debug mode:

```bash
npx playwright test --debug
```

### Generate and view test report:

```bash
npx playwright show-report
```

## 📊 Test Reports

After running tests, view the comprehensive HTML report:

```bash
npx playwright show-report playwright-report/
```

The report includes:

- Test execution timeline
- Pass/fail status
- Error screenshots and videos
- Detailed logs and traces

## ⚙️ Configuration

Edit `playwright.config.js` to customize:

- **Browser Settings** - Chromium, Firefox, WebKit configurations
- **Timeout Values** - Adjust wait times and test timeouts
- **Viewport Size** - Set browser window dimensions
- **Headless Mode** - Run with or without GUI
- **Retry Logic** - Configure automatic test retries
- **Base URL** - Set the application's base URL

Example configuration:

```javascript
use: {
  baseURL: 'https://arbpay.example.com',
  headless: true,
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

## 🔐 Security & Best Practices

- **Credentials Management** - Use environment variables for sensitive data
- **Session Handling** - Proper login/logout automation
- **Error Handling** - Comprehensive error context logging
- **Test Isolation** - Each test is independent and reproducible

## 📝 Test Scenarios

The current test suite covers:

1. **Application Launch** - Verify application title and accessibility
2. **User Navigation** - Automated navigation through application pages
3. **Price Monitoring** - Filter and identify listings at target prices (₹1000)
4. **Purchase Automation** - Execute buy actions with confirmation

## 🐛 Troubleshooting

### Tests timing out

- Increase timeout in `playwright.config.js`
- Check network connectivity to the application
- Verify element selectors are correct

### Browser not starting

```bash
npx playwright install --with-deps
```

### Tests failing sporadically

- Review test timing and wait strategies
- Check if application state changes affect test reliability
- Add additional wait conditions for dynamic content

## 🔄 CI/CD Integration

This project can be integrated into CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins, etc.):

```yaml
- name: Install dependencies
  run: npm install && npx playwright install

- name: Run tests
  run: npm test

- name: Upload test reports
  uses: actions/upload-artifact@v2
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Configuration Guide](https://playwright.dev/docs/test-configuration)

## 👨‍💻 Author

Created as an automation testing portfolio project demonstrating Playwright expertise and E2E testing capabilities.

## 📄 License

This project is provided as-is for educational and testing purposes.

## 🤝 Contributing

Feel free to fork and modify this project for your testing needs. Contributions and improvements are welcome!

---

**Happy Testing! 🎭**
