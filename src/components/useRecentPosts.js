import { useStaticQuery, graphql } from "gatsby"

export default function useRecentPosts() {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        limit: 3
        sort: { order: DESC, fields: [fields___slug] }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date(formatString: "MMM DD, YYYY")
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  return allMarkdownRemark.edges.map(({ node }) => ({
    id: node.id,
    slug: node.fields.slug,
    date: node.frontmatter.date,
    title: node.frontmatter.title,
  }))
}
