<template>
  <div>
    <div class="card-body" style="min-height:750px;">
      <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
      <PageHeading :header="'Cavach KYC'" :subHeader="'Follow these simple instructions for your KYC request'" />
      <div class="">
        <img class="opacity-80" src="../assets/page0.png" style="padding: 20px; height:500px; width: 70%"
          width="100%" />
        <div class="d-grid gap-1 " style="width: 50%;margin: auto;">
          <button class="btn btn-outline-dark btn-lg" @click="nextStep()">
            Let's go!
          </button>
        </div>
        <ConsentBox />
      </div>
    </div>
    <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
  </div>
</template>

<script type="text/javascript">
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "AppInstructions",
  components: {
  },
  computed: {
    ...mapGetters(["getCavachAccessToken", "getRedirectUrl"])
  },
  async created() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (!params.cavachAccessToken || !params.redirectUrl) {

      console.log({
        cavachAccessToken: this.getCavachAccessToken,
        redirectUrl: this.getRedirectUrl
      })
      if (this.getCavachAccessToken != '' && !this.getRedirectUrl != '') {
        console.log('Error: 401')
        this.toast('Error initalization of widget!', "error");
        return;
      }

    }


    this.setCavachAccessToken(params.cavachAccessToken || this.getCavachAccessToken)
    this.setRedirectUrl(params.redirectUrl || this.getRedirectUrl)

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
    ...mapActions(["getNewSession", "registerUser"]),
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
