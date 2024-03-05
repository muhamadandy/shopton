import { useState } from "react";
import { Button, TextInput } from "flowbite-react";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword("");
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex max-w-md">
      <div className="flex items-center space-x-1">
        <TextInput
          type="text"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder="Search products..."
        />
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default SearchBox;
