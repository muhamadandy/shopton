import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import RatingComp from "./Rating";

const Product = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <Card
        className="max-w-sm w-full h-full hover:scale-105 duration-300"
        imgSrc={product.image}
      >
        <h5 className="text-sm font-bold">{product.name}</h5>
        <RatingComp
          value={product.rating}
          text={`${product.numReviews} Reviews`}
        />

        <p className=" text-lg">${product.price}</p>
      </Card>
    </Link>
  );
};

export default Product;
