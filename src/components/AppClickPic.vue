<template>
  <div class="card maincontainer">
    <div class="card-body">
      <span class="">Click Your Picture</span>
      <div class="scanQR"></div>
      <!-- <ConsentBox /> -->
      <button class="btn btn-primary">Submit</button>
    </div>
    <div class="card-footer"><PoweredBy /></div>
  </div>
</template>

<script type="text/javascript">
import PoweredBy from "../components/PoweredBy.vue";

export default {
  name: "AppClickPic",
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

.scanQR {
  width: 200px;
  height: 200px;
  background-color: rgb(160, 157, 157);
  border-radius: 5px;
  margin: 0 auto;
}
</style>
