//ViewManager by TooMeenoo
// plus lang
//async.delay required
var Vm = {
    data: {
        animDir: ["lt", "rt"], //Animation direction [from,to] "lt" "rt" "up" "dn" "ok"
        toOpacity: 0, //Animaition to transparent (0-1)
        animTime: 300, // ms, same in css

        ldef:  ["en", "sk", "cs"],//Language definition (if defined)
        lid: 0, //default language
        translatedClass: "txt",//User defined
        translatedRepeat: "txts",//for data-translate-id (for repeated strings)
        //Call with language data in Vm.start() to enable

        //SYSTEM
        inMove: 0,
        opened: "",
        callback: "",
    },
    goto: function (key) {
        Vm.openView(key, false, "");
    },
    goback: function () {
        var node = Vm.getView(Vm.data.opened)
        var parent = node.getAttribute("data-parent");
        Vm.openView(parent, true, "");
    },
    openView: function(key, back, callback){
        if (!Vm.data.inMove) {
            Vm.data.callback = callback;
            //console.log(Vm.data.callback.toString());
            var show = Vm.getView(key);
            var hide = Vm.getView(Vm.data.opened);
            if (!back) {
                show.setAttribute("data-parent", Vm.data.opened);
            };
            Vm.data.opened = key;
            Vm.setPos(Vm.cp(show, (back ? Vm.data.animDir[0] : Vm.data.animDir[1])));
            Vm.data.inMove += 2;
            Vm.enableAnim(show);
            Vm.enableAnim(hide);
            aSync(Vm.animate, 15, Vm.cp(hide, (back ? Vm.data.animDir[1] : Vm.data.animDir[0])), Vm.exitAnim);
            aSync(Vm.animate, 15, Vm.cp(show, "ok"), Vm.exitAnim);
        }
    },
    //System Code
    cp: function (node, position) { //create params shorthand
        if (position == "ok")
            return [node, 1, 0, 0];
        if (position == "rt")
            return [node, Vm.data.toOpacity, 0, 100];
        if (position == "lt")
            return [node, Vm.data.toOpacity, 0, -100];
        if (position == "dn")
            return [node, Vm.data.toOpacity, 100, 0];
        if (position == "up")
            return [node, Vm.data.toOpacity, -100, 0];
    },

    setPos: function (p) {
        p[0].style.opacity = p[1];
        p[0].style.top = p[2] + "%";
        p[0].style.left = p[3] + "%";
        p[0].style.display="block";
    },
    enableAnim: function(block){ //EXTENDED SETTINGS
        block.style.display = "block";
        block.style.transitionDuration = Vm.data.animTime + "ms";
        block.style.transitionDelay = "0ms";
        block.style.transitionProperty = "all";
        block.style.transitionTimingFunction = "ease-in";
    },
    start: function (enableLang) {
        var block = Vm.getView(0);
        Vm.data.opened = 0;
        Vm.enableAnim(block);
        Vm.data.inMove ++;
        aSync(Vm.animate, 10, Vm.cp(block, "ok"), Vm.exitAnim);
        if (typeof enableLang !== "undefined" && enableLang) {
            //Language load (auto)
            var userLang = navigator.language || navigator.userLanguage;
            Vm.getCurrLid(userLang);
            Vm.translate();
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
            Vm.data.inMove--;
            if (parseInt(node.style.opacity) == 0)
                node.style.display = "none";
            if ((!Vm.data.inMove)&&(Vm.data.callback.toString().length > 0)) {
                Vm.data.callback();
            }
        }, Vm.data.animTime)
    },
    translate: function (){
        list = document.getElementsByClassName(Vm.data.translatedClass);
        var i =0;
        while (i < list.length) {
            //console.log(i + ": " + list[i].innerHTML + "  //" + lang[Vm.data.lid][i]);
            list[i].innerHTML = lang[Vm.data.lid][i];
            i++;
        };
        list = document.getElementsByClassName(Vm.data.translatedRepeat);
        var i = 0;
        while (i < list.length) {
            list[i].innerHTML = lang[Vm.data.lid][list[i].getAttribute("data-translate-id")];
            i++;
        };
    },
    getCurrLid: function (langName){
        var i = 0;
        while (i < Vm.data.ldef.length) {
            if (langName.indexOf(Vm.data.ldef[i]) >= 0)
                return Vm.data.lid = i;
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