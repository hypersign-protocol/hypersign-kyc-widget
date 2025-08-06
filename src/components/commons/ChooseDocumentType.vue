<template>
  <div class="document-type-container">
    <div class="document-options">
      <button v-for="(item, i) in items" :key="i" class="document-option-btn" @click="chooseDoc(item.type)">
        <div class="document-icon">
          <img :src="item.icon" alt="document icon" />
        </div>
        <div class="document-text">
          {{ item.text }}
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { EVENT, EVENTS } from '../utils/eventBus'
export default {
  name: 'ChooseDocumentType',
  computed: {
    extractedData() {
      const d = this.$store.state.kycExtractedData.extractionRaw.ocr
      delete d.BARCODES // need to find better way to handle barcode
      return d
    },
  },

  watch: {
    govIdType: function (newVal) {
      if (newVal !== '') {
        this.$emit('EventChoosenDocumentType', { docType: newVal })
      }
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
      items: [
        {
          icon: require('../../assets/passport.png'),
          text: 'Passport',
          type: 'PASSPORT',
        },
        // {
        //   icon: require('../../assets/governament.png'),
        //   text: 'Government ID Card',
        //   type: 'ID_CARD',
        // },
      ],
      govIdType: '',
    }
  },

  methods: {
    ...mapActions(['verifyResult']),
    ...mapMutations(['nextStep', 'previousStep']),
    toast(msg, type = 'success') {
      EVENT.emitEvent(
        EVENTS.NOTIFY,
        JSON.stringify({
          toastMessage: msg,
          toastType: type,
        })
      )
    },

    chooseDoc(docType) {
      this.govIdType = docType
      // Immediately emit the event to trigger FacePhi widget
      this.$emit('EventChoosenDocumentType', { docType: docType })
    },

    submit() {
      this.$emit('EventChoosenDocumentType', { docType: this.govIdType })
    },
  },
}
</script>

<style scoped>
.document-type-container {
  width: 100%;
}

.document-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-option-btn {
  display: flex;
  align-items: center;
  padding: 10px 16px; /* Reduced padding for smaller height */
  background-color: #ffffff;
  border: 2px solid #adb5bd; /* Stronger border */
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-bottom: 8px;
  box-shadow: none;
}

.document-option-btn:hover {
  border-color: #000000;
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.document-option-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.document-icon {
  width: 20px; /* Just enough for the icon */
  height: 20px; /* Just enough for the icon */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.document-icon img {
  width: 20px; /* Icon size matches container */
  height: 20px; /* Icon size matches container */
  object-fit: contain;
}

.document-text {
  font-size: 14px; /* Slightly larger for better readability */
  font-weight: 500; /* Medium weight */
  color: #333333; /* Darker text color */
  line-height: 1.4;
  text-align: left;
  flex: 1;
}

/* Mobile Responsive */
@media (max-width: 450px) {
  .document-option-btn {
    padding: 8px 14px; /* Even smaller padding on mobile */
  }

  .document-icon {
    width: 18px; /* Slightly smaller on mobile */
    height: 18px; /* Slightly smaller on mobile */
    margin-right: 10px;
  }

  .document-icon img {
    width: 18px; /* Icon size matches container */
    height: 18px; /* Icon size matches container */
  }

  .document-text {
    font-size: 13px; /* Slightly smaller on mobile but still readable */
  }
}
</style>
