// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
    ],
    client: {
      jasmine: {
        random: false,
        verboseDeprecations: true,
      },
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    reporters: ["progress", "coverage"],
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      subdir: ".",
      reporters: [
        { type: "html" },
        { type: "text-summary" },

        { type: "lcov" },
        {
          type: "lcov",
          subdir: "coverage",
          file: "sonar.xml",
        },
      ],
    },
    customLaunchers: {
      ChromeDebug: {
        base: "ChromeHeadless",
        flags: [
          "--remote-debugging-address=0.0.0.0",
          "--remote-debugging-port=9222",
          "--disable-web-security",
        ],
      },
    },
    debugger: true,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromeDebug"],
    browserNoActivityTimeout: 100000,
    browserDisconnectTimeout: 100000,
    pingTimeout: 2000,
    singleRun: false,
    restartOnFileChange: true,
    failOnSkippedTests: false,
    failOnFailingTestSuite: false,
    failOnEmptyTestSuite: false,
  });
};
