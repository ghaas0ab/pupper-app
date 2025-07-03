export default {
 testEnvironment: 'jest-fixed-jsdom',
 transform: {
 '^.+\\.tsx?$': 'ts-jest', // Supports TypeScript files
 },
 moduleNameMapper: {
 '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Handling CSS imports
 },
 };