import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />

    <div className="tc avenir">
      <h1 className="f1 athelas">404</h1>
      <h2 className="f2 mt4 bt athelas">Page not found :(</h2>
      <p>The requested page could not be found.</p>
    </div>
  </Layout>
)

export default NotFoundPage
