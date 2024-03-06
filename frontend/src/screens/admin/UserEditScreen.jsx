import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { Button, Label, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import {
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} from "../../slices/userApiSlice";

const UserEditScreen = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <>
      <Link
        to="/admin/userlist"
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 m-4 rounded text-white"
      >
        Go Back
      </Link>
      <FormContainer>
        <h1 className=" text-2xl font-semibold text-slate-500 mb-4">
          Edit User
        </h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message>
            <div className=" bg-red-500 p-4 rounded">{error.data.message}</div>
          </Message>
        ) : (
          <form
            onSubmit={submitHandler}
            className="flex max-w-md flex-col gap-4"
          >
            <div>
              <div className="mb-2 block">
                <Label value="Name" />
              </div>
              <TextInput
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Email" />
              </div>
              <TextInput
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className=" flex items-center space-x-1">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <Label value="Is Admin" />
            </div>
            <Button type="submit">Update</Button>
          </form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
