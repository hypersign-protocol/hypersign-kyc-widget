// export const KAVACH_SERVER_BASE_URL = "http://localhost:3009"
export const ENTITY_API_BASE_URL = 'https://api.entity.hypersign.id'
export const ENTITY_APP_SERCRET = '0a88981d30e66a8b188760b081c14.02178535aa9c0ee9fe6cf4e2e3902559f12357c93d44df1959229122def5be650303272f2dc4d5443cb7275c25e2566e5'
export const KAVACH_SERVER_BASE_URL = 'https://stage.hypermine.in/kavach'

// This must be in the format: <http/https>://<subdomain>.host/api/v1
export const HYPERSIGN_SERVICE_BASE_URL_FORMAT = process.env.NODE_ENV === 'production' ? 'https://<subdomain>.api.cavach.hypersign.id/api/v1' : 'http://localhost:3001/api/v1'
// export const HYPERSIGN_SERVICE_BASE_URL_FORMAT = 'http://<subdomain>.localhost:3001/api/v1'

export const AUTH_PROVIDERS = Object.freeze({
  GOOGLE: 'google',
  KEPLR: 'keplr',
  METAMASK: 'metamask',
  DIAM: 'diam',
})

export const STEP_NAMES = Object.freeze({
  SignIn: 'SignIn',
  VaultPIN: 'VaultPIN',
  AppInstructions: 'AppInstructions',
  LiveLiness: 'LiveLiness3',
  IdDocs: 'IdDocs4',
  ZkProofs: 'ZkProofs',
  OnChainId: 'OnChainId4',
  UserConsent: 'UserConsent',
  FinalResult: 'FinalResult',
})

export const ZK_PROOF_TYPES = Object.freeze({
  zkProofOfAge: 'zkProofOfAge',
  zkProofOfDOB: 'zkProofOfDOB',
  zkProofOfMembership: 'zkProofOfMembership',
  zkProofOfPersonHood: 'zkProofOfPersonHood',
  zkProofKYC: 'zkProofOfKYC',
})

export const FaicalAuthenticationError = {
  CHECK_COULD_NOT_PERFORMED: 'Face check could not be performed',
  FACE_DOESNOT_MATACH: 'Faces does not match', /// runtime
  FACE_NOT_FOUND: 'Face not found in the image',
  FAILED_POSE_OF_FACE: 'Failed to perform face check due to the pose of the face',
  FAILED_FACIAL_PATTERN: 'Failed, due to problems in the extraction of the facial pattern',
  ALREADY_BEEN_VERIFIED: 'Failed, because document has already been verified in some other account with this service', /// runtime
}
