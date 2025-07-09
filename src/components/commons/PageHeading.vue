<template>
  <div>
    <div class="position-relative header">
      {{ header }}
      <span class="badge position-absolute top-10 translate-middle rounded" v-if="beta"> Beta </span>
    </div>
    <div class="subheader">
      {{ subHeader }}
    </div>

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

.subheader {
  font-size: 16px;
  color: grey;
  margin-top: 2px;
  /* margin-bottom: 10px; */
}

.header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  position: relative;
}
@media (min-width: 600px) {
  .header {
    font-size: 40px;
  }
  .subheader {
    font-size: 18px;
  }
}

@media (min-width: 960px) {
  .header {
    font-size: 45px;
  }
  .subheader {
    font-size: 20px;
  }
}
</style>
