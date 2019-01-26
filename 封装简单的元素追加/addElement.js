;(function(){
	var that;

	function $(el){
		let element = document.querySelectorAll(el);
		if (element.length < 2) {
			return element[0];
		}else{
			return element;
		}
	}

	window.$ = $;

})()