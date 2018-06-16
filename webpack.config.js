const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');

// Is the current build a development build
const IS_DEV = (process.env.NODE_ENV === 'dev');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'app');
const dirAssets = path.join(__dirname, 'assets');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const appHtmlTitle = 'Mailsploit';

// Markdown
const markdown = require('markdown-it')({html: true});

const iterator = require('markdown-it-for-inline');
/*markdown.use(iterator, 'add_span', 'text', (tokens, idx) => {
    const token = tokens[idx];
    // replace original
    //tokens[idx].content = `<span>${token.content.split(' ').join('</span> <span>')}</span>`;
});*/
markdown.use(require('./app/markdown-it-video/index', { // <-- this use(package_name) is required
  youtube: { width: 480, height: 251, theme: 'white' },
  vimeo: { width: 500, height: 281 },
  vine: { width: 600, height: 600, embed: 'simple' },
  prezi: { width: 550, height: 400 }
}));
markdown.use(iterator, 'url_new_win', 'link_open', (tokens, idx) => {
    const currentLink = tokens[idx];
    currentLink.attrPush([ 'target', '_blank' ]);

    let rel = 'noreferrer';
    if (currentLink.attrs[0][1] !== 'https://wire.com') {
        rel = `${rel} nofollow`;
    }

    currentLink.attrPush([ 'rel', rel ]);
});
markdown.renderer.rules['paragraph_open'] = (tokens, idx, options, env, self) => {
  return '<p><span>';
};
markdown.renderer.rules['paragraph_close'] = (tokens, idx, options, env, self) => {
  return '</span></p>';
};

/*markdown.renderer.rules.text = (tokens, idx) => {
  // disable escaping, god dammit fuck that crap
  return tokens[idx].content;
};*/


/*markdown.use(require('markdown-it-container'), 'paragraph', {
  validate: (params) => params.trim() === 'paragraph',
  //const m = tokens[idx].info.trim();
  render: (tokens, idx) => {
    console.log(tokens);
    return (tokens[idx].nesting === 1 ? '<div>' : '</div>');
  }
});
markdown.renderer.rules['paragraph_open'] = (tokens, idx, options, env, self) => {
  return '<p class="test">';
};*/

/*markdown.renderer.rules['text'] = (tokens, idx, options, env, self) => {
    console.log('INLINE');
    //console.log(idx);
    //console.log(tokens[idx]);
    //console.log(tokens[idx - 1] === 'paragraph_open');

    console.log(options);
    console.log(env);
    console.log(self);

  return 'lOL';
};*/


/*markdown.core.ruler.at('replacements', function replace(state) {
    //...
    const tokens = state.tokens;
    let interator = 0;
    for (token of tokens) {
        if (token.type === 'inline') {
            if (tokens[interator - 1].type === 'paragraph_open') {
                console.log('PARAGRAPHGE OMGGG');
                // replace original
                state.tokens[interator].content = 'tgtg';
            }
            console.log('inline maggle');
        }
        interator++;
    }
});
*/


/*markdown.renderer.rules['paragraph_close'] = (tokens, idx, options, env, self) => {
  return '</p>';
};*/

/**
 * Webpack Configuration
 */
module.exports = {
    output: {
        crossOriginLoading: 'anonymous',
    },
    entry: {
        /*vendor: [
            'lodash'
        ],*/
        bundle: path.join(dirApp, 'index')
    },
    resolve: {
        modules: [
            dirNode,
            dirApp,
            dirAssets,
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].[chunkhash].css'),

        new FaviconsWebpackPlugin(path.join(dirAssets, 'images', 'favicon.png')),

        /*new webpack.ProvidePlugin({
            // lodash
            '_': 'lodash'
        }),*/

        new SriPlugin({
            hashFuncNames: ['sha256', 'sha384'],
            enabled: !IS_DEV,
        }),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.pug'),
            title: 'Main',
            formUrl: (IS_DEV ? 'http://127.0.0.1:8081/process' : 'https://backend.mailsploit.com/process'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: false,
                minifyJS: true
              },
        })
    ],
    module: {
        rules: [
            // BABEL
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
                options: {
                    //compact: true,
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/transform-runtime', '@babel/plugin-proposal-object-rest-spread']
                },
            },

            // STYLES
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: IS_DEV
                            }
                        },
                        'postcss-loader'
                    ],
                })
            },

            // CSS / SASS
            {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: IS_DEV
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: IS_DEV,
                                includePaths: [
                                    dirAssets
                                ],
                            }
                        },
                        'postcss-loader'
                    ],
                })
            },

            // Fonts
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[sha512:hash:base64:7].[ext]',
                },
            },

            // Pug
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    filters: {
                        'markdown-custom': (text, options) => markdown.render(text)
                    },
                    pretty: false,
                    self: true,
                },
            },

            // IMAGES
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[sha512:hash:base64:7].[ext]'
                        }
                    },
                    {
                      loader: 'image-webpack-loader',
                      options: {
                        bypassOnDebug: true,
                      },
                    },
                ],
            }

        ]
    },
};
