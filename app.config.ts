export default {
  expo: {
    name: "Astronia",
    slug: "astronia",
    version: "1.1.0",
    sdkVersion: "52.0.0",
    platforms: ["ios", "android"],
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.astronia.app",
      buildNumber: "2",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#FFFFFF",
        duration: 3000,
      },
    },
    android: {
      package: "com.astronia.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#FFFFFF",
        duration: 3000,
      },
      versionCode: 2,
    },
    extra: {
      eas: {
        projectId: "fae96cfc-b4ef-459f-ba3b-978f313597df",
      },
    },
  },
};
