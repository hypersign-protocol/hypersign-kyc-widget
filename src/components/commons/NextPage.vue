<template>
  <div class="" style="padding-right: 10px; padding-left: 10px">
    <div class="row">
      <div class="col">
        <span class="nextPriv" @click="previousStep()" style="float: left"
          ><i class="bi bi-chevron-left"></i
        ></span>
        <span class="nextPriv" @click="nextStep()" style="float: right"
          ><i class="bi bi-chevron-right"></i
        ></span>
      </div>
    </div>
  </div>
</template>

<style type="text/css" scoped>
.nextPriv {
  cursor: pointer;
  color: grey;
}

.nextPriv:hover {
  color: black;
}
</style>

<script>
import { mapMutations } from "vuex";
export default {
  methods: {
    ...mapMutations(["nextStep", "previousStep"]),
  },
};
</script>
