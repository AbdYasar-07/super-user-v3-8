import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const RouteEnum = {
  GROUPS: "groups",
  ROLES: "roles",
  PROFILE: "profile",
  ROLEASSIGNED: "roles/assigned",
  ROLEUNASSIGNED: "roles/unassigned",
};

function Tabs({ tabs }) {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleDefaultRoutes = (route) => {
    route = route.toLowerCase();
    if (route.split(",").length > 0) {
      route = route.replaceAll(" ", "/");
    }
    switch (route) {
      case RouteEnum.GROUPS:
      case RouteEnum.ROLES:
        navigate(`/users/${userId}/${route.toLowerCase()}/show`);
        break;
      case RouteEnum.ROLEASSIGNED:
      case RouteEnum.ROLEUNASSIGNED:
        navigate(`/members/${userId}/${route.toLowerCase()}`);
        break;
      default:
        navigate(`/users/${userId}/${route.toLowerCase()}`);
    }
  };

  const tabNavigation = (route) => {
    handleDefaultRoutes(route);
  };

  return (
    <div className="d-flex container">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          {tabs?.map((tab, index) => {
            return (
              <button
                key={index + 1}
                class={`${index === 0 ? "nav-link active" : "nav-link"}`}
                id="nav-home-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-home"
                type="button"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={() => tabNavigation(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default Tabs;
