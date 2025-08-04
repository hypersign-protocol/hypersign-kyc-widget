<template>
  <div class="page-heading-container">
    <div class="position-relative header page-heading-title">
      {{ header }}
      <span class="badge position-absolute top-10 translate-middle rounded" v-if="beta"> Beta </span>
    </div>
    <div class="subheader page-heading-subtitle">
      {{ subHeader }}
    </div>
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
.page-heading-container {
  text-align: center;
  margin-bottom: 24px;
}

.page-heading-title {
  color: #000000;
  font-weight: 600;
  margin-bottom: 8px;
}

.page-heading-subtitle {
  color: #666666;
  font-weight: 400;
}

.badge {
  padding: 5px;
  float: right;
  background-color: #ffd900;
  font-size: x-small;
  color: #000000;
  font-weight: bold;
  width: auto;
  text-align: center;
  align-content: center;
  margin-left: 5px;
  border-radius: 4px;
}

.subheader {
  font-size: 16px;
  color: #666666;
  margin-top: 8px;
  font-weight: 400;
}

.header {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  position: relative;
  color: #000000;
}

@media (min-width: 600px) {
  .header {
    font-size: 32px;
  }
  .subheader {
    font-size: 18px;
  }
}

@media (min-width: 960px) {
  .header {
    font-size: 36px;
  }
  .subheader {
    font-size: 20px;
  }
}

@media (max-width: 450px) {
  .header {
    font-size: 20px;
  }
  .subheader {
    font-size: 14px;
  }
}
</style>
