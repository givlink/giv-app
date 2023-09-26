module.exports = {
  devServer: {
    port: 3001,
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
}
