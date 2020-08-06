/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            babelTransformerPath: require.resolve('react-native-svg-transformer'),
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),
    },
};
