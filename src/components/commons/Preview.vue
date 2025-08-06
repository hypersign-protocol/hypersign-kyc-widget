<template>
  <div class="preview-container">
    <!-- Header Section -->
    <div class="header-section">
      <p class="subtitle">Please verify your document details</p>
    </div>

    <!-- Face Image Section -->
    <div class="face-section">
      <div class="face-container">
        <img :src="`data:image/png;base64, ${$store.state.kycExtractedData.extractionRaw.ocr.FACE}`" class="face-image" alt="Document Face" />
      </div>
    </div>

    <!-- Details Section -->
    <div class="details-section">
      <div class="details-box">
        <div class="details-header">
          <i class="bi bi-file-text"></i>
          <span class="details-title">Extracted Information</span>
        </div>
        <div class="details-content">
          <div class="details-table">
            <div v-for="(data, idx) in Object.entries(extractedData)" :key="idx" class="detail-item">
              <div class="detail-label">{{ snakeToPascal(data[0]) }}</div>
              <div class="detail-value">{{ data[1] }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Section -->
    <div class="action-section">
      <button class="btn-primary" @click="submit()">
        <i class="bi bi-check-circle"></i>
        Continue
      </button>
      <button class="btn-secondary" @click="rescan()">
        <i class="bi bi-arrow-clockwise"></i>
        Rescan
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { EVENT, EVENTS } from '../utils/eventBus'
export default {
  name: 'PreviewData',
  computed: {
    extractedData() {
      const d = { ...this.$store.state.kycExtractedData.extractionRaw.ocr }
      delete d.FACE
      delete d.OVERALL_RATING
      return d
    },
  },
  components: {},
  data: function () {
    return {
      isLoading: false,
      fullPage: true,
      toastMessage: '',
      toastType: 'success',
      isToast: false,
    }
  },
  methods: {
    ...mapActions(['verifyResult', 'nextStep']),
    ...mapMutations(['previousStep']),
    toast(msg, type = 'success') {
      EVENT.emitEvent(
        EVENTS.NOTIFY,
        JSON.stringify({
          toastMessage: msg,
          toastType: type,
        })
      )
    },

    snakeToPascal(str) {
      return str
        .split('_') // Split the string by underscores
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join('') // Join them back into a single string
    },
    async submit() {
      try {
        // this.isLoading = true;
        // this.toast('Submitting your data...', "warning");
        this.$emit('verifyIdDocEvent', true)
        // const result = await this.verifyResult()

        // this.isLoading = false;
        // this.nextStep();
      } catch (e) {
        this.toast(e.message, 'error')
        // this.isLoading = false;
      }
    },

    async rescan() {
      await this.$store.commit('setKycExtractedData', {
        data: {},
        status: false,
      })
      await this.$store.commit('setKycCapturedData', {
        tokenFrontDocumentImage: '',
        tokenBackDocumentImage: '',
        tokenFaceImage: '',
        countryCode: '',
      })
      this.$emit('EventrescanIDDoc', true)
      // this.nextStep(4)
    },
  },
}
</script>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  background-color: #ffffff;
  padding-bottom: 0px;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 0px;
}

.subtitle {
  font-size: 14px;
  color: #666666;
  margin: 0;
  line-height: 1.4;
}

/* Face Section */
.face-section {
  flex: 1;
  min-height: 0;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.face-container {
  text-align: center;
}

.face-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #e9ecef;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Details Section */
.details-section {
  margin-bottom: 10px;
}

.details-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.details-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.details-header i {
  font-size: 16px;
  color: #6c757d;
  margin-right: 8px;
}

.details-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
}

.details-content {
  display: flex;
  flex-direction: column;
}

.details-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 13px;
  font-weight: 600;
  color: #333333;
  flex: 0 0 40%;
  line-height: 1.4;
}

.detail-value {
  font-size: 13px;
  color: #666666;
  flex: 0 0 60%;
  line-height: 1.4;
  text-align: right;
  word-wrap: break-word;
}

/* Action Section */
.action-section {
  margin-top: auto;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-primary {
  width: 100%;
  padding: 10px 16px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
}

.btn-primary:hover {
  background-color: #333333;
}

.btn-primary:active {
  transform: translateY(1px);
}

.btn-secondary {
  width: 100%;
  padding: 10px 16px;
  background-color: #ffffff;
  color: #6c757d;
  border: 1px solid #6c757d;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
}

.btn-secondary:hover {
  background-color: #f8f9fa;
  border-color: #495057;
  color: #495057;
}

.btn-secondary:active {
  transform: translateY(1px);
}

/* Mobile Responsive */
@media (max-width: 450px) {
  .preview-container {
    padding: 16px;
    padding-bottom: 80px;
  }

  .subtitle {
    font-size: 13px;
  }

  .face-image {
    width: 100px;
    height: 100px;
  }

  .details-box {
    padding: 12px;
    max-height: 250px;
  }

  .details-title {
    font-size: 13px;
  }

  .detail-label,
  .detail-value {
    font-size: 12px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 8px 14px;
    font-size: 13px;
    height: 36px;
  }
}
</style>
