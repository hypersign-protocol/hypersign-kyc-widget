<template>
  <div class="card maincontainer">
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
.maincontainer {
  width: 350px;
  height: 550px;
  background-color: #f5f5f5;
  border: 1px solid grey;
  border-radius: 20px;
  box-shadow: 2px 5px 5px grey;
  margin: 0 auto;
}

.final-msg-icon {
  font-size: 150px;
}

.fail {
  color: red;
}
</style>
