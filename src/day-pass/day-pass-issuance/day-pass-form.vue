<template>
  <div class="card maincontainerForm" style="text-align: left">
    <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="true"
    ></load-ing>
    <div class="card-header" style="text-align: center">
      <h4>Day Pass Issuance</h4>
    </div>
    <div class="card-body" v-if="!showDayPass">
      <div class="mb-3">
        <div v-if="!isAadhaarQRVerifiedAndDataExtracted">
          <label for="basic-url" class="form-label fw-bold"
            >Choose ID Provider and verify your identity</label
          >
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios1"
              value="option1"
              @click="openkycpopup()"
            />
            <label class="form-check-label" for="exampleRadios1">
              Aadhaar Id By <a href="#"> Cavach.id </a>
            </label>
          </div>

          <!-- <button class="btn btn-link btn-sm" @click="openkycpopup()">
            Verify your Identity
          </button> -->
        </div>
        <div v-else>
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
              Your ID is verified!
            </label>
          </div>
          <!-- <button class="btn btn-success btn-sm" disabled>
            <span
              ><i class="bi bi-check-circle" style="color: white"></i> Your ID
              is verified!</span
            >
          </button> -->
        </div>
      </div>

      <div class="mb-3">
        <label for="basic-url" class="form-label fw-bold">Full Name</label>

        <input
          type="text"
          class="form-control"
          id="fullName"
          v-model="dayPassCredential.name"
          placeholder="Your Full Name"
        />
      </div>
      <div class="mb-3">
        <label for="basic-url" class="form-label fw-bold">Phone Number</label>
        <div class="input-group">
          <span class="input-group-text" id="basic-addon3">+91</span>
          <input
            type="text"
            class="form-control"
            id="basic-url"
            aria-describedby="basic-addon3 basic-addon4"
            v-model="dayPassCredential.phoneNumber"
          />
        </div>
        <div class="form-text" id="basic-addon4">
          Phone number linked with your ID
        </div>
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label fw-bold"
          >Email address</label
        >
        <input
          type="email"
          class="form-control"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
          v-model="dayPassCredential.email"
        />
      </div>

      <div class="mb-3">
        <label for="basic-url" class="form-label fw-bold"
          >Select Workspace</label
        >
        <select class="form-select" aria-label="Default select example">
          <option selected>Select Workspace you are looking for</option>
          <option value="1">HSR Layout</option>
          <option value="2">Indra Nagar</option>
          <option value="3">Marathalli</option>
        </select>
      </div>

      <div class="mb-3">
        <div v-if="!hasPaid">
          <label for="basic-url" class="form-label fw-bold"
            >Choose Payment Option</label
          >
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios1"
              value="option1"
              @click="openPaymentGatewayPopup()"
            />
            <label class="form-check-label" for="exampleRadios1">
              Razor Pay
            </label>
          </div>
        </div>
        <div v-else>
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
              Your Payment is done successfully!
            </label>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <button class="btn btn-outline-dark" @click="submitForm()">
          Submit
        </button>
      </div>
    </div>
    <div v-else class="card-body">
      <day-pass-final></day-pass-final>
    </div>
    <div class="card-footer" style="text-align: center">
      <PoweredBy footer-label="Secured By"></PoweredBy>
      <span style="font-size: small; color: rgb(97, 95, 95)">{{
        this.getUserDID?.did
      }}</span>
    </div>
  </div>
</template>

