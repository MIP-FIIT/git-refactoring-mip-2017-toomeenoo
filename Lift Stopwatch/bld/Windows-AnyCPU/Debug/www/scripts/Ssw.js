var relase = false;

var Ssw = {
	data: {
		ttime: 2,//TODO setup default 2
		wtime: 5,
		end: 0,
		start: 0,
		loop: 0,
		stc: 3,
		infinity: false,
		animOk: false,
		paused: false,
	},
	set: function(id, val){
		//if(id="wtime") // Add support for MM:SS TODO
		var tmp = val.replace(",", ".");
		val = parseFloat(tmp);
		if(isNaN(val) || val<=0)
			return;
		if(id=="tempo"){
			Ssw.data.ttime = val;
			Util.id("tpm").value=Math.round((60/val)*100)/100;
		}else if(id=="tpm"){
			Ssw.data.ttime = val = 60 / val;
			Util.id("tempo").value=Math.round(val*100)/100;
		}else if(id=="tcount"){
			Ssw.data.wtime = val = (val*Ssw.data.ttime)/60;
			Util.id("wtime").value=Math.round(val*100)/100;
			Util.id("totime").style.transform="rotate("+((360/60)*val)+"deg)";
		}else if(id=="wtime"){
			Ssw.data.wtime = val;
			var num = (Ssw.data.wtime*60)/Ssw.data.ttime;
			Util.id("tcount").value=Math.round(num*100)/100;
			Util.id("totime").style.transform="rotate("+((360/60)*val)+"deg)";
		};
	},
    /*preStart: function () {

          -- DONE by ViewManager
	    Util.id("settings").style.top = "100%";
	    Util.id("wr").style.filter = "blur(0px)";
	    Util.id("text").style.filter = "blur(0px)";
	    setTimeout(function () { Util.id("settings").style.display = "none"; }, 200);
	    Ssw.countdown();

	},*/
	countdown: function () {
	    if (Ssw.data.paused) {
	        Util.id("stc").style.display = "block";
	        Util.id("ball").style.display = "none";
	        Ssw.data.stc = 3;//DEFAULT
	        Ssw.data.paused = false;
	        return;
	    }
	    if (Ssw.data.stc > 0) {
	        Util.id("stc").innerHTML = Ssw.data.stc;
	        Ssw.data.stc--;
	        setTimeout(Ssw.countdown, 1000);
	    } else {
	        Util.id("stc").style.display = "none";
	        Util.id("ball").style.display = "block";
	        Ssw.start();
	    }
	},
	start: function () {
	    //VM callback keep screen on
	    Vm.sleep(false);

		var time = Ssw.data.wtime * 60000;
		var minRot = Ssw.data.wtime * 6;
		var secRot = Ssw.data.wtime * 360;
		Ssw.data.loop = Math.round(Ssw.data.ttime*1000);
		Util.id("min").style.transitionDuration=time+"ms";
		Util.id("sec").style.transitionDuration=time+"ms";
		Util.id("min").style.transform="rotate("+minRot+"deg)";
		Util.id("sec").style.transform = "rotate(" + secRot + "deg)";
		if (Ssw.data.animOk) {
		    Util.id("bh").style.animationDuration = Ssw.data.loop + "ms";
		    var now = new Date();
		    Ssw.data.start = now.getTime();
		    Ssw.data.end = now.getTime() + time
		} else {
		    Util.id("bh").style.top = "-75%";
		    Util.id("bh").style.transition = "top ease-in-out " + (Ssw.data.loop / 2) + "ms";
		    var now = new Date();
		    Ssw.data.start = now.getTime();
		    Ssw.data.end = now.getTime() + time
		    Ssw.jsLoop((Ssw.data.loop / 2), 25);
		}
		Ssw.showTime();
	},
	showTime: function () {
	    if (Ssw.data.paused)
	        return;
		var start = Ssw.data.start;
		var end = Ssw.data.end;
		var loop =  Ssw.data.loop;
		var now = new Date().getTime();
		if(now>end){
			var data = [false];
		}else{
			var a = end-now;
			var loops = Math.floor((now-start)/loop);
			var perc = Math.round(((now-start)/(end-start))*100);
			var remMin = Math.floor(a/60000);
			var remSec = Math.floor((a-remMin*60000)/1000);
			var remMs = Math.round(((a-remMin*60000)-remSec*1000) /10);
			var data = [true, remMin, remSec, remMs, loops, perc];
		}
		if (data[0]) {

		    Util.id("time").innerHTML =
                Ssw.data.infinity?
                 (1439 - data[1]) + ":" + Ssw.lz(59 - data[2]) + "." + Ssw.lz(99 - data[3]) :
		         data[1] + ":" + Ssw.lz(data[2]) + "." + Ssw.lz(data[3]);
		    Util.id("total").innerHTML = data[4] + (Ssw.data.infinity? "x" : "x  (" + data[5] + "%)");
		    aSync(Ssw.showTime);
		}else{
			Util.id("bh").style.animationDuration = "";
			Util.id("time").innerHTML = "0:00.00";
			Util.id("total").innerHTML = Math.round((Ssw.data.end - Ssw.data.start) / Ssw.data.loop) + " (100%)";

		    //VM callback keep screen on
			Vm.sleep(true);
		}
	},
	jsLoop: function (delay, dir) {
	    Util.id("bh").style.top = "-" + dir + "%";
	    var now = new Date().getTime();
	    //console.log(delay + " " + dir + " " + now + " " + Ssw.data.end)
	    if (now < Ssw.data.end) {
	        jsTim = setTimeout(function () {
	            Ssw.jsLoop(delay, ((dir == 75) ? 25 : 75));
	        }, delay);
	    } else {
	        Util.id("bh").style.top = "-50%";
	    }
	},
	lz: function (num) {//Leading zero
	    if (num == 0)
	        return "00";
	    if (num < 10)
	        return "0" + num;
	    return num;
	},
	moveOne: function (eid, up) {
	    var val = Util.id(eid).value;
	    var tmp = val.replace(",", ".");
	    val = parseFloat(tmp);
	    if (isNaN(val) || (undefined === val) || ("" == val))
	        val = 0;
	    if (val != Math.round(val))
	        val = (up) ? Math.ceil(val) : Math.floor(val);
        else
	        (up) ? val++ : val--;
	    if (val < 0)
	        val = 0;
	    Util.id(eid).value = val;
	    Ssw.set(eid, Util.id(eid).value);
	},
	reset: function(){
	    Ssw.data = {
	        ttime: 2, wtime: 5, end: 0, start: 0, loop: 0,
	        stc: 3, infinity: false, animOk: false, paused: true,
	    };
	    try { clearTimeout(jsTim) } catch (e) { };
	    Util.id("min").style.transitionDuration = "0ms";
	    Util.id("sec").style.transitionDuration = "0ms";
	    Util.id("min").style.transform = "rotate(0deg)";
	    Util.id("sec").style.transform = "rotate(0deg)";
	    Util.id("stc").style.display = "block";
	    Util.id("ball").style.display = "none";
	    Util.id("time").innerHTML = "0:0.0";
	    Util.id("bh").style.transition = "top ease-in-out 0ms";
	    setTimeout(function () {
	        Util.id("total").innerHTML = "0&nbsp;(0%)";
	        Util.id("bh").style.top = "-50%";
	    }, 10);
	},
	pause: function () {
	    if (Ssw.data.end > 0) {
	        if (!Ssw.data.paused) {
	            Ssw.data.paused = true;
	            //VM callback keep screen on
	            Vm.sleep(true);

                //Change text
	            Util.id("pauseBtn").innerHTML = lang[Vm.data.lid][13];

	            var pt = new Date().getTime();
	            var rt = Ssw.data.end - pt;
	            var time = Ssw.data.wtime * 60000;
	            var minRot = Ssw.data.wtime * 6 * ((pt - Ssw.data.start) / (Ssw.data.end - Ssw.data.start));
	            var secRot = Ssw.data.wtime * 360 * ((pt - Ssw.data.start) / (Ssw.data.end - Ssw.data.start));

	            Util.id("min").style.transitionDuration = "0ms";
	            Util.id("sec").style.transitionDuration = "0ms";
	            Util.id("min").style.transform = "rotate(" + minRot + "deg)";
	            Util.id("sec").style.transform = "rotate(" + secRot + "deg)";

                if(Ssw.data.animOk)
                    Util.id("bh").style.animationDuration = "";

	            Ssw.data.start = [minRot, secRot];//Store rotation
	            Ssw.data.end = rt;//Store remaining time
	        } else {
	            //VM callback keep screen on
	            Vm.sleep(false);

                //change text
	            Util.id("pauseBtn").innerHTML = lang[Vm.data.lid][16];

	            Ssw.data.paused = false;
	            var minRot = Ssw.data.wtime * 6;
	            var secRot = Ssw.data.wtime * 360;
	            Util.id("min").style.transitionDuration = Ssw.data.end+"ms";
	            Util.id("sec").style.transitionDuration = Ssw.data.end+"ms";
	            Util.id("min").style.transform = "rotate(" + (minRot) + "deg)";
	            Util.id("sec").style.transform = "rotate(" + (secRot) + "deg)";

	            if (Ssw.data.animOk)
	                Util.id("bh").style.animationDuration = Math.round(Ssw.data.ttime * 1000) + "ms";

	            //turn back time! :D 
	            Ssw.data.end += new Date().getTime();
	            Ssw.data.start = Ssw.data.end - Math.round(Ssw.data.wtime * 60000);
	            Ssw.showTime();
	            if (!Ssw.data.animOk)
	                Ssw.jsLoop((Ssw.data.loop / 2), 25);
	        };
	    };
	},
};

