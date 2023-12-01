import React, { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import NavTabHeader from "../../Utils/NavTabHeader";

const RolesOutlet = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  useEffect(() => {
    navigate(`/users/${userId}/roles/show`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <NavTabHeader showTab={true} tabsHeaders={["ROLES", "ALL ROLES"]} />
      <Outlet />
    </div>
  );
};

export default RolesOutlet;
