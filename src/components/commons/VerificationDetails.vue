<template>
  <div v-if="finalResult && Object.keys(finalResult).length > 0">
    <div>
      <div class="row">
        <div class="col">
          <ul
            class="list-group list-group-horizontal position-relative overflow-auto"
          >
            <li class="list-group-item">
              <div class="big">{{ finalResult.threshold }}</div>
              <div class="small">Threshold</div>
            </li>
            <li class="list-group-item">
              <div class="big">{{ finalResult.score }}</div>
              <div class="small">Score</div>
            </li>

            <li class="list-group-item">
              <div class="big">
                <i
                  class="bi bi-check-lg"
                  v-if="finalResult.verified == true"
                  style="color: green"
                ></i>
                <i class="bi bi-x-circle" v-else style="color: red"></i>
              </div>
              <div class="small">Verified?</div>
            </li>
          </ul>
        </div>
      </div>
      <ul class="list-group">
        <li
          class="list-group-item p-2"
          v-for="detail in finalResult.details"
          :key="detail.type"
          style="text-align: left"
        >
          <div class="row">
            <div class="col">
              <i
                class="bi bi-check-circle"
                v-if="detail.status == true"
                style="color: green"
              ></i>
              <i class="bi bi-x-circle" v-else style="color: red"></i>
            </div>
            <div class="col-8">
              <span style="font-size: small; color: ">{{ detail.type }}</span>
            </div>
            <div class="col" style="text-align: right">
              <span class="badge">{{ detail.score }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    <!-- <span>No stats found to displayed</span> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["finalResult"]),
  },
  data() {
    return {
      //   result: {
      //     details: [
      //       {
      //         type: "AadhaarSecureQr",
      //         status: true,
      //         score: "10",
      //       },
      //       {
      //         type: "AadhaarPhoneNumber",
      //         status: true,
      //         score: "5",
      //       },
      //       {
      //         type: "AadhaarImageVerification",
      //         status: false,
      //         score: "0",
      //       },
      //       {
      //         type: "AadhaarOtpVerification",
      //         status: false,
      //         score: "0",
      //       },
      //     ],
      //     score: 15,
      //     threshold: "12",
      //     verified: true,
      //   },
    };
  },
};
</script>

<style>
.big {
  font-size: 30px;
  font-weight: bolder;
  width: 72px;
}

.small {
  font-size: small;
  color: grey;
}
.badge {
  margin-left: 40%;
  padding: 2px;
  float: right;
  background-color: grey;
  border-radius: 43%;
  font-size: inherit;
  font-weight: bold;
  color: white;
  width: 25px;
  text-align: center;
  align-content: center;
  margin-left: 5px;
}
</style>
