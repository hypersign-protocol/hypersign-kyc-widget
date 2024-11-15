<template>
  <div>
    <!-- <PageHeading :header="'Preview'" :subHeader="'Please verify if your data is correct before sumitting'" /> -->
    <div class="row mt-2">
      <div class="col-md-12" style="text-align: left">
        <InfoMessage message="Please verify if your informations are correct" />
        <div class="card widget-card" style="width: 100%; margin: auto; max-height: 400px; overflow-y: scroll">
          <div class="row">
            <div class="col-8">
              <table class="table table-hover" style="text-align: left">
                <tbody>
                  <tr v-for="(data, idx) in Object.entries(extractedData)" v-bind:key="idx">
                    <td>
                      <strong>{{ snakeToPascal(data[0]) }}</strong>
                    </td>
                    <td style="">{{ data[1] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-4">
              <div class="center" style="align-items: baseline">
                <img class="avatar" :src="`data:image/png;base64, ${$store.state.kycExtractedData.extractionRaw.ocr.FACE}`" height="100" />
              </div>
              <div class="center mt-2">
                <button class="btn btn-success-link" style="color: green">
                  <i class="bi bi-check-all"></i>
                  {{ $store.state.kycExtractedData.extractionRaw.ocr.OVERALL_RATING }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-md-12">
        <button class="btn btn-light" @click="rescan()">Rescan</button>
        <button class="btn btn-outline-dark" @click="submit()">Continue</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'PreviewData',
  computed: {
    extractedData() {
      const d = { ...this.$store.state.kycExtractedData.extractionRaw.ocr }
      delete d.FACE
      delete d.OVERALL_RATING
      return d
    },
  },
  components: {},
  data: function () {
    return {
      isLoading: false,
      fullPage: true,
      toastMessage: '',
      toastType: 'success',
      isToast: false,
    }
  },

  methods: {
    ...mapActions(['verifyResult']),
    ...mapMutations(['nextStep', 'previousStep']),
    toast(msg, type = 'success') {
      this.isToast = true
      this.toastMessage = msg
      this.toastType = type

      setTimeout(() => {
        this.isToast = false
        this.toastMessage = ''
      }, 5000)
    },

    snakeToPascal(str) {
      return str
        .split('_') // Split the string by underscores
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join('') // Join them back into a single string
    },
    async submit() {
      try {
        // this.isLoading = true;
        // this.toast('Submitting your data...', "warning");
        this.$emit('verifyIdDocEvent', true)
        // const result = await this.verifyResult()

        // this.isLoading = false;
        // this.nextStep();
      } catch (e) {
        this.toast(e.message, 'error')
        // this.isLoading = false;
      }
    },

    async rescan() {
      await this.$store.commit('setKycExtractedData', {
        data: {},
        status: false,
      })
      await this.$store.commit('setKycCapturedData', {
        tokenFrontDocumentImage: '',
        tokenBackDocumentImage: '',
        tokenFaceImage: '',
        countryCode: '',
      })
      this.$emit('EventrescanIDDoc', true)
      // this.nextStep(4)
    },
  },
}
</script>

<style type="text/css" scoped>
.consent-message {
  font-size: smaller;
  margin-left: 44px;
  color: grey;
}

.avatar {
  vertical-align: middle;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(73, 133, 73, 0.47);
}
</style>
