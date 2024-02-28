<template>
  <div class="card maincontainer" style="text-align: center;">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
    <NavBar />
    <div class="card-body">
      <PageHeading :header="'Verify Your Identity Using Aadhaar'"
        :subHeader="'Follow these simple instructions to verify'" />
      <div class="">
        <img class="opacity-80" src="../assets/page0.png" style="padding: 20px; height:500px; width: 70%" width="100%" />
        <div class="d-grid gap-1">
          <button class="btn btn-outline-dark" @click="nextStep()">
            Let's go!
          </button>
        </div>
        <ConsentBox />
      </div>
    </div>
    <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    <div class="card-footer">
      <PoweredBy />
    </div>
  </div>
</template>

<script type="text/javascript">
import PoweredBy from "./commons/PoweredBy.vue";
import { mapMutations, mapActions } from "vuex";
export default {
  name: "AppInstructions",
  components: {
    PoweredBy,
  },
  async created() {

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (!params.cavachAccessToken || !params.redirectUrl) {
      console.log('Error: 401')
      this.toast('Error initalization of widget!', "error");
      return;
    }

    this.setCavachAccessToken(params.cavachAccessToken)
    this.setRedirectUrl(params.redirectUrl)

    try {
      this.isLoading = true;
      await this.getNewSession()
      this.isLoading = false;
    } catch (e) {
      this.toast(e.message, "error");
      this.isLoading = false;
    }
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      toastMessage: "",
      toastType: "success",
      isToast: false,
    };
  },
  methods: {
    ...mapMutations(["setCavachAccessToken", "setRedirectUrl", "nextStep"]),
    ...mapActions(["getNewSession"]),
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
