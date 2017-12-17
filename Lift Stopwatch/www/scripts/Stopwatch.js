var relase = false;
var Stopwatch = {
	config: {
		upPosition: 25,
		dnPosition: 75,
		defaultData: {
			tempoUp: 1,//seconds
			tempoDn: 1,//seconds
			duration: 1,//seconds
			end: 0,//unix ms
			start: 0,//unix ms
			countdown: 3,
			infinity: false,
			paused: false,
		}
	},
	data: {
		tempoUp: 2,//seconds
		tempoDn: 2,//seconds
		duration: 60,//seconds
		end: 0,//unix ms
		start: 0,//unix ms
		countdown: 3,
		infinity: false,
		paused: false,
	},
	countdown: function () {
	    if (Stopwatch.data.paused) {
	        Util.id("countdown").style.display = "block";
	        Util.id("ball").style.display = "none";
	        Stopwatch.data.countdown = 3;//DEFAULT
	        Stopwatch.data.paused = false;
	        return;
	    }
	    if (Stopwatch.data.countdown > 0) {
	        Util.id("countdown").innerHTML = Stopwatch.data.countdown;
	        Stopwatch.data.countdown--;
	        setTimeout(Stopwatch.countdown, 1000);
	    } else {
	        Util.id("countdown").style.display = "none";
			Util.id("bh").style.top = "-25%";
	        setTimeout(Stopwatch.start, 100);
	    }
	},
	start: function () {
	    //VM callback keep screen on
	    ViewManager.sleep(false);
		
	    Util.id("ball").style.display = "block";

		var time = Stopwatch.data.duration * 1000;
		var minRot = Stopwatch.data.duration * 0.1;
		var secRot = Stopwatch.data.duration * 6;
		
		Util.id("min").style.transitionDuration=time+"ms";
		Util.id("sec").style.transitionDuration=time+"ms";
		Util.id("min").style.transform="rotate("+minRot+"deg)";
		Util.id("sec").style.transform = "rotate(" + secRot + "deg)";

		Util.id("bh").style.transition = "top ease-in-out 0ms";
		var now = new Date();
		Stopwatch.data.start = now.getTime();
		Stopwatch.data.end = now.getTime() + time
		Stopwatch.jsLoop(true);
		
		Stopwatch.showTime();
	},
	showTime: function () {
	    if (Stopwatch.data.paused)
	        return;
		var start = Stopwatch.data.start;
		var end = Stopwatch.data.end;
		var loop = (Stopwatch.data.tempoDn+Stopwatch.data.tempoUp)*1000;
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
			Util.id("total").innerHTML = Math.round((Stopwatch.data.end - Stopwatch.data.start) / loop) + " (100%)";

		    //VM callback keep screen on
			ViewManager.sleep(true);
		}
	},
	jsLoop: function (up) {
		var dir, delay;
		if(up){
			dir = Stopwatch.config.upPosition;
			delay = Stopwatch.data.tempoDn;
		}else{
			dir = Stopwatch.config.dnPosition;
			delay = Stopwatch.data.tempoUp;
		}
		delay *= 1000;
	    Util.id("bh").style.top = "-" + dir + "%";
	    var now = new Date().getTime();
	   	Util.id("bh").style.transition = "top ease-in-out "+delay+"ms";
	    if (now < Stopwatch.data.end) {
	        jsTim = setTimeout(function () {
	            Stopwatch.jsLoop(!up);
	        }, delay);
	    } else {
	        Util.id("bh").style.top = "-25%";
	    }
	},
	lz: function (num) {//Leading zero
	    if (num == 0)
	        return "00";
	    if (num < 10)
	        return "0" + num;
	    return num;
	},
	reset: function(){
	    Stopwatch.data = Stopwatch.config.defaultData;
	    try { clearTimeout(jsTim) } catch (e) { };
	    Util.id("min").style.transitionDuration = "0ms";
	    Util.id("sec").style.transitionDuration = "0ms";
	    Util.id("min").style.transform = "rotate(0deg)";
	    Util.id("sec").style.transform = "rotate(0deg)";
	    Util.id("countdown").style.display = "block";
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
	            Util.id("pauseBtn").innerHTML = lang[ViewManager.data.lid][11];

	            var pauseTime = new Date().getTime();
	            var remainTime = Stopwatch.data.end - pauseTime;
	            var time = Stopwatch.data.duration * 1000;
	            var minRot = Stopwatch.data.duration * 0.1 * ((pauseTime - Stopwatch.data.start) / (Stopwatch.data.end - Stopwatch.data.start));
	            var secRot = Stopwatch.data.duration * 6 * ((pauseTime - Stopwatch.data.start) / (Stopwatch.data.end - Stopwatch.data.start));

	            Util.id("min").style.transitionDuration = "0ms";
	            Util.id("sec").style.transitionDuration = "0ms";
	            Util.id("min").style.transform = "rotate(" + minRot + "deg)";
	            Util.id("sec").style.transform = "rotate(" + secRot + "deg)";

	            Stopwatch.data.start = [minRot, secRot];//Store rotation
	            Stopwatch.data.end = remainTime;//Store remaining time
	        } else {
	            //VM callback keep screen on
	            ViewManager.sleep(false);

                //change text
	            Util.id("pauseBtn").innerHTML = lang[ViewManager.data.lid][14];

	            Stopwatch.data.paused = false;
	            var minRot = Stopwatch.data.duration * 0.1;
	            var secRot = Stopwatch.data.duration * 6;
	            Util.id("min").style.transitionDuration = Stopwatch.data.end+"ms";
	            Util.id("sec").style.transitionDuration = Stopwatch.data.end+"ms";
	            Util.id("min").style.transform = "rotate(" + (minRot) + "deg)";
	            Util.id("sec").style.transform = "rotate(" + (secRot) + "deg)";

	            //turn back time
	            Stopwatch.data.end += new Date().getTime();
	            Stopwatch.data.start = Stopwatch.data.end - Math.round(Stopwatch.data.duration * 1000);
	            Stopwatch.showTime();
				Stopwatch.jsLoop(true);
	        };
	    };
	},
};

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
        var up = Util.db.get("up", 2);
        var down = Util.db.get("down", 5);
        var duration = Util.db.get("dur", 5);/*
        Util.id("tempo").setAttribute("placeholder", tt);
        Util.id("tpm").setAttribute("placeholder", 60 / tt);
        Util.id("tcount").setAttribute("placeholder", (60 * wt) / tt);
        Util.id("wtime").setAttribute("placeholder", wt);
        Stopwatch.data.tempo = tt;
        Stopwatch.data.tempoUp = 1;
        Stopwatch.data.tempoDn = 1;
        Stopwatch.data.duration = wt;*/
    },
    setVars: function () {
        Util.db.store("ttime", Stopwatch.data.tempo);
        Util.db.store("ttime", Stopwatch.data.duration);
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
                Stopwatch.data.duration = 1440;
                return ViewManager.openView('stopwatch', false, Stopwatch.countdown);
            }
            /*if (Util.empty(Util.id("tempo").value))
                Util.id("tempo").value = Stopwatch.data.tempo;*/
            //Util.id("tcount").setAttribute("placeholder", (60 * Stopwatch.data.duration) / Util.id("tempo").value);
        };
        ViewManager.goto(screen);
    },
    empty: function (variable) {
        return (typeof variable === "undefined") || (variable == null) || (variable.length === 0);
    },
	interactions: {
		setTempoUp: function(perc){
			Stopwatch.data.tempoUp = Util.helpers.percToVal(perc, 1, 15, 2);
			Util.helpers.displayTempo();
			Util.interactions.setDuration(0);
		},
		setTempoDn: function(perc){
			Stopwatch.data.tempoDn = Util.helpers.percToVal(perc, 1, 15, 2);
			Util.helpers.displayTempo();
			Util.interactions.setDuration(0);
		},
		setDuration: function(perc){
			var repeats = Util.helpers.percToVal(perc, 1, 500, 1);
			var duration = (Stopwatch.data.tempoDn+Stopwatch.data.tempoUp)*repeats;
			Stopwatch.data.duration = duration;
			Util.helpers.displayDuration(duration, repeats);
		},
	},
	helpers: {
		percToVal: function(perc, min, max, prec){
			return min + Math.round((max-min)*(perc/100)*prec)/prec;
		},
		displayTempo: function(){
			Util.id("tempo_val").innerHTML = Stopwatch.data.tempoUp+"s / "+Stopwatch.data.tempoDn+"s";
		},
		displayDuration: function(duration, repeats){
			Util.id("duration_val").innerHTML = Util.helpers.sToMin(duration)+" min / "+repeats+" x";
		},
		sToMin: function(s){
			return Math.floor(s/60)+":"+Util.helpers.leadingZero(Math.round(s%60));
		},
		leadingZero: function(num){
			return Stopwatch.lz(num);
		}
	},
}

