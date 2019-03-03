import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Byline from "../components/byline";

export default function Template(props) {
  const {
    title,
    date,
    timeToRead,
    html,
    slug,
    previous,
    next
  } = props.pageContext;

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
  );

  return (
    <Layout>
      <SEO title={title} />
      <div className="pa2">
        <div>
          <div className="db dn-ns">
            <Link to="/">Jeremy Liberman</Link>
          </div>
          <div className="dn db-ns">{nav}</div>

          <div>
            <Link className="mt4-l mb0 f4 f2-l black" to={slug}>
              {title}
            </Link>
          </div>

          <Byline date={date} timeToRead={timeToRead} />

          <div className="mt4 f5" dangerouslySetInnerHTML={{ __html: html }} />

          {nav}
        </div>
      </div>
    </Layout>
  );
}
