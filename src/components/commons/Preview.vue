<template>
  <div class="kyc-container">
    <!-- <PageHeading :header="'Preview'" :subHeader="'Please verify if your data is correct before sumitting'" /> -->
    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <InfoMessage message="Please verify if your informations are correct" />
        <v-card class="preview profile-card">
          <div class="profile-image">
            <v-avatar size="100">
              <img :src="`data:image/png;base64, ${$store.state.kycExtractedData.extractionRaw.ocr.FACE}`" />
            </v-avatar>
          </div>
          <div class="profile-details">
            <v-simple-table style="text-align: left">
              <template v-slot:default>
                <tbody>
                  <tr v-for="(data, idx) in Object.entries(extractedData)" v-bind:key="idx">
                    <td>
                      <strong>{{ snakeToPascal(data[0]) }}</strong>
                    </td>
                    <td style="">{{ data[1] }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
          <!-- <div class="row center">
            <div class="col-4">
              <div class="mt-1" style="align-items: baseline">
                <v-badge overlap bordered bottom color="green accent-5" dot offset-x="15" offset-y="15" :content="$store.state.kycExtractedData.extractionRaw.ocr.OVERALL_RATING">
                  <v-avatar size="100">
                    <img :src="`data:image/png;base64, ${$store.state.kycExtractedData.extractionRaw.ocr.FACE}`" />
                  </v-avatar>
                </v-badge>
              </div>
            </div>
            <div class="col-12">
              <v-simple-table style="text-align: left">
                <template v-slot:default>
                  <tbody>
                    <tr v-for="(data, idx) in Object.entries(extractedData)" v-bind:key="idx">
                      <td>
                        <strong>{{ snakeToPascal(data[0]) }}</strong>
                      </td>
                      <td style="">{{ data[1] }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
          </div> -->
        </v-card>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-md-12">
        <v-btn class="btn btn-light" @click="rescan()">Rescan</v-btn>
        <v-btn class="btn btn-outline-dark" @click="submit()">Continue</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { EVENT, EVENTS } from '../utils/eventBus'
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
      EVENT.emitEvent(
        EVENTS.NOTIFY,
        JSON.stringify({
          toastMessage: msg,
          toastType: type,
        })
      )
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
.preview {
  width: 100%;
  margin: auto;
  max-height: 400px;
  overflow-y: scroll;
}

@media (max-width: 768px) {
  .preview {
    max-height: 500px;
  }
}

.profile-image {
  position: fixed;
  top: 30px; /* Adjusted so half the image is outside the card */
  left: 50%;
  transform: translateX(-50%);
  width: 100px; /* Adjust the size of the image */
  height: 100px; /* Adjust the size of the image */
  border-radius: 50%;
  border: 4px solid #fff; /* Optional border around the image */
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details {
  margin-top: 60px; /* Adjust to align details properly */
}

.profile-details p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}
</style>
