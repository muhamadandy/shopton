import { Navbar, Dropdown } from "flowbite-react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";

const HeaderComp = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [logoutApiCall] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar fluid className=" sticky top-0 z-10 shadow-md">
        <Link to="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Shopton
          </span>
        </Link>

        <div className="flex md:order-2">
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse className=" order-3 pr-6">
          <Link
            to="/cart"
            className="flex items-center hover:translate-x-2 mb-4 md:mb-0"
          >
            <FaShoppingCart size={20} /> <span className="mx-1">Cart</span>
            {cartItems.length > 0 && (
              <Badge className="bg-red-500 text-white rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </Badge>
            )}
          </Link>
          {userInfo ? (
            <Dropdown
              color="light"
              label={userInfo.name}
              dismissOnClick={false}
            >
              <Dropdown.Item>
                <Link to="/profile">Profile</Link>
              </Dropdown.Item>
              {userInfo && userInfo.isAdmin && (
                <>
                  <Dropdown.Item>
                    <Link to="/admin/productlist">Products</Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to="/admin/userlist">Users</Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to="/admin/orderlist">Orders</Link>
                  </Dropdown.Item>
                </>
              )}
              <Dropdown.Item>
                <Link onClick={logoutHandler}>Logout</Link>
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <Link
              to="/login"
              className="flex items-center mb-4 md:mb-0 hover:translate-x-2 space-x-2"
            >
              <FaUser /> <span>Sign In</span>
            </Link>
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
export default HeaderComp;