//ADDED CODE
Util = {
    id: function(key){
        return document.getElementById(key);
    },
    db: {
        store: function (name, val) {
            localStorage.setItem(name, val);
        },
        get: function (name, def) {
            if (Util.empty(localStorage.getItem(name)))
                return def;
            return localStorage.getItem(name);
        }
    },
    loadVars: function () {
        var tt = Util.db.get("ttime", 2);
        var wt = Util.db.get("wtime", 5);
        Util.id("tempo").setAttribute("placeholder", tt);
        Util.id("tpm").setAttribute("placeholder", 60 / tt);
        Util.id("tcount").setAttribute("placeholder", (60 * wt) / tt);
        Util.id("wtime").setAttribute("placeholder", wt);
        Ssw.data.ttime = tt;
        Ssw.data.wtime = wt;
    },
    setVars: function () {
        Util.db.store("ttime", Ssw.data.ttime);
        Util.db.store("ttime", Ssw.data.wtime);
    },
    prepare: function (screen, data) {
        if (screen == "setup1") {
            Util.loadVars();
            Ssw.data.infinity = data;
            if (data){
                Util.id("stp1btn").innerHTML = lang[Vm.data.lid][13];
            } else {
                Util.id("stp1btn").innerHTML = lang[Vm.data.lid][9];
            }
        } else if (screen == "setup2") {
            if (Ssw.data.infinity) {
                Ssw.data.paused = false;
                Ssw.data.wtime = 1440;
                return Vm.openView('stopwatch', false, Ssw.countdown);
            }
            if (Util.empty(Util.id("tempo").value))
                Util.id("tempo").value = Ssw.data.ttime;
            Util.id("tcount").setAttribute("placeholder", (60 * Ssw.data.wtime) / Util.id("tempo").value);
        };
        Vm.goto(screen);
    },
    empty: function (variable) {
        return (typeof variable === "undefined") || (variable == null) || (variable.length === 0);
    }
}


//REMOVE
if (!relase)
    document.addEventListener("keydown", function (e) { if (e.key == "l") { Vm.start(true); } });
