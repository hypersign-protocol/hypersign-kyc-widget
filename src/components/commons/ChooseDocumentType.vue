<template>
  <div class="kyc-container">
    <v-card class="mx-auto" tile>
      <v-list shaped>
        <!-- <v-subheader>Choose Document Type</v-subheader> -->
        <v-list-item-group v-model="selectedItem" color="secondary">
          <v-list-item v-for="(item, i) in items" :key="i" @click="chooseDoc(item.type)">
            <v-list-item-icon>
              <img :src="item.icon" width="40" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title style="text-align: start">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
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
        {
          icon: require('../../assets/governament.png'),
          text: 'Government ID Card',
          type: 'ID_CARD',
        },
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
    },

    submit() {
      this.$emit('EventChoosenDocumentType', { docType: this.govIdType })
    },
  },
}
</script>

<style scoped lang="scss">
// :root {
//   --card-line-height: 1.2e1em 1em;
//   0.5em: 0.5em;
//   --color-green: #558309;
//   --color-gray: #e2ebf6;
//   --color-dark-gray: #c4d1e2px 2px;
//   --radio-size: 1.5em;
// }

.grid {
  display: grid;
  grid-gap: 1em;
  margin: 0 auto;
  max-width: 60em;
  padding: 0;

  @media (min-width: 42em) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card {
  background-color: #fff;
  border-radius: 0.5em;
  position: relative;

  &:hover {
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);
  }
}

.radio {
  font-size: inherit;
  margin: 0;
  position: absolute;
  right: calc(1em + 2px);
  top: calc(1em + 2px);
}

@supports (-webkit-appearance: none) or (-moz-appearance: none) {
  .radio {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: #fff;
    border: 2px solid #e2ebf6;
    border-radius: 50%;
    cursor: pointer;
    height: 1.5em;
    outline: none;
    transition:
      background 0.2s ease-out,
      border-color 0.2s ease-out;
    width: 1.5em;

    &::after {
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      content: '';
      display: block;
      height: 0.75rem;
      left: 25%;
      position: absolute;
      top: 50%;
      transform: rotate(45deg) translate(-50%, -50%);
      width: 0.375rem;
    }

    &:checked {
      background: #558309;
      border-color: #558309;
    }
  }

  .card:hover .radio {
    border-color: #c4d1e1;

    &:checked {
      border-color: #558309;
    }
  }
}

.plan-details {
  border: 2px solid #e2ebf6;
  border-radius: 0.5em;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 1em;
  transition: border-color 0.2s ease-out;
}

.card:hover .plan-details {
  border-color: #c4d1e1;
}

.radio:checked ~ .plan-details {
  border-color: #558309;
}

.radio:focus ~ .plan-details {
  box-shadow: 0 0 0 2px #c4d1e1;
}

.radio:disabled ~ .plan-details {
  color: #c4d1e1;
  cursor: default;
}

.radio:disabled ~ .plan-details .plan-type {
  color: #c4d1e1;
}

.card:hover .radio:disabled ~ .plan-details {
  border-color: #e2ebf6;
  box-shadow: none;
}

.card:hover .radio:disabled {
  border-color: #e2ebf6;
}

.plan-type {
  color: #558309;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1em;
}

.plan-cost {
  font-size: 2.5rem;
  font-weight: bold;
  padding: 0.5rem 0;
}

.slash {
  font-weight: normal;
}

.plan-cycle {
  font-size: 2rem;
  font-variant: none;
  border-bottom: none;
  cursor: inherit;
  text-decoration: none;
}

.hidden-visually {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
</style>
