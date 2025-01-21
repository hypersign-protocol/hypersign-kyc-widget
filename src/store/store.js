import Vue from 'vue'
import Vuex from 'vuex'

import vaultState from './vault/states'
import vaultGetters from './vault/getters'
import vaultMutations from './vault/mutations'
import vaultActions from './vault/actions'

import signinGetters from './signin/getters'
import signinState from './signin/states'
import signinMutations from './signin/mutations'
import signinActions from './signin/actions'

import ekycMutations from './ekyc/mutations'
import eKycState from './ekyc/states'
import ekycActions from './ekyc/actions'
import ekycGetters from './ekyc/getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...eKycState,
    ...signinState,
    ...vaultState,
  },
  getters: {
    ...signinGetters,
    ...ekycGetters,
    ...vaultGetters,
  },
  mutations: {
    ...signinMutations,
    ...ekycMutations,
    ...vaultMutations,
  },
  actions: {
    ...signinActions,
    ...ekycActions,
    ...vaultActions,
  },
})
