<template>
  <div id="dayPass-id">
    <div class="center">
      <i class="bi bi-check-circle-fill" style="font-size: 50px"></i>
    </div>
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
    <p>
      <button
        type="button"
        class="btn btn-outline-dark"
        @click="downloadDayPass()"
      >
        Print Your Day Pass
      </button>
    </p>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
export default {
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
