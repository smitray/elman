import Cookie from 'js-cookie';

export const getters = {
  isAuthenticated: (state) => {
    if (state.user) {
      return true;
    }
    return false;
  }
};

export const mutations = {
  SET_USER: (state, user) => {
    state.user = user;
    state.isAuthenticated = true;
  },
  UNSET_USER: (state) => {
    state.user = null;
    state.isAuthenticated = false;
    state.token = null;
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_DIRECTION: (state, direction) => {
    state.direction = direction;
  }
};

export const actions = {
  async USER_LOGIN({ commit, dispatch }, cred) {
    try {
      const { data } = await this.$axios.$post('/api/auth/local', {
        ...cred
      });
      Cookie.set('token', data.token);
      commit('SET_TOKEN', data.token);
      await dispatch('USER_GET_DETAILS');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Wrong credentials');
      }
      if (error.response && error.response.status === 409) {
        throw new Error('Username or Email already exists');
      }
      throw error;
    }
  },
  async USER_GET_DETAILS({ commit, state }) {
    try {
      const { token } = state;
      this.$axios.setHeader('Authorization', token);
      const { data } = await this.$axios.$get('/api/auth');
      commit('SET_USER', data.user);
    } catch (error) {
      throw error;
    }
  },
  logout({ commit }) {
    Cookie.remove('token');
    commit('UNSET_USER');
    this.$router.push({
      name: 'index'
    });
  }
};

export const state = () => ({
  user: null,
  isAuthenticated: false,
  token: null,
  direction: 'auth'
});
