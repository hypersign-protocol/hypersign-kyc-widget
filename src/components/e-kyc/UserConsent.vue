<template>

    <div class="card-body">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
        <PageHeading :header="'User Consent'" style="text-align: center;" />

        <div class="widget-card" style="width: 90%;margin:auto;     margin-top: 30px;"
            v-if="getPresentationRequestParsed">
            <div class="container credential-row">
                <div class="row">
                    <div class="col-md-2">
                        <img :src="getPresentationRequestParsed.logoUrl" style="height:80px"
                            v-if="getPresentationRequestParsed.logoUrl">
                        <i class="bi bi-robot" style="font-size:xxx-large;" v-else></i>
                    </div>
                    <div class="col-md-10" style="text-align: left;">
                        <div class="row" v-if="getPresentationRequestParsed.domain">
                            <div class="col-md-12">
                                {{ getPresentationRequestParsed.domain }}
                            </div>
                        </div>
                        <div class="row" style="color: grey; font-size: large;">
                            <div class="col-md-12">
                                <span v-if="getPresentationRequestParsed.reason">
                                    {{ getPresentationRequestParsed.reason }}
                                </span>
                                <span v-else>
                                    verifier app needs your information to allow you serivce
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="widget-card " style="width: 90%;margin:auto;     margin-top: 30px;">
            <div class="container">
                <div class="row credential-row" v-for="eachCredential in getVaultDataCredentials"
                    v-bind:key="eachCredential.id">
                    <div class="col-1">
                        <i class="bi bi-person-bounding-box"
                            v-if="eachCredential.type[1] == 'PersonhoodCredential'"></i>

                        <i class="bi bi-calendar3-week" v-if="eachCredential.type[1] == 'DateOfBirthCredential'"></i>
                        <i class="bi bi-globe" v-if="eachCredential.type[1] == 'CitizenshipCredential'"></i>
                        <i class="bi bi-person-vcard" v-if="eachCredential.type[1] == 'PassportCredential'"></i>
                    </div>
                    <div class="col-10 credential-row-type">
                        {{ eachCredential.type[1] }}
                        <InfoMessage :message="eachCredential.id"></InfoMessage>
                    </div>
                    <div class="col-1 credential-row-switch">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"
                                checked disabled>
                        </div>
                    </div>
                </div>
                <!-- <p>
                    <InfoMessage
                        message="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups. Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups." />
                </p> -->
            </div>
        </div>
        <p style="margin-top: 1%">
            <button class="btn btn-outline-dark" @click="submit()">
                <i class="bi bi-check-circle"></i> Authorize
            </button>
        </p>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" class="bottom" />
    </div>

</template>


<script type="text/javascript">
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { HypersignVerifiablePresentation } from 'hs-ssi-sdk';
export default {
    name: 'UserConsent',
    data() {
        return {
            isLoading: false,
            fullPage: true,
            toastMessage: "",
            toastType: "success",
            isToast: false,
            hypersignVP: null,
        }
    },
    created() {
        this.hypersignVP = new HypersignVerifiablePresentation();
    },
    computed: {
        ...mapGetters(['getVaultDataCredentials', 'getUserDID', 'getPresentationRequestParsed']),
        credentailsTypesInWallet() {
            const types = this.getVaultDataCredentials.map(x => x.type)
            const allTypes = [].concat(...types)
            const uniqueTypes = Array.from(new Set(allTypes))
            const uniqueTypesWithoutDefaultTypes = uniqueTypes.filter(x => x != 'VerifiableCredential')
            return uniqueTypesWithoutDefaultTypes
        },
    },
    methods: {
        ...mapActions(['verifyResult']),
        ...mapMutations(['nextStep', 'previousStep', 'setUserPresentationConsent']),
        toast(msg, type = "success") {
            this.isToast = true;
            this.toastMessage = msg;
            this.toastType = type;

            setTimeout(() => {
                this.isToast = false;
                this.toastMessage = "";
            }, 2000);
        },
        async submit() {
            try {

                // TODO: Generating the presention with all the VCs
                this.toast('Submitting your data...', "success");
                const presentation = await this.generatePresentation()
                this.setUserPresentationConsent(presentation)
                console.log(presentation)
                // TODO:  sign this presentation 

                // const signedPresentation  = await this.signPresentation(presentation)

                // Submitting the presentation

                this.isLoading = true;
                this.toast('Submitting your data...', "warning");
                this.$emit('verifyIdDocEvent', true)

                // TODO: send this presentation in the verifyResult API // TODO: change the name of this API as well as functioin
                const result = await this.verifyResult()
                console.log(result)
                this.isLoading = false;
                this.nextStep();
            } catch (e) {
                this.toast(e.message, "error");
                this.isLoading = false;
            }
        },
        async generatePresentation() {

            const params = {
                "verifiableCredentials": [...this.getVaultDataCredentials],
                "holderDid": this.getUserDID
            }
            return await this.hypersignVP.generate(params);

        },
    }
}
</script>


<style scoped>
.credential-row {
    padding: 10px;
    font-size: x-large;
}

.credential-row-type {
    text-align: left
}

.credential-row-switch {
    align-content: right;

}

.conset-message {
    color: grey;
    font-size: x-small;
}
</style>
