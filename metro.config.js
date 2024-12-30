// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this for expo-router context resolution
config.resolver.requireCycle = ['expo-router'];

module.exports = config; 