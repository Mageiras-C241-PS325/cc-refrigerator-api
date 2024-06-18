<ref *1> Auth {
  authRequestHandler: AuthRequestHandler {
    app: FirebaseApp {
      appStore: [AppStore],
      services_: [Object],
      isDeleted_: false,
      name_: 'firebaseAuth',
      options_: [Object],
      INTERNAL: [FirebaseAppInternals],
      auth: [Function (anonymous)],
      appCheck: [Function (anonymous)],
      database: [Function (anonymous)],
      messaging: [Function (anonymous)],
      storage: [Function (anonymous)],
      firestore: [Function (anonymous)],
      instanceId: [Function (anonymous)],
      installations: [Function (anonymous)],
      machineLearning: [Function (anonymous)],
      projectManagement: [Function (anonymous)],
      securityRules: [Function (anonymous)],
      remoteConfig: [Function (anonymous)],
      __extended: true
    },
    httpClient: AuthHttpClient { retry: [Object], app: [FirebaseApp] },
    authResourceUrlBuilder: AuthResourceUrlBuilder {
      app: [FirebaseApp],
      version: 'v2',
      urlFormat: 'https://identitytoolkit.googleapis.com/{version}/projects/{projectId}{api}'
    }
  },
  tokenGenerator: FirebaseTokenGenerator {
    tenantId: undefined,
    signer: ServiceAccountSigner {
      credential: [ServiceAccountCredential],
      algorithm: 'RS256'
    }
  },
  sessionCookieVerifier: FirebaseTokenVerifier {
    issuer: 'https://session.firebase.google.com/',
    tokenInfo: {
      url: 'https://firebase.google.com/docs/auth/admin/manage-cookies',
      verifyApiName: 'verifySessionCookie()',
      jwtName: 'Firebase session cookie',
      shortName: 'session cookie',
      expiredErrorCode: [Object]
    },
    app: FirebaseApp {
      appStore: [AppStore],
      services_: [Object],
      isDeleted_: false,
      name_: 'firebaseAuth',
      options_: [Object],
      INTERNAL: [FirebaseAppInternals],
      auth: [Function (anonymous)],
      appCheck: [Function (anonymous)],
      database: [Function (anonymous)],
      messaging: [Function (anonymous)],
      storage: [Function (anonymous)],
      firestore: [Function (anonymous)],
      instanceId: [Function (anonymous)],
      installations: [Function (anonymous)],
      machineLearning: [Function (anonymous)],
      projectManagement: [Function (anonymous)],
      securityRules: [Function (anonymous)],
      remoteConfig: [Function (anonymous)],
      __extended: true
    },
    shortNameArticle: 'a',
    signatureVerifier: PublicKeySignatureVerifier { keyFetcher: [UrlKeyFetcher] }
  },
  idTokenVerifier: FirebaseTokenVerifier {
    issuer: 'https://securetoken.google.com/',
    tokenInfo: {
      url: 'https://firebase.google.com/docs/auth/admin/verify-id-tokens',
      verifyApiName: 'verifyIdToken()',
      jwtName: 'Firebase ID token',
      shortName: 'ID token',
      expiredErrorCode: [Object]
    },
    app: FirebaseApp {
      appStore: [AppStore],
      services_: [Object],
      isDeleted_: false,
      name_: 'firebaseAuth',
      options_: [Object],
      INTERNAL: [FirebaseAppInternals],
      auth: [Function (anonymous)],
      appCheck: [Function (anonymous)],
      database: [Function (anonymous)],
      messaging: [Function (anonymous)],
      storage: [Function (anonymous)],
      firestore: [Function (anonymous)],
      instanceId: [Function (anonymous)],
      installations: [Function (anonymous)],
      machineLearning: [Function (anonymous)],
      projectManagement: [Function (anonymous)],
      securityRules: [Function (anonymous)],
      remoteConfig: [Function (anonymous)],
      __extended: true
    },
    shortNameArticle: 'an',
    signatureVerifier: PublicKeySignatureVerifier { keyFetcher: [UrlKeyFetcher] }
  },
  authBlockingTokenVerifier: FirebaseTokenVerifier {
    issuer: 'https://securetoken.google.com/',
    tokenInfo: {
      url: 'https://cloud.google.com/identity-platform/docs/blocking-functions',
      verifyApiName: '_verifyAuthBlockingToken()',
      jwtName: 'Firebase Auth Blocking token',
      shortName: 'Auth Blocking token',
      expiredErrorCode: [Object]
    },
    app: FirebaseApp {
      appStore: [AppStore],
      services_: [Object],
      isDeleted_: false,
      name_: 'firebaseAuth',
      options_: [Object],
      INTERNAL: [FirebaseAppInternals],
      auth: [Function (anonymous)],
      appCheck: [Function (anonymous)],
      database: [Function (anonymous)],
      messaging: [Function (anonymous)],
      storage: [Function (anonymous)],
      firestore: [Function (anonymous)],
      instanceId: [Function (anonymous)],
      installations: [Function (anonymous)],
      machineLearning: [Function (anonymous)],
      projectManagement: [Function (anonymous)],
      securityRules: [Function (anonymous)],
      remoteConfig: [Function (anonymous)],
      __extended: true
    },
    shortNameArticle: 'an',
    signatureVerifier: PublicKeySignatureVerifier { keyFetcher: [UrlKeyFetcher] }
  },
  app_: FirebaseApp {
    appStore: AppStore { appStore: [Map] },
    services_: { auth: [Circular *1] },
    isDeleted_: false,
    name_: 'firebaseAuth',
    options_: {
      credential: [ServiceAccountCredential],
      databaseURL: 'https://mageiras-99042.firebaseio.com'
    },
    INTERNAL: FirebaseAppInternals {
      credential_: [ServiceAccountCredential],
      tokenListeners_: []
    },
    auth: [Function (anonymous)],
    appCheck: [Function (anonymous)],
    database: [Function (anonymous)],
    messaging: [Function (anonymous)],
    storage: [Function (anonymous)],
    firestore: [Function (anonymous)],
    instanceId: [Function (anonymous)],
    installations: [Function (anonymous)],
    machineLearning: [Function (anonymous)],
    projectManagement: [Function (anonymous)],
    securityRules: [Function (anonymous)],
    remoteConfig: [Function (anonymous)],
    __extended: true
  },
  tenantManager_: TenantManager {
    app: FirebaseApp {
      appStore: [AppStore],
      services_: [Object],
      isDeleted_: false,
      name_: 'firebaseAuth',
      options_: [Object],
      INTERNAL: [FirebaseAppInternals],
      auth: [Function (anonymous)],
      appCheck: [Function (anonymous)],
      database: [Function (anonymous)],
      messaging: [Function (anonymous)],
      storage: [Function (anonymous)],
      firestore: [Function (anonymous)],
      instanceId: [Function (anonymous)],
      installations: [Function (anonymous)],
      machineLearning: [Function (anonymous)],
      projectManagement: [Function (anonymous)],
      securityRules: [Function (anonymous)],
      remoteConfig: [Function (anonymous)],
      __extended: true
    },
    authRequestHandler: AuthRequestHandler {
      app: [FirebaseApp],
      httpClient: [AuthHttpClient],
      authResourceUrlBuilder: [AuthResourceUrlBuilder]
    },
    tenantsMap: {}
  },
  projectConfigManager_: ProjectConfigManager {
    authRequestHandler: AuthRequestHandler {
      app: [FirebaseApp],
      httpClient: [AuthHttpClient],
      authResourceUrlBuilder: [AuthResourceUrlBuilder]
    }
  }
}