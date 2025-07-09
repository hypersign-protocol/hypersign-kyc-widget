<template>
  <v-card class="verifier-card hypersign-box" elevation="3" shaped>
    <v-card-text class="pa-4 text-center">
      <!-- Logo & Domain Name -->
      <!-- <v-avatar size="56" class="mx-auto mb-2">
        <img :src="logoUrl" alt="Verifier logo" />
      </v-avatar> -->
      <v-avatar size="56" class="mx-auto mb-2">
        <template v-if="currentLogo">
          <img :src="currentLogo" alt="Verifier logo" @error="onLogoError" />
        </template>
        <template v-else>
          <i class="bi bi-google-play" style="font-size: 50px"></i>
        </template>
      </v-avatar>
      <div class="verifier-domain font-weight-medium mb-3">Verification For {{ name }}</div>
      <!-- Data Info Section -->
      <div class="text-body-2 mb-2 text-left">
        You are about to share your personal data with
        <strong>{{ getDomainName }}</strong> for identity verification.
      </div>

      <div class="text-body-2 mb-3 text-left">The data being collected may include a selfie (used for face verification), a government-issued identity document, and your basic personal details such as full name, date of birth, and gender.</div>

      <!-- <div class="text-caption text--secondary">
        Your data is processed securely and in compliance with
        <a href="https://gdpr.eu/" target="_blank" class="text-primary">GDPR</a>. We do not store your data after verification unless you explicitly allow it.
      </div> -->
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'VerifierInfoCard',
  props: {
    logoUrl: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      default: 'Verifier App',
    },
    name: {
      type: String,
      default: 'Verifier App',
    },
  },
  data() {
    return {
      currentLogo: this.logoUrl, // initialize from prop
    }
  },
  watch: {
    logoUrl(newVal) {
      this.currentLogo = newVal
    },
  },
  methods: {
    onLogoError() {
      this.currentLogo = null
    },
  },
  computed: {
    getDomainName() {
      try {
        const url = new URL(this.domain)
        return url.hostname
      } catch (e) {
        return this.domain
      }
    },
  },
}
</script>

<style scoped>
.hypersign-box {
  border-radius: 8px !important;
  -webkit-box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15) !important;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15) !important;
}

.verifier-card {
  border-radius: 10px;
  max-width: 80%;
  margin: 0 auto 20px;
  background-color: #fff;
}

@media (max-width: 450px) {
  .verifier-card {
    /* transform: scale(1.1); */
    font-size: 14px;
    max-width: 100%;
  }
}

.verifier-domain {
  font-size: 16px;
}

ul {
  margin: 0;
  padding-left: 18px;
}

ul li {
  margin-bottom: 4px;
}
</style>
