import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  idToken: "",
  permissions: [],
  roles: [],
  groups: [],
  authorizationAccessCode: "",
  managementAccessToken: "",
  conceptionDatabase: [],
  renderingUser: {},
  importedUserLogs: [],
  addedBusinessPartner: {}, // to show the member info with respective BP to the rendering users on the list
  refreshUnRelatedComponent: {
    target: "",
    render: false
  },
  currentBusinessPartner: {},
  renderShopifySystem: false
};

const auth0Slice = createSlice({
  name: "auth0Context",
  initialState,
  reducers: {
    addUserInfo(state, action) {
      state.accessToken = action.payload.accessToken;
      state.idToken = action.payload.idToken;
      state.groups = action.payload.groups;
      state.roles = action.payload.roles;
      state.permissions = action.payload.permissions;
    },
    addAuthorizationCode(state, action) {
      state.authorizationAccessCode = action.payload.code;
    },
    addManagementAccessToken(state, action) {
      state.managementAccessToken = action.payload.managementAccessToken;
    },
    addConceptionDatabase(state, action) {
      state.conceptionDatabase = action.payload.conception;
    },
    renderingCurrentUser(state, action) {
      state.renderingUser = action.payload.currentUser;
    },
    addImportedUserLogs(state, action) {
      state.importedUserLogs.push(action.payload.userLog);
    },
    addBP(state, action) {
      state.addedBusinessPartner = action.payload.addedBusinessPartner;
    },
    renderComponent(state, action) {
      state.refreshUnRelatedComponent.target = action.payload.cmpName;
      state.refreshUnRelatedComponent.render = !state.refreshUnRelatedComponent.render;
    },
    clearImportedUser(state, action) {
      state.importedUserLogs = [];
    },
    addCurrentBusinessPartner(state, action) {
      state.currentBusinessPartner = action.payload.businessPartner;
    },
    addIsShopifyBPTab(state, action) {
      state.renderShopifySystem = action.payload.showShopifySystemTab;
    },
    clearState(state, action) {
      state.accessToken = "";
      state.idToken = "";
      state.groups = [];
      state.roles = [];
      state.permissions = [];
      state.authorizationAccessCode = "";
      state.managementAccessToken = "";
      state.conceptionDatabase = [];
      state.renderingUser = {};
      state.importedUserLogs = [];
      state.currentBusinessPartner = {};
    },
  },
});

export const { addUserInfo, addAuthorizationCode, addConceptionDatabase, renderingCurrentUser, addImportedUserLogs, clearImportedUser, addManagementAccessToken, addBP, renderComponent, addCurrentBusinessPartner, addIsShopifyBPTab, clearState } =
  auth0Slice.actions;
export default auth0Slice.reducer;
