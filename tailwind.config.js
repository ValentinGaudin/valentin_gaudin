module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js', './lib/**/*.js', './pages/*.js'],
    darkMode: 'media',
      justifyContent: ['hover', 'focus'],
  theme: {
    colors:  {
      transparent: 'transparent',
      current: 'currentColor',
      purple :{
        light: '#8350ec',
        DEFAULT: '#682ae9',
        dark: '#3d08AA',
      },
      yellow :{
        light: '#D4E702',
        DEFAULT: '#EAFE16',
        dark: '#383D00',
      },
      orange :{
        light: '#FFD56F',
        DEFAULT: '#FFBB17',
        dark: '#A57500',
      },
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}