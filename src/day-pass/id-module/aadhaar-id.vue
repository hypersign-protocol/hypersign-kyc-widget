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
          "sch:hid:testnet:z3PAnHTPFpoP6JUxU2qEECLEs7RsAJUSYdHfei3NJUsWw:1.0",
        subjectDid: issuerDidDocument.id, // TODO: pass did of users
        issuerDid: issuerDidDocument.id,
        expirationDate: "2027-12-31T23:59:59Z",
        verificationMethodId: issuerDidDocument.verificationMethod[0].id,
        fields: {
          dob: "",
          docType: "Aadhaar ID",
          issuer: "Cavach.id",
          name: "",
          jpegImage: "",
          gender: "",
          house: "",
        },
        namespace: "testnet",
        persist: false,
        // registerCredentialStatus: false,
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
    const url = new URL(window.location);
    this.idCredentialTemplate.subjectDid = url.searchParams.get("did");
    if (!this.idCredentialTemplate.subjectDid) {
      this.idCredentialTemplate.subjectDid =
        this.idCredentialTemplate.issuerDid;
    }
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
          this.idCredentialTemplate.fields.gender = aadhaarData.gender;
          this.idCredentialTemplate.fields.house = aadhaarData.house;
          // this.idCredentialTemplate.fields.jpegImage = ""; //TODO aadhaarData.jpegImage;
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
