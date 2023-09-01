<template>
  <div class="card maincontainer">
    <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="true"
    ></load-ing>
    <NavBar />
    <div class="card-body">
      <PageHeading
        :header="'Verify Phone Number'"
        :subHeader="'Provide your Aadhaar linked phone number and verify your OTP'"
      />

      <div class="col p-2">
        <label for="validationCustom01" class="form-label" style="float: left"
          >Phone Number</label
        >
        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">+91</span>
          <input
            type="number"
            class="form-control"
            id="validationCustom01"
            value="Mark"
            v-model="phoneNumber"
            required
            :disabled="isPhoneCheckDone"
          />
        </div>
        <button
          class="btn btn-outline-dark"
          @click="check()"
          v-if="!isPhoneCheckDone"
        >
          Next
        </button>
      </div>

      <div v-if="isPhoneCheckDone" class="p-2 mb-3">
        <label for="validationCustom01" class="form-label" style="float: left"
          >4 digits OTP
        </label>
        <div class="input-group">
          <OtpInput
            ref="otpInput"
            input-classes="otp-input"
            separator="-"
            :num-inputs="4"
            :should-auto-focus="true"
            :is-input-num="true"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
            style="font-size: 30px"
          />
          <small style="color: grey; text-align: left"
            >Note: This feature is coming soon. Enter any 4 digits to
            test...</small
          >
        </div>
        <button class="btn btn-link btn-dark" @click="handleClearInput()">
          Clear
        </button>
      </div>
    </div>
    <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    <div class="card-footer"><PoweredBy /></div>
  </div>
</template>

<script type="text/javascript">
import OtpInput from "@bachdgvn/vue-otp-input";
import PoweredBy from "./commons/PoweredBy.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "AppOtp",
  data() {
    return {
      isPhoneCheckDone: false,
      isLoadingPage: false,
      phoneNumber: "",
      toastMessage: "",
      toastType: "success",
      isToast: false,
    };
  },
  components: {
    OtpInput,
    PoweredBy,
  },
  computed: {},
  methods: {
    ...mapActions(["addharQRVerify", "verifyPhoneNumber", "getFinalResult"]),
    ...mapMutations(["setPhoneNumber", "nextStep", "setFinalResult"]),
    wait(time = 3000) {
      return new Promise((resolve) => {
        return setTimeout(() => {
          resolve();
        }, time);
      });
    },
    async check() {
      try {
        // TODO: validate this.phoneNumber for 10 digits
        if (this.phoneNumber.length != 10) {
          throw new Error("Phone number should of 10 digits");
        }
        this.setPhoneNumber(this.phoneNumber);

        // Start verification
        this.isLoadingPage = true;
        const result = await this.verifyPhoneNumber();
        await this.wait(1000);
        if (result && result.verified === true) {
          this.isPhoneCheckDone = true;
        } else if (result.verified === false) {
          this.toast("Invalid phone number", "error");
        }
        this.isLoadingPage = false;
      } catch (e) {
        this.isLoadingPage = false;
        console.log(e);
        this.toast(e, "error");
        console.log(e);
      }
    },
    async handleOnComplete(value) {
      try {
        console.log("OTP completed: ", value);
        this.isLoadingPage = true;
        // TODO: go for verification
        const result = await this.getFinalResult();
        await this.wait(2000);
        if (result && result.credentialSubject) {
          this.setFinalResult(result.credentialSubject);
          this.isLoadingPage = false;
          if (result.credentialSubject.verified === true) {
            this.nextStep(4);
          } else {
            this.nextStep(5);
          }
        }
      } catch (e) {
        this.toast(e.message, "error");
        console.log(e);
        this.isLoadingPage = true;
      }
    },
    handleOnChange(value) {
      console.log("OTP changed: ", value);
    },
    handleClearInput() {
      this.$refs.otpInput.clearInput();
      this.setPhoneNumber("");
      this.isPhoneCheckDone = false;
      this.phoneNumber = "";
    },

    toast(msg, type = "success") {
      this.isToast = true;
      this.toastMessage = msg;
      this.toastType = type;

      setTimeout(() => {
        this.isToast = false;
        this.toastMessage = "";
      }, 2000);
    },
  },
};
</script>

<style lang="less">
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  &.error {
    border: 1px solid red !important;
  }
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
