var webpack=require('webpack');
module.exports={
  entry: [
    'script!jquery/dist/jquery.min.js',
    'script!foundation-sites/dist/foundation.min.js',
    './app/app.jsx'
  ],
  externals:{
    jquery:'jQuery'
  },
  plugins:[
    new webpack.ProvidePlugin({
      '$':'jquery',
      'jquery':'jquery'
    })
  ],
  output: {
    path:__dirname,
    filename:'./public/bundle.js'
  },
  resolve :{
    root:__dirname,
    alias:{
      Main:'app/components/Main.jsx',
      CountryForm: 'app/components/CountryForm.jsx',
      YearForm: 'app/components/YearForm.jsx',
      VariableForm: 'app/components/VariableForm.jsx',
      dhisImporter:'app/components/dhisImporter.jsx',
      Nav:'app/components/Nav.jsx',
      applicationStyles:'app/styles/app.scss'

    },
    extensions:['','.js','jsx']
  },
  module:{
    loaders:[
      {
        loader:'babel-loader',
        query: {
          presets:['react','es2015','stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
devtool: 'inline-source-map'
};
