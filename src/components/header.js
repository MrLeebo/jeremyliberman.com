import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import useRecentPosts from "./useRecentPosts"

export default function Header({ siteTitle }) {
  const posts = useRecentPosts()

  return (
    <header className="f3 mt4 bg-near-black white pa3 br2 br--right avenir">
      <Link to="/" className="f2 lh-title white avenir">
        {siteTitle}
      </Link>
      <p className="mt3 f4 light-gray">
        Using computer technology to solve people problems
      </p>

      <ul className="ml0 list">
        <li className="ml2 silver">Recent Posts</li>
        {posts.map(({ id, slug, title, date }) => (
          <li key={id}>
            <Link to={slug} className="f5 white">
              {title}
            </Link>
            <div className="f6 silver">On {date}</div>
          </li>
        ))}
      </ul>

      <div className="f6 tc">
        <a
          href="https://github.com/MrLeebo"
          target="_blank"
          rel="noopener noreferrer"
          className="white"
        >
          GitHub
        </a>{" "}
        |{" "}
        <a
          href="https://twitter.com/mrleebo"
          target="_blank"
          rel="noopener noreferrer"
          className="white"
        >
          Twitter
        </a>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}
