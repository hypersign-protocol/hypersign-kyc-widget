## POST https://authserver.hypersign.id/hs/api/v2/register

Response Body: 
```js
{
    
    "user": {
        "name":"VISHWAS B ANAND",
        "email":"vishu.anand1@gmail.com",
        "did":"did:hid:testnet:z6MkpmVuREXbmV16ihExTpXSSrs4R6JDZTcfR9dGH6A9E7i9"
    },
    "isThridPartyAuth":true,
    "expirationDate":"2030-12-31T00:00:00.000Z",
    "thridPartyAuthProvider":"Google",
    "accessToken":"eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9maWRhdG8udXMuYXV0aDAuY29tLyJ9..uED2kH5v4w08NG3H._RDx65_HUcCLigp2fTNnKw7SpDU3jxHWW_tZjWC4wjNRgPiB7vm8eC5zAyrX7yQQWPm3Kpk_GTzTkXeOqEAzkYQL8CdCyT1brgRmCrOfsKoRE7vxJPcQsr0HJSoziju7g7YYastkEd1LN2fqMgXANMr9QV4Gj_g3HSR4J-L3qq-6fRnGwsKsVLpsOcWH30poGSOWdsDcZDkd7mZwJN0IIRUcWo3yMtSnPu_Qad8P72q_Sw8abvYxcU62UDh1mGAhdXn-tFgNRcriDj7x_-j-9F5Il07g7G6usHb3AIUo6RimY1gk5vmeeTl4oA.Abu-tPrMAOcHE5YhG5NaTQ"
}
```

Response Body: 
```js
{
    "status": 200,
    "message": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld",
            "https://w3id.org/security/suites/ed25519-2020/v1"
        ],
        "id": "vc:hid:testnet:z6Mki9PTNNLXmdVnWQMHdyMfj1qV8G3M5VGbuRxBByLv2a93",
        "type": [
            "VerifiableCredential",
            "PersonhoodCredential"
        ],
        "expirationDate": "2025-03-03T05:33:30Z",
        "issuanceDate": "2024-03-03T05:31:51Z",
        "issuer": "did:hid:testnet:z6MktWXeAc7j2ShkwEcPDW9JaYYcaTExxbbJKiZhDxo6reC1",
        "credentialSubject": {
            "baseSixtyFourImage": "data:",
            "id": "did:hid:testnet:z6MkpmVuREXbmV16ihExTpXSSrs4R6JDZTcfR9dGH6A9E7i9"
        },
        "credentialSchema": {
            "id": "sch:hid:testnet:z6Mkvtd73dDgg7HU8wLCmXbe2RAHPAU1Ex1VUXCFtPV7u36i:1.0",
            "type": "JsonSchemaValidator2018"
        },
        "credentialStatus": {
            "id": "https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z6Mki9PTNNLXmdVnWQMHdyMfj1qV8G3M5VGbuRxBByLv2a93",
            "type": "HypersignCredentialStatus2023"
        },
        "proof": {
            "type": "Ed25519Signature2020",
            "created": "2024-03-03T05:33:33Z",
            "verificationMethod": "did:hid:testnet:z6MktWXeAc7j2ShkwEcPDW9JaYYcaTExxbbJKiZhDxo6reC1#key-1",
            "proofPurpose": "assertionMethod",
            "proofValue": "zTCkJ5EYf9qNnaYdubXLaHAgdpZPuCfvUaZ7h57KRZBcoKF4oPAPCiZVY2kqAsiDhC1znNJLzAA4ugP1DWoiDFMV"
        }
    },
    "error": null,
    "authToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUHJhdGFwIE1yaWRoYSIsImVtYWlsIjoicHJhdGFwbXJpZGhhQGdtYWlsLmNvbSIsImlhdCI6MTcwOTQ0NDAxMCwiZXhwIjoxNzA5NzAzMjEwfQ.KZJNC2Lyrbz8hN8rFcvaV0S5IZNn_fMOIaPpf3HUnNEcVgzJnYvlScvCjvj4mTbjU8TXoRhl3JvjpgNVDHVSjQ"
}
```

```js
{
    "status": 403,
    "message": "User already exists",
    "error": null,
    "data": {
        "docId": "hs:doc:lvh7mu3x7q8j2by4dzpii_fwudh7h8nm_bunnpty7v0",
        "sequence": 0,
        "userId": "pratapmridha@gmail.com"
    },
    "authToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUHJhdGFwIE1yaWRoYSIsImVtYWlsIjoicHJhdGFwbXJpZGhhQGdtYWlsLmNvbSIsImlhdCI6MTcwOTQ0Mzk3MiwiZXhwIjoxNzA5NzAzMTcyfQ.CIWTlkYNxbGZjQHPpafA30t8L7fwlDmJZdurP4679jTqJIZJlfApPu7j4SJ5Xfy5GynuJcLMiUBxC3R1SLKgdw"
}
```

