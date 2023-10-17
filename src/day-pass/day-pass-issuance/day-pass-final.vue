<template>
  <div>
    <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="true"
    ></load-ing>
    <div id="dayPass-id" style="background: beige">
      <h1>Day Pass</h1>
      <div class="row">
        <div class="col-md-12">
          <i
            class="bi bi-check-circle-fill"
            style="font-size: 50px; color: green"
          ></i>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <!-- <div style="text-align: center">
            <i
              class="bi bi-check-circle-fill"
              style="font-size: 50px; color: green"
            ></i>
          </div> -->
          <p>Hi {{ dayPass.credentialSubject?.name }}</p>
          <p>
            Thank you for booking Day pass with
            <span style="font-weight: bold">{{
              dayPass.credentialSubject?.center
            }}</span
            >.
          </p>
          <p>Please find the details:</p>
          <ul>
            <li>ID: {{ dayPass?.id }}</li>
            <li>Name: {{ dayPass.credentialSubject?.name }}</li>
            <li>Issued On: {{ dayPass.credentialSubject?.issuanceDate }}</li>
            <li>
              Valid Until:
              {{ dayPass.credentialSubject?.expirationDate }}
            </li>
            <li v-if="this.hasIdVerified">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckChecked"
                  checked
                  disabled
                />
                <label
                  class="form-check-label"
                  for="flexCheckChecked"
                  style="color: green"
                >
                  Your Id is verified!
                </label>
              </div>
            </li>
            <li v-if="this.hasPaymentDone">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckChecked"
                  checked
                  disabled
                />
                <label
                  class="form-check-label"
                  for="flexCheckChecked"
                  style="color: green"
                >
                  Your Payment is done!
                </label>
              </div>
            </li>
          </ul>
          <p>
            Thank you for booking with us,
            <span style="font-weight: bold">Happy Working!!</span>
          </p>
        </div>
        <div class="col-md-6" v-if="this.QRCodeURl != ''">
          <!-- <qrcode-vue
            :value="dayPassStr"
            :size="300"
            level="H"
            style="padding-left: 10px"
          /> -->
          <img :src="QRCodeURl" />
          <div>Show this QR code at the checkin desk at venue</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <button
          type="button"
          class="btn btn-outline-dark"
          @click="downloadDayPass()"
        >
          Print Your Day Pass
        </button>

        <button type="button" class="btn btn-link" @click="refresh()">
          Request New Day Pass
        </button>
      </div>
    </div>
    <p></p>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
// import QrcodeVue from "qrcode.vue";
import { mapGetters, mapActions } from "vuex";
import zlib from "browserify-zlib";
import QRCode from "qrcode";
// var Buffer = require("buffer").Buffer;
// var zlib = require("zlib");

export default {
  components: {
    // QrcodeVue,
  },
  computed: {
    ...mapGetters([
      "getUserDID",
      "getdayPassCredential",
      "getinvoiceCredential",
      "getidCredential",
    ]),

    hasIdVerified() {
      if (
        this.getidCredential &&
        Object.keys(this.getidCredential).length > 0
      ) {
        return true;
      }
      return false;
    },

    hasDayPassIssued() {
      if (
        this.getdayPassCredential &&
        Object.keys(this.getdayPassCredential).length > 0
      ) {
        return true;
      }
      return false;
    },

    hasPaymentDone() {
      if (
        this.getinvoiceCredential &&
        Object.keys(this.getinvoiceCredential).length > 0
      ) {
        return true;
      }
      return false;
    },

    dayPassStr() {
      return JSON.stringify(this.presentation);
    },
  },
  data() {
    return {
      dayPass: {},
      isLoadingPage: false,
      presentation: {},
      QRCodeURl: "",
    };
  },

  async mounted() {
    if (this.getdayPassCredential) {
      this.dayPass = this.getdayPassCredential;
    }

    try {
      this.isLoadingPage = true;
      const credentialDocuments = [];
      if (!this.getUserDID) {
        throw new Error("No user ID found");
      }

      if (this.hasDayPassIssued) {
        credentialDocuments.push(this.getdayPassCredential);
      }

      if (this.hasPaymentDone) {
        credentialDocuments.push(this.getinvoiceCredential);
      }

      if (this.hasIdVerified) {
        credentialDocuments.push(this.getidCredential);
      }

      this.presentation = await this.generatePresentation({
        credentialDocuments: credentialDocuments,
        holderDid: this.getUserDID.did,
        domain: "https://127.0.0.1:8080", // TODO: fix hardcoding, window.location.origin,
        challenge: "12345",
      });

      this.compressAndGeneratedQRCode();
    } catch (e) {
      console.error(e.message);
      this.isLoadingPage = false;
    } finally {
      this.isLoadingPage = false;
    }
  },

  methods: {
    ...mapActions(["generatePresentation", "refreshStore"]),

    refresh() {
      this.refreshStore();
      window.location.reload();
    },

    async compressAndGeneratedQRCode() {
      const d = JSON.stringify(this.presentation);
      // TODO: Need to compress more
      const deflated = zlib.deflateSync(d).toString("base64");
      this.QRCodeURl = await QRCode.toDataURL(deflated, {
        width: 300,
        scale: 1,
      });

      // TODO:  remove this once we figure out how to extract presentation from pdf
      localStorage.setItem("presentation", d);
    },

    downloadDayPass() {
      html2pdf(document.getElementById("dayPass-id"), {
        margin: 1,
        filename: "day-pass-" + `${this.dayPass.id}.pdf`,
      });
    },
  },
};
</script>
