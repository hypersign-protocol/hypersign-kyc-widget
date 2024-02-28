<template>
    <div class="card maincontainer" style="text-align: center;">
        <NavBar />
        <div class="card-body">
            <PageHeading :header="'Preview'" :subHeader="'Please verify if your data is correct before sumitting'" />

            <div class="row">
                <div class="col-md-12" style="text-align: left">
                    <strong>Your Id Document</strong>
                    <div class="card center" style="padding:5px">
                        <img :src="extractedImage" style="width:500px" />
                    </div>
                </div>
            </div>
            <div class="row" style="margin-top: 1%;">
                <div class="col-md-12" style="text-align: left">
                    <strong>Extracted Data</strong>
                    <div class="card" style="padding: 10px">
                        <table class="table" style="text-align: left">
                            <tr>
                                <td>Name</td>
                                <td>{{ `${extractedData.firstName} ${extractedData.lastName}` }}</td>
                            </tr>

                            <tr>
                                <td>Date Of Birth</td>
                                <td>{{ `${extractedData.dateOfBirth}` }}</td>
                            </tr>

                            <tr>
                                <td>Nationality </td>
                                <td>{{ `${extractedData.nationality}` }}</td>
                            </tr>

                            <tr>
                                <td> Gender </td>
                                <td>{{ `${extractedData.gender}` }}</td>
                            </tr>

                            <tr>
                                <td>Document Number</td>
                                <td>{{ `${extractedData.documentNumber}` }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            <div class="row" style="margin-top: 1%;">
                <div class="col-md-12">
                    <button class="btn btn-outline-dark" @click="submit()">
                        Submit
                    </button>
                </div>
            </div>
        </div>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
        <div class="card-footer">
            <PoweredBy style="text-align: center;" />
        </div>
    </div>
</template>

<script>
import PoweredBy from "../commons/PoweredBy.vue";
import { mapActions, mapMutations } from "vuex";

export default {
    name: 'PreviewData',
    computed: {
        extractedData() {
            return this.$store.state.kycExtractedData.extractionData
        },
        extractedImage() {
            return this.$store.state.kycExtractedData.images?.frontDocument
        }
    },
    components: {
        PoweredBy,
    },
    data: function () {
        return {
            isLoading: false,
            fullPage: true,
            toastMessage: "",
            toastType: "success",
            isToast: false,



        }
    },

    methods: {
        ...mapActions(['verifyResult']),
        ...mapMutations(['nextStep']),
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
                this.isLoading = true;
                this.toast('Submitting your data...', "warning");
                const result = await this.verifyResult()
                console.log(result)
                this.isLoading = false;
                this.nextStep();
            } catch (e) {
                this.toast(e.message, "error");
                this.isLoading = false;
            }

        }

    }
}
</script>