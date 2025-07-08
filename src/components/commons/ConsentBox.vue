<!-- <template>
  <div class="consent-message">
    <v-checkbox v-model="consentGiven" hide-details dense class="mt-0 pt-0" :label="label" @change="emitConsent"></v-checkbox>
  </div>
</template> -->
<template>
  <div class="consent-container">
    <label class="form-check-label-wrapper">
      <input type="checkbox" class="form-check-input large-checkbox" v-model="consentGiven" @change="emitConsent" />
      <span class="consent-label-text">
        I understand, have read and agree to the
        <a href="https://docs.hypersign.id/privacy-policy" target="_blank">Terms of Use</a>
        and
        <a href="https://docs.hypersign.id/privacy-policy" target="_blank">Privacy Policy</a>.
      </span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'ConsentBox',
  data() {
    return {
      consentGiven: false,
    }
  },
  methods: {
    emitConsent() {
      this.$emit('consent-changed', this.consentGiven)
    },
  },
}
</script>

<style scoped>
.consent-container {
  /* border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa; */
  padding: 14px 16px;
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;

  display: flex;
  justify-content: center;
}

.form-check-label-wrapper {
  display: flex;
  align-items: center; /* ✅ Vertically center checkbox and text */
  gap: 12px;
  cursor: pointer;
}

.large-checkbox {
  width: 22px;
  height: 22px;
  min-width: 22px;
  min-height: 22px;
  cursor: pointer;
  accent-color: #333; /* Optional: dark theme look */
}

.consent-label-text {
  line-height: 1.5;
}

.consent-label-text a {
  color: #007bff;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .large-checkbox {
    transform: scale(1.1);
  }

  .consent-container {
    font-size: 12px;
  }
}
</style>
