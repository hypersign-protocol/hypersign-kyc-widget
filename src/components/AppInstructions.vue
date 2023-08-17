<template>
  <div class="card maincontainer">
    <load-ing
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing>
    <div class="card-header">
      <!-- <img class="opacity-80" src="../assets/logo.png" width="60px" /> -->
      KAVACH
    </div>
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
<style type="text/css" scoped>
.maincontainer {
  width: 350px;
  height: 600px;
  background-color: #f5f5f5;
  border: 1px solid grey;
  border-radius: 20px;
  box-shadow: 2px 5px 5px grey;
  margin: 0 auto;
}
</style>
