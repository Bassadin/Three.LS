module.exports = {
    mount: {
        public: '/',
        src: '/_dist_',
    },
    buildOptions: {
        sourceMaps: true,
    },
    plugins: ['@snowpack/plugin-typescript'],
    installOptions: {
        installTypes: true,
    },
};
