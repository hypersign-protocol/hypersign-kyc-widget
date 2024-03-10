// Data
//// PR
const issuerDID = "did:hid:testnet:z6Mkt5faxt5HMXPjhibV8hs4it6yEzwv3RVNUUYck7dbS8XT"
const issuerDIDVerificationMethod = "did:hid:testnet:z6Mkt5faxt5HMXPjhibV8hs4it6yEzwv3RVNUUYck7dbS8XT#key-1"
const reason = "Comdex need your these information to allow you access"

//// Access tokens
const cavachAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjVmMzczNWIwMmI1ZDNlZTBhYzJhZDNlZmJiYTU5Y2EzODNjZSIsInVzZXJJZCI6IjFlZDM2NzQ4LTFkZTgtNGQxZi04N2U0LTVhYzk1NGFhYjNjNSIsImdyYW50VHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImttc0lkIjoiaHM6ZG9jOnR6eXN3YWt5ZHk5bnhzZmY5OWtucmNwbndvbHZ0d3B2Zm9nNGZfaGdnbW0iLCJ3aGl0ZWxpc3RlZENvcnMiOlsiKiJdLCJzdWJkb21haW4iOiJlbnQtOWNlYzVjMyIsImVkdklkIjoiaHM6ZGV2ZWxvcGVyLWRhc2hib2FyZDphcHA6NWYzNzM1YjAyYjVkM2VlMGFjMmFkM2VmYmJhNTljYTM4M2NlIiwiaWF0IjoxNzEwMDYwMjcxLCJleHAiOjE3MTAwNzQ2NzF9.KWf2sZkQTVRTy1twFtOAeUiTZoqcu5Pl8I94gm3rQwA"
const ssiAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImI3OWYwZTliZjFkMmZiNGRiM2M0N2Y5YmY2NGZjYTg5NmYzYiIsInVzZXJJZCI6IjFlZDM2NzQ4LTFkZTgtNGQxZi04N2U0LTVhYzk1NGFhYjNjNSIsImdyYW50VHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImttc0lkIjoiaHM6ZG9jOjZkN3psM2NvZnNraDhsY2pyZ3FqdGZhb2NwYW5yY3kzYWlkOHJpOWF0bm0iLCJ3aGl0ZWxpc3RlZENvcnMiOlsiKiJdLCJzdWJkb21haW4iOiJlbnQtM2ZjYmNhNSIsImVkdklkIjoiaHM6ZGV2ZWxvcGVyLWRhc2hib2FyZDphcHA6Yjc5ZjBlOWJmMWQyZmI0ZGIzYzQ3ZjliZjY0ZmNhODk2ZjNiIiwiaWF0IjoxNzEwMDU4NzQxLCJleHAiOjE3MTAwNzMxNDF9.o0YdmBv8vLn4L8t8A_1emG7fkPpWsAJF4hA1QqekvQw"
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




