import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Byline from "../components/byline"

export default function Template(props) {
  const {
    title,
    date,
    timeToRead,
    html,
    slug,
    previous,
    next,
  } = props.pageContext

  const nav = (
    <div className="f5">
      {previous && (
        <span className="f">
          ← <Link to={previous.slug}>{previous.title}</Link>
        </span>
      )}
      {previous && next && " | "}
      {next && (
        <span className="f">
          <Link to={next.slug}>{next.title}</Link> →
        </span>
      )}
    </div>
  )

  return (
    <Layout>
      <SEO title={title} />
      <div className="pa2">
        <div>
          {nav}

          <div>
            <Link className="mt4 mb0 f2 black" to={slug}>
              {title}
            </Link>
          </div>

          <Byline date={date} timeToRead={timeToRead} />

          <div className="mt4 f5" dangerouslySetInnerHTML={{ __html: html }} />

          {nav}
        </div>
      </div>
    </Layout>
  )
}
