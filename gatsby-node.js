/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { graphql } = require("gatsby");
const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require("path");
const slugify = require("slug");
const moment = require("moment");

function slug(node) {
  const { title, date } = node.frontmatter;
  const slug = slugify(title, { lower: true });
  return `/${moment.utc(date).format("YYYY/MM/DD")}/${slug}.html`;
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const component = path.resolve(`src/templates/blog-post.js`);

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            html
            timeToRead
            frontmatter {
              title
              description
              date
              formatted_date: date(formatString: "MMMM DD, YYYY")
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    return Promise.reject(result.errors);
  }

  const posts = result.data.allMarkdownRemark.edges;
  posts.forEach(({ node }, index) => {
    const {
      html,
      timeToRead,
      frontmatter: { date, formatted_date, title, description }
    } = node;

    const path = slug(node);
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;
    console.log({ description });

    createPage({
      path,
      component,
      context: {
        slug: path,
        date: formatted_date,
        title,
        description,
        timeToRead: timeToRead,
        next: next && { title: next.frontmatter.title, slug: slug(next) },
        previous: previous && {
          title: previous.frontmatter.title,
          slug: slug(previous)
        },
        html
      }
    });
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    createNodeField({ node, name: `slug`, value: slug(node) });
  }
};
