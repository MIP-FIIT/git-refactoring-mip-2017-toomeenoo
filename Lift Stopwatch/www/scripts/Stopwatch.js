var relase = false;

var Stopwatch = {
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
			Stopwatch.data.ttime = val;
			Util.id("tpm").value=Math.round((60/val)*100)/100;
		}else if(id=="tpm"){
			Stopwatch.data.ttime = val = 60 / val;
			Util.id("tempo").value=Math.round(val*100)/100;
		}else if(id=="tcount"){
			Stopwatch.data.wtime = val = (val*Stopwatch.data.ttime)/60;
			Util.id("wtime").value=Math.round(val*100)/100;
			Util.id("totime").style.transform="rotate("+((360/60)*val)+"deg)";
		}else if(id=="wtime"){
			Stopwatch.data.wtime = val;
			var num = (Stopwatch.data.wtime*60)/Stopwatch.data.ttime;
			Util.id("tcount").value=Math.round(num*100)/100;
			Util.id("totime").style.transform="rotate("+((360/60)*val)+"deg)";
		};
	},
	countdown: function () {
	    if (Stopwatch.data.paused) {
	        Util.id("stc").style.display = "block";
	        Util.id("ball").style.display = "none";
	        Stopwatch.data.stc = 3;//DEFAULT
	        Stopwatch.data.paused = false;
	        return;
	    }
	    if (Stopwatch.data.stc > 0) {
	        Util.id("stc").innerHTML = Stopwatch.data.stc;
	        Stopwatch.data.stc--;
	        setTimeout(Stopwatch.countdown, 1000);
	    } else {
	        Util.id("stc").style.display = "none";
	        Util.id("ball").style.display = "block";
	        Stopwatch.start();
	    }
	},
	start: function () {
	    //VM callback keep screen on
	    ViewManager.sleep(false);

		var time = Stopwatch.data.wtime * 60000;
		var minRot = Stopwatch.data.wtime * 6;
		var secRot = Stopwatch.data.wtime * 360;
		Stopwatch.data.loop = Math.round(Stopwatch.data.ttime*1000);
		Util.id("min").style.transitionDuration=time+"ms";
		Util.id("sec").style.transitionDuration=time+"ms";
		Util.id("min").style.transform="rotate("+minRot+"deg)";
		Util.id("sec").style.transform = "rotate(" + secRot + "deg)";
		if (Stopwatch.data.animOk) {
		    Util.id("bh").style.animationDuration = Stopwatch.data.loop + "ms";
		    var now = new Date();
		    Stopwatch.data.start = now.getTime();
		    Stopwatch.data.end = now.getTime() + time
		} else {
		    Util.id("bh").style.top = "-75%";
		    Util.id("bh").style.transition = "top ease-in-out " + (Stopwatch.data.loop / 2) + "ms";
		    var now = new Date();
		    Stopwatch.data.start = now.getTime();
		    Stopwatch.data.end = now.getTime() + time
		    Stopwatch.jsLoop((Stopwatch.data.loop / 2), 25);
		}
		Stopwatch.showTime();
	},
	showTime: function () {
	    if (Stopwatch.data.paused)
	        return;
		var start = Stopwatch.data.start;
		var end = Stopwatch.data.end;
		var loop =  Stopwatch.data.loop;
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
                Stopwatch.data.infinity?
                 (1439 - data[1]) + ":" + Stopwatch.lz(59 - data[2]) + "." + Stopwatch.lz(99 - data[3]) :
		         data[1] + ":" + Stopwatch.lz(data[2]) + "." + Stopwatch.lz(data[3]);
		    Util.id("total").innerHTML = data[4] + (Stopwatch.data.infinity? "x" : "x  (" + data[5] + "%)");
		    aSync(Stopwatch.showTime);
		}else{
			Util.id("bh").style.animationDuration = "";
			Util.id("time").innerHTML = "0:00.00";
			Util.id("total").innerHTML = Math.round((Stopwatch.data.end - Stopwatch.data.start) / Stopwatch.data.loop) + " (100%)";

		    //VM callback keep screen on
			ViewManager.sleep(true);
		}
	},
	jsLoop: function (delay, dir) {
	    Util.id("bh").style.top = "-" + dir + "%";
	    var now = new Date().getTime();
	    //console.log(delay + " " + dir + " " + now + " " + Stopwatch.data.end)
	    if (now < Stopwatch.data.end) {
	        jsTim = setTimeout(function () {
	            Stopwatch.jsLoop(delay, ((dir == 75) ? 25 : 75));
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
	    Stopwatch.set(eid, Util.id(eid).value);
	},
	reset: function(){
	    Stopwatch.data = {
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
	    if (Stopwatch.data.end > 0) {
	        if (!Stopwatch.data.paused) {
	            Stopwatch.data.paused = true;
	            //VM callback keep screen on
	            ViewManager.sleep(true);

                //Change text
	            Util.id("pauseBtn").innerHTML = lang[ViewManager.data.lid][13];

	            var pt = new Date().getTime();
	            var rt = Stopwatch.data.end - pt;
	            var time = Stopwatch.data.wtime * 60000;
	            var minRot = Stopwatch.data.wtime * 6 * ((pt - Stopwatch.data.start) / (Stopwatch.data.end - Stopwatch.data.start));
	            var secRot = Stopwatch.data.wtime * 360 * ((pt - Stopwatch.data.start) / (Stopwatch.data.end - Stopwatch.data.start));

	            Util.id("min").style.transitionDuration = "0ms";
	            Util.id("sec").style.transitionDuration = "0ms";
	            Util.id("min").style.transform = "rotate(" + minRot + "deg)";
	            Util.id("sec").style.transform = "rotate(" + secRot + "deg)";

                if(Stopwatch.data.animOk)
                    Util.id("bh").style.animationDuration = "";

	            Stopwatch.data.start = [minRot, secRot];//Store rotation
	            Stopwatch.data.end = rt;//Store remaining time
	        } else {
	            //VM callback keep screen on
	            ViewManager.sleep(false);

                //change text
	            Util.id("pauseBtn").innerHTML = lang[ViewManager.data.lid][16];

	            Stopwatch.data.paused = false;
	            var minRot = Stopwatch.data.wtime * 6;
	            var secRot = Stopwatch.data.wtime * 360;
	            Util.id("min").style.transitionDuration = Stopwatch.data.end+"ms";
	            Util.id("sec").style.transitionDuration = Stopwatch.data.end+"ms";
	            Util.id("min").style.transform = "rotate(" + (minRot) + "deg)";
	            Util.id("sec").style.transform = "rotate(" + (secRot) + "deg)";

	            if (Stopwatch.data.animOk)
	                Util.id("bh").style.animationDuration = Math.round(Stopwatch.data.ttime * 1000) + "ms";

	            //turn back time! :D 
	            Stopwatch.data.end += new Date().getTime();
	            Stopwatch.data.start = Stopwatch.data.end - Math.round(Stopwatch.data.wtime * 60000);
	            Stopwatch.showTime();
	            if (!Stopwatch.data.animOk)
	                Stopwatch.jsLoop((Stopwatch.data.loop / 2), 25);
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
        Stopwatch.data.ttime = tt;
        Stopwatch.data.wtime = wt;
    },
    setVars: function () {
        Util.db.store("ttime", Stopwatch.data.ttime);
        Util.db.store("ttime", Stopwatch.data.wtime);
    },
    prepare: function (screen, data) {
        if (screen == "setup1") {
            Util.loadVars();
            Stopwatch.data.infinity = data;
            if (data){
                Util.id("stp1btn").innerHTML = lang[ViewManager.data.lid][13];
            } else {
                Util.id("stp1btn").innerHTML = lang[ViewManager.data.lid][9];
            }
        } else if (screen == "setup2") {
            if (Stopwatch.data.infinity) {
                Stopwatch.data.paused = false;
                Stopwatch.data.wtime = 1440;
                return ViewManager.openView('stopwatch', false, Stopwatch.countdown);
            }
            if (Util.empty(Util.id("tempo").value))
                Util.id("tempo").value = Stopwatch.data.ttime;
            Util.id("tcount").setAttribute("placeholder", (60 * Stopwatch.data.wtime) / Util.id("tempo").value);
        };
        ViewManager.goto(screen);
    },
    empty: function (variable) {
        return (typeof variable === "undefined") || (variable == null) || (variable.length === 0);
    }
}


//REMOVE
if (!relase)
    document.addEventListener("keydown", function (e) { if (e.key == "l") { ViewManager.start(true); } });
