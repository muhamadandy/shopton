import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../slices/orderApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import { Button, Card, List, ListGroup, ListItem } from "flowbite-react";

const PlaceOrderScreen = () => {
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const navigate = useNavigate();
  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <div className="w-full md:w-6/12 md:mx-auto mb-4">
        <CheckoutSteps className="" step1 step2 step3 step4 />
      </div>
      <div className="px-10 w-full md:max-w-8/12 md:mx-auto">
        <div className="flex-1 flex-col">
          <div className="mb-4">
            <h1 className=" text-2xl text-slate-600 font-semibold">Shipping</h1>
            <strong>Address: </strong>
            {cart.shippingAddress.address},{cart.shippingAddress.city},
            {cart.shippingAddress.postalCode},{cart.shippingAddress.country},
          </div>
          <div className="mb-4">
            <h1 className=" text-2xl text-slate-600 font-semibold">
              Payment Method
            </h1>
            <strong>Method: </strong>
            {cart.paymentMethod}
          </div>
          <div>
            <h1 className=" text-2xl text-slate-600 font-semibold">
              Order Items
            </h1>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <List>
                {cart.cartItems.map((item) => (
                  <List.Item
                    key={item._id}
                    className="flex items-center justify-around space-x-4 border-b-2 p-2"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover mr-4"
                    />
                    <Link to={`/product/${item._id}`}>{item.name}</Link>

                    <div>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </div>
                  </List.Item>
                ))}
              </List>
            )}
          </div>
        </div>
        <Card className="max-w-6/12 mt-4">
          <ListGroup>
            <h1 className=" text-2xl text-slate-600 font-semibold">
              Order Summary
            </h1>
          </ListGroup>
          <ListGroup>
            <ListItem>Items: ${cart.itemsPrice}</ListItem>
          </ListGroup>
          <ListGroup>
            <ListItem>Shipping: ${cart.shippingPrice}</ListItem>
          </ListGroup>
          <ListGroup>
            <ListItem>Tax: ${cart.taxPrice}</ListItem>
          </ListGroup>
          <ListGroup>
            <ListItem>Total: ${cart.totalPrice}</ListItem>
          </ListGroup>
          <Button
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0}
          >
            Place Order
          </Button>
          {isLoading && <Loader />}
        </Card>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
