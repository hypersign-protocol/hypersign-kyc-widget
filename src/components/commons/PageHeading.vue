<template>
  <div class="page-heading">
    <div class="header-container">
      <h1 class="main-header">{{ header }}</h1>
      <span class="beta-badge" v-if="beta">Beta</span>
    </div>
    <p class="sub-header" v-if="subHeader">{{ subHeader }}</p>
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
.page-heading {
  text-align: center;
  margin-bottom: 24px;
}

.header-container {
  position: relative;
  display: inline-block;
}

.main-header {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.beta-badge {
  position: absolute;
  top: -8px;
  right: -40px;
  background-color: #ffd900ce;
  color: #000000;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
}

.sub-header {
  font-size: 14px;
  color: #666666;
  margin: 0;
  line-height: 1.4;
}

/* Mobile Responsive */
@media (max-width: 450px) {
  .main-header {
    font-size: 16px;
  }

  .sub-header {
    font-size: 13px;
  }

  .beta-badge {
    font-size: 9px;
    padding: 1px 4px;
    right: -35px;
  }
}
</style>
