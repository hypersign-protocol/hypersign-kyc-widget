<template>
  <div>
    <a href="javascript:;" v-on:click="deleteAccountConfirmation()">Forgot PIN?</a>
  </div>
</template>
<script>
export default {
  name: 'ForgotPin',
  data() {
    return {
      lostPinMessage: `Account Reset Confirmation:
-----------------------------
It looks like you forgot your PIN. Since this is a non-custodial data vault, we can not recover your account or data. The only option is to reset your account, which will delete all your data and require you to request credentials again from issuers. Are you sure you want to proceed with the account reset?`,
    }
  },
  methods: {
    async deleteAccountConfirmation() {
      if (confirm(this.lostPinMessage)) {
        this.$emit('proceedWithAccountDeletion', true)
      }
    },
  },
}
</script>
