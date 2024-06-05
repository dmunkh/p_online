import React, { useState } from "react";
import useBearStore from "src/state/state";
// import Card from "./card"
import SaveButton from "src/components/button/SaveButton";
import axios from "axios";
import _ from "lodash";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setIsUserValid = useBearStore((state) => state.setIsUserValid);
  const setUserId = useBearStore((state) => state.setUserId);
  const setMainCompanyID = useBearStore((state) => state.setMainCompanyID);
  const setGroupId = useBearStore((state) => state.setGroupId);
  const setUserName = useBearStore((state) => state.setUserName);
  const setUserInfo = useBearStore((state) => state.setUserInfo);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here
    // Assuming you fetch user data after successful login
    // const userData = { user_id: "123", user_name: "John Doe" };
    // setUserId(email); // Ensure setUserId is correctly defined and imported
    // setUserName(userData.user_name); // Ensure setUserName is correctly defined and imported
    setIsUserValid(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://dmunkh.store/api/backend/user"
        );
        var result = _.filter(
          response.data.response,
          (a) => a.login_name.toLowerCase() === email.toLowerCase()
        );
        // console.log("user resultttt", result[0]);
        setUserId(result[0].id);
        setMainCompanyID(result[0].main_company_id);
        setUserName(result[0].user_name);
        setGroupId(result[0].group_id);
        setUserInfo(result[0]);

        // console.log("order list", response.data.response);
      } catch (error) {}
    };
    fetchData();
  };

  const handleClick = () => {
    console.log("emaillll", email);
    setIsUserValid(true);
    const userData = { user_id: email, user_name: "John Doe" };
    setUserId(email);
    setUserName(userData.user_name);
    // setGroupId(result[0].group_id);
    setIsUserValid(true);
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
                <label htmlFor="email-address" className="sr-only">
                  Нэвтрэх нэр
                </label>
                <input
                  id="email-address"
                  name="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Нэвтрэх нэр"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
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
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
      <SaveButton
        onClick={() => {
          // setLoading(true);
          handleClick();
          // setLoading(false);
        }}
      />
    </>
  );
};
export default React.memo(Login);
