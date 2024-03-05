import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { Button, List, Card } from "flowbite-react";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="mx-auto mt-10">
      <h1 className=" m-4 text-3xl text-slate-600 font-semibold mb-6">
        Shopping Cart
      </h1>
      {cartItems.length === 0 ? (
        <Message>
          <div className="bg-red-500 p-4 m-4 rounded">
            Your cart is empty{" "}
            <Link to="/" className=" text-blue-700">
              Go Back
            </Link>
          </div>
        </Message>
      ) : (
        <List unstyled className="m-4">
          {cartItems.map((item) => (
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
              <div>${item.price}</div>
              <div className="flex items-center">
                <select
                  id="qty"
                  value={item.qty}
                  onChange={(e) =>
                    addToCartHandler(item, Number(e.target.value))
                  }
                  className="px-2 py-1 border rounded-md"
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                color="light"
                onClick={() => removeFromCartHandler(item._id)}
              >
                <FaTrash />
              </Button>
            </List.Item>
          ))}
          <Card className="max-w-sm">
            <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              items
            </h5>
            $
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
            <Button
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
              color="dark"
            >
              Procced to Checkout
            </Button>
          </Card>
        </List>
      )}
    </div>
  );
};

export default CartScreen;
