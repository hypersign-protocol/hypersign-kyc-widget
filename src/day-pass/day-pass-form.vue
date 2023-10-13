<template>
  <div class="card" style="text-align: left">
    <!-- <div class="embed-responsive embed-responsive-21by9">
      <iframe
        class="embed-responsive-item"
        src="https://cavach.hypermine.in"
        height="700"
        width="500"
        allow="camera;microphone"
      ></iframe>
    </div> -->
    <div class="card-header" style="text-align: center">
      <h4>Day Pass Issuance Form</h4>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label for="basic-url" class="form-label">Name</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="First name"
            aria-label="Username"
          />
          <input
            type="text"
            class="form-control"
            placeholder="Last name"
            aria-label="Server"
          />
        </div>
      </div>
      <div class="mb-3">
        <label for="basic-url" class="form-label">Phone Number</label>
        <div class="input-group">
          <span class="input-group-text" id="basic-addon3">+91</span>
          <input
            type="text"
            class="form-control"
            id="basic-url"
            aria-describedby="basic-addon3 basic-addon4"
          />
        </div>
        <div class="form-text" id="basic-addon4">
          Phone number linked with your ID
        </div>
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label"
          >Email address</label
        >
        <input
          type="email"
          class="form-control"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
        />
      </div>

      <div class="mb-3">
        <label for="basic-url" class="form-label">Select Workspace</label>
        <select class="form-select" aria-label="Default select example">
          <option selected>Select Workspace you are looking for</option>
          <option value="1">HSR Layout</option>
          <option value="2">Indra Nagar</option>
          <option value="3">Marathalli</option>
        </select>
      </div>

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
          <label class="form-check-label" for="exampleRadios1">
            Razor Pay
          </label>
        </div>
      </div>

      <div class="mb-3">
        <button class="btn btn-primary">Next</button>
      </div>
    </div>
  </div>
</template>
