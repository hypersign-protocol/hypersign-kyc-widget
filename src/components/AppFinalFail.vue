<template>
  <div class="card maincontainer">
    <NavBar />
    <div class="card-body">
      <p><i class="bi bi-x-circle final-msg-icon fail"></i></p>
      <span class="">Failed to verify!</span>
    </div>
    <div class="card-footer"><PoweredBy /></div>
  </div>
</template>

<script type="text/javascript">
import PoweredBy from "./commons/PoweredBy.vue";
export default {
  name: "AppFinalSuccess",
  components: {
    PoweredBy,
  },
};
</script>
<style type="text/css" scoped>
.final-msg-icon {
  font-size: 150px;
}

.fail {
  color: red;
}
</style>
