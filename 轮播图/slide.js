~function(){
	function Slide(curEle,obj){
		// 获取元素
		this.oWrapSlide = document.getElementById('wrap_slide'),
		this.oFirstEle = mytools.firstChild(this.oWrapSlide);
		this.aImg = this.oFirstEle.getElementsByTagName('img'),
		this.oUl = mytools.children(this.oWrapSlide,"ul")[0],
		this.aLisItem = this.oUl.getElementsByTagName('li'),
		this.oPrev = mytools.children(this.oWrapSlide,"a")[0],
		this.oNext = mytools.children(this.oWrapSlide,"a")[1];

		this.dataUrl = obj.url;	// 获取请求地址
		this.interval = obj.time || 3000;	// 每隔多少时间 运动一次
		this.step = 0;
		this.autoTimer = null;

		return this.init();
	}

	Slide.prototype = {
		constructor:Slide,
		// 数据请求
		getData:function(){
			_this = this;
			// 使用ajax请求获取数据
			let xhr = new XMLHttpRequest;
			//	请求地址 http://localhost/api/getlunbotu  false->使用异步编程
			xhr.open("get",this.dataUrl,false);
			xhr.onreadystatechange = function(){
				if ( xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status) ) {
					let val = xhr.responseText;
					_this.data = JSON.parse(val).data; //吧获取到的数据 存储到 data这个变量
				}
			}
			xhr.send(null);
		},

		// 数据绑定
		dataBind(){
			let str = "",liStr = "";
			if (this.data) {
				for (let i = 0, len = this.data.length; i < len; i++) {
					console.log(this.data[i]);
					str += "<div><img src='#' trueImg=http://localhost/"+ this.data[i]["pic"] +" /></div>";
					i === 0? (liStr += "<li class='bg'></li>") : (liStr += "<li></li>")
				}
				str += "<div><img src='#' trueImg=http://localhost/"+ this.data[0]["pic"] +" /></div>"
			}
			this.oFirstEle.innerHTML = str;
			this.oUl.innerHTML = liStr;
			this.picCount = this.data.length + 1;
			mytools.css(this.oFirstEle,"width", this.picCount * 660); // 动态计算 oImgSlide 元素的总宽度
			mytools.css(this.oUl,"width",this.data.length * 20);// 动态计算 oUl 元素的总宽度
		},

		// 延迟加载
		lazyImg(){
			let _this = this;
				for (let i = 0, len = this.aImg.length; i < len; i++) {
					let newImg = new Image;
					newImg.src = aImg[i].getAttribute("trueImg");
					newImg.onload = function(){
						_this.aImg[i].src = this.src;
						mytools.css(_this.aImg[i],{opacity:1,display:"block"});
						newImg = null;
					}
				}
		},

		//自动轮播
		autoMove(){
			if (this.step >= this.picCount-1) {
				this.step = 0;
				mytools.css(this.oFirstEle,"left",0)
			}
			this.step++;
			mytools.animation(this.oFirstEle,{left:-this.step*660},600);
			this.changeTip();
		},

		changeTip(){
			let tempStep = this.step >= this.aLisItem.length? 0: this.step;
			for (let i = 0, len = this.aLisItem.length; i < len; i++) {
				i === tempStep? mytools.addClass(this.aLisItem[i],"bg") : mytools.removeClass(this.aLisItem[i],"bg")
			}
		},

		// 移入移出
		overOut(){
			let _this = this;
			this.oWrapSlide.onmouseover = function(){
				clearInterval(_this.autoTimer);
			}

			this.oWrapSlide.onmouseout = function(){
				_this.autoTimer = setInterval(function(){
					_this.autoMove();
				},_this.interval);
			}
		},

		// 焦点切换
		tipEvent(){
			let _this = this;
			for (let i = 0, len = this.aLisItem.length; i < len; i++) {
				this.aLisItem[i].index = i;
				this.aLisItem[i].onclick = function(){
					clearInterval(_this.autoTimer);
					_this.step = this.index;
					_this.changeTip();
					mytools.animation(_this.oFirstEle,{left:-_this.step*660},600);
					setTimeout(_this.autoTimer,500);
				}
			}
		},

		// 左右切换
		leftRight(){
			let _this = this;
			oNext.onclick = function(){
				clearInterval(_this.autoTimer);
				_this.autoMove();
				setTimeout(_this.autoTimer,500);
			}
			oPrev.onclick = function() {
				clearInterval(_this.autoTimer)
				if( _this.step <= 0) {
					_this.step = _this.picCount - 1;
					mytools.css(_this.oFirstEle,"left",-(_this.step) * 660);
				}
				_this.step--;
				_this.changeTip();
				mytools.animation(_this.oFirstEle,{ left: -_this.step * 660 },600);
				setTimeout(_this.autoTimer,500);
			}
		},

		// 入口
		init(){
			let _this = this;
			this.getData();
			this.dataBind();
			setTimeout(function(){
				_this.lazyImg();
			},500)

			this.autoTimer = setInterval(function(){
				_this.autoMove()
			},this.interval)

			this.changeTip();
			this.overOut();
			this.tipEvent();
			this.leftRight();
			return this;
		}

	}

	window.oMourSlide = Slide;

}()