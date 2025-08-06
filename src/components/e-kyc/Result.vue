<template>
  <div class="result-container">
    <!-- Header Section -->
    <div class="header-section">
      <h1 class="main-title" v-if="getFinalResult">Congratulations!</h1>
      <h1 class="main-title" v-else>Verification Complete</h1>
      <p class="subtitle" v-if="getFinalResult">Your identity has been successfully verified</p>
      <p class="subtitle" v-else>We have completed the verification process</p>
    </div>

    <!-- Result Icon Section -->
    <div class="icon-section">
      <div class="icon-container">
        <i v-if="getFinalResult" class="bi bi-check-circle result-icon success"></i>
        <i v-else class="bi bi-x-circle result-icon fail"></i>
      </div>
    </div>

    <!-- Message Section -->
    <div class="message-section">
      <div class="message-box">
        <div class="message-header">
          <i v-if="getFinalResult" class="bi bi-shield-check"></i>
          <i v-else class="bi bi-exclamation-triangle"></i>
          <span class="message-title" v-if="getFinalResult">Verification Successful</span>
          <span class="message-title" v-else>Verification Failed</span>
        </div>
        <div class="message-content">
          <div class="message-item">
            <i v-if="getFinalResult" class="bi bi-check-circle message-icon-success"></i>
            <i v-else class="bi bi-x-circle message-icon-error"></i>
            <span class="message-text" v-if="getFinalResult">Your identity is verified!</span>
            <span class="message-text" v-else>We could not verify your identity</span>
          </div>
          <div class="message-item" v-if="getFinalResult">
            <i class="bi bi-clock message-icon-info"></i>
            <span class="message-text">You will be redirected back to the verifier app in {{ maxTimeOut }} seconds</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Section -->
    <div class="action-section" v-if="!getFinalResult">
      <button class="btn-primary" @click="goBack()">
        <i class="bi bi-arrow-left"></i>
        Try Again
      </button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'FinalResult',
  components: {},
  data: () => {
    return {
      maxTimeOut: 5,
      timer: null,
    }
  },
  computed: {
    ...mapGetters(['getRedirectUrl', 'getFinalResult']),
    ...mapGetters(['getPresentationRequestParsed']),
    ...mapState(['idToken']),
  },
  mounted() {
    if (this.getFinalResult) {
      this.startTimer()
    }
  },
  methods: {
    startTimer() {
      // Set up an interval to decrement the seconds every second
      this.timer = setInterval(() => {
        if (this.maxTimeOut > 0) {
          this.maxTimeOut--
        } else {
          this.stopTimer()
        }
      }, 1000)
    },
    stopTimer() {
      clearInterval(this.timer)
      // window.location.href = `${this.getRedirectUrl}?idToken=${this.idToken}`;
      const data = JSON.stringify({
        status: 'success',
        message: 'Successfully verified the user',
        idToken: this.idToken,
      })
      /// WARNING: ----------------------------------------------------------------
      // this is security bug, we are sending idToken to any domain
      // if we dont do this, then we are getting CORS error
      // window.opener.postMessage(data, 'this.getPresentationRequestParsed.domain');
      if (window.opener) {
        window.opener.postMessage(data, '*')
        self.close()
      } else {
        close()
      }
    },
    goBack() {
      // Navigate back to the previous step
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped>
.result-container {
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

.main-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.subtitle {
  font-size: 14px;
  color: #666666;
  margin: 0;
  line-height: 1.4;
}

/* Icon Section */
.icon-section {
  flex: 1;
  min-height: 0;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container {
  text-align: center;
}

.result-icon {
  font-size: 120px;
  margin-bottom: 16px;
}

.success {
  color: #28a745;
}

.fail {
  color: #dc3545;
}

/* Message Section */
.message-section {
  margin-bottom: 10px;
}

.message-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.message-header i {
  font-size: 16px;
  color: #6c757d;
  margin-right: 8px;
}

.message-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-item {
  display: flex;
  align-items: center;
}

.message-icon-success {
  font-size: 14px;
  color: #28a745;
  margin-right: 8px;
  flex-shrink: 0;
}

.message-icon-error {
  font-size: 14px;
  color: #dc3545;
  margin-right: 8px;
  flex-shrink: 0;
}

.message-icon-info {
  font-size: 14px;
  color: #17a2b8;
  margin-right: 8px;
  flex-shrink: 0;
}

.message-icon-warning {
  font-size: 14px;
  color: #ffc107;
  margin-right: 8px;
  flex-shrink: 0;
}

.message-text {
  font-size: 13px;
  color: #666666;
  line-height: 1.4;
}

/* Action Section */
.action-section {
  margin-top: auto;
  margin-bottom: 10px;
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

/* Mobile Responsive */
@media (max-width: 450px) {
  .result-container {
    padding: 16px;
    padding-bottom: 80px;
  }

  .main-title {
    font-size: 16px;
  }

  .subtitle {
    font-size: 13px;
  }

  .result-icon {
    font-size: 100px;
  }

  .message-box {
    padding: 12px;
  }

  .message-title {
    font-size: 13px;
  }

  .message-text {
    font-size: 12px;
  }

  .btn-primary {
    padding: 8px 14px;
    font-size: 13px;
    height: 36px;
  }
}
</style>
