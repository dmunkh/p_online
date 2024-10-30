import React, { useState } from "react";
import useBearStore from "src/state/state";
// import Card from "./card"
import SaveButton from "src/components/button/SaveButton";
import axios from "axios";
import _ from "lodash";
import { usePlanContext } from "src/contexts/planContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error message
  const [isLoading, setIsLoading] = useState(false); // State for loading status

  const setIsUserValid = useBearStore((state) => state.setIsUserValid);
  const setUserId = useBearStore((state) => state.setUserId);
  const setMainCompanyID = useBearStore((state) => state.setMainCompanyID);
  const setGroupId = useBearStore((state) => state.setGroupId);
  const setUserName = useBearStore((state) => state.setUserName);
  const setUserInfo = useBearStore((state) => state.setUserInfo);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages
    setIsLoading(true); // Set loading to true before API call

    const fetchData = async () => {
      try {
        // const response = await fetch("http://localhost:5000/login", {
        const response = await fetch("https://dmunkh.store/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data.user_info.user_name);
          localStorage.setItem("access_token", data.access_token);
          setIsUserValid(true);
          setUserId(data.user_info.id);
          setMainCompanyID(data.user_info.main_company_id);
          setUserName(data.user_info.user_name);
          setUserInfo(data.user_info);
        } else {
          // Set error message on login failure
          setError(data.msg || "Login failed. Please try again.");
        }
      } catch (error) {
        setError("An error occurred. Please try again."); // Handle fetch error
        console.error("Error:", error);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    };
    fetchData();
  };

  // Clear error when input changes
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setError(""); // Clear error message when username changes
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(""); // Clear error message when password changes
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Нэвтрэх
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Нэвтрэх нэр
                </label>
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Нэвтрэх нэр"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Нууц үг
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Нууц үг"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            {/* Render error message if exists */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13a1 1 0 00-1 1v6a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Уншиж байна...
                  </>
                ) : (
                  "Нэвтрэх"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <SaveButton onClick={handleClick} /> */}
    </>
  );
};

export default React.memo(Login);
