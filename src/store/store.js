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
        setImage: (state, imageData) => {
            state.imageData = imageData;
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
                        qrString: '2235738957097961121749905887497543921908082579730365230403796785283928752025264756287291126037923560666399527903236354434818513928995262766462602025389193851495690946340838681743230741052599487242491245226166181777041960933240272552959532798572051245361509211905067190029103090022913088961630314621839503858627598066615410625872720517686010255348596832827731324563988051070397270588340275284312947588193493686469190658272963990147030059104371495364320533645993691002927687333651773681914742562600679425193713342723480180117608456398605550565603609500765464530875472955362188127936776432011472206345715319669148528813235165429271374894548738007024086672851485030689203208788061972251979588668405062140416286307074130444388251443074464143368432780000772834857690675533917929067768961845215263200994221763467613558861372836378380546803197347688990847715172672539772326030401092790249655675402776086094370283819121046927730979966703515869714658816777270140790972565397025385990345921802914805988559209683502606642129694635909433831409455798646906173972163247336112559384255003960362968486482232162526392969524778210161789598970642431543822130282574722649644148598740109300016090958471470350860018329220493291572572708107810040969935546977460177603034397188770797092028738774483252834975946662365861151729715849401288223929677507893127934629814001407598251229190418597561232799759726741160050381778620065299188345206089127684221297152856530361376153182842308243916851795806341192128251373082061268643658405082452888297503994771252908541211179446535929403071438518257095862133826711888040277213029649220849385013903880092901951610020874897278875948098554375301197073548892501555135383308941029202963770356223001170404546091250870183923395871562362385829760114564919601053947225611574042192162685378870539813348510817560297146990977504483804346564808852061168057987054466226642071537811412134027036778593642973119458383118791550996135165932276351213060724748806770038902225880200993382129514113245836581745383971770824108181374236663591966500234482113587371910421856385031962912307386353492788790720444522717945925990182477775507902063539329617186313276180710011023465033761767517956011986394049669447485882907054285968115337753980173420939561746460379479043908868386629210904457202135239917314477524099171986191644285339616654468219244252713257935834245149382789643145003601082077702277957625175925181084416344321531712421834223505118753526661014360710417505272869167876460952549152647706652053492410088788073857381189264074451874917215276444184246693189694298166813451449957089089244647492976363249626420842601029436426634609875076022181938255802340083933049960745814977875858010417238146034098516339056492302335129713235636565500557789838784744946915588492269606251404212190074810185578621608927993449377758276209708992280375654657045901418370026772321924705087597091902973501867208855021774444115494193314028925022873151750646840511436830780825209250756879799105572839722756278780335182405162007592960' //state.qrString
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
                        userImage: state.imageData
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