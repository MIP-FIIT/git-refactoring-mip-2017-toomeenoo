// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
        try {
            if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
                AdMob.createBanner({
                    adId: admobid.banner,
                    position: AdMob.AD_POSITION.BOTTOM_CENTER,
                    isTesting: !relase, // TODO: remove this line when release
                    overlap: true,
                    offsetTopBar: false,
                    bgColor: 'black'
                });

                // this will load a full screen ad on startup
                /*
                AdMob.prepareInterstitial({
                    adId: admobid.interstitial,
                    isTesting: true, // TODO: remove this line when release
                    autoShow: true
                });*/

            } else {
                console.log("ADMOB not started!");
            }
        }catch(e){
            console.log("ADMOB Error:");
            console.log(e);
        }
        //Tr.load();
        Vm.start(true);
        
        //document.getElementById("ssss").innerHTML = userLang;
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();