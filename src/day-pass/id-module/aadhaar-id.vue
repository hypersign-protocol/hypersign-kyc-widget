<template>
  <div>
    <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="true"
    ></load-ing>

    <template>
      <!-- <component
        v-if="getActiveStep.stepName === 'AppScanQR'"
        :is="'AppScanQR'"
        @finalresult="getResult"
      >
      </component> -->
      <component :is="getActiveStep.stepName" @finalresult="getResult">
      </component>
    </template>
  </div>
</template>

<script>
import AppInstructions from "../../components/AppInstructions.vue";
import AppScanQR from "../../components/AppScanQR.vue";
import AppClickPic from "../../components/AppClickPic.vue";
import AppFinalSuccess from "../../components/AppFinalSuccess.vue";
import { mapGetters, mapActions } from "vuex";
import issuerDidDocument from "./issuer";
export default {
  name: "AadhaarId",
  components: {
    AppInstructions,
    AppScanQR,
    AppClickPic,
    AppFinalSuccess,
  },
  data() {
    return {
      idCredentialTemplate: {
        // schemaContext: ["https://schema.org"],
        // type: [],
        schemaId:
          "sch:hid:testnet:z2YPXosqAbYztVmqYFTW1VfXo2Z6dnafyVPgZ2n9jBmMa:1.0",
        subjectDid: issuerDidDocument.id, // TODO: pass did of users
        issuerDid: issuerDidDocument.id,
        expirationDate: "2027-12-31T23:59:59Z",
        verificationMethodId: issuerDidDocument.verificationMethod[0].id,
        fields: {
          dob: "",
          docType: "Aadhaar ID",
          issuer: "Cavach.id",
          name: "",
        },
        namespace: "testnet",
        persist: false,
      },
      idCredential: {},
      isLoadingPage: false,
    };
  },
  computed: {
    ...mapGetters(["getActiveStep", "getAadhaarData"]),
    // ...mapState(["aadharData"]),
  },
  mounted() {
    // if (this.getAadhaarData) {
    //   this.isAlreadyVerifed = true;
    //   this.getResult("Ok");
    // }
    // window.addEventListener("beforeunload", () => {
    //   window.opener.postMessage("popup-closed", "*");
    // });
  },
  methods: {
    ...mapActions(["issueCredential"]),
    async getResult(data) {
      console.log(
        " getResult ...................................................................."
      );
      this.isLoadingPage = true;

      try {
        if (data === "Ok") {
          let aadhaarData;
          if (!this.getAadhaarData) {
            aadhaarData = JSON.parse(localStorage.getItem("aadharData"));
          } else {
            aadhaarData = this.getAadhaarData;
            // throw new Error("Aadhar data not found, Could not verify your ID");
          }

          this.idCredentialTemplate.fields.name = aadhaarData.name;
          this.idCredentialTemplate.fields.dob = aadhaarData.dob;
          this.idCredential = await this.issueCredential(
            this.idCredentialTemplate
          );
          const m = {
            success: true,
            message: this.idCredential,
          };
          this.sendMessageToClient(m);
        } else {
          throw new Error("Could not verify your ID");
        }
      } catch (e) {
        this.isLoadingPage = false;
        this.sendMessageToClient({
          success: false,
          message: e.message,
        });
      } finally {
        this.isLoadingPage = false;
      }
    },

    sendMessageToClient(m) {
      const message = {
        event: "id-popup-closed",
        message: m,
      };
      window.opener.postMessage(message, "*");
    },
  },
};
</script>
