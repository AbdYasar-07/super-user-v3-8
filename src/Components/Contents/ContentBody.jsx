/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState, useEffect } from "react";
import Axios from "../../Utils/Axios";
import Pagination from "../../Utils/Pagination";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import AppSpinner from "../../Utils/AppSpinner";
import { FaUser } from "react-icons/fa";
import Search from "../../Utils/Search";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addAuthorizationCode } from "../../store/auth0Slice";

const ContentBody = ({ isUserAdded, setIsTokenFteched }) => {
  const [data, setData] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { getAccessTokenSilently } = useAuth0();
  const [loadSpinner, setLoadSpinner] = useState(true);
  const [currentItems, setcurrentItems] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [authorizationAccessCode, setauthorizationAccessCode] = useState("");
  const resource = process.env.REACT_APP_AUTH_EXT_RESOURCE;
  const dispatch = useDispatch();
  const auth_access_token = useSelector(
    (state) => state.auth0Context.authorizationAccessCode
  );
  const fetchAccessToken = async () => {
    await getAccessTokenSilently()
      .then(async (response) => {
        localStorage.setItem("access_token", response);
        setIsTokenFteched(true);
        return await fetchAuthorizationToken().then(() => {
          return true;
        });
      })
      .catch((error) => {
        toast("Login required", { type: "error", position: "top-center" });
        console.error("Error while fetching token", error);
      });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Never";
    }
    const date = new Date(timestamp);
    const now = new Date();

    const diffInMilliseconds = Math.abs(now - date);
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const fetchAuthorizationToken = async () => {
    const body = {
      grant_type: process.env.REACT_APP_AUTH_GRANT_TYPE,
      client_id: process.env.REACT_APP_M2M_CLIENT_ID,
      client_secret: process.env.REACT_APP_M2M_CLIENT_SECRET,
      audience: process.env.REACT_APP_M2M_AUDIENCE,
    };
    if (
      localStorage.getItem("access_token") &&
      localStorage.getItem("access_token").toString().length > 0
    ) {
      const authorizationResponse = Axios(
        "https://dev-34chvqyi4i2beker.jp.auth0.com/oauth/token",
        "POST",
        body,
        null
      );
      authorizationResponse
        .then((tkn) => {
          localStorage.setItem("auth_access_token", tkn.access_token);
          dispatch(addAuthorizationCode({ code: tkn.access_token }));
          authExtensionApi(
            "users",
            "GET",
            null,
            tkn.access_token
            // localStorage.getItem("auth_access_token")
          );
        })
        .catch((error) => {
          console.error("Error while fetching authorization token ::", error);
        });
    }
  };

  const formData = (users) => {
    const actualUsers = users?.map((user) => {
      return {
        userId: user.user_id,
        email: user.email,
        name: user.name,
        lastLogin: formatTimestamp(user.last_login),
        loginCount: user.logins_count,
        connection: user.identities[0].connection,
      };
    });

    return actualUsers;
  };

  const authExtensionApi = async (url, method, body, token) => {
    const response = Axios(resource + `/${url}`, method, body, token);
    response
      .then((data) => {
        setData(formData(data?.users));
        setAllRecords(formData(data?.users));
      })
      .catch((error) => {
        setLoadSpinner(false);
        console.error(
          "Error while accessing authorization resource :::",
          error
        );
      })
      .finally((_) => {
        setLoadSpinner(false);
      })
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAccessToken();
      } catch (error) {
        console.error("error ::", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    authExtensionApi(
      "users",
      "GET",
      null,
      authorizationAccessCode
      // localStorage.getItem("auth_access_token")
    );
    setLoadSpinner(true);
  }, [isUserAdded]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    var indexOfLastItem = currentPage * itemsPerPage;
    if (isSearchActive === true) {
      indexOfLastItem = 10;
      setIsSearchActive(false);
      setCurrentPage(1);
    }
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItem = data && data.slice(indexOfFirstItem, indexOfLastItem);
    setcurrentItems(currentItem);
  }, [isSearchActive, data, currentPage]);
  useEffect(() => {
    if (auth_access_token) {
      setauthorizationAccessCode(auth_access_token);
    }
  }, [auth_access_token]);
  return (
    <div>
      {loadSpinner && <AppSpinner />}
      {!loadSpinner && (
        <Search
          records={data}
          setRecords={setData}
          isSearchActived={setIsSearchActive}
          setLoadSpinner={setLoadSpinner}
          data={allRecords}
        />
      )}
      {!loadSpinner && (
        <div className="container" style={{ height: "499px" }}>
          {" "}
          <hr />
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Last Login</th>
                <th>Logins</th>
                <th>Connection</th>
              </tr>
            </thead>
            <tbody>
              {currentItems &&
                currentItems?.map((item) => (
                  <tr key={item.userId}>
                    <td>
                      <Link to={`/users/${item.userId}`}>{item.name}</Link>
                    </td>
                    <td>{item.email}</td>
                    <td>{item.lastLogin}</td>
                    <td>{item.loginCount || 0}</td>
                    <td>{item.connection}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!loadSpinner &&
            // (!localStorage.getItem("auth_access_token") ||
            (!authorizationAccessCode || data?.length === 0) &&
            // localStorage.getItem("auth_access_token") && (
            authorizationAccessCode && (
              <div>
                <h6>
                  No user's found <FaUser style={{ marginBottom: "5px" }} />{" "}
                </h6>
              </div>
            )}
          {loadSpinner &&
            (data?.length === 0 || data === undefined) &&
            // !localStorage.getItem("auth_access_token") && (
            !authorizationAccessCode && (
              <h6 className="mt-4">Login required</h6>
            )}
          {/* {!loadSpinner && !localStorage.getItem("auth_access_token") && ( */}
          {loadSpinner && !authorizationAccessCode && (
            <>
              <h6>
                The logged-in user does not have the permission to view list of
                users <FaUser style={{ marginBottom: "5px" }} />{" "}
              </h6>
            </>
          )}
        </div>
      )}
      {/* {!loadSpinner && localStorage.getItem("auth_access_token") && ( */}
      {!loadSpinner && authorizationAccessCode && (
        <div className="paginator container">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(data && data.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ContentBody;
