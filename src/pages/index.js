import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import DataLog from "../components/DataLog"

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <DataLog variable="temperature" yMin={65} yMax={90} title="Temperature" />
      <DataLog variable="humidity" yMin={0} yMax={100} title="Humidity" />
      { false && <>
        <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
          <Image />
        </div>
        <Link to="/page-2/">Go to page 2</Link>
      </>}
    </Layout>
  );
};

export default IndexPage