## GET https://authserver.hypersign.id/hs/api/v2/vcstatus/vc:hid:testnet:z6Mki9PTNNLXmdVnWQMHdyMfj1qV8G3M5VGbuRxBByLv2a93

```js
{
  "status": 200,
  "message": "VC found",
  "error": "",
  "vc": {
    "credentialStatus": {
      "credentialStatusDocument": {
        "context": [
          "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialStatus.jsonld",
          "https://w3id.org/security/suites/ed25519-2020/v1"
        ],
        "id": "vc:hid:testnet:z6Mki9PTNNLXmdVnWQMHdyMfj1qV8G3M5VGbuRxBByLv2a93",
        "revoked": false,
        "suspended": false,
        "remarks": "Credential is active",
        "issuer": "did:hid:testnet:z6MktWXeAc7j2ShkwEcPDW9JaYYcaTExxbbJKiZhDxo6reC1",
        "issuanceDate": "2024-03-03T05:31:51Z",
        "credentialMerkleRootHash": "55073b6815dec87d5e52cd2399348da57ef830052cc98382b7f6150cec806122"
      },
      "credentialStatusProof": {
        "type": "Ed25519Signature2020",
        "created": "2024-03-03T05:33:33Z",
        "verificationMethod": "did:hid:testnet:z6MktWXeAc7j2ShkwEcPDW9JaYYcaTExxbbJKiZhDxo6reC1#key-1",
        "proofPurpose": "assertionMethod",
        "proofValue": "z3AUjqSphJQgG4pVZVdrWSVMGfbczxxKpAcdSKniTRDpLxXQWMFwBQUUTfYgHachQX8dsjTsp2J9jw7k5F78yCmk4",
        "clientSpecType": "CLIENT_SPEC_TYPE_NONE"
      }
    }
  }
}
```

## POST https://authserver.hypersign.id/hs/api/v2/sync

REquest body: 
```js
{
    "user": {
        "userId": "pratapmridha@gmail.com",
        "sequenceNo": 0,
        "docId": "randomId"
    },
    "document": {
        "encryptedMessage": ""
    }
}
```

REquest header: 

```js
Authorization: Bearer <authToken>
```


## GET https://authserver.hypersign.id/hs/api/v2/sync/vishwasbhushan001@gmail.com

REquest header: 

```js
Authorization: Bearer <authToken>
```

Response
```js
{
    "encryptedMessage": ".....",
    "userId": "vishwasbhushan001@gmail.com"
}
```



## ---

https://authserver.hypersign.id/hs/api/v2/sync/verifytoken
https://authserver.hypersign.id/hs/api/v2/vcstatus/vc:hid:testnet:z6Mkhje69o812zhWeTZbCq9u4GjtTovfrKmDTTWPUNpKXxPV



https://authserver.hypersign.id/hs/api/v2/sync

{"user":{"userId":"vishu.anand1@gmail.com","sequenceNo":0,"docId":"randomId"},"document":{"encryptedMessage":"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"}


https://icons.getbootstrap.com/?q=vault

http://localhost:4999?cavachAccessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjA3ZjE4Zjg2MTk0MmRmNzM2NDQzZmM0MDg1MDUwMTliMDYwMSIsInVzZXJJZCI6ImI2ZDQyMWNkLThkNGQtNDhmZC05ZTQ4LTA0NjQ0MWM0M2RhNCIsImdyYW50VHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImttc0lkIjoiaHM6ZG9jOmpuZm05ZzV6bzNmLXhqN3hiN3c4cGNybHFrN2lhZWpxem52N2NkbnpiZm8iLCJ3aGl0ZWxpc3RlZENvcnMiOlsiKiJdLCJzdWJkb21haW4iOiJlbnQtMGIyMmRiOSIsImVkdklkIjoiaHM6ZGV2ZWxvcGVyLWRhc2hib2FyZDphcHA6MDdmMThmODYxOTQyZGY3MzY0NDNmYzQwODUwNTAxOWIwNjAxIiwiaWF0IjoxNzA2ODQ5ODUyLCJleHAiOjE3NjY4NjQyNzJ9.4hhaA9UP3nZ2bI4TiRXrjLqXYZVeqKvJG9BUHWH515g&redirectUrl=https://google.com