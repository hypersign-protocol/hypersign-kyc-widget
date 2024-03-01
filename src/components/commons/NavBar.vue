<template>
  <div class="navbar navbar-expand-md navbar-light">
    <div class="container">
      <a href="#" class="navbar-brand">
        <img class="opacity-80" src="../../../public/assets/img/logo.png" width="100px" />
      </a>


      <span style="float:right;
      padding-right: 10px;
      float: right;
      padding-top: 4px;
      padding-left: 10px;
      border: 1px solid #808080eb;
      border-radius: 33px;
      padding-bottom: 4px;
      background: #80808024;
      " v-if="getActiveStep.name">
        {{ getActiveStep.name }} ({{ getActiveStep.id }} / {{ steps.length - 2 }})
      </span>
    </div>
  </div>
</template>



<script>
import { mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState(["steps",]),
    ...mapGetters(["getActiveStep"])
  }
}
</script>