/*module.exports = ({ file, options, env }) => ({
  parser: file.extname === '.sss' ? 'sugarss' : false,
  plugins: {
    'postcss-import': { root: file.dirname },
    'postcss-cssnext': options.cssnext ? options.cssnext : false,
    'autoprefixer': env == 'production' ? options.autoprefixer : false,
    'cssnano': env === 'production' ? options.cssnano : false,
    'css-mqpacker': env === 'production' ? options.mqpacker : false,
  }
});
*/

module.exports = {
    plugins: [
        //require('postcss-import'),
        require('postcss-cssnext'),
        require('css-mqpacker'),
        /*require('cssnano')({
            preset: ['advanced', {
                discardComments: {
                    removeAll: true,
                },
            }]
        }),*/
    ]
};