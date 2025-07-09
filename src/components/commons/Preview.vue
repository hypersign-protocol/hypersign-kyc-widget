<template>
  <div class="widget-card-width">
    <!-- Header Message -->
    <InfoMessage message="Please verify if your informations are correct" class="notShowOnMobile mb-2" />

    <!-- Card with Face & Details -->
    <v-card class="mb-2">
      <v-row align="center">
        <!-- Face Image -->
        <v-col cols="12" sm="4" class="text-center">
          <v-avatar size="100" class="elevation-3 mx-auto">
            <img :src="`data:image/png;base64, ${$store.state.kycExtractedData.extractionRaw.ocr.FACE}`" />
          </v-avatar>
        </v-col>

        <!-- Extracted Table -->
        <v-col cols="12" sm="8">
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr v-for="(data, idx) in Object.entries(extractedData)" :key="idx">
                  <td class="font-weight-medium text-left" style="width: 40%">
                    {{ snakeToPascal(data[0]) }}
                  </td>
                  <td class="text-left">
                    {{ data[1] }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card>

    <!-- Buttons -->
    <v-row>
      <v-col cols="12">
        <!-- <v-btn block color="primary" @click="submit()">✔ Continue</v-btn> -->
        <v-btn block color="secondary" @click="submit()">✔ Continue</v-btn>
        <v-btn outlined block color="secondary" class="mt-1" @click="rescan()">↻ Rescan</v-btn>
      </v-col>
    </v-row>
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
    ...mapActions(['verifyResult', 'nextStep']),
    ...mapMutations(['previousStep']),
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

.showOnMobile {
  display: none;
}
.notShowOnMobile {
  display: block;
}
@media (max-width: 450px) {
  .preview {
    max-height: 458px;
  }
  .showOnMobile {
    display: block;
  }
  .notShowOnMobile {
    display: none;
  }
}

.profile-image {
  position: fixed;
  top: 82px; /* Adjusted so half the image is outside the card */
  left: 50%;
  transform: translateX(-50%);
  /* border-radius: 50%; */
  /* border: 4px solid #fff; */
  /* background: #fff; */
  overflow: hidden;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
}

.profile-details {
  margin-top: 60px; /* Adjust to align details properly */
}

.profile-details p {
  margin: 5px 0;
  font-size: 12px;
  color: #333;
}
</style>
