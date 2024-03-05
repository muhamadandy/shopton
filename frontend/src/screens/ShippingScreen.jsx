import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1 className=" text-2xl font-semibold text-slate-500 mb-4">Shipping</h1>
      <form onSubmit={submitHandler} className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label value="Address" />
          </div>
          <TextInput
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label value="City" />
          </div>
          <TextInput
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label value="Postal Code" />
          </div>
          <TextInput
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label value="Country" />
          </div>
          <TextInput
            type="text"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <Button type="submit">Continue</Button>
      </form>
    </FormContainer>
  );
};

export default ShippingScreen;
