/* eslint-disable no-useless-concat */
import React from "react";
import { useNavigate } from "react-router";

function NavTabHeader({ showTab, tabsHeaders }) {
  const navigate = useNavigate();

  const handleNavigation = (header) => {
    switch (header.toLowerCase()) {
      case "groups": {
        navigate("show");
        break;
      }
      case "roles": {
        navigate("show");
        break;
      }
      case "rolesassigned": {
        navigate("roles/assigned");
        break;
      }
      case "rolesunassigned": {
        navigate("roles/unassigned");
        break;
      }
      default: {
        navigate(`${header.toLowerCase()}`);
      }
    }
  };

  return (
    <div className="container mt-4">
      {showTab && (
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          {tabsHeaders.map((header, index) => {
            return (
              <li class="nav-item" role="presentation" key={index + 1}>
                <button
                  className={
                    `${
                      index === 0
                        ? "nav-link active btn-primary "
                        : "nav-link  btn-primary"
                    }` + "text-decoration-none"
                  }
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                  onClick={() => {
                    handleNavigation(header.trim().split(" ").join(""));
                  }}
                >
                  {header}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default NavTabHeader;
