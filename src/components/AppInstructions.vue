<template>
  <div class="card maincontainer">
    <load-ing
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing>
    <!-- <div class="card-header"></div> -->
    <NavBar />

    <img
      class="card-img opacity-80"
      src="../assets/page0.png"
      style="padding: 20px"
    />
    <div class="card-body">
      <button class="btn btn-outline-primary" @click="nextStep()">
        Let's go!
      </button>
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
