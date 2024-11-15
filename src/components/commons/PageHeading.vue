<template>
  <div>
    <h1 class="position-relative">
      {{ header }}
      <span
        class="badge position-absolute top-10 translate-middle rounded"
        v-if="beta"
      >
        Beta
      </span>
    </h1>
    <h6 style="color: grey">
      {{ subHeader }}
    </h6>

    <!-- <button type="button" class="position-relative btn btn-light">
      <h1>{{ header }}</h1>
      <span class="badge position-absolute top-0 start-100 translate-middle rounded-pill bg-light border" v-if="!beta">
        beta
      </span>
      <h6 style="color: grey">
        {{ subHeader }}
      </h6>
    </button> -->
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    header: String,
    subHeader: String,
    beta: {
      default: false,
      type: Boolean,
    },
  },
}
</script>

<style scoped>
.badge {
  padding: 5px;
  float: right;
  background-color: #ffd900ce;
  /* border-radius: 40%; */
  font-size: x-small;
  /* font-weight: bold; */
  color: black;
  font-weight: bold;
  width: auto;
  text-align: center;
  align-content: center;
  margin-left: 5px;
}
</style>
