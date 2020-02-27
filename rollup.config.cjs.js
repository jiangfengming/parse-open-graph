import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',

  output: {
    format: 'cjs',
    exports: 'named',
    file: 'dist/openGraph.js'
  },

  plugins: [
    babel()
  ]
}
