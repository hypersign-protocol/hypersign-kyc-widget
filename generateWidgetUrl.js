// Data
//// PR
const issuerDID = "did:hid:testnet:3d11e40f-2250-4846-bd23-bfb58cf4eea5"
const issuerDIDVerificationMethod = "did:hid:testnet:3d11e40f-2250-4846-bd23-bfb58cf4eea5#key-1"
const reason = "Comdex need your these information to allow you access"

//// Access tokens
const cavachAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImIzZjA1MDk3ZTI4YWZlODM2MDRlY2ZmZGM3N2UxNTBhYWFlOCIsInVzZXJJZCI6ImMyMjM4NDlmLTYyMTUtNGQ1OS1hZmI0LWFjYTYxODAyZDUxNyIsImdyYW50VHlwZSI6ImFjY2Vzc19zZXJ2aWNlX2t5YyIsImttc0lkIjoiaHM6ZG9jOmItZXlnenluZjNkdmd4NGR2d2ttMWIzamE1M19kd2Nxd2lrYjN4eWU3MzQiLCJ3aGl0ZWxpc3RlZENvcnMiOlsiKiJdLCJzdWJkb21haW4iOiJlbnQtYjNhYmM5MiIsImVkdklkIjoiaHM6ZGV2ZWxvcGVyLWRhc2hib2FyZDphcHA6YjNmMDUwOTdlMjhhZmU4MzYwNGVjZmZkYzc3ZTE1MGFhYWU4IiwiaWF0IjoxNzEwMTQ5MDY5LCJleHAiOjE3MTAxNjM0Njl9.QVX7IlLluw2XMlON_Qu6HroBGt0yLi8m9BK-pyxRAxo"
const ssiAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImVkYTM4MjM4MjYxOTFiMmU5YmEzNDRhY2JjNTQ4ZGE1ZjRlMCIsInVzZXJJZCI6ImMyMjM4NDlmLTYyMTUtNGQ1OS1hZmI0LWFjYTYxODAyZDUxNyIsImdyYW50VHlwZSI6ImFjY2Vzc19zZXJ2aWNlX3NzaSIsImttc0lkIjoiaHM6ZG9jOnZycWN5amZodWV1anNqZGs3cF8wNDhrbHNtNHAtYzF1d25wdWhfdmlkbDgiLCJ3aGl0ZWxpc3RlZENvcnMiOlsiKiJdLCJzdWJkb21haW4iOiJlbnQtMGJjZTU1YSIsImVkdklkIjoiaHM6ZGV2ZWxvcGVyLWRhc2hib2FyZDphcHA6ZWRhMzgyMzgyNjE5MWIyZTliYTM0NGFjYmM1NDhkYTVmNGUwIiwiaWF0IjoxNzEwMTQ5MDA5LCJleHAiOjE3MTAxNjM0MDl9.mKzlDXu6DA9p9BN96e-LgMC8HvO6E71ra7gN_ZzPw7M"
const redirectUrl = "https://google.com"
//// ----------------------------------------------------------------

const widgetBaseUrl = "http://localhost:4999"
const presentationRequest = {
    "query": [
        {
            "type": "QueryByExample",
            "credentialQuery": [
                {
                    "example": {
                        "type": "PersonhoodCredential",
                        "credentialSchema": {
                            "id": "sch:hid:testnet:z6Mkvtd73dDgg7HU8wLCmXbe2RAHPAU1Ex1VUXCFtPV7u36i:1.0"
                        }
                    },
                    "trustedIssuer": [
                        {
                            "required": true,
                            "issuer": "did:hid:testnet:zCyAz2wfKjAaWE4FW75KxpZh2wuo9kRAUZyV2xEe93cKr"
                        }
                    ]
                }
            ]
        },
        {
            "type": "QueryByExample",
            "credentialQuery": [
                {
                    "example": {
                        "type": "PassportCredential",
                        "credentialSchema": {
                            "id": "sch:hid:testnet:z6MkgMXXQL7YD7BufNLbjrwueoj4nmih9xujJ6aozJDmzFWx:1.0"
                        }
                    },
                    "trustedIssuer": [
                        {
                            "required": true,
                            "issuer": "did:hid:testnet:zCyAz2wfKjAaWE4FW75KxpZh2wuo9kRAUZyV2xEe93cKr"
                        }
                    ]
                }
            ]
        }
    ],
    "reason": reason,
    "issuerDID": issuerDID,
    "issuerDIDVerificationMethod": issuerDIDVerificationMethod,
    "domain": "https://comdex.one/",
    "logoUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMsJ_pm-uPdm_MyNyRNpB9RXlnp3f9Fs1GPQ&usqp=CAU"
}
const presentationRequestStr = JSON.stringify(presentationRequest)
const prBase64 = btoa(presentationRequestStr)
const finalUrl = `${widgetBaseUrl}?cavachAccessToken=${cavachAccessToken}&ssiAccessToken=${ssiAccessToken}&pr=${prBase64}&redirectUrl=${redirectUrl}`
console.log(finalUrl)




