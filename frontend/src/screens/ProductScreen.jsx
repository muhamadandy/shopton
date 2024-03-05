import { Button, Label, Select, TextInput } from "flowbite-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useState } from "react";
import { addToCart } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review Submitted");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/" className="mb-4 inline-block">
        <Button color="light" className="m-4">
          Go Back
        </Button>
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>
          <div className="bg-red-500 p-4 m-4 rounded">
            {error?.data?.message || error.error}
          </div>
        </Message>
      ) : (
        <>
          <Meta title={product.name} />
          <div className="mx-auto p-6">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              {/* IMAGE */}
              <div className="flex-shrink-0 md:w-1/2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto rounded-xl"
                />
              </div>
              {/* ABOUT */}
              <div className="flex flex-col md:w-1/2 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                </div>
                <p className="text-gray-700">{product.description}</p>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
                <h6 className="text-2xl font-semibold">$ {product.price}</h6>
                {product.countInStock > 0 && (
                  <div className="flex items-center">
                    <label htmlFor="qty" className="mr-2">
                      Qty
                    </label>
                    <select
                      id="qty"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="border rounded-md"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <strong>
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </strong>
                <div className="flex mt-4">
                  <Button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    color="dark"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h2 className=" text-2xl text-slate-600 font-semibold">Reviews</h2>
            {product.reviews.length === 0 && (
              <Message>
                <div className=" max-w-md bg-blue-400 p-4 rounded-md font-semibold">
                  No Reviews
                </div>
              </Message>
            )}
            <div>
              {product.reviews.map((review) => (
                <div
                  className="mb-4 p-4 bg-slate-100 rounded-md"
                  key={review._id}
                >
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </div>
              ))}
              <div>
                {loadingProductReview && <Loader />}
                {userInfo ? (
                  <>
                    <h2 className=" text-2xl font-semibold">
                      Write a Customer Review
                    </h2>
                    <form onSubmit={submitHandler}>
                      <div className="max-w-md">
                        <div className="mb-2 block">
                          <Label value="Rating" />
                        </div>
                        <Select
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Pair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Select>
                      </div>

                      <div className="mb-2">
                        <div className="mb-2 block">
                          <Label value="Comment" />
                        </div>
                        <TextInput
                          value={comment}
                          type="text"
                          sizing="lg"
                          className=" max-w-md"
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      <Button type="submit" disabled={loadingProductReview}>
                        Submit
                      </Button>
                    </form>
                  </>
                ) : (
                  <Message>
                    <div className="p-4 rounded-md font-semibold my-2">
                      Please{" "}
                      <Link to="/login" className="text-blue-500">
                        Sign In
                      </Link>{" "}
                      to write a review
                    </div>
                  </Message>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductScreen;
