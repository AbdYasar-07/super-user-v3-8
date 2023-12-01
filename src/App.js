import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./Components/AppLayout";
import Content from "./Components/Contents/Content";
import ContentOutlet from "./Components/Contents/ContentOutlet";
import { CodeSnippet } from "./Utils/CodeSnippet";
import NestedContentOutlet from "./Components/Contents/NestedContentOutlet";
import Roles from "./Components/Users/Roles";
import GroupsOutlet from "./Components/Contents/GroupsOutlet";
import Groups from "./Components/Users/Groups";
import AllGroups from "./Components/Users/AllGroups";
import { useEffect, useState } from "react";
import RolesOutlet from "./Components/Contents/RolesOutlet";
import AllRoles from "./Components/Users/AllRoles";
import WildCard from "./Utils/WildCard";
import { useSelector } from "react-redux";
import Member from "./Components/BPAdmin/Member/Member";
import MemberOutlet from "./Components/BPAdmin/Member/MemberOutlet";
import RoleUnassigned from "./Components/BPAdmin/Member/RoleUnassigned";
import RoleAssigned from "./Components/BPAdmin/Member/RoleAssigned";
import BP from "./Components/BPAdmin/BP/BP";
import BPDetail from "./Components/BPAdmin/BP/BPDetail";
import BPDetailOutlet from "./Components/BPAdmin/BP/BPDetailOutlet";
import BPDetailMembers from "./Components/BPAdmin/BP/BPDetailMembers";
import BPDetailService from "./Components/BPAdmin/BP/BPDetailService";
import BPDetailStore from "./Components/BPAdmin/BP/BPDetailStore";
import BPDetailComs from "./Components/BPAdmin/BP/BPDetailComs";
import BPProdDetailService from "./Components/BPAdmin/BP/BPProdDetailService";

function App() {
  const [isProfileRendered, setIsProfileRendered] = useState(false);
  const [loggedUserProfile, setLoggedUserProfile] = useState([]);
  const currentSelectedUser = useSelector(
    (store) => store?.auth0Context?.renderingUser
  );
  useEffect(() => {
    let userProfile = null;

    if (Object.keys(currentSelectedUser).length !== 0) {
      userProfile = JSON.parse(JSON.stringify(currentSelectedUser));
      setLoggedUserProfile(JSON.stringify(userProfile, null, 2));
    }
    setIsProfileRendered(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileRendered]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="users" element={<Content />}>
              <Route index element={<ContentOutlet />}></Route>
              <Route
                path=":userId"
                element={
                  <NestedContentOutlet
                    setIsProfileRendered={setIsProfileRendered}
                    isProfileRendered={isProfileRendered}
                  />
                }
              >
                <Route
                  path="profile"
                  element={
                    <CodeSnippet
                      title="User Profile"
                      code={loggedUserProfile}
                    />
                  }
                ></Route>
                <Route path="groups" element={<GroupsOutlet />}>
                  <Route path="show" element={<Groups />}></Route>
                  <Route path="allgroups" element={<AllGroups />}></Route>
                </Route>
                <Route path="roles" element={<RolesOutlet />}>
                  <Route path="show" element={<Roles />}></Route>
                  <Route path="allroles" element={<AllRoles />}></Route>
                </Route>
              </Route>
            </Route>
            <Route path="members" element={<Content />}>
              <Route index element={<Member />}></Route>
              <Route
                path=":memberId"
                element={
                  <MemberOutlet setIsProfileRendered={setIsProfileRendered} />
                }
              >
                <Route path="roles/assigned" element={<RoleAssigned />}></Route>
                <Route
                  path="roles/unassigned"
                  element={<RoleUnassigned />}
                ></Route>
              </Route>
            </Route>
            <Route path="bp" element={<Content />}>
              <Route index element={<BP />}></Route>
              <Route path=":bpId" element={<BPDetail />}>
                <Route path="tabs" element={<BPDetailOutlet />}>
                  <Route path="members" element={<BPDetailMembers />}></Route>
                  <Route path="store" element={<BPDetailStore />}></Route>
                  <Route path="uat-service" element={<BPDetailService />}></Route>
                  <Route path="prod-service" element={<BPProdDetailService />} ></Route>
                  <Route path="coms" element={<BPDetailComs />}></Route>
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="/*" element={<WildCard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
