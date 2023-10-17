<template>
  <div class="card maincontainer" style="text-align: left; padding: 10px">
    <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="true"
    ></load-ing>
    <div class="mb-3">
      <div v-if="!hasPaid" class="center" style="text-align: center">
        <div style="text-align: center">
          Scan the QR code to pay throug your UPI app. Once payment is done,
          press Submit
        </div>
        <i class="bi bi-qr-code" style="font-size: 200px"></i>
        <button class="btn btn-outline-dark" @click="pay()">Submit</button>
      </div>
      <div v-else class="center" style="text-align: center">
        <i class="bi bi-check-circle-fill" style="font-size: 200px"></i>
        <!-- <i class="bi bi-check-circle final-msg-icon success"></i> -->
        <div style="text-align: center">You payment was successfully!</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { HypersignDID } from "hs-ssi-sdk";
import { mapActions } from "vuex";
import issuerDidDocument from "./issuer";
export default {
  data() {
    return {
      hasPaid: false,
      isLoadingPage: false,
      invoiceCredentialTemplate: {
        // schemaContext: ["https://schema.org"],
        // type: [],
        schemaId:
          "sch:hid:testnet:zBQcabxBSYke3gNNeWeAzBkxqGfzZEYnS29jYe3oQynZS:1.0",
        subjectDid: issuerDidDocument.id, // TODO: pass did of users
        issuerDid: issuerDidDocument.id,
        expirationDate: "2027-12-31T23:59:59Z",
        verificationMethodId: issuerDidDocument.verificationMethod[0].id,
        fields: {
          accountId: "123123",
          broker: "RazorPay",
          invoiceNumber: "12314",
          customer: "user",
          provider: "Beehive",
          paymentMethod: "UPI",
          paymentStatus: "Success",
        },
        namespace: "testnet",
        persist: false,
        // registerCredentialStatus: false,
      },
      invoiceCredential: {},
    };
  },
  mounted() {
    const url = new URL(window.location);
    this.invoiceCredentialTemplate.subjectDid = url.searchParams.get("did");
    if (!this.invoiceCredentialTemplate.subjectDid) {
      this.invoiceCredentialTemplate.subjectDid =
        this.invoiceCredentialTemplate.issuerDid;
    }
  },
  methods: {
    ...mapActions(["issueCredential"]),
    async pay() {
      this.isLoadingPage = true;
      this.invoiceCredentialTemplate.subjectDid = this.subjectDID;
      this.invoiceCredential = await this.issueCredential(
        this.invoiceCredentialTemplate
      );
      this.hasPaid = true;
      this.isLoadingPage = false;

      window.opener.postMessage(
        {
          event: "pay-popup-closed",
          message: this.invoiceCredential,
        },
        "*"
      );
    },
  },
};
</script>
