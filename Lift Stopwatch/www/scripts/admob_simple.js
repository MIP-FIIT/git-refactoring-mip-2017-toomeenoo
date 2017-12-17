var admobid = {};

// TODO: replace the following ad units with your own
if( /(android)/i.test(navigator.userAgent) ) {
  admobid = { // for Android
    banner: 'ca-app-pub-5168294242808017/1690458883',
    interstitial: 'ca-app-pub-5168294242808017/6120658487',
    rewardvideo: 'ca-app-pub-5168294242808017/8324236483',
  };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
  admobid = { // for iOS
    banner: 'ca-app-pub-3940256099942544/4480807092',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewardvideo: 'ca-app-pub-3940256099942544/1712485313',
  };
} else {
  admobid = { // for Windows Phone
    banner: 'ca-app-pub-5168294242808017/1690458883',
    interstitial: 'ca-app-pub-5168294242808017/6120658487',
    rewardvideo: '',
  };
}