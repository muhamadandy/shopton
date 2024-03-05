import { Footer } from "flowbite-react";

const FooterComp = () => {
  const currentYear = new Date().getFullYear();
  return (
    <Footer container className="mt-auto">
      <Footer.Copyright
        href="/"
        by="Shopton™"
        year={currentYear}
        style={{ textAlign: "center", width: "100%" }}
      />
    </Footer>
  );
};

export default FooterComp;
