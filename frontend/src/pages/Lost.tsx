import { Link } from "react-router-dom";

const Lost = () => {
  return (
    <div className="max-w-md mx-auto">
      <span>
        <h1 className="uppercase text-center text-2xl font-bold">
          Nothing is here
        </h1>
        <h4 className="text-center text-lg mt-2">
          You are seeing this because you are headed into the abyss! ⚫
        </h4>
        <p className="text-center text-gray-500 mt-3">
          <Link to="/" className="uppercase text-blue-500">
            Go home
          </Link>
        </p>
      </span>
    </div>
  );
};

export default Lost;
