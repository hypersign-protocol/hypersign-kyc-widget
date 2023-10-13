<template>
  <div class="card" style="text-align: left">
    <div class="card-header" style="text-align: center">
      <h4>Day Pass Issuance Form</h4>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <div v-if="!isAadhaarQRVerifiedAndDataExtracted">
          <label for="basic-url" class="form-label">Verify Your Id</label>
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
              Aadhaar Id
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
        <label for="basic-url" class="form-label">Name</label>

        <input
          type="text"
          class="form-control"
          id="fullName"
          v-model="aadharData.name"
          placeholder="Full Name"
        />
      </div>
      <div class="mb-3">
        <label for="basic-url" class="form-label">Phone Number</label>
        <div class="input-group">
          <span class="input-group-text" id="basic-addon3">+91</span>
          <input
            type="text"
            class="form-control"
            id="basic-url"
            aria-describedby="basic-addon3 basic-addon4"
          />
        </div>
        <div class="form-text" id="basic-addon4">
          Phone number linked with your ID
        </div>
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label"
          >Email address</label
        >
        <input
          type="email"
          class="form-control"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
        />
      </div>

      <div class="mb-3">
        <label for="basic-url" class="form-label">Select Workspace</label>
        <select class="form-select" aria-label="Default select example">
          <option selected>Select Workspace you are looking for</option>
          <option value="1">HSR Layout</option>
          <option value="2">Indra Nagar</option>
          <option value="3">Marathalli</option>
        </select>
      </div>

      <div class="mb-3">
        <div v-if="!hasPaid">
          <label for="basic-url" class="form-label"
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
        <button class="btn btn-primary">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";

export default {
  computed: {
    // ...mapState(["aadharData"]),
    isAadhaarQRVerifiedAndDataExtracted() {
      // const aadhaarDataStr = localStorage.getItem("aadharData");
      // // if (aadhaarDataStr) {
      // //   this.aadharData = JSON.parse(aadhaarDataStr);
      // // }
      return this.aadharData && Object.keys(this.aadharData).length > 0;
    },
  },
  data() {
    return {
      aadharData: {},
      hasPaid: false,
    };
  },
  methods: {
    openkycpopup() {
      const windowFeatures = "left=100,top=100,width=500,height=700";
      window.open(
        "https://192.168.29.209:8080/kyc",
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
        "https://192.168.29.209:8080/pay",
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
    },
    onPopupClosed() {
      try {
        console.log("KYC Popup closed");

        const aadharDataStr = localStorage.getItem("aadharData");
        if (aadharDataStr) {
          this.aadharData = JSON.parse(aadharDataStr);
        } else {
          console.log("Could not find aadharDataStr");
        }
      } catch (e) {
        console.error("Could not parse str");
      }
    },
  },
};
</script>
