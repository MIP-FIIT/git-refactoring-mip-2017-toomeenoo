var relase = false;
var Stopwatch = {
	config: {
		upPosition: 25,
		dnPosition: 75,
		rangeUp: {from:1, to:15, precision: 0.5},
		rangeDn: {from:1, to:15, precision: 0.5},
		rangeTimes: {from:1, to:500, precision: 1},
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
	        setTimeout(Stopwatch.start, 10);
	    }
	},
	start: function () {
	    //VM callback keep screen on
	    ViewManager.sleep(false);
		
		//Add load
		try{
			AdMob.prepareInterstitial({
					adId:admobid.interstitial,
					autoShow: false,
				});
		}catch(e){};
				
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
		Stopwatch.jsLoop(false);
		
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
			try{
				AdMob.showInterstitial()
			}catch(e){};
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
				Stopwatch.jsLoop(false);
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
        get: function (name, def, num) {
            if (Util.empty(localStorage.getItem(name)))
                return def;
			if(num)
            	return parseFloat(localStorage.getItem(name));
            return localStorage.getItem(name);
        }
    },
    loadVars: function () {
        var up = Util.db.get("up", 0, 1);
        var down = Util.db.get("down", 0, 1);
        var duration = Util.db.get("dur", 0, 1);
		
		//Set range to loaded values
		Range.set(Util.id("tempoUpRange"), up);
		Range.set(Util.id("tempoDnRange"), down);
		Range.set(Util.id("durationRange"), duration);
		
		//Load data to stopwacth and display
		Util.interactions.setTempoUp(up, 1)
		Util.interactions.setTempoDn(down, 1)
		Util.interactions.setDuration(duration);
    },
    setVars: function () {
        Util.db.store("up", Range.get(Util.id("tempoUpRange")));
        Util.db.store("down", Range.get(Util.id("tempoDnRange")));
        Util.db.store("dur", Range.get(Util.id("durationRange")));
    },
    prepare: function (screen, data) {
        if (screen == "setup1") {
            Stopwatch.data.infinity = data;
            if (data){
                Util.id("stp1btn").innerHTML = lang[ViewManager.data.lid][13];
            } else {
                Util.id("stp1btn").innerHTML = lang[ViewManager.data.lid][9];
            }
			return ViewManager.openView(screen, false, Util.loadVars);
        } else if (screen == "setup2") {
            if (Stopwatch.data.infinity) {
                Stopwatch.data.paused = false;
                Stopwatch.data.duration = 1440;
                return ViewManager.openView('stopwatch', false, Stopwatch.countdown);
            }else{
				return ViewManager.openView(screen, false, function(){
					Range.restyle(Util.id("durationRange"));
				});
			}
        } else if (screen == "stopwatch") {
            Stopwatch.data.paused = false; 
			Util.setVars();
			return ViewManager.openView('stopwatch', false, Stopwatch.countdown);
        };
		ViewManager.goto(screen);
    },
    empty: function (variable) {
        return (typeof variable === "undefined") || (variable == null) || (variable.length === 0);
    },
	interactions: {
		//Only parameter for setting only Fn's value
		setTempoUp: function(perc, only){
			Stopwatch.data.tempoUp = Stopwatch.config.defaultData.tempoUp = Util.helpers.percToVal(perc, Stopwatch.config.rangeUp);
			Util.helpers.displayTempo();
			if(!only)
				Util.interactions.setDuration(Util.db.get("dur", 0, 1));
		},
		setTempoDn: function(perc, only){
			Stopwatch.data.tempoDn = Stopwatch.config.defaultData.tempoDn = Util.helpers.percToVal(perc, Stopwatch.config.rangeDn);
			Util.helpers.displayTempo();
			if(!only)
				Util.interactions.setDuration(Util.db.get("dur", 0, 1));
		},
		setDuration: function(perc){
			var repeats = Util.helpers.percToVal(perc, Stopwatch.config.rangeTimes);
			var duration = (Stopwatch.data.tempoDn+Stopwatch.data.tempoUp)*repeats;
			Stopwatch.data.duration = Stopwatch.config.defaultData.duration = duration;
			Util.helpers.displayDuration(duration, repeats);
		},
	},
	helpers: {
		percToVal: function(perc, min, max, precMul){//precision multipler
			if(typeof min == "object"){
				precMul = 1 / min.precision;
				max = min.to;
				min = min.from;
			}
			return min + Math.round((max-min)*(perc/100)*precMul)/precMul;
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
		var e = this.eventParse(event);
		this.updateF = updateF || false;
		this.finishF = finishF || false;
		this.node = node;
		this.touchLimits = node.getBoundingClientRect();
		var touchable = node.getElementsByTagName("div")[0];
		var touchableSizes = touchable.getBoundingClientRect();
		if(event.target == touchable){
			this.max = this.touchLimits.width - touchableSizes.width - 4;//border fix
			this.touch = e.x;
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
			this.touchLimits.top-this.configLimit > event.y ||
			this.touchLimits.bottom+this.configLimit < event.y ||
			this.touchLimits.left-this.configLimit > event.x ||
			this.touchLimits.right+this.configLimit < event.x 
		){
			console.log("Off limit", event.x, event.y, this.touchLimits.top-this.configLimit, this.touchLimits.bottom+this.configLimit, this.touchLimits.left-this.configLimit, this.touchLimits.right+this.configLimit);
			this.stop();
			return false;
		}
		return true
	},
	move: function(event){
		var e = this.eventParse(event);
		if(this.active && this.touchLimit(e)){
			this.last = this.limit(this.position+(e.x - this.touch));
			this.value = (this.last / this.max)*100;
			this.active.style.left = this.last+"px";
			if(this.updateF){
				this.updateF(this.value);
			}
		}
	},
	stop: function(){
		console.log("stop", this.active);
		this.position = this.last;
		this.touch = -1;
		this.active = false;
		this.node.setAttribute("data-value", this.value);
		if(this.finishF){
			this.finishF(this.value);
		}
	},
	eventParse: function(event){
		if(event.type.indexOf("touch")>=0){
			return {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
		}else{
			return {x: event.clientX, y: event.clientY};
		}
		
	},
	set: function(node, perc){
		var touchable = node.getElementsByTagName("div")[0];
		var tmp_max = node.getBoundingClientRect().width - touchable.getBoundingClientRect().width;
		touchable.style.left = (perc/100) * tmp_max + "px";
		node.setAttribute("data-value", perc);
	},
	get: function(node){
		return parseFloat(node.getAttribute("data-value"));
	},
	restyle: function(node){
		this.set(node, this.get(node));
	}
};

//REMOVE
if (!relase)
    document.addEventListener("keydown", function (e) { if (e.key == "l") { ViewManager.start(true); } });
