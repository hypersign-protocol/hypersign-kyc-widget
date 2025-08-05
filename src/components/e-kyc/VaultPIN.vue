<template>
  <div class="kyc-container">
    <div class="">
      <load-ing :active.sync="isLoadingPage" :can-cancel="true" :is-full-page="fullPage"></load-ing>

      <div v-if="ifNewUser">
        <RegisterPIN @proceedWithUnlockVaultAndSyncDataEvent="unlockVaultAndSyncData" />
      </div>

      <div v-else>
        <AskPIN @proceedWithUnlockVaultAndSyncDataEvent="unlockVaultAndSyncData" @proceedWithAccountDeletionFinal="proceedWithAccountDeletionFinalHandler" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
}

.footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  z-index: 100;
}
</style>

<script type="text/javascript">
import AskPIN from '../commons/AskPIN.vue'
import RegisterPIN from '../commons/RegisterPIN.vue'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { generateMnemonicForWallet, generateMnemonicToHDSeed } from '../utils/hd-wallet'
import { HypersignDID } from 'hs-ssi-sdk'
import { STEP_NAMES } from '../../config'
import { EVENT, EVENTS } from '../utils/eventBus'
// import VaultConfig from '../../store/vault/config'
export default {
  name: STEP_NAMES.VaultPIN,
  computed: {
    ...mapState(['ifNewUser', 'steps']),
    ...mapGetters(['getWidgetConfigFromDb', 'getSteps', 'getVaultData', 'getVaultId', 'getVaultWallet', 'getVaultMnemonic']),
  },
  components: {
    AskPIN,
    RegisterPIN,
  },
  async created() {
    if (this.getWidgetConfigFromDb.faceRecog) {
      this.enableAstep(STEP_NAMES.LiveLiness)
    }

    if (this.getWidgetConfigFromDb.idOcr.enabled) {
      this.enableAstep(STEP_NAMES.IdDocs)
    }

    if (this.getWidgetConfigFromDb.zkProof.enabled) {
      this.enableAstep(STEP_NAMES.ZkProofs)
    }
  },
  methods: {
    ...mapMutations(['setVaultRaw', 'setAStep']),
    ...mapActions(['nextStep', 'previousStep', 'unlockVault', 'deleteAccount', 'initializeVault', 'intitalizeVaultWallet', 'createKMS', 'lockVault', 'syncUserData', 'syncUserDataById', 'retriveVaultKeys', 'retriveVaultCredentials', 'addUpdateDocumentById', 'getUserAccessMnemomic']),
    enableAstep(stepName) {
      const stepToUpdate = this.steps.find((x) => x.stepName === stepName)
      stepToUpdate.isEnabled = true
      this.$store.dispatch('updateStepState', stepToUpdate)
      // this.setAStep(stepToUpdate)
    },
    async unlockVaultAndSyncData(data) {
      try {
        if (data) {
          this.isLoadingPage = true
          /// unlock you mnemonic
          if (!this.ifNewUser) {
            await this.getUserAccessMnemomic()
          }
          this.userVaultDataRaw.mnemonic = this.getVaultMnemonic

          /// setup vault wallet
          await this.intitalizeVaultWallet({ mnemonic: this.getVaultMnemonic })
          this.userVaultDataRaw.hypersign.did = this.getVaultWallet.didDocument.id
          this.userVaultDataRaw.hypersign.didDoc = {
            ...this.getVaultWallet.didDocument,
          }
          this.userVaultDataRaw.hypersign.keys = this.getVaultWallet.keys
          if (this.userVaultDataRaw) {
            this.setVaultRaw(JSON.stringify(this.userVaultDataRaw))
          }

          /// setup vault
          await this.initializeVault()

          if (this.ifNewUser) {
            this.createKMS()
          }

          await this.retriveVaultCredentials()

          this.isLoadingPage = false
          this.nextStep()
        } else {
          this.isLoadingPage = false
        }
      } catch (e) {
        this.toast(e.message, 'error')
        this.isLoadingPage = false
      }
    },
    generateMnemonic1() {
      this.userVaultDataRaw.mnemonic = generateMnemonicForWallet()
    },

    async proceedWithAccountDeletionFinalHandler() {
      try {
        this.isLoadingPage = true
        this.toast('Account reset in progress', 'warning')
        await this.deleteAccount()
        this.isLoadingPage = false
        this.toast('Account successfully reset', 'success')
        this.previousStep()
      } catch (e) {
        this.isLoadingPage = false
        this.toast(e.message, 'error')
      }
    },
    async generateDID() {
      const seed = await generateMnemonicToHDSeed(this.userVaultDataRaw.mnemonic)
      const hypersignDID = new HypersignDID({ namespace: 'testnet' })
      const kp = await hypersignDID.bjjDID.generateKeys({ seed })

      const didDocument = await hypersignDID.bjjDID.generate({
        publicKeyMultibase: kp.publicKeyMultibase,
      })

      this.userVaultDataRaw.hypersign.did = didDocument.id
      this.userVaultDataRaw.hypersign.didDoc = { ...didDocument }
      this.userVaultDataRaw.hypersign.keys = { ...kp }
    },
    toast(msg, type = 'success') {
      EVENT.emitEvent(
        EVENTS.NOTIFY,
        JSON.stringify({
          toastMessage: msg,
          toastType: type,
        })
      )
    },
  },
  data() {
    return {
      isLoadingPage: false,
      fullPage: true,
      toastMessage: '',
      toastType: 'success',
      isToast: false,
      userVaultDataRaw: {
        password: '',
        mnemonic: '',
        hypersign: {
          did: '',
          keys: {},
          credentials: [],
        },
      },
    }
  },
}
</script>
