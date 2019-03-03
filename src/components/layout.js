/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { Helmet } from "react-helmet";

import Header from "./header";
import "./layout.css";

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          bodyAttributes={{
            class: "bg-washed-yellow"
          }}
        >
          <link
            rel="stylesheet"
            href="https://unpkg.com/tachyons@4/css/tachyons.min.css"
          />
        </Helmet>

        <div className="cf">
          <div className="fixed left-0 top-1 w-20 measure-narrow pr3 dn db-l">
            <Header siteTitle={data.site.siteMetadata.title} />
          </div>
          <div className="center avenir w-60-l f3 measure-wide lh-copy">
            <main>{children}</main>
          </div>
        </div>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
