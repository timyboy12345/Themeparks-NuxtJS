window.OneSignalDeferred = window.OneSignalDeferred || []

// eslint-disable-next-line no-undef
OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: '6011d2bb-3bfa-40cc-adca-3f1b8f1954ee',
    safari_web_id: 'web.onesignal.auto.01b20842-ed7c-48c4-bd42-e78491d78625',
    notifyButton: {
      enable: false,
    },
    allowLocalhostAsSecureOrigin: true,
  })
})
