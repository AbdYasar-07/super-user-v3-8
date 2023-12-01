/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import "./Styles/Header.css";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "./Login";
import Logout from "./Logout";
import { useDispatch } from "react-redux";
import { addUserInfo } from "../store/auth0Slice";
import ToolTip from "../Utils/Tooltip";
import concepcionLogo from "../asset/concepcionImg.png";
const Header = ({ user }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, getAccessTokenSilently, getIdTokenClaims } =
    useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      const loadAuth0Context = async () => {
        const access_token = await getAccessTokenSilently();
        const id_token = await getIdTokenClaims();
        dispatch(
          addUserInfo({
            accessToken: access_token,
            idToken: id_token,
            permissions: user.user_profile.authorization?.permissions,
            roles: user.user_profile.authorization?.roles,
            groups: user.user_profile.authorization?.groups
          })
        );
      };

      loadAuth0Context();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <header>
      <nav
        className="d-block position-relative"
        style={{ padding: "0", boxShadow: "5px 5px 5px #adadad !important" }}
      >
        <div className="d-flex justify-content-between align-items-center ms-5">
          <div>
            <img
              src="https://cdn.auth0.com/styleguide/latest/lib/logos/img/logo-blue.svg"
              alt="auth0"
              width="100"
              height="92"
              className="ms-3 me-5"
            />
            <img
              src={concepcionLogo}
              // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSSetZHth0LHil6EGxW5ngEMCLEzKEyWrlaA&usqp=CAU"
              alt="Conception"
              width="100"
              height="50"
              className="ms-3 me-3"
            />
          </div>
          <div
            className="justify-content-end d-flex align-items-center "
            id="navbarNav"
          >
            <div
              className="ms-2 me-3 custombtnStyle"
            //  style={{ position: "relative", right: "461px", top: "8px" }}
            >
              <ToolTip
                label={"About"}
                info={"SUPER USER PORTAL APP VERSION : 3.8"}
              />
            </div>
            {isAuthenticated && (
              <div
                className="ms-2 me-3"
              // style={{
              //   position: "absolute",
              //   right: "128px",
              //   bottom: "18px",
              // }}
              >
                <span style={{ marginRight: "15px" }}>Hello, {user?.name}</span>
                <img
                  src={user?.picture}
                  alt="user profile"
                  className="rounded-circle"
                  width="50"
                  height="50"
                />
              </div>
            )}
            <div
            // style={{ position: "absolute", right: "8px", top: "41px" }}
            >
              {!isAuthenticated && <Login />}
              {isAuthenticated && <Logout />}
            </div>
          </div>
        </div>
        <div style={{ marginRight: "10px" }}></div>
      </nav>
    </header>
  );
};

export default Header;
