
let mytools = (function () {
	let flag = "getComputedStyle" in window; // 返回true的话代表不是IE6~8浏览器;


	function getCss(attr){
		let val = null, reg = null;
		if(flag) {
			val = window.getComputedStyle(this,null)[attr];
		}else{
			if (attr === "opacity") {
				val = this.currentStyle["filter"];
				reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
				val = reg.test(val)? reg.exec(val)[1] / 100 : 1;
			}else{
				val = this.currentStyle[attr];
			}
		}
		reg = /^(-?\d+(\.\d+)?)(px|rem|em|pt)?$/;
		return reg.test(val)? parseFloat(val) : val;
	}

	function setCss(attr,val){
		if ( attr === "float" ) {
			this["style"]["cssFloat"] = val;
			this["style"]["styleFloat"] = val;
			return;
		}
		if ( attr === "opacity" ) {
			this["style"]["opacity"] = val;
			this["style"]["filter"] = "alpha(opacity="+ val * 100 +")";
			return;
		}
		let reg = /^(width|height|top|bottom|left|right|(margin|padding|(Top|Left|Right|Bottom)?))$/;
		if ( reg.test(attr) ) {
			if( !isNaN( val ) ) {
				val += "px";
			}
		}
		this["style"][attr] = val;
	}

	function setGroupCss(options) {
		options = options || 0;
		for (let key in options) {
			if(options.hasOwnProperty(key)){
				setCss.call(this, key, options[key]);
			}
		}
	}
	


	function animaCompute(t,b,c,d){
		return c * t / d + b;
	}


	return {
		// 把伪数组 转换成数组
		toArray(likeAry) {
			if(flag){
				return [].slice.call(likeAry);
			}
			let ary = [];
			for (let i = 0; i < likeAry.length; i++) {
				ary[ary.length] = likeAry[i];
			}
			return ary;
		},

		//	利用 window.navigator.userAgent 来判断浏览器
		judgeBrowser() { 

		},

		// 获取Ele元素下的所有子元素  如果传递第二个参数 则获取指定元素名
		children(Ele,tagName) { 
			let ary = [];
			if ( !flag ) {
				let nodeList = Ele.childNodes;
				for (let i = 0; i < nodeList.length; i++) {
					if( nodeList[i].nodeType === 1 ) {
						ary[ary.length] = nodeList[i];
					}
				}
			}else{
				ary = [].slice.call(Ele.children);
			}
			if ( typeof tagName === "string" ){
				let curAry = [];
				for (let i = 0; i < ary.length; i++) {
					if( ary[i].nodeName.toLowerCase() === tagName.toLowerCase() ) {
						curAry.push(ary[i]);
					}
				}
				return curAry;
			}
			return ary;
		},

		// 获取curEle元素的上一个元素节点
		prev(curEle) {	
			if( flag ) {
				return curEle.previousElementSibling;
			}
			let prev = curEle.previousSibling;
			while( prev && prev.nodeType !== 1 ) {
				prev = prev.previousSibling;
			}
			return prev;
		},

		// 获取curEle元素的下一个元素节点
		next(curEle) {	
			if( flag ) {
				return curEle.nextElementSibling;
			}
			let next = curEle.nextSibling;
			while( next && next.nodeType !== 1 ) {
				next = next.nextSibling;
			}
			return next;
		},

		prevAll(curEle) {
			let ary = [];
			let pre = this.prev(curEle);
			while(pre){
				ary.unshift(pre);
				pre = this.prev(pre);
			}
			return ary;
		},

		nextAll(curEle) {
			let ary = [];
			let nex = this.next(curEle);
			while(nex){
				ary.push(nex);
				nex = this.next(nex);
			}
			return ary;
		},

		sibling(curEle) {
			let prev = this.prev(curEle);
			let next = this.next(curEle);
			let ary = [];
			prev?ary.push(prev):null;
			next?ary.push(next):null;
			return ary;
		},

		// 获取兄弟元素节点
		siblings(curEle) {	
			return this.prevAll(curEle).concat(this.nextAll(curEle));
		},

		// 获取元素下标
		index(curEle) {	
			return this.prevAll(curEle).length;
		},

		// 获取第一个元素
		firstChild(curEle) {	
			let chs = this.children(curEle);
			return chs.length > 0? chs[0] : null;
		},

		// 获取最后一个元素
		lastChild(curEle) {	
			let chs = this.children(curEle);
			return chs.length > 0? chs[chs.length - 1]: null;
		},

		// 同appendChild功能一样
		append(newEle,container) {	
			container.appendChild(newEle);
		},

		// 向指定容器的开头追加元素
		prepend(newEle,container) { 
			let fir = this.firstChild(container);
			if(fir) {
				container.insertBefore(newEle,fir);
				return;
			}
			container.appendChild(newEle);
		},

		// 把元素追加到某一个元素的前面
		insertBefore(newEle,oldEle) {
			oldEle.parentNode.insertBefore(newEle,oldEle);
		},

		// 把元素追加到某一个元素的后面
		insertAfter(newEle,oldEle) {
			let nex = this.next(oldEle);
			if(nex) {
				this.insertBefore(newEle,nex);
				return;
			}
			oldEle.parentNode.appendChild(newEle);
		},

		//	元素中是否包含这个类
		hasClass(curEle,className){
			let reg = new RegExp( "(^| +)"+ className +"( +|$)" );
			return reg.test(curEle.className);
		},

		//	给元素添加类
		addClass(curEle,className){
			let ary = className.trim().split(/ +/g);
			for (let i = 0; i < ary.length; i++) {
				if (!this.hasClass(curEle,ary[i])) {
					curEle.className += " "+ary[i];
				}
			}
		},

		//	移出元素中的类
		removeClass(curEle,className){
			let ary = className.trim().split(/ +/g);
			for(let i = 0, len = ary.length; i < len; i++) {
				if ( this.hasClass(curEle,ary[i]) ) {
					let reg = new RegExp("(^| +)" + ary[i] + "( +|$)","g");
					curEle.className = curEle.className.replace(reg," ");
				}
			}
		},

		//	获取某个上下文中 元素里的 class = className 的元素
		getElementClass(className,context){
			context = context || document;
			let classNameAry = className.trim().split(/ +/g);
			let nodeList = context.getElementsByTagName("*");
			let ary = [];
			for (let i = 0, len = nodeList.length; i < len; i++) {
				let isOk = true;
				for (let k = 0, len = classNameAry.length; k < len; k++) {
					if( !this.hasClass(nodeList[i],classNameAry[k]) ){
						isOk = false;
						break;
					}
				}
				if(isOk) {
					ary.push(nodeList[i]);
				}
			}
			return ary;
		},

		css(curEle){
			let ary = [].slice.call(arguments,1);
			let argOne = ary[0];
			if( typeof argOne === "string" ) {
				let argThree = ary[1];
				if( !argThree ) {
					return getCss.apply(curEle,ary);
				}
				setCss.apply(curEle,ary);
			}
			if( argOne.toString() === "[object Object]" ) {
				setGroupCss.apply(curEle,ary);
			}
		},

		// 封装选项卡  三个参数都是必传
		// container 要操作的容器
		// defaultIndex 默认选中元素 如果传入第二个参数的话，第三个参数为必传
		// className 默认选中的样式
		/*
			固定结构
			<div class="options">  class不是必须要使用这个  只要传容器进来即可
				<ul>
					<li>选项一</li>
				</ul>
				<div>内容一</div>
			</div>
		*/
		tabControl(container,defaultIndex,className){
			let that = this, oUl = this.firstChild(container), aLis = this.children(oUl);
			let aDiv = this.nextAll(oUl);
			defaultIndex = defaultIndex || 0;
			this.addClass(aLis[defaultIndex],className);
			this.addClass(aDiv[defaultIndex],className);
			for (let i = 0, len = aLis.length; i < len; i++){
				aLis[i].onclick = function() {
					let index = that.index(this);
					for(let j = 0, len = aDiv.length; j < len; j++) {
						index === j ? (that.addClass(aDiv[j],className),that.addClass(aLis[j],className)) : (that.removeClass(aDiv[j],className),that.removeClass(aLis[j],className))
					}
				}
			}
		},

		//animation 实现了简单的动画
		animation(curEle,obj,duration,callback){
			clearInterval(curEle.timer);
			let that = this, begin = {}, change = {};
			for (let key in obj){
				if(obj.hasOwnProperty(key)) {
					begin[key] = this.css(curEle,key);
					change[key] = obj[key] - begin[key];
					console.log(key)
				}
			}
			let time = 0;
			curEle.timer = setInterval(function(){
				time += 10;
				if(time >= duration) {
					that.css(curEle,obj);
					clearInterval(curEle.timer);
					typeof callback === "function"? callback.call(curEle) : null;
					return;
				}
				for (let key in obj) {
					let curPos = animaCompute(time,begin[key],change[key],duration);
					that.css(curEle,key,curPos);
				}
			},10)
		}


	}
})()