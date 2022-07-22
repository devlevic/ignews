/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: [
    '<rootDir>/tests/setupTests.ts'
  ],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true
          },
          keepClassNames: true,
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
            react: {
              runtime: 'automatic'
            }
          }
        },
        module: {
          type: 'es6',
          noInterop: false
        }
      }
    ]
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.tsx*',
    '!src/**/_app.tsx',
    '!src/**/_document.tsx',
    '!src/**/*.spec.tsx'
  ],
  coverageReporters: ['lcov', 'text']
};
