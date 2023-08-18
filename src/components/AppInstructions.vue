<template>
  <div class="card maincontainer">
    <load-ing
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing>
    <NavBar />
    <div class="card-body">
      <PageHeading
        :header="'Verify Your Identity Using Aadhaar'"
        :subHeader="'Follow these simple instructions to verify'"
      />
      <div class="">
        <img
          class="opacity-80"
          src="../assets/page0.png"
          style="padding: 20px"
          width="100%"
        />
        <div class="d-grid gap-1">
          <button class="btn btn-outline-dark" @click="nextStep()">
            Let's go!
          </button>
        </div>
        <ConsentBox />
      </div>
    </div>
    <div class="card-footer">
      <PoweredBy />
    </div>
  </div>
</template>

<script type="text/javascript">
import PoweredBy from "./commons/PoweredBy.vue";
import { mapMutations } from "vuex";
export default {
  name: "AppInstructions",
  components: {
    PoweredBy,
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
    };
  },
  methods: {
    ...mapMutations(["nextStep"]),
  },
};
</script>
