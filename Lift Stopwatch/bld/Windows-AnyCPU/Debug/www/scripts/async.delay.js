// aSync w/ delay Script Starter By TooMeeNoo (v.: 2.3)
function aSync(fname, delay, params, onfinish)
{
    try{
        delay=((undefined===delay)||delay<0||isNaN(delay))?0:delay; 
        (undefined === onfinish)?
            (
                (undefined === params) ?
                setTimeout(fname,delay)
                :
                setTimeout(function () {
                    fname(params)
                }, delay)
            )
            :
            setTimeout(function () {
                onfinish(fname(params));
            },delay);
    } catch (e) {
        return e;
    }
	return true;
};