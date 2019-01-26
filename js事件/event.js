function bind(curEle,eventType,eventFn){
	if (curEle.addEventListener) {
		curEle.addEventListener(eventType,eventFn,false)
		return;
	}

	var tempFn = function(){
		eventFn.call(curEle);
	}

	tempFn.photo = eventFn;

	!curEle["mybind"+eventType] ? curEle["mybind"+eventType] = [] : null;

	var ary = curEle["mybind"+eventType];
	for (var i = 0; i < ary.length; i++) {
		if (ary[i].photo === eventFn) {
			return;
		}
	}

	curEle["mybind"+eventType].push(tempFn);

	curEle.attachEvent("on"+eventType,tempFn);

}

function unbind(curEle,eventType,eventFn){
	if (curEle.removeEventListener) {
		curEle.addEventListener(eventType,eventFn,false)
		return;
	}

	var ary = curEle["mybind"+eventType];

	if (ary) {
		for(var i = 0; i < ary.length; i++) {
			if( ary[i].photo === eventFn ) {
				curEle.detachEvent("on"+eventType,ary[i]);
				ary.splice(i,1);
				break;
			}
		}
	}
}


function on(curEle,eventType,eventFn){
	!curEle["myEvent" + eventType] ? curEle["myEvent" + eventType] = [] : null;
	var ary = curEle["myEvent" + eventType];
	for (var i = 0; i < ary.length; i++) {
		if(ary[i] === eventFn){
			return;
		}
	}
	ary.push(eventFn)
	bind(curEle,eventType,run)
}

function off(curEle,eventType,eventFn){
	var ary = curEle["myEvent" + eventType];
	if (ary) {
		for (var i = 0; i < ary.length; i++) {
			if(ary[i] === eventFn){
				ary[i] = null;
			}
		}
	}
}

function run(e){
	e = e || window.event;
    if (window.event) {
        e.target = e.srcElement;
        e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
        e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
        e.preventDefault = function () {
            e.returnValue = false;
        };
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };
    }

    var ary = this["myEvent" + e.type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            var curFn = ary[i];
            if (typeof curFn === "function") {
                curFn.call(this, e);
            } else {
                //->把off中赋值为null的哪些项给删除掉
                ary.splice(i, 1);
                i--;
            }
        }
    }
}