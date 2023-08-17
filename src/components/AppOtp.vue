<template>
  <div class="card maincontainer">
    <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="true"
    ></load-ing>
    <div class="card-body">
      <h4>Phone Number Verification</h4>
      <div class="col" v-if="!isPhoneCheckDone">
        <label for="validationCustom01" class="form-label"
          >Enter Your Aadhaar Linked Phone Number</label
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
          />
        </div>
        <button class="btn btn-outline-primary" @click="check()">Next</button>
      </div>

      <div v-else class="p-2 mb-3">
        <label for="validationCustom01" class="form-label"
          >Enter 4 digits OTP:
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
            style="margin: 0 auto; font-size: 30px"
          />
          <small style="color: grey; text-align: left"
            >Note: This feature is coming soon. Enter any 4 digits to
            test...</small
          >
        </div>
        <!-- <button class="btn btn-outline-primary" @click="validateOtp()">
          Next
        </button> -->
        <button class="btn btn-link" @click="handleClearInput()">Clear</button>
      </div>
      <NextPage />
    </div>
    <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    <div class="card-footer"><PoweredBy /></div>
  </div>
</template>

<script type="text/javascript">
import OtpInput from "@bachdgvn/vue-otp-input";
import PoweredBy from "./commons/PoweredBy.vue";
import { mapActions, mapMutations } from "vuex";
import NextPage from "./commons/NextPage.vue";

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
    NextPage,
  },
  computed: {},
  methods: {
    ...mapActions(["addharQRVerify", "verifyPhoneNumber", "getFinalResult"]),
    ...mapMutations(["setPhoneNumber", "nextStep"]),
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
        if (result && result.verified === true) {
          this.isPhoneCheckDone = true;
        }
        this.isLoadingPage = false;
      } catch (e) {
        this.isLoadingPage = false;
        this.toast(e.message, "error");
        console.log(e);
      }
    },
    async handleOnComplete(value) {
      try {
        console.log("OTP completed: ", value);
        // TODO: go for verification
        const result = await this.getFinalResult();
        if (result && result.verified === true) {
          this.nextStep(5);
        }
      } catch (e) {
        this.toast(e.message, "error");
        console.log(e);
      }
    },
    handleOnChange(value) {
      console.log("OTP changed: ", value);
    },
    handleClearInput() {
      this.$refs.otpInput.clearInput();
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

<style type="text/css" scoped>
.maincontainer {
  width: 350px;
  height: 550px;
  background-color: #f5f5f5;
  border: 1px solid grey;
  border-radius: 20px;
  box-shadow: 2px 5px 5px grey;
  margin: 0 auto;
}
</style>

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
