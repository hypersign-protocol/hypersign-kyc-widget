<template>
  <div class="result-container">
    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="header-section">
        <h1 class="main-title" v-if="getFinalResult">Congratulations!</h1>
        <h1 class="main-title" v-else>Verification Complete</h1>
      </div>

      <!-- Success Icon Section -->
      <div class="icon-section">
        <div class="success-icon-container" v-if="getFinalResult">
          <div class="success-icon">
            <i class="bi bi-check-lg"></i>
          </div>
        </div>
        <div class="fail-icon-container" v-else>
          <div class="fail-icon">
            <i class="bi bi-x-lg"></i>
          </div>
        </div>
      </div>

      <!-- Subtitle Section -->
      <div class="subtitle-section">
        <h2 class="subtitle" v-if="getFinalResult">Your Identity is verified!</h2>
        <h2 class="subtitle" v-else>We could not verify your identity</h2>
      </div>

      <!-- Redirect Message -->
      <div class="redirect-section" v-if="getFinalResult">
        <p class="redirect-text">You will be redirected to the verifier Apps</p>
        <p class="redirect-time">in {{ maxTimeOut }} mins</p>
      </div>

      <!-- Action Section -->
      <div class="action-section" v-if="!getFinalResult">
        <button class="btn-primary" @click="goBack()">
          <i class="bi bi-arrow-left"></i>
          Try Again
        </button>
      </div>
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
  height: 100vh;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

/* Header Section */
.header-section {
  margin-bottom: 32px;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

/* Icon Section */
.icon-section {
  margin-bottom: 24px;
}

.success-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.success-icon {
  width: 100px;
  height: 100px;
  background-color: #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon i {
  font-size: 50px;
  color: #ffffff;
}

.fail-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.fail-icon {
  width: 100px;
  height: 100px;
  background-color: #dc3545;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fail-icon i {
  font-size: 50px;
  color: #ffffff;
}

/* Subtitle Section */
.subtitle-section {
  margin-bottom: 24px;
}

.subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  line-height: 1.3;
}

/* Redirect Section */
.redirect-section {
  margin-bottom: 32px;
}

.redirect-text {
  font-size: 14px;
  color: #000000;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.redirect-time {
  font-size: 14px;
  color: #000000;
  margin: 0;
  line-height: 1.4;
}

/* Action Section */
.action-section {
  margin-top: 32px;
}

.btn-primary {
  padding: 12px 24px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
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
  }

  .content-wrapper {
    max-width: 100%;
  }

  .main-title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 16px;
  }

  .success-icon,
  .fail-icon {
    width: 80px;
    height: 80px;
  }

  .success-icon i,
  .fail-icon i {
    font-size: 40px;
  }

  .redirect-text,
  .redirect-time {
    font-size: 13px;
  }

  .btn-primary {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
