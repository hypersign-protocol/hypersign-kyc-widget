import Vue from 'vue'
import Vuex from 'vuex'
import { KAVACH_SERVER_BASE_URL,ENTITY_API_BASE_URL, ENTITY_APP_SERCRET } from '../config'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        qrString: "",
        phoneNumber: "",
        finalResult: {},
        aadharData: {},
        authorization:null,
        steps: [
            {
                id: 0,
                isActive: true,
                stepName: 'AppInstructions',
                previous: 0
            },
            {
                id: 1,
                isActive: true,
                stepName: 'AppScanQR',
                previous: 0
            },
            {
                id: 2,
                isActive: false,
                stepName: 'AppClickPic',
                previous: 1

            },
            {
                id: 3,
                isActive: false,
                stepName: 'AppOtp',
                previous: 2
            },
            {
                id: 4,
                isActive: false,
                stepName: 'AppFinalSuccess',
                previous: 3
            },
            {
                id: 5,
                isActive: false,
                stepName: 'AppFinalFail',
                previous: 3

            }
        ]
    },
    getters: {
        getActiveStep: (state) => {
            // console.log(state)
            return state.steps.find(x => x.isActive == true)
        }
    },
    mutations: {

        nextStep: (state, jumpToStepId = null) => {
            const activeStep = state.steps.find(x => x.isActive == true)
            const nextStepId = jumpToStepId ? jumpToStepId : activeStep.id + 1;
            state.steps[activeStep.id].isActive = false;
            state.steps[nextStepId].isActive = true;
        },

        previousStep: (state) => {
            const activeStep = state.steps.find(x => x.isActive == true)
            const previousStepId = activeStep.previous
            state.steps[activeStep.id].isActive = false;
            state.steps[previousStepId].isActive = true;
        },
        setAuthorization:(state,authorization)=>{
            state.authorization = authorization
            localStorage.setItem('authorization', authorization)

        },
        setQrString: (state, qrString) => {
            state.qrString = qrString;
        },

        setPhoneNumber: (state, phoneNumber) => {
            state.phoneNumber = phoneNumber;
        },

        setFinalResult: (state, result) => {
            state.finalResult = { ...result };
        },

        setAadhaarData: (state, aadharData) => {
            state.aadharData = { ...aadharData };
        }
    },
    actions: {
        addharQRVerify: ({ state }) => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/qr/verify'
                fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: state.authorization,
                    },
                    body: JSON.stringify({
                        qrString: '70400754456627879635412682207093404733951579683932156464643926592918293027900190430510103272432474159770799301878886164764520640553070201570338745245852868359501352023803005143704085153181285706451174864195813350292817095206252827350787276791622646257030863687661429153124230699224300583116877884537604742211568762017258307755956566781277581848200244943692438137106942365747148618643112463693980530933792417101366814805759056558425423381054311701397587663524840134083814275784220522128204400915757904860435230400367737419889781642950934284037728140471899086660036458482421922698095475493779870382130356102098248294438248511657370470098248020276366624277251381621126330438534004450552025777905673725292192438432632921006601100588454477281998228920641790223368722042602057834816878119614008476428361764098205662226503795064538692777790532051515707972956533967466085058895219232596533554210501669482384334391660342601519187429122291860366810586537109774181838539693457641121135268936403495914170836250276609373875079567887386246123632010863303152378659962328249713712251481254822650158708077878626856754435179993421845206308644118101778413036268208470785675644092025861895632527158676855865242347765085574566746768328827954846492142742883743380056968154687629067457726566338813299276105123460894252624871739327999014105947235329006417425268943841859850882238979931265234605269892549168744629555759011023699226117830362340641319197625536194371892274338087610661217068236047641583917464525443345016727602287582980780562453676108017063575116233413146994845433981269450941310263253967990764268928809603667725160436398945030669775981851358487047164860527432038792358479919609549886806883405400723203350410269514790043304803754046605923844502751289705189259942747193672237142781529156634963192325552883343711999688005888072535848443501965231969811815436734732650584969385670252693146052095850890360559206188122876812642825237703606515674708435437713043794550003927218063872946663225468282306636510823462099485016928999978221654484649535075203961623693871143010912759626708479450946163945620279249902638925213240697729482377198684801207125332162332064516192411873529251320318349602779216514740984378744268234868827287455015197061556230401284449492305100543804204160361894066452653645591396043687639717637866888929747487877703100505900756494480749438019049807699817790049815699028886312848135070833343967766513314617453849171998994987654760908209790173842905765023115520265364830660210577014148086772875901878157883743389244871352781434480740061698197734379174751689588926751569070680838363751350083471943629785695993752803470141455722000435742344057576931964835878612441443753927459906218764565522734474274477135246963888354560363681391928694529961900242367038469118100778458748181057914322465717129522022353064433432671939087594628649225705996765905113079925338308434886763796190640292787178247435872232267136430093857562487618148880930534555714593693842904282827624972137830911572841372889098834920425992283298099492035614396988791091068277288567425857575762416696277350186555830758164425141903403343216396314950365050884855552980660749192652058810943139575981883409805489902437035637053598864586261488150756470678847273046024184484660995956778735623328947179706712064' //state.qrString
                    })
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }

                    
                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })
            })
        },
        setJWT: ({
            commit
        }) => {
            return new Promise((resolve, reject) => {
               
                    const url = ENTITY_API_BASE_URL + '/api/v1/app/oauth'
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Api-Secret-Key':ENTITY_APP_SERCRET
                        },
                        body:undefined
                    }).then(resp => {
                        return resp.json()
                    }).then(json => {
                        if (json.statusCode == 400) {
                            throw new Error('Bad Request ' + json.message.toString())
                        }
                        commit('setAuthorization', 'Bearer '+json.access_token)
                        resolve()
                    }).catch(e => {
                        reject(e.message)
                        localStorage.removeItem('authorization')
                    })
                

                }

            )
        },
        setSession: ({
                    state

        }) => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/session'
                fetch(url, {
                    method: 'POST',
                    credentials: 'include',
            
                    headers: {
                        'content-type': 'application/json',
                        Authorization: state.authorization,
                        
                    },
                    body: undefined
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    
                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }
                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })
            })
        },

        verifyPhoneNumber: ({ state }) => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/ph/verify'
                fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        phoneNumber: state.phoneNumber
                    }),
                    headers: {
                        'content-type': 'application/json',
                        Authorization: state.authorization,

                    }
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }
                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })
            })
        },

        verifyImage: ({state}) => {
            return new Promise((resolve, reject) => {
                console.log('Inside verifyImage')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/img/verify'
                fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        userImage: ''
                    }),
                    headers: {
                        'content-type': 'application/json',
                        Authorization: state.authorization,

                    }
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }
                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })
            })
        },

        getFinalResult: ({state}) => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/result'
                fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                    headers:{
                        Authorization: state.authorization,
                        'content-type': 'application/json',

                    }
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }
                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })
            })
        },

    },


})