import axios from "axios";

const Axios = async (url, method = "get", data = null, token = null, isManagementApi, isOSC = null, isShopify = null, oscHeader = 'Fetch') => {
  try {
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (isOSC) {
      headers["OSvC-CREST-Application-Context"] = `${oscHeader}`;
      headers['Content-Type'] = 'application/json';
      headers['Authorization'] = 'Basic c3BlcmlkaWFuX2FkbWluOlNwZXJpZGlhbkAxMjMj';
      // headers['Access-Control-Allow-Origin'] = "*";
      // headers['Access-Control-Allow-Headers'] = '*';
    }
    if (isManagementApi) {
      headers["content-type"] = "application/json"
    }
    if (isShopify) {
      headers['X-Shopify-Access-Token'] = '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';
      // headers['Access-Control-Allow-Origin'] = "*";
      // headers['Access-Control-Allow-Headers'] = 'X-Requested-With';
    }

    const response = await axios.request({
      method: method,
      url: url,
      data: data,
      headers: headers,
    });

    return response.data;
  } catch (error) {
    // console.error(error);
    return error;
  }
};

export default Axios;
