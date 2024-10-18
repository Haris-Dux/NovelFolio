import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state?.auth?.user);

  return (
    <div className="container mx-auto mt-4 max-w-md p-4 border rounded-lg shadow-lg">
      <h2 className="text-center text-2xl font-semibold mb-4">Your Profile</h2>

      {/* Card Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4">
          <h3 className="font-semibold">Details of user:</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <b>First Name: </b>
              <span>{user?.firstName}</span>
            </li>
            <li>
              <b>Last Name: </b>
              <span>{user?.lastName}</span>
            </li>
            <li>
              <b>Email: </b>
              <span>{user?.email}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Button */}
      <Link
        to="/"
        className="mt-4 block text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Profile;
