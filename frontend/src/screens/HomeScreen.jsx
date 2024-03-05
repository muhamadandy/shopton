import Product from "../components/Product";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import SearchBox from "../components/SearchBox";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link
          to="/"
          className=" py-2 px-4 m-4 rounded-md bg-slate-500 hover:bg-slate-600 text-white font-semibold"
        >
          {" "}
          Go Back
        </Link>
      )}
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
          <div className="p-4 w-full flex justify-center items-center">
            <SearchBox />
          </div>
          <h1 className="m-4 text-2xl font-semibold">Latest Products</h1>
          <div className=" flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full p-4 flex justify-center items-center">
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword ? keyword : ""}
            />
          </div>
        </>
      )}
    </>
  );
};

export default HomeScreen;
