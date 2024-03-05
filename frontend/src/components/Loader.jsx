import { Spinner } from "flowbite-react";

const Loader = () => {
  return (
    <Spinner
      className=" w-10 h-10 m-auto block"
      aria-label="Default status example"
    />
  );
};

export default Loader;
