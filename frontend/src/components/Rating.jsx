import { Rating } from "flowbite-react";

const RatingComp = ({ value, text }) => {
  return (
    <>
      <Rating>
        <span>
          {value >= 1 ? <Rating.Star /> : <Rating.Star filled={false} />}
        </span>
        <span>
          {value >= 2 ? <Rating.Star /> : <Rating.Star filled={false} />}
        </span>
        <span>
          {value >= 3 ? <Rating.Star /> : <Rating.Star filled={false} />}
        </span>
        <span>
          {value >= 4 ? <Rating.Star /> : <Rating.Star filled={false} />}
        </span>
        <span>
          {value >= 5 ? <Rating.Star /> : <Rating.Star filled={false} />}
        </span>
        <span>{text && text}</span>
      </Rating>
    </>
  );
};

export default RatingComp;
