//ViewManager by TooMeenoo
// plus lang
//async.delay required
var ViewManager = {
    data: {
        animDir: ["lt", "rt"], //Animation direction [from,to] "lt" "rt" "up" "dn" "ok"
        toOpacity: 0, //Animaition to transparent (0-1)
        animTime: 300, // ms, same in css

        ldef:  ["en", "sk", "cs"],//Language definition (if defined)
        lid: 0, //default language
        translatedClass: "txt",//User defined
        translatedRepeat: "txts",//for data-translate-id (for repeated strings)
        //Call with language data in ViewManager.start() to enable

        //SYSTEM
        inMove: 0,
        opened: "",
        callback: "",
    },
    goto: function (key) {
        ViewManager.openView(key, false, "");
    },
    goback: function () {
        var node = ViewManager.getView(ViewManager.data.opened)
        var parent = node.getAttribute("data-parent");
        ViewManager.openView(parent, true, "");
    },
    openView: function(key, back, callback){
        if (!ViewManager.data.inMove) {
            ViewManager.data.callback = callback;
            //console.log(ViewManager.data.callback.toString());
            var show = ViewManager.getView(key);
            var hide = ViewManager.getView(ViewManager.data.opened);
            if (!back) {
                show.setAttribute("data-parent", ViewManager.data.opened);
            };
            ViewManager.data.opened = key;
            ViewManager.setPos(ViewManager.cp(show, (back ? ViewManager.data.animDir[0] : ViewManager.data.animDir[1])));
            ViewManager.data.inMove += 2;
            ViewManager.enableAnim(show);
            ViewManager.enableAnim(hide);
            aSync(ViewManager.animate, 15, ViewManager.cp(hide, (back ? ViewManager.data.animDir[1] : ViewManager.data.animDir[0])), ViewManager.exitAnim);
            aSync(ViewManager.animate, 15, ViewManager.cp(show, "ok"), ViewManager.exitAnim);
        }
    },
    //System Code
    cp: function (node, position) { //create params shorthand
        if (position == "ok")
            return [node, 1, 0, 0];
        if (position == "rt")
            return [node, ViewManager.data.toOpacity, 0, 100];
        if (position == "lt")
            return [node, ViewManager.data.toOpacity, 0, -100];
        if (position == "dn")
            return [node, ViewManager.data.toOpacity, 100, 0];
        if (position == "up")
            return [node, ViewManager.data.toOpacity, -100, 0];
    },

    setPos: function (p) {
        p[0].style.opacity = p[1];
        p[0].style.top = p[2] + "%";
        p[0].style.left = p[3] + "%";
        p[0].style.display="block";
    },
    enableAnim: function(block){ //EXTENDED SETTINGS
        block.style.display = "block";
        block.style.transitionDuration = ViewManager.data.animTime + "ms";
        block.style.transitionDelay = "0ms";
        block.style.transitionProperty = "all";
        block.style.transitionTimingFunction = "ease-in";
    },
    start: function (enableLang) {
        var block = ViewManager.getView(0);
        ViewManager.data.opened = 0;
        ViewManager.enableAnim(block);
        ViewManager.data.inMove ++;
        aSync(ViewManager.animate, 10, ViewManager.cp(block, "ok"), ViewManager.exitAnim);
        if (typeof enableLang !== "undefined" && enableLang) {
            //Language load (auto)
            var userLang = navigator.language || navigator.userLanguage;
            ViewManager.getCurrLid(userLang);
            ViewManager.translate();
        }
    },
    getView: function(key){
        //Key should be id or #order in array
        if (undefined === key.lenght)
            return document.getElementsByClassName("view")[key];
        return document.getElementById(key);
    },
    animate: function (d) {
        var node = d[0], opacity = d[1], top = d[2], left = d[3];
        node.style.opacity = opacity;
        node.style.top = top + "%";
        node.style.left = left + "%";
        return node;
    },
    fs: function () {//re-enable fullscreen
        setTimeout(function () {
            try {
                AndroidFullScreen.immersiveMode();
                Fullscreen.on();
            } catch (e) {
                //free
            };
        }, 10);
    },
    sleep: function (enable) {
        try {
            if (enable)
                window.plugins.insomnia.allowSleepAgain();
            else
                window.plugins.insomnia.keepAwake();
        } catch (e) { };
    },
    exitAnim: function (node) {
        setTimeout(function () {
            node.style.transition = "";
            ViewManager.data.inMove--;
            if (parseInt(node.style.opacity) == 0)
                node.style.display = "none";
            if ((!ViewManager.data.inMove)&&(ViewManager.data.callback.toString().length > 0)) {
                ViewManager.data.callback();
            }
        }, ViewManager.data.animTime)
    },
    translate: function (){
        list = document.getElementsByClassName(ViewManager.data.translatedClass);
        var i =0;
        while (i < list.length) {
            //console.log(i + ": " + list[i].innerHTML + "  //" + lang[ViewManager.data.lid][i]);
            list[i].innerHTML = lang[ViewManager.data.lid][i];
            i++;
        };
        list = document.getElementsByClassName(ViewManager.data.translatedRepeat);
        var i = 0;
        while (i < list.length) {
            list[i].innerHTML = lang[ViewManager.data.lid][list[i].getAttribute("data-translate-id")];
            i++;
        };
    },
    getCurrLid: function (langName){
        var i = 0;
        while (i < ViewManager.data.ldef.length) {
            if (langName.indexOf(ViewManager.data.ldef[i]) >= 0)
                return ViewManager.data.lid = i;
            i++;
        }
    },
};


//Keyboard manager 
/*
Vkb = {
    open: function () {
        document.getElementById("keyboard").style.bottom = "0%";
    }
};
*/