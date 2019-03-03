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
              frontmatter {
                title
                description
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
    slug: node.fields.slug,
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    date: node.frontmatter.date
  }));
}
