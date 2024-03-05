import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../slices/productApiSlice";
import { Link } from "react-router-dom";
import { Button, Table } from "flowbite-react";
import { toast } from "react-toastify";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <div className=" w-10/12 md:w-8/12 mx-auto flex justify-between my-4">
        <h1 className=" text-3xl text-slate-600 font-semibold">Products</h1>
        <Button onClick={createProductHandler}>
          <FaEdit /> Create Product
        </Button>
      </div>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>
          {" "}
          <div className="bg-red-500 p-4 rounded">{error}</div>
        </Message>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>NAME</Table.HeadCell>
              <Table.HeadCell>PRICE</Table.HeadCell>
              <Table.HeadCell>CATEGORY</Table.HeadCell>
              <Table.HeadCell>BRAND</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {data.products.map((product) => (
                <Table.Row
                  key={product._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {product._id}
                  </Table.Cell>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>$ {product.price}</Table.Cell>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell>{product.brand}</Table.Cell>
                  <Table.Cell className="flex justify-center items-center space-x-2">
                    <Link to={`/admin/product/${product._id}/edit`}>
                      <FaEdit size={20} />
                    </Link>

                    <FaTrash
                      color="red"
                      size={20}
                      className="cursor-pointer"
                      onClick={() => deleteHandler(product._id)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div className="w-full p-4 flex justify-center items-center">
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductListScreen;
