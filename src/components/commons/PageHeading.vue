<template>
  <div>
    <h1>{{ header }}</h1>
    <h6 style="color: grey">
      {{ subHeader }}
    </h6>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    header: String,
    subHeader: String,
  },
};
</script>
