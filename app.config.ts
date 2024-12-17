export default {
  expo: {
    name: "PillKeeper",
    slug: "pill-keeper",
    version: "1.0.0",
    sdkVersion: "52.0.0",
    platforms: ["ios", "android"],
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.pillkeeper.app",
      buildNumber: "1",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#4CAF50",
        duration: 3000,  
      },
    },
    android: {
      package: "com.pillkeeper.app",  
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#4CAF50",
        duration: 3000,  
      },
    },
    extra: {
      eas: {
        projectId: "fae96cfc-b4ef-459f-ba3b-978f313597df", 
      },
    },
  },
};
