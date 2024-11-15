<template>
  <div>
    <div class="center">
      <div class="row">
        <div class="col-md-2"></div>
        <div class="col-md-8">
          <ul style="list-style-type: none">
            <li>
              <i class="bi bi-x-circle final-msg-icon fail"></i>
            </li>
            <li>
              <h5>We are sorry!</h5>
            </li>
            <li>
              <h7> This session is expired. You can close the window and restrart the KYC process from the verifier app </h7>
            </li>
            <li class="mt-1">
              <h6>You will be redirected back to verifier app in {{ maxTimeOut }}</h6>
            </li>
          </ul>
        </div>
        <div class="col-md-2"></div>
      </div>
    </div>
    <div class="card-footer">
      <PoweredBy />
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'

import PoweredBy from './commons/PoweredBy.vue'

export default {
  name: 'SessionExpired',
  data: () => {
    return {
      maxTimeOut: 5,
      timer: null,
    }
  },
  computed: {
    ...mapGetters(['getRedirectUrl', 'getFinalResult']),
  },
  components: {
    PoweredBy,
  },
  mounted() {
    this.startTimer()
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
        status: 'fail',
        message: 'Session expired',
        idToken: null,
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
  },
}
</script>
<style type="text/css" scoped>
.final-msg-icon {
  font-size: 150px;
}

.success {
  color: green;
}
</style>
