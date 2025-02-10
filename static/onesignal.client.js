window.OneSignalDeferred = window.OneSignalDeferred || []

// eslint-disable-next-line no-undef
OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: window.oneSignalAppId,
    safari_web_id: 'web.onesignal.auto.01b20842-ed7c-48c4-bd42-e78491d78625',
    notifyButton: {
      enable: false,
    },
    allowLocalhostAsSecureOrigin: true,
  })
})
