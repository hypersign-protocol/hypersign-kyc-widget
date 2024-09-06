<template>
  <div>
    <!-- <PageHeading :header="'Preview'" :subHeader="'Please verify if your data is correct before sumitting'" /> -->
    <div class="row" style="margin-top: 1%">
      <div class="col-md-12" style="text-align: left">
        <InfoMessage message="Please verify if your informations are correct" />
        <div class="card widget-card" style="width: 90%; margin: auto">
          <table class="table" style="text-align: left">
            <tr
              v-for="(data, idx) in Object.entries(extractedData)"
              v-bind:key="idx"
            >
              <td>{{ snakeToPascal(data[0]) }}</td>
              <td>{{ data[1] }}</td>
            </tr>
            <!-- 
            <tr>
              <td>Name</td>
              <td>
                {{ `${extractedData.firstName} ${extractedData.lastName}` }}
              </td>
            </tr>

            <tr>
              <td>Date Of Birth</td>
              <td>{{ `${extractedData.dateOfBirth}` }}</td>
            </tr>

            <tr>
              <td>Sex</td>
              <td>{{ `${extractedData.gender}` }}</td>
            </tr>

            <tr>
              <td>Nationality</td>
              <td>{{ `${extractedData.nationality}` }}</td>
            </tr>

            <tr>
              <td>Issued Date</td>
              <td>{{ `${extractedData.dateOfIssue}` }}</td>
            </tr>
            <tr>
              <td>Expiration Date</td>
              <td>{{ `${extractedData.dateOfExpiry}` }}</td>
            </tr> -->
          </table>
        </div>
      </div>
    </div>

    <div class="row" style="margin-top: 1%">
      <div class="col-md-12">
        <button class="btn btn-light" @click="rescan()">Rescan</button>
        <button class="btn btn-outline-dark" @click="submit()">Continue</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  name: "PreviewData",
  computed: {
    extractedData() {
      return this.$store.state.kycExtractedData.extractionRaw.ocr;
    },
  },
  components: {},
  data: function () {
    return {
      isLoading: false,
      fullPage: true,
      toastMessage: "",
      toastType: "success",
      isToast: false,
    };
  },

  methods: {
    ...mapActions(["verifyResult"]),
    ...mapMutations(["nextStep", "previousStep"]),
    toast(msg, type = "success") {
      this.isToast = true;
      this.toastMessage = msg;
      this.toastType = type;

      setTimeout(() => {
        this.isToast = false;
        this.toastMessage = "";
      }, 5000);
    },

    snakeToPascal(str) {
      return str
        .split("_") // Split the string by underscores
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize each word
        .join(""); // Join them back into a single string
    },
    async submit() {
      try {
        // this.isLoading = true;
        // this.toast('Submitting your data...', "warning");
        this.$emit("verifyIdDocEvent", true);
        // const result = await this.verifyResult()

        // this.isLoading = false;
        // this.nextStep();
      } catch (e) {
        this.toast(e.message, "error");
        // this.isLoading = false;
      }
    },

    async rescan() {
      await this.$store.commit("setKycExtractedData", {
        data: {},
        status: false,
      });
      await this.$store.commit("setKycCapturedData", {
        tokenFrontDocumentImage: "",
        tokenBackDocumentImage: "",
        tokenFaceImage: "",
        countryCode: "",
      });
      //this.nextStep(4)
    },
  },
};
</script>

<style type="text/css" scoped>
.consent-message {
  font-size: smaller;
  margin-left: 44px;
  color: grey;
}
</style>
