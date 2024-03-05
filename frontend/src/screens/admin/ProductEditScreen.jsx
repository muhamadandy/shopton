import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { Button, Label, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productApiSlice";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    const result = await updateProduct(updatedProduct);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product updated");
      navigate("/admin/productlist");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link
        to="/admin/productlist"
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 m-4 rounded text-white"
      >
        Go Back
      </Link>
      <FormContainer>
        <h1 className=" text-2xl font-semibold text-slate-500 mb-4">
          Edit Product
        </h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message>
            <div className=" bg-red-500 p-4 rounded">{error}</div>
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
                <Label value="Price" />
              </div>
              <TextInput
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            {/* IMAGE INPUT PLACEHOLDER */}
            <div>
              <div className="mb-2 block">
                <Label value="Image" />
              </div>
              <TextInput
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={() => setImage}
              />
              <input
                className=" rounded-md border w-full"
                type="file"
                onChange={uploadFileHandler}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Brand" />
              </div>
              <TextInput
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Count In Stock" />
              </div>
              <TextInput
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Category" />
              </div>
              <TextInput
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Description" />
              </div>
              <TextInput
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button type="submit">Update</Button>
          </form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
