import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Byline from "../components/byline";
import useIndexPosts from "../components/useIndexPosts";

export default function IndexPage() {
  const posts = useIndexPosts();

  return (
    <Layout>
      <SEO title="Home" />

      <ul className="list mh1 mh2-ns">
        {posts.map(({ id, title, slug, description, timeToRead, date }) => (
          <li key={id} className="mt4-ns">
            <Link to={slug} className="db">
              {title}
            </Link>{" "}
            {/*&middot; {timeToRead}m read*/}
            <Byline date={date} timeToRead={timeToRead} />
            <div className="mt3">
              <div
                className="f5"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
