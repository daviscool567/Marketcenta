import axios from "axios";
import { createStore } from "vuex";
// import { Storage } from '@ionic/storage';

// const personalStorage = new Storage();
// personalStorage.create();

const state = {
  authToken: localStorage.getItem("clientToken") || null,
  user: {},
  all_categories: [],
  sub_categories: [],
  all_carts: [],
  carts_total: 0,
  defaultAddress: null,
  userAdresses: {},
};

const getters = {
  loggedIn: (state) => state.authToken != null,
  auth_token: (state) => state.authToken,
  auth_user: (state) => state.user,
  allCategories: (state) => state.all_categories.product_category,
  subCategories: (state) => state.sub_categories,
  // allProducts: (state) => state.all_products,
  carts_data: (state) => state.all_carts,
  cart_total: (state) => state.carts_total,
  cartCount: (state) => state.all_carts.length,
  defaultAddress: (state) => state.defaultAddress,
  addresses: (state) => state.userAdresses
};

const actions = {
  setAuthData({ commit }, resp) {
    localStorage.setItem("clientToken", resp.access_token);
    localStorage.setItem("clientDetails", JSON.stringify(resp.user));
    commit("setToken", resp);
  },
  getAuthData({ commit }) {
    const text = localStorage.getItem("clientDetails");
    const clientDetails = JSON.parse(text);
    commit("fetchData", clientDetails);
  },
  destroyToken({ commit }) {
    // const personalStorage = new Storage();
    // personalStorage.create();
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientDetails");
    commit("removeToken");
  },
  async getCategories({ commit }, url) {
    const response = await axios.post(url, {
      not_paginated: true,
      client: true,
    });

    commit("setCategories", response.data);
  },
  async getSubCategories({ commit }, id) {
    const response = await axios.post(
      // "http://127.0.0.1:8000/api/client/products/subcategories/fetch",
      "https://api.marketcenta.com/api/client/products/subcategories/fetch",
      { no_paginate: true, catId: id }
    );

    commit("setSubCategories", response.data.product_sub_category);
  },

  showUser({ commit }, userId) {
    const token = localStorage.getItem("clientToken");
    axios
      .get(`https://api.marketcenta.com/api/user/fetch/${userId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        localStorage.setItem("clientDetails", JSON.stringify(res.data));
        commit("updateUser", res.data);
      });
  },
  async getCarts({ commit }, id) {
    let auth_token = localStorage.getItem("clientToken");
    await axios
      .post(
        "https://api.marketcenta.com/api/client/products/carts/fetch",
        { id: id },
        {
          headers: {
            authorization: `Bearer ${auth_token}`,
          },
        }
      )
      .then((response) => {
        commit("setCarts", response.data.mssg[0]);
        commit("setCartsTotal", response.data.mssg[1]);
      })
  },
  async fetchDefaultAddress({ commit }) {
    const text = localStorage.getItem("clientDetails");
    const user = JSON.parse(text);
    const auth_token = localStorage.getItem("clientToken");
    await axios
      .get("https://api.marketcenta.com/api/user/address/default/fetch/" + user.id, {
        headers: {
          authorization: `Bearer ${auth_token}`,
        },
      })
      .then((res) => {
        commit('set_default_address', res.data);
      })
  },
  async fetchUserAddress({ commit }) {
    const text = localStorage.getItem("clientDetails");
    const user = JSON.parse(text);
    const auth_token = localStorage.getItem("clientToken");
    await axios
      .get("https://api.marketcenta.com/api/user/address/fetch/" + user.id, {
        headers: {
          authorization: `Bearer ${auth_token}`,
        },
      })
      .then((res) => {
        commit('set_user_addresses', res.data);
      })
  },
};

const mutations = {
  setToken: (state, token) => {
    state.authToken = token.access_token;
    state.user = token.user
  },
  fetchData(state, authData) {
    state.user = authData;
  },
  removeToken(state) {
    (state.authToken = null), (state.user = {});
  },
  setCategories: (state, data) => (state.all_categories = data),
  setSubCategories: (state, data) => (state.sub_categories = data),
  // setAllProducts: (state, data) => (state.all_products = data),
  setCarts: (state, data) => {
    state.all_carts = data
  },
  setCartsTotal: (state, data) => (state.carts_total = data),
  updateUser: (state, userData) => {
    state.user = userData;
  },
  set_default_address: (state, data) => {
    state.defaultAddress = data
  },
  set_user_addresses: (state, data) => {
    state.userAdresses = data
  }
};

export default createStore({
  state,
  mutations,
  actions,
  getters,
});
