import { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="text-2xl mb-4 text-slate-500">Payment Method</h1>
      <form onSubmit={submitHandler} className="flex max-w-md flex-col gap-4">
        <label>Select Method</label>
        <div>
          <input
            type="radio"
            className="my-2 mr-2"
            value="PayPal"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span>PayPal or Credit Card</span>
        </div>
        <Button type="submit">Continue</Button>
      </form>
    </FormContainer>
  );
};

export default PaymentScreen;
