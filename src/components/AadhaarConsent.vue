<template>
  <div>
    <img src="../assets/aadhaar-logo.png" height="40" style="opacity: 15%" />

    <table
      class="table"
      style="text-align: left; font-size: x-small; padding-top: 10px"
    >
      <tbody>
        <tr>
          <th scope="row">Name</th>
          <th colspan="2">{{ aadharData.name }}</th>
          <td rowspan="2" style="text-align: center">
            <img :src="aadharData.jpegImage" height="45" />
          </td>
        </tr>
        <tr>
          <th scope="row">DOB</th>
          <td colspan="3">{{ aadharData.dob }}</td>
        </tr>
        <tr>
          <th scope="row">Gender</th>
          <td colspan="3">{{ aadharData.gender }}</td>
        </tr>
        <tr>
          <th scope="row">Address</th>
          <td colspan="3">
            {{ aadharData.house }} {{ aadharData.location }}
            {{ aadharData.state }} - {{ aadharData.pincode }}
          </td>
        </tr>
      </tbody>
    </table>
    <span style="font-size: x-small"
      >Kindly provide your consent to generate zero knowledge proof of your data
      for verification purpose. Do not worry, we do not store your personal data
      anywhere, not even in encrypted form. Read more about zero knowledge proof
      and our data policy <a href="#">here</a></span
    >
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["aadharData"]),
  },
};
</script>
