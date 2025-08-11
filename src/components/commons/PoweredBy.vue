<template>
  <div class="powered-wrapper">
    <a href="https://hypersign.id" target="_blank" rel="noopener" style="color: black">
      <span class="powered-text">Powered by</span>
      <img src="/assets/img/hypersign_black_transparent_rect.png" width="70" height="20" alt="Hypersign logo" class="powered-logo" />
    </a>
  </div>
</template>

<style scoped>
.powered-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 13px;
}

a {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: black;
  gap: 6px;
}

.powered-logo {
  display: inline-block;
  vertical-align: middle;
}

.powered-text {
  font-weight: 500;
}
</style>
