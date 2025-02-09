window.OneSignalDeferred = window.OneSignalDeferred || []

// eslint-disable-next-line no-undef
OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: window.nodeEnv === 'production' ? '6011d2bb-3bfa-40cc-adca-3f1b8f1954ee' : 'ce881398-7ed0-4376-bb3b-6a20d63835f3',
    safari_web_id: 'web.onesignal.auto.01b20842-ed7c-48c4-bd42-e78491d78625',
    notifyButton: {
      enable: false,
    },
    allowLocalhostAsSecureOrigin: true,
  })
})
