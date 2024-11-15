export default {
  setQrString: (state, qrString) => {
    state.qrString = qrString
  },
  setImage: (state, imageData) => {
    state.imageData = imageData
  },
  setPhoneNumber: (state, phoneNumber) => {
    state.phoneNumber = phoneNumber
  },

  setFinalResult: (state, result) => {
    state.finalResult = { ...result }
  },

  setAadhaarData: (state, aadharData) => {
    state.aadharData = { ...aadharData }
  },
}