<script>
import DayPassFinal from "./day-pass-final.vue";
import { mapMutations, mapActions, mapGetters } from "vuex";
import PoweredBy from "../../components/commons/PoweredBy.vue";
export default {
  components: {
    DayPassFinal,
    PoweredBy,
  },
  computed: {
    isAadhaarQRVerifiedAndDataExtracted() {
      return this.aadharData && Object.keys(this.aadharData).length > 0;
    },
    ...mapGetters(["getUserDID"]),
  },
  async mounted() {
    try {
      this.isLoadingPage = true;
      if (this.getUserDID?.did) {
        this.isLoadingPage = false;
        return;
      }
      const didRes = await this.createDid();
      const data = {
        didDocument: didRes.didDocument,
        verificationMethodId: didRes.didDocument.verificationMethod[0].id,
      };
      const resp = await this.registerDid({ ...data });
      console.log(resp);
    } catch (e) {
      console.error(e.message || e);
    } finally {
      this.isLoadingPage = false;
    }
  },
  data() {
    return {
      idCredential: {},
      invoiceCredential: {},
      dayPassCredential: {},
      isLoadingPage: false,
      aadharData: {},
      hasPaid: false,
      showDayPass: false,
    };
  },
  methods: {
    ...mapMutations([
      "setPhoneNumber",
      "nextStep",
      "setFinalResult",
      "setQrString",
      "setImage",
      "setFinalResult",
    ]),
    ...mapActions(["createDid", "registerDid"]),
    openkycpopup() {
      const windowFeatures = "left=100,top=100,width=500,height=700";
      window.open(
        `https://${window.location.host}/kyc`,
        "mozillaWindow",
        windowFeatures
      );

      window.addEventListener("message", (event) => {
        if (event.data === "popup-closed") {
          this.onPopupClosed();
        }
      });
    },
    openPaymentGatewayPopup() {
      const windowFeatures = "left=100,top=100,width=500,height=700";
      window.open(
        `https://${window.location.host}/pay`,
        "mozillaWindow",
        windowFeatures
      );

      window.addEventListener("message", (event) => {
        if (event.data === "pay-popup-closed") {
          this.onPayPopupClosed();
        }
      });
    },
    onPayPopupClosed() {
      console.log("Pay Popup closed");
      this.hasPaid = true;

      this.invoiceCredential.accountId = "123123";
      this.invoiceCredential.broker = "RazorPay";
      this.invoiceCredential.invoiceNumber = "12314";
      this.invoiceCredential.customer = "user";
      this.invoiceCredential.provider = "Beehive";
      this.invoiceCredential.paymentMethod = "UPI";
      this.invoiceCredential.paymentStatus = "Success";
      this.setImage(this.invoiceCredential);
    },
    onPopupClosed() {
      try {
        console.log("KYC Popup closed");
        const aadharDataStr = localStorage.getItem("aadharData");
        if (aadharDataStr) {
          this.aadharData = JSON.parse(aadharDataStr);
          this.idCredential = {
            name: this.aadharData.name,
            dob: this.aadharData.dob,
            docType: "Aadhaar",
            issuer: "Cavach.Id",
          };
          console.log("Seeint setidcredential...");
          this.dayPassCredential.name = this.idCredential.name;
          this.setPhoneNumber(this.idCredential);
          // this.setPhoneNumber1(this.idCredential);
        } else {
          console.log("Could not find aadharDataStr");
        }
      } catch (e) {
        console.error(e);
      }
    },

    submitForm() {
      try {
        //

        if (!this.hasPaid) {
          return alert("Please finish your payment before proceeding");
        }

        let proccedWithoutIdConfirmation = false;

        if (!this.isAadhaarQRVerifiedAndDataExtracted) {
          proccedWithoutIdConfirmation = confirm(
            "You did not verify your Identity. You need to verify your ID manually at the veuene during checkin and might have to stand in long queue or wait. To make your and others checking processs seamless, we suggest you verify and procees.\n\n Press Cancel to verify your ID, preess OK to proceed without ID verification"
          );
        }

        if (proccedWithoutIdConfirmation) {
          console.log(proccedWithoutIdConfirmation);
          this.showDayPass = true;
        }

        if (this.hasPaid && this.isAadhaarQRVerifiedAndDataExtracted) {
          this.showDayPass = true;
        }

        if (this.showDayPass) {
          this.dayPassCredential.invoiceNumber =
            this.invoiceCredential.invoiceNumber;
          const now = Date.now();

          if (!this.dayPassCredential.name) {
            this.dayPassCredential.name = this.idCredential.name;
          }

          this.dayPassCredential.issuanceDate = now;
          this.dayPassCredential.expirationDate =
            now + new Date().getDate() + 1;
          this.dayPassCredential.issuer = "Beehive";
          this.dayPassCredential.center = "HSR Layout";
          this.setFinalResult(this.dayPassCredential);
        }
      } catch (e) {
        console.error(e.message);
      }
    },
  },
};
</script>
