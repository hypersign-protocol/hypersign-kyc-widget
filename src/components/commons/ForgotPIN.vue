<template>
  <div>
    <v-btn outlined block color="secondary" @click="deleteAccountConfirmation()">Forgot PIN?</v-btn>
    <v-row justify="center">
      <v-dialog v-model="confirmationDialog" max-width="310">
        <v-card>
          <v-card-title class="text-h6">Account Reset Required! </v-card-title>
          <v-card-text>{{ lostPinMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="confirmationDialog = false">Disagree</v-btn>
            <v-btn color="green darken-1" text @click="proceedWithResetting()">AGREE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'ForgotPin',
  data() {
    return {
      confirmationDialog: false,
      lostPinMessage: `
      It looks like you forgot your PIN. Since this is a non-custodial data vault, 
      we can not recover your account or data for security reasons. The only option is to reset your account, 
      which means we will delete all your old encrypted data and require you to re-verify your identity. Are you sure you want to proceed with the account reset?`,
    }
  },
  methods: {
    async deleteAccountConfirmation() {
      this.confirmationDialog = true
    },
    proceedWithResetting() {
      this.$emit('proceedWithAccountDeletion', true)
    },
  },
}
</script>
