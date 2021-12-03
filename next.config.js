const composePlugins = require('next-compose-plugins')

const path = require('path')

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});
const nextConfig = {
  /** Tell Next that it should render MDX files as page if they're in the page directory. */
  pageExtensions: ["js", "jsx", "mdx"],
};
module.exports = withMDX({
  layoutPath: './layouts',
    images: {
      domains: ['img.icons8.com'],
    },
    sassOptions: {
      includePaths: [path.join(__dirname, 'public/assets/styles/global.scss')],
    },
  defaultLayout: true,
  fileExtensions: ['mdx'],
  remarkPlugins: [],
  rehypePlugins: [],
  usesSrc: false,

  extendFrontMatter: {
    process: (mdxContent, frontMatter) => {},
    phase: 'prebuild|loader|both',
  },
  reExportDataFetching: false,
})
