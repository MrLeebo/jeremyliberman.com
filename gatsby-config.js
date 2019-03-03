const age = new Date().getFullYear() - 1985;

module.exports = {
  siteMetadata: {
    title: `Jeremy Liberman`,
    description: `My name is Jeremy Liberman and I am currently ${age} years old and work as a Software Developer in the Kansas City area.`,
    author: `@MrLeebo`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "pages",
        path: `${__dirname}/src/pages`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-external-links`,
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-prismjs`
        ]
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Jeremy Liberman's Blog`,
        short_name: `MrLeebo's Blog`,
        start_url: `/`,
        background_color: `#fffceb`,
        theme_color: `#fffceb`,
        display: `minimal-ui`,
        icon: `src/images/avatar.png`, // This path is relative to the root of the site.
        include_favicon: true
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-39343115-1"
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    "gatsby-plugin-offline"
  ]
};
