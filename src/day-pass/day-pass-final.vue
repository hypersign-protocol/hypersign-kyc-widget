<template>
  <div>
    <div id="dayPass-id">
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
          <p>Hi {{ dayPassCredential.name }}</p>
          <p>
            Thank you for booking Day pass with
            <span style="font-weight: bold">{{ dayPassCredential.center }}</span
            >.
          </p>
          <p>Please find the details:</p>
          <ul>
            <li>ID: {{ dayPassCredential.id }}</li>
            <li>Name: {{ dayPassCredential.name }}</li>
            <li>Issued On: {{ dayPassCredential.issuanceDate }}</li>
            <li>Valid Until: {{ dayPassCredential.expirationDate }}</li>
          </ul>
          <p>
            Thank you for booking with us,
            <span style="font-weight: bold">Happy Working!!</span>
          </p>
        </div>
        <div class="col-md-6">
          <qrcode-vue
            :value="dayPassStr"
            :size="300"
            level="H"
            style="padding-left: 10px"
          />
          <div>Show this QR code at the checkin desk at venue</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 center">
        <button
          type="button"
          class="btn btn-outline-dark"
          @click="downloadDayPass()"
          style="margin-left: 57%"
        >
          Print Your Day Pass
        </button>
      </div>
    </div>
    <p></p>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
import QrcodeVue from "qrcode.vue";
import { mapState } from "vuex";

export default {
  components: {
    QrcodeVue,
  },
  computed: {
    ...mapState(["dayPassCredential"]),
    dayPassStr() {
      return JSON.stringify(this.dayPass);
    },
  },
  data() {
    return {
      dayPass: {
        id: "day-pass-123",
        fullname: "Vishwas Anand Bhushan",
        companyName: "Hypermine Pvt. Ltd",
        issuanceDate: "12-12-2023",
        expirationDate: "12-12-2023",
        center: "HSR Layout",
        issuer: "Bhive",
        confirmationNumber: "",
        email: "vishu.anndn3@gmail.com",
        phoneNumber: "8444927388",
      },
    };
  },

  mounted() {
    // const dayPassCredentialStr = localStorage.getItem("dayPassCredential");
    // const dayPassCredential = JSON.parse(dayPassCredentialStr);
    // this.dayPass = {
    //   ...dayPassCredential,
    // };
  },

  methods: {
    downloadDayPass() {
      html2pdf(document.getElementById("dayPass-id"), {
        margin: 1,
        filename: "i-was-html.pdf",
      });
    },
  },
};
</script>
