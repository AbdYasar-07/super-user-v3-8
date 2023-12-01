import React, { useEffect, useState } from "react";
import Search from "../../../Utils/Search";
import DataGridTable from "../../../Utils/DataGridTable";
import AppSpinner from "../../../Utils/AppSpinner";
import Axios from "../../../Utils/Axios";
import { getOSCStoreIDByBPCode, getShopifyCompaniesId, groupFilter } from "../../BusinessLogics/Logics";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCurrentBusinessPartner, renderComponent } from "../../../store/auth0Slice";

const BPtabel = () => {
  const [loading, setLoading] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [bpData, setBpData] = useState([]);
  const [filterRecord, setFilteredRecord] = useState([]);
  const resource = process.env.REACT_APP_AUTH_EXT_RESOURCE;
  const auth0Context = useSelector((store) => store?.auth0Context);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCurrentData = (data) => {
    dispatch(addCurrentBusinessPartner({ businessPartner: data }))
    navigate(`/bp/${data.id}/tabs`);
  };

  const fetchAllGroups = async () => {
    try {
      const total_groups_response = await Axios(
        resource + "/groups",
        "GET",
        null,
        localStorage.getItem("auth_access_token"),
        false
      );
      const total_groups = await total_groups_response.groups;
      if (total_groups?.length > 0) {
        await bindGroupData(groupFilter(total_groups, "BP_"));
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const bindGroupData = async (total_groups) => {
    total_groups = total_groups.map((_grp) => {
      return {
        id: _grp?._id,
        BPID: _grp?.name?.substring(3),
        BPName: _grp?.description,
        Members: _grp?.members?.length,
        IsInShopify: "",
        IsInOSCDev: "",
        IsInOSCProd: "",
        shopifyId: "",
        devOscId: "",
        prodOscId: "",
        IsOSCStoreInBothSystem: false
      };
    });

    const bpCodes = total_groups.map((group) => {
      return String(group.BPID);
    });

    await accessOSCDev(bpCodes, total_groups); // call for osc server
    await accessOSCProd(bpCodes, total_groups); // call for osc prod server
    const nodes = await accessShopify(bpCodes); // call for shopify
    patchTotalGroupsForShopifyResponse(bpCodes, nodes, total_groups);
    markOSCStoreInBothSystem(total_groups);

    if (total_groups?.length > 0) {
      setFilteredRecord(total_groups);
      setBpData(total_groups);
    }
  };

  const patchTotalGroupsForShopifyResponse = (bpCodes, nodes, total_groups) => {
    bpCodes.map((bpCode) => {
      const filteredNode = nodes.find((node) => node?.node?.externalId === bpCode);
      const businessPartnerIdx = total_groups.findIndex((group) => String(group.BPID) === bpCode);
      total_groups[businessPartnerIdx]['IsInShopify'] = filteredNode?.node?.externalId && filteredNode?.node?.externalId.length > 0 ? "Yes" : "No";
      total_groups[businessPartnerIdx]['shopifyId'] = filteredNode?.node?.externalId;
    });
  }

  const accessShopify = async (bpCodes) => {
    if (Array.isArray(bpCodes) && bpCodes.length > 0) {
      const result = await getShopifyCompaniesId();
      if (result['data'] && result['data']['companies'] && result['data']['companies']['edges'] && Array.isArray(result['data']['companies']['edges'])) {
        return result['data']['companies']['edges'];
      }
    }
  }

  const accessOSCDev = async (bpCodes, total_groups) => {
    if (Array.isArray(bpCodes) && bpCodes.length > 0) {
      const pairsMapDev = new Map();
      for (const bpCode of bpCodes) {
        await getOSCStoreIDByBPCode(bpCode).then((result) => {
          const oscId = (result?.rows && result?.rows.length > 0) ? result?.rows[0][0] : null;
          pairsMapDev.set(bpCode, oscId);
        });
      }
      pairsMapDev.forEach((value, key) => {
        const idx = total_groups.findIndex((group) => String(group.BPID) === key);
        total_groups[idx]["IsInOSCDev"] = value ? "Yes" : "No";
        total_groups[idx]["devOscId"] = value;
      });
    }
  };

  const accessOSCProd = async (bpCodes, total_groups) => {
    if (Array.isArray(bpCodes) && bpCodes.length > 0) {
      const pairsMapProd = new Map();
      for (const bpCode of bpCodes) {
        await getOSCStoreIDByBPCode(bpCode, true).then((result) => {
          const oscId = (result?.rows && result?.rows.length > 0) ? result?.rows[0][0] : null;
          pairsMapProd.set(bpCode, oscId);
        });
      }
      pairsMapProd.forEach((value, key) => {
        const idx = total_groups.findIndex((group) => String(group.BPID) === key);
        total_groups[idx]["IsInOSCProd"] = value ? "Yes" : "No";
        total_groups[idx]["prodOscId"] = value;
      });
    }

  };

  const markOSCStoreInBothSystem = (total_groups) => {
    if (total_groups) {
      total_groups.map((group) => {
        group['IsOSCStoreInBothSystem'] = (group?.IsInOSCDev == "Yes" && group?.IsInOSCProd == "Yes") ? true : false;
      });
    }
  };

  useEffect(() => {

    setLoading(true);
    fetchAllGroups();
  }, []);

  useEffect(() => {
    if (auth0Context?.refreshUnRelatedComponent?.target === "BPTABLE") {
      setLoading(true);
      fetchAllGroups();
      dispatch(renderComponent({ cmpName: "" }));
    }
  }, [auth0Context?.refreshUnRelatedComponent?.render]);

  return (
    <>
      {!loading && (<><div className="py-4">
        <Search
          records={bpData}
          setRecords={setFilteredRecord}
          isSearchActived={setIsSearchActive}
          setLoadSpinner={setLoading}
          data={bpData}
        />
      </div>

        <DataGridTable
          data={filterRecord}
          rowHeader={[
            "BP ID",
            "BP Name",
            "Members",
            "Is In Shopify",
            "Is In OSC Dev",
            "Is In OSC Prod",
            "Action",
          ]}
          getCurrentData={getCurrentData}
          loading={loading}
          action={true}
          emptyMessage={"No Business Partners Found."}
        />
      </>
      )}
      {loading && <AppSpinner />}
    </>
  );
};

export default BPtabel;
