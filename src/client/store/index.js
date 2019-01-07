export const mutations = {

};

export const actions = {
  nuxtServerInit({ commit, dispatch }, { req, app }) {
    try {
      if (req.headers.cookie) {
        const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('token='));
        if (jwtCookie) {
          const token = jwtCookie.split('=')[1].replace('Bearer%20', 'Bearer ');
          commit('user/SET_TOKEN', token);
          // app.$axios.setHeader('Authorization', token);
          // return Promise.resolve(dispatch('user/USER_GET_DETAILS'));
          return true;
        }
      }
      return false;
    } catch (e) {
      throw e;
    }
  }
};

export const state = () => ({

});
