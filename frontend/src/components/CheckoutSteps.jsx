import { Navbar } from "flowbite-react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Navbar className="mb-4">
      {step1 ? (
        <Link to="/login" className=" text-blue-500">
          Sign In
        </Link>
      ) : (
        <Link disabled className=" text-gray-500">
          Sign In
        </Link>
      )}
      {step2 ? (
        <Link to="/shipping" className=" text-blue-500">
          Shipping
        </Link>
      ) : (
        <Link disabled className=" text-gray-500">
          Shipping
        </Link>
      )}
      {step3 ? (
        <Link to="/payment" className=" text-blue-500">
          Payment
        </Link>
      ) : (
        <Link disabled className=" text-gray-500">
          Payment
        </Link>
      )}
      {step4 ? (
        <Link to="/placeorder" className=" text-blue-500">
          Place Order
        </Link>
      ) : (
        <Link disabled className=" text-gray-500">
          Place Order
        </Link>
      )}
    </Navbar>
  );
};

export default CheckoutSteps;
