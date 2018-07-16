import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    exports: 'named',
    format: 'umd',
    name: 'openGraph',
    file: 'dist/openGraph.umd.js'
  },
  plugins: [
    babel()
  ]
}
