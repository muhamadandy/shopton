import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/orderApiSlice";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h1 className=" text-2xl text-slate-600 font-semibold m-4">Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>
          <div className="bg-red-500 p-4 rounded">{error}</div>
        </Message>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>DATE</Table.HeadCell>
              <Table.HeadCell>TOTAL</Table.HeadCell>
              <Table.HeadCell>PAID</Table.HeadCell>
              <Table.HeadCell>DELIVERED</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {orders.map((order) => (
                <Table.Row
                  key={order._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {order._id}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {order.user && order.user.name}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {order.createdAt.substring(0, 10)}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {order.totalPrice}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-black rounded font-bold"
                      to={`/order/${order._id}`}
                    >
                      Details
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </>
  );
};

export default OrderListScreen;