var Range = {
	configLimit: 10,
	
	node: false,
	active: false,
	position: 0,
	value: 0,
	touch: -1,
	last: 0,
	max: 0,
	touchLimits: {},
	updateF: false,
	finishF: false,
	
	start: function(node, event, finishF, updateF){
		this.updateF = updateF || false;
		this.finishF = finishF || false;
		this.node = node;
		this.touchLimits = node.getBoundingClientRect()
		var touchable = node.getElementsByTagName("div")[0];
		var touchableSizes = touchable.getBoundingClientRect();
		if(event.target == touchable){
			this.max = this.touchLimits.width - touchableSizes.width - 4;//border fix
			this.touch = event.x;
			this.position = touchableSizes.left-this.touchLimits.left;
			this.active = touchable;
		}
	},
	limit: function(value){
		if(value<0)
			value = 0;
		if(value>this.max)
			value = this.max;
		return value;
	},
	touchLimit: function(event){
		if(
			this.touchLimits.top-this.configLimit < event.y &&
			this.touchLimits.bottom+this.configLimit > event.y &&
			this.touchLimits.left-this.configLimit < event.x &&
			this.touchLimits.right+this.configLimit > event.x 
		){
			return true;
		}else{
			this.stop();
			return false;
		}
	},
	move: function(event){
		if(this.active && this.touchLimit(event)){
			this.last = this.limit(this.position+(event.x - this.touch));
			this.value = (this.last / this.max)*100;
			this.active.style.left = this.last+"px";
			if(this.updateF){
				this.updateF(this.value);
			}
		}
	},
	stop: function(){
		this.position = this.last;
		this.touch = -1;
		this.active = false;
		this.node.setAttribute("data-value", this.value);
		if(this.finishF){
			this.finishF(this.value);
		}
	},
	set: function(node, perc){
		var touchable = node.getElementsByTagName("div")[0];
		var tmp_max = node.getBoundingClientRect().width - touchable.getBoundingClientRect().width;
		touchable.style.left = (perc/100) * tmp_max + "px";
		node.setAttribute("data-value", perc);
	}
};

//REMOVE
if (!relase)
    document.addEventListener("keydown", function (e) { if (e.key == "l") { ViewManager.start(true); } });
