<template>
  <div class="card-body">
    <PageHeading :header="'Congratulations!'" style="text-align: center" />
    <div class="center mt-3">
      <div class="row" v-if="getFinalResult">
        <div class="col-md-12 center">
          <ul style="list-style-type: none">
            <li>
              <i class="bi bi-check-circle final-msg-icon successt"></i>
            </li>
            <li>
              <h5>Your identity is verified!</h5>
            </li>
            <li>
              <h6>You will be redirected back to the verifier app in {{ maxTimeOut }}</h6>
            </li>
          </ul>
        </div>
      </div>

      <div class="row" v-else>
        <div class="col-md-12">
          <ul style="list-style-type: none">
            <li>
              <i class="bi bi-x-circle final-msg-icon fail"></i>
            </li>
            <li>
              <h5>We are sorry!</h5>
            </li>
            <li>
              <h6>We could not verify your identity</h6>
            </li>
          </ul>
        </div>
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
  },
}
</script>

<style type="text/css" scoped>
.final-msg-icon {
  font-size: 200px;
}

.fail {
  color: red;
}

.successt {
  color: green;
}
</style>
