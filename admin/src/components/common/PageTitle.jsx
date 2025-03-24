import React from "react";
import { Helmet } from "react-helmet";

const PageTitle = ({ title, description }) => {
  return (
    <Helmet>
      <title>
        {" "}
        {title
          ? `${title} | React eCommerce Admin Dashboard`
          : "ZetuMall "}
      </title>
      <meta
        name="description"
        content={
          description
            ? ` ${description} `
            : "Zetumall Admin Dashboard"
        }
      />
    </Helmet>
  );
};

export default PageTitle;
