export default {
  expo: {
    name: "Astronia",
    slug: "pill-keeper",
    version: "1.2.0",
    sdkVersion: "52.0.0",
    platforms: ["ios", "android"],
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.astronia.app",
      buildNumber: "3",
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
      versionCode: 3,
    },
    extra: {
      eas: {
        projectId: "fae96cfc-b4ef-459f-ba3b-978f313597df",
      },
    },
  },
};
