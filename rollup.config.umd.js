import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    format: 'umd',
    name: 'openGraph',
    file: 'dist/openGraph.umd.js'
  },
  plugins: [
    babel()
  ]
}
