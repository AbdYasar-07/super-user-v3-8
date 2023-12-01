/* eslint-disable jsx-a11y/anchor-is-valid */
import "./Styles/SidebarComponent.css";
import Content from "./Contents/Content";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

const SidebarComponent = () => {
  const userInfo = useSelector((state) => state.auth0Context);
  const restrictedRoutes = ['permissions', 'groups', 'roles'];
  const navigate = useNavigate();

  const getPermissionLabel = (permission) => {
    let colonIndex = permission.indexOf(":");
    if (colonIndex !== -1) {
      const extractedString = permission.substring(colonIndex + 1);
      return extractedString;
    } else {
      return false;
    }
  };

  const handleSidebarClick = (route) => {
    if (restrictedRoutes.includes(route)) {
      toast.error(`Access to this ${route.toUpperCase()} functionality is restricted`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    navigate(`/${route}`);
  }

  const showEssentialPermissions = (permissions) => {
    return permissions
      ?.filter((permission) => permission !== "SUA:Login")
      .map((essentialPermission, index) => {
        return (
          <>
            <li className="nav-item mt-2 mb-4">
              <Button
                key={index + 1}
                className="links nav-link align-middle px-0"
                style={{ width: "128px", padding: "8px 0" }}
                onClick={() => handleSidebarClick(`${getPermissionLabel(essentialPermission).toLowerCase()}`)}
              >
                {/* <i className="fs-4 bi-house"></i>{" "} */}
                <span
                  className="d-none d-sm-inline"
                  style={{ fontSize: "14px" }}
                >
                  {getPermissionLabel(essentialPermission)}
                </span>
              </Button>
            </li>
          </>
        );
      });
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <div className="col-auto col-md-2 col-lg-2 col-xxl-2 col-xl-2 px-sm-2 px-0 ">
            <div className="text-white min-vh-100">
              <a className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none justi justify-content-center">
                <span
                  className="fs-6 d-none d-sm-inline "
                  style={{
                    marginTop: "20px",
                    color: "black",
                    padding: "10px",
                    background: "#adadad50",
                    fontFamily: "sans-serif",
                    borderRadius: "10px",
                    fontSize: "12px !important",
                  }}
                >
                  SUPER USER AUTH APP
                  <FaUserAlt style={{ margin: "5px" }} />
                </span>
              </a>
              <ul className="p-0 d-inline-block" id="menu">
                {userInfo?.accessToken &&
                  showEssentialPermissions(userInfo?.permissions)}
              </ul>
            </div>
          </div>
          <div className="col-10 py-3">
            <Content />
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarComponent;
