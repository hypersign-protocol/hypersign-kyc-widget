<template>
  <div class="card maincontainerForm" style="text-align: left">
    <IsChromium></IsChromium>
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
        <div v-if="!isIdVerifed">
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
            <span
              title="Click to view your ID credential"
              style="cursor: grab; padding: 2px"
              ><i class="bi bi-credit-card-2-front-fill"></i
            ></span>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label for="basic-url" class="form-label fw-bold">Full Name</label>

        <input
          type="text"
          class="form-control"
          id="fullName"
          v-model="dayPassCredentialTemplate.fields.name"
          placeholder="Your Full Name"
        />
      </div>
      <div class="mb-3">
        <label for="basic-url" class="form-label fw-bold">Address</label>

        <textarea
          type="text-area"
          class="form-control"
          id="address"
          v-model="dayPassCredentialTemplate.fields.house"
          placeholder="Your Address"
        ></textarea>
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
            v-model="dayPassCredentialTemplate.fields.phoneNumber"
          />
        </div>
        <!-- <div class="form-text" id="basic-addon4">
          Phone number linked with your ID
        </div> -->
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
          v-model="dayPassCredentialTemplate.fields.email"
        />
      </div>

      <div class="mb-3">
        <label for="basic-url" class="form-label fw-bold"
          >Select Workspace</label
        >
        <select
          class="form-select"
          required
          v-model="dayPassCredentialTemplate.fields.center"
        >
          <option selected value="">
            Select Workspace you are looking for
          </option>
          <option value="HSR Layout">HSR Layout</option>
          <option value="Indra Nagar">Indra Nagar</option>
          <option value="Marathalli">Marathalli</option>
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
            <span
              title="Click to view your invoice credential"
              style="cursor: grab; padding: 2px"
              ><i class="bi bi-credit-card-2-back-fill"></i
            ></span>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <button class="btn btn-outline-dark" @click="submitForm()">
          Submit
        </button>

        <button class="btn btn-link" @click="refresh()">Reset</button>
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
import issuerDidDocument from "./issuer";
export default {
  name: "DayPass",
  components: {
    DayPassFinal,
    PoweredBy,
  },
  computed: {
    isDIDCreated() {
      return this.getUserDID && Object.keys(this.getUserDID).length > 0;
    },

    isIdVerifed() {
      return this.idCredential && Object.keys(this.idCredential).length > 0;
    },
    hasPaid() {
      return (
        this.invoiceCredential && Object.keys(this.invoiceCredential).length > 0
      );
    },
    showDayPass() {
      return (
        this.dayPassCredential && Object.keys(this.dayPassCredential).length > 0
      );
    },
    ...mapGetters([
      "getUserDID",
      "getdayPassCredential",
      "getinvoiceCredential",
      "getidCredential",
    ]),
  },
  async mounted() {
    try {
      this.isLoadingPage = true;

      if (this.getinvoiceCredential) {
        this.invoiceCredential = this.getinvoiceCredential;
      }

      if (this.getdayPassCredential) {
        this.dayPassCredential = this.getdayPassCredential;
      }

      if (this.getidCredential) {
        this.idCredential = this.getidCredential;
        this.dayPassCredentialTemplate.fields.name =
          this.idCredential.credentialSubject.name;
        this.dayPassCredentialTemplate.fields.house =
          this.idCredential.credentialSubject.house;
      }

      if (this.getUserDID?.did) {
        this.isLoadingPage = false;
        return;
      }

      const didRes = await this.createDid();
      const data = {
        didDocument: didRes.didDocument,
        verificationMethodId: didRes.didDocument.verificationMethod[0].id,
      };
      await this.registerDid({ ...data });
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

      dayPassCredentialTemplate: {
        // schemaContext: ["https://schema.org"],
        // type: [],
        schemaId:
          "sch:hid:testnet:zEm5JG2iBuds4oMvmrNJavYxR3eXp7eszfgdhtsnjGAb2:1.0",
        subjectDid: issuerDidDocument.id, // TODO: pass did of users
        issuerDid: issuerDidDocument.id,
        expirationDate: "2027-12-31T23:59:59Z",
        verificationMethodId: issuerDidDocument.verificationMethod[0].id,
        fields: {
          name: "",
          email: "",
          phoneNumber: "",
          center: "",
          issuanceDate: "",
          expirationDate: "",
          issuer: "Behive Ltd",
        },
        namespace: "testnet",
        persist: false,
        // registerCredentialStatus: false,
      },
      isLoadingPage: false,
      shouldIssueCredential: false,
    };
  },
  methods: {
    ...mapMutations([
      "nextStep",
      "setdayPassCredential",
      "setinvoiceCredential",
      "setidCredential",
    ]),
    ...mapActions([
      "createDid",
      "registerDid",
      "issueCredential",
      "refreshStore",
    ]),
    refresh() {
      this.refreshStore();
      window.location.reload();
    },

    openkycpopup() {
      const windowFeatures = "left=100,top=100,width=500,height=700";
      window.open(
        `${window.location.origin}/kyc?did=${this.getUserDID?.did}`,
        "mozillaWindow",
        windowFeatures
      );

      window.addEventListener("message", (event) => {
        console.log("Inside : openkycpopup ");
        if (event.data.event === "id-popup-closed") {
          console.log(
            "Inside : openkycpopup :event.data.event  " + event.data.event
          );
          this.onIdPopupClosed(event.data.message);
        } else {
          console.log(event.data);
        }
      });
    },

    openPaymentGatewayPopup() {
      const windowFeatures = "left=100,top=100,width=500,height=700";
      window.open(
        `${window.location.origin}/pay?did=${this.getUserDID?.did}`,
        "mozillaWindow",
        windowFeatures
      );

      window.addEventListener("message", (event) => {
        if (event.data.event === "pay-popup-closed") {
          this.onPayPopupClosed(event.data.message);
        }
      });
    },

    onPayPopupClosed(credential) {
      console.log("Pay Popup closed");
      this.invoiceCredential = credential;
      this.setinvoiceCredential(this.invoiceCredential);
    },

    onIdPopupClosed(message) {
      try {
        console.log("KYC Popup closed");
        if (message && message.success) {
          this.idCredential = message.message;
          this.dayPassCredentialTemplate.fields.name =
            this.idCredential.credentialSubject.name;
          this.dayPassCredentialTemplate.fields.house =
            this.idCredential.credentialSubject.house;
          this.setidCredential(this.idCredential);
        } else {
          throw new Error(message?.message || "Something went wrong");
        }
      } catch (e) {
        console.error(e);
      }
    },

    async submitForm() {
      try {
        if (!this.hasPaid) {
          return alert("Please finish your payment before proceeding");
        }

        let proccedWithoutIdConfirmation = false;

        if (!this.isIdVerifed) {
          proccedWithoutIdConfirmation = confirm(
            "You did not verify your Identity. You need to verify your ID manually at the veuene during checkin and might have to stand in long queue or wait. To make your and others checking processs seamless, we suggest you verify and procees.\n\n Press Cancel to verify your ID, preess OK to proceed without ID verification"
          );
        }

        if (proccedWithoutIdConfirmation) {
          console.log(proccedWithoutIdConfirmation);
          this.shouldIssueCredential = true;
        }

        if (this.hasPaid && this.isIdVerifed) {
          this.shouldIssueCredential = true;
        }

        if (this.shouldIssueCredential) {
          this.isLoadingPage = true;
          this.dayPassCredentialTemplate.fields.invoiceNumber =
            this.invoiceCredential.invoiceNumber;
          const now = Date.now();

          if (!this.dayPassCredentialTemplate.fields.name) {
            this.dayPassCredentialTemplate.fields.name = this.idCredential.name;
          }

          this.dayPassCredentialTemplate.subjectDid = this.getUserDID?.did
            ? this.getUserDID?.did
            : this.dayPassCredentialTemplate.issuerDid;
          this.dayPassCredentialTemplate.fields.issuanceDate = now;
          this.dayPassCredentialTemplate.fields.expirationDate =
            now + new Date().getDate() + 1;

          // this.dayPassCredentialTemplate.fields.center = "HSR Layout"; // TODO: update this.

          delete this.dayPassCredentialTemplate.fields.house;

          this.dayPassCredential = await this.issueCredential(
            this.dayPassCredentialTemplate
          );

          this.setdayPassCredential(this.dayPassCredential);
          this.isLoadingPage = false;
        }
      } catch (e) {
        this.isLoadingPage = false;
        console.error(e.message);
      } finally {
        this.isLoadingPage = false;
      }
    },
  },
};
</script>
