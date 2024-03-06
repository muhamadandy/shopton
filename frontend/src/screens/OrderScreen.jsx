import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/orderApiSlice";
import { toast } from "react-toastify";
import { Button, Card, ListGroup, ListItem } from "flowbite-react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    isError,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("Payment Successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();
  //   toast.success("Payment Successful");
  // }
  function onError(err) {
    toast.error(err.message);
  }
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message className="bg-color-red-500">
      {err?.data?.message || err.error}
    </Message>
  ) : (
    <>
      <h1 className=" text-2xl font-semibold text-slate-500 p-4">
        Order {order._id}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 p-4">
        <div>
          <ListGroup className="p-4 space-y-2">
            <h2 className=" text-xl font-medium">Shipping</h2>
            <p>
              <strong>Name: </strong>
              {order.user.name}
            </p>
            <p>
              <strong>Email: </strong>
              {order.user.email}
            </p>
            <p>
              <strong>Address: </strong>
              {order.shippingAddress.address},{order.shippingAddress.city},
              {order.shippingAddress.postalCode},{order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <Message>
                <div className="bg-green-500 p-4 rounded">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </div>
              </Message>
            ) : (
              <Message>
                <div className=" bg-red-500 p-4 rounded">Not Delivered</div>
              </Message>
            )}
            <div className="mb-4 space-y-2">
              <h2 className=" text-xl font-medium">Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message>
                  <div className="bg-green-500 p-4 rounded">
                    Paid on {order.paidAt.substring(0, 10)}
                  </div>
                </Message>
              ) : (
                <Message>
                  <div className=" bg-red-500 p-4 rounded">Not Paid</div>
                </Message>
              )}
            </div>
            <div>
              <h2 className=" text-xl font-medium">Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListItem
                  key={index}
                  className="flex items-center justify-around space-x-4 border-b-2 p-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover mr-4"
                  />
                  <Link to={`/product/${item.product}`}>{item.name}</Link>

                  <div>
                    {item.qty} x ${item.price} = ${item.qty * item.price}
                  </div>
                </ListItem>
              ))}
            </div>
          </ListGroup>
        </div>

        <div>
          <Card className="max-w-6/12 mt-4">
            <h1 className=" text-2xl text-slate-600 font-semibold border-b-2">
              Order Summary
            </h1>
            <p>
              <strong>Items: </strong>${order.itemsPrice}
            </p>
            <p>
              <strong>Shipping: </strong>${order.shippingPrice}
            </p>
            <p>
              <strong>Tax: </strong>${order.taxPrice}
            </p>
            <p>
              <strong>Total: </strong>${order.totalPrice}
            </p>

            {/* PAY ORDER PLACEHOLDER */}
            {!order.isPaid && (
              <div className=" border-t-2 p-2">
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <div>
                    {/* <Button
                      onClick={onApproveTest}
                      style={{ marginBottom: "10px" }}
                    >
                      Test Pay Order
                    </Button> */}
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* MARK AS DELIVERED PLACEHOLDER */}
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <div>
                  <Button type="button" onClick={deliverOrderHandler}>
                    Mark As Delivered
                  </Button>
                </div>
              )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
