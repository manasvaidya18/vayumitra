module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                http: false,
                https: false,
                zlib: false,
                stream: false,
                util: false,
                url: false,
                assert: false,
                crypto: false,
                http2: false,
            };
            return webpackConfig;
        },
    },
};
