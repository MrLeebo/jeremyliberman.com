import { useStaticQuery, graphql } from "gatsby";

export default function useIndexPosts() {
  const { allMarkdownRemark } = useStaticQuery(
    graphql`
      query {
        allMarkdownRemark(
          limit: 1000
          sort: { order: DESC, fields: [fields___slug] }
        ) {
          edges {
            node {
              id
              timeToRead
              excerpt(format: HTML, pruneLength: 500)
              frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `
  );

  return allMarkdownRemark.edges.map(({ node }) => ({
    id: node.id,
    timeToRead: node.timeToRead,
    excerpt: node.excerpt,
    slug: node.fields.slug,
    title: node.frontmatter.title,
    date: node.frontmatter.date
  }));
}
