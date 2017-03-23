const sauceLabsLaunchers = {
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'Windows 10',
    version: '',
  },
  sl_ie11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11',
  },
  sl_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.12',
    version: '10',
  },
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '55.0',
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '50.0',
  },
  sl_ios: {
    base: 'SauceLabs',
    browserName: 'Safari',
    appiumVersion: '1.6.3',
    deviceName: 'iPhone Simulator',
    deviceOrientation: 'portrait',
    platformVersion: '10.0',
    platformName: 'iOS',
  },
  sl_android: {
    base: 'SauceLabs',
    browserName: 'Browser',
    appiumVersion: '1.5.3',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait',
    platformVersion: '5.1',
    platformName: 'Android',
  },
};

function getBrowsers() {
  if (process.env['TRAVIS'] === 'true') {
    return Object.keys(sauceLabsLaunchers);
  } else {
    return ['Chrome'];
  }
}

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'browser.js',
      'bower_components/forgiven-mocha/browser.js',
      'bower_components/chai/chai.js',
      'integration/browser/test.js',
    ],
    exclude: [
    ],
    preprocessors: {
    },
    reporters: ['progress'],
    customLaunchers: sauceLabsLaunchers,
    browsers: getBrowsers(),
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: 5,
  });
};
