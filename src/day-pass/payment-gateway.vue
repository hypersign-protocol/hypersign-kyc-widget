<template>
  <div class="card" style="text-align: left; padding: 10px">
    <div class="mb-3">
      <label for="basic-url" class="form-label">Choose Payment Option</label>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="exampleRadios"
          id="exampleRadios1"
          value="option1"
        />
        <label class="form-check-label" for="exampleRadios1"> Razor Pay </label>
      </div>
      <div>
        <div>
          <div>Scan the QR code to pay via UPI</div>
          <div>Once payment is done, press Submit</div>
          <i class="bi bi-qr-code" style="font-size: 200px"></i>
        </div>
        <div>
          <button class="btn btn-primary">Submit</button>
        </div>
      </div>

      <div>
        <i class="bi bi-check-circle-fill" style="font-size: 200px"></i>
        <label style=""
          >Congratulation, your Day Pass is generated successfully!</label
        >
      </div>
    </div>
  </div>
</template>

<script>
// import { HypersignDID } from "hs-ssi-sdk";

export default {
  methods: {
    initiateHypersignSDK() {
      //   const hypersignDID = new HypersignDID({ namespace: "testnet" });
    },
  },
};
</script>
