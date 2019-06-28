module.exports = {
  plugins: [
    require('autoprefixer'),
    // https://cssnano.co/

    require('cssnano')({
      preset: [
        'default',
        {
          normalizeWhitespace: false,
        },
      ],
    }),
  ],
};
