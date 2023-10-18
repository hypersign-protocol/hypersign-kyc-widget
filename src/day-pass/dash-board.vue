<template>
  <div class="card maincontainerForm">
    <IsChromium></IsChromium>
    <div class="card-header" style="text-align: center">
      <h4>Day Pass</h4>
    </div>
    <div class="card-body">
      <a href="/day-pass">
        <div class="card card-tile">
          <div class="card-body">
            <h5 class="card-title">Request Day Pass</h5>
            <!-- <h6 class="card-subtitle mb-2 text-muted">Day pass issuance</h6> -->
            <p class="card-text">
              Verify your Identity, choose your prefred workspace and request a
              day pass for smooth checkin experience at the workspace
            </p>
          </div>
        </div>
      </a>

      <a href="/day-pass-verify">
        <div class="card card-tile">
          <div class="card-body">
            <h5 class="card-title">Verify Day Pass</h5>
            <!-- <h6 class="card-subtitle mb-2 text-muted">Day pass verification</h6> -->
            <p class="card-text">
              Verify your guests with day pass credential in seconds and give
              them a secure and smooth work experience
            </p>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style>
.card-tile {
  width: 19rem;
  float: left;
  margin: 10px;
  text-align: left;
  cursor: pointer;
}
</style>
