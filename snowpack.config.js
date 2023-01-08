module.exports = {
    mount: {
        public: '/',
        src: '/_dist_',
    },
    buildOptions: {
        sourcemap: true,
    },
    plugins: ['@snowpack/plugin-typescript', '@snowpack/plugin-sass'],
    packageOptions: {
        installTypes: true,
    },
};
