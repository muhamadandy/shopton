import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="content" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to Shopton",
  description: "We sell the best products for cheap",
  keywords: "Electronics, buy electronics,cheap electronics",
};

export default Meta;
