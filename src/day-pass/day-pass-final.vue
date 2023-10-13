<template>
  <div>
    <div id="dayPass-id">
      <div class="row">
        <div class="col-md-12 center" style="text-align: center">
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
          <p>Hi {{ dayPass.fullname }}</p>
          <p>
            Thank you for booking Day pass with
            <span style="font-weight: bold">{{ dayPass.center }}</span
            >.
          </p>
          <p>Please find the details:</p>
          <ul>
            <li>ID: {{ dayPass.id }}</li>
            <li>Name: {{ dayPass.fullname }}</li>
            <li>Company Name: {{ dayPass.companyName }}</li>
            <li>Issued On: {{ dayPass.issuanceDate }}</li>
            <li>Valid Until: {{ dayPass.expirationDate }}</li>
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
export default {
  components: {
    QrcodeVue,
  },
  computed: {
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
        center: "Garuda Bhive, BTM",
        issuer: "Bhive",
        confirmationNumber: "",
        email: "vishu.anndn3@gmail.com",
        phoneNumber: "8444927388",
      },
    };
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
