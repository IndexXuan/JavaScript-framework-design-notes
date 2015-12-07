/*******************************************************
    > File Name: 020-copy-node.js
    > Author: IndexXuan
    > Mail: indexxuan@gmail.com
    > Created Time: 2015年06月16日 星期二 15时30分08秒
 ******************************************************/

$.fn.clone = function(dataAndEvents, deepDataAndEvents) {
	dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
	deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
	return this.map(function() {
		return cloneNode(this, dataAndEvents, deepDataAndEvents);
	});
};

function cloneNode(node, dataAndEvents, deepDataAndEvents) {
	if (node.nodeType === 1) {
		var neo = $.fixCloneNode(node), // copy element's attributes
		    src, neos, i;
		if (dataAndEvents) {
			$.mergeData(neo, node); // copy data and events
			if (deepDataAndEvents) {
				src = node[TAGS]("*");
				neos = neo[TAGS]("*");
				for (i = 0; src[i]; i++) {
					$.mergeData(neos[i], src[i]);
				}
			}
		}
		src = neos = null;
		return neo;
	} else {
		return node.cloneNode(true);
	}
}

// in modern browsers and modern framework like zepto
clone: function() {
	return this.map(function() {
		return this.cloneNode(true);
	});
}

