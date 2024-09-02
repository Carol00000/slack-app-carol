import { useEffect, useState } from "react";
import UserService from "../services/UserService";
import ChannelService from "../services/ChannelService";
import { FaEnvelope } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
// import SendMessage from "./components/SendMessage";
import logo from "../assests/images/msgLogo.png";



export default function Dashboard({ setIsLoggedIn, user }) {
  const [userList, setUserList] = useState([]);
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);
  const [channelFlag, setChannelFlag] = useState(true);
// const navigate = useNavigate();


  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await UserService.getUsers(user);
        setUserList(users || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message || "An error occurred while fetching users");
        setUserList([]); // Ensure userList is an empty array on error
      }
    }

    if (user) {
      fetchUsers();
    } else {
      console.error("User object is null or undefined");
      setError("User is not authenticated");
    }
  }, [user]);

  useEffect(() => {
    async function getChannels() {
      try {
        const channelsData = await ChannelService.getChannels(user);
        setChannels(channelsData || []); // Ensure channels is always an array
        setError(null);
      } catch (error) {
        console.error("Error fetching channels:", error);
        setError(error.message || "An error occurred while fetching channels");
        setChannels([]);
      }
    }

    if (channelFlag && user) {
      setChannelFlag(false);
      getChannels();
    }
  }, [user, channelFlag]);

  function logout() {
    console.log("Logging out");
    localStorage.clear();
    setIsLoggedIn(false);
    // navigate("/"); // Redirect to the homepage or login page after logout
  }


  // SIDEBAR : MY DASHBOARD - LOG OUT - DMs - CHANNELS //
  return (
    <div className="flex bg-gray-900 dark:bg-gray-900 p-4 mx-auto md:h-screen">
      <div className="w-1/4 bg-gray-800 text-white p-6">
        <div className="flex items-center justify-center mb-6">
        <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
          <div>
            <h2 className="text-lg font-semibold"> My Dashboard</h2>
          </div>
    </div>

{/*LOG OUT*/}
        <div className="space-y-4">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
          >
            Log Out
          </button>
      

{/*CHANNELS*/}
          <div className="text-xl flex items-center cursor-pointer">
            <FaEnvelope className="mr-2" /> DMs
          </div>
          <h2 className="text-lg font-bold mt-6">Channels</h2>
          {channels.length > 0 ? (
            channels.map((channel) => (
              <div
                key={channel.id}
                className="cursor-pointer p-2 border rounded mb-2 bg-purple-600 hover:bg-purple-500"
              >
                <p className="text-white">Channel Name: {channel.name}</p>
                <p className="text-white">Owner ID: {channel.owner_id}</p>
              </div>
            ))
          ) : (
            <div className="text-white">
              {error ? "No Channels Available" : "Loading channels..."}
            </div>
          )}
        </div>
      </div>

{/* Chat and User List */}
      <div className="w-3/4 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-bold mb-4">User List</h2>
          {userList.length > 0 ? (
            userList.slice(0, 5).map((student) => (              
              <div key={student.id} className="p-2 border-b border-gray-300">
                <p>ID: {student.id}</p>
                <p>Email: {student.email}</p>
              </div>
            ))
          ) : (
            <div>{error ? "No Users Available" : "Loading users..."}</div>
          )}
        </div>

{/* CHAT BOX */}
        <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Chat</h2>
          <div className="h-64 overflow-y-auto">
            {/* Chat messages would go here */}
            <div className="p-3 bg-blue-100 rounded mb-3">
              <p>Chat Message Example</p>
            </div>
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-l-lg w-full"
              placeholder="Type Something..."
            />
            <button className="bg-blue-500 text-white p-2 rounded-r-lg">
              Send
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
