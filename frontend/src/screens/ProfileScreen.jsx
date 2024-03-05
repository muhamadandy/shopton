import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useProfileMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { Button, Label, TextInput } from "flowbite-react";
import { useGetMyOrdersQuery } from "../slices/orderApiSlice";
import { Table } from "flowbite-react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo.name, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
      <form onSubmit={submitHandler} className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label value="Name" />
          </div>
          <TextInput
            type="text"
            placeholder="Enter name"
            shadow
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label value="Email Address" />
          </div>
          <TextInput
            type="email"
            placeholder="Enter email"
            shadow
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label value="Password" />
          </div>
          <TextInput
            type="password"
            placeholder="Enter password"
            shadow
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label value="Confirm password" />
          </div>
          <TextInput
            type="password"
            placeholder="Confirm password"
            shadow
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button type="submit">Update</Button>
        {loadingUpdateProfile && <Loader />}
      </form>
      <div>
        <h2>MyOrder</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message>
            <div className="bg-red-500 p-4 m-4 rounded">
              {error?.data?.message || error.error}
            </div>
          </Message>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell>ID</Table.HeadCell>
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
      </div>
    </div>
  );
};

export default ProfileScreen;
