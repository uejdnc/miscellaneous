/*
	QS = Shortcut of querySelector
	QSA = Shortcut of querySelectorAll
	QID = Shortcut of getElementById
	QC = Shortcut of getElementsByClassName
	QTAG = Shortcut of getElementsByTagName
	QIFR = Returns contentWindow of an Iframe
	today = Today's date on string
	oSumE = Sum elements in object
	cssVar = Gives you the value of a css variable
	minute = convers minutes to milliseconds
	maxV = Get max value of JSON
	bTime = Format minutes to h ' (Hours and minutes)
	diffDate = Difference in days from two strings
	isJSON = If string is valid JSON
	sLineChart = Creates a lineChart
	pieChart = Create a svg pie chart
	ajax = Makes xmlhttp request via post or get, it could also sen beacons
	post = Send data through post (ajax shortcut)
	beacon = Send a beacon (ajax shortcut)
	ajaxForm = Sends a form,  and appends data to it, through ajax (ajax shortcut)
	arrayToNodeList = Converts an array to a NodeList
	isNode = Checks whether parameter passed is a Node
	nodeListToArray = Converts a NodeList to an array
	range = Returns a given range, it could be numbers or letters
	overlap = Returns boolean on whether two elements overlap
	_listeners = Variable to store the listeners set with the .listen() function
*/
const QS = (e, p) => ((e && (p || document).querySelector(e)) || emptyNode()),
	QSA = (e, p) => (p || document).querySelectorAll(e),
	QID = (e, p) => ((e && (p || document).getElementById(e)) || emptyNode()),
	QC = (e, p) => (p || document).getElementsByClassName(e),
	QTAG = (e, p) => (p || document).getElementsByTagName(e),
	QIFR = (e, f) => f ? (QS(e).contentWindow[f] || (() => void 0)) : QS(e).contentWindow,
	today = () => new Date().toJSON().slice(0, 10),
	oSumE = o => Object.values(o).reduce((a, b) => parseInt(a) + parseInt(b)),
	cssVar = (v, e = QS(':root')) => e.css(`--${v}`),
	minute = n => n * 6e4,
	rand = () => Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
	maxV = (array, key) => {
		let max = 0;
		for (let i in array) max = (array[i][key] >= max) ? array[i][key] : max;
		return max;
	},
	uniArray = (array, key) => { for (var i = -1, a = [], l = array.length; ++i != l; a[i] = array[i][key]); return a; },
	joinMultiObj = (array, j1 = ',', j2 = '-') => { for (var i = -1, a = [], l = array.length; ++i != l; a[i] = Object.values(array[i]).join(j2)); return a.join(j1); },
	hTime = t => 'object' === typeof t ? ((t = Object.values(t)).length != 2 ? parseInt(t[0]) : ((parseInt((t = Object.values(t))[0]) * 60) + parseInt(t[1]))) : ((t = t.split('h')).length != 2 ? parseInt(t[0]) : ((parseInt(t[0]) * 60) + parseInt(t[1]))),
	bTime = (t, f) => {
		const h = ((t = Math.round(parseInt(isNaN(t) ? 0 : t))) > 59) ? parseInt(t / 60) : 0,
			m = t % 60 || 0;
		return f ? { hours: h, minutes: m } : ((h ? `${h}h ` : '') + (m ? `${m}'` : '')).trim() || `${t}'`;
	},
	diffDate = (i, f, amount = (1000 * 3600 * 24)) => ~~((Math.abs((new Date(f)).getTime() - (new Date(i)).getTime())) / amount),
	isJSON = str => {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return JSON.parse(str);
	},
	sLineChart = (data, orientation, container, sum = 0, dd) => {
		let lines = '';
		const max = data.length;

		if (!orientation) orientation = 'v';
		if (!container) container = 'body';

		if (!sum) { for (let i in data) sum += data[i][0]; }

		for (let i in data) {
			let datos = data[i][0],
				percent = (datos / sum) * 100,
				percent_nice = (dd == 'percent') ? `${Math.round(percent, 1)}%` : ((dd == 'time') ? bTime(datos) : datos + dd),
				color = data[i][1],
				clase = data[i][2],
				title = data[i][3] + ((data[i][3] && orientation != 'l') ? `: ${percent_nice}` : ''),
				size = (orientation == 'h') ? 'width' : 'height',
				placement = (orientation == 'h') ? 'top' : 'right',
				titleTooltip = title;

			if (color) color = `background-color: ${color};`;

			lines += (orientation == 'l') ? `
			<div class="${clase}">
				<div class="line"><div style="${size}: ${percent}%; ${color}">${percent_nice}</div></div>
				<div class="title" data-toggle="tooltip" data-container="${container}" data-placement="top" title="${titleTooltip}">${title}</div>
			</div>` : `<div class="${clase}" style="${size}: ${percent}%; ${color}" data-toggle="tooltip" data-container="${container}" data-placement="${placement}" title="${titleTooltip}"></div>
			`;
		}

		return lines;
	},
	pieChart = (data, size, container, opacity = 0.6) => {
		let cx = cy = size / 2,
			radius = cx - 10,
			chartelem = '',
			cDatos = sum = nulo = 0;

		if (!container) container = 'body';

		for (let i in data) { sum += parseInt(data[i][0]) }
		data.push([sum / 10000, '#666', '']);

		if (!sum) nulo = 1, sum = 1, data = [
			[1, '#666', ''],
			[sum / 10000, '#666', '']
		];

		sum += sum / 10000;

		let deg = sum / 360, // one degree
			jung = sum / 2, // necessary to test for arc type
			dx = radius, // Starting point:
			dy = 0, // first slice starts in the East
			oldangle = 0;

		/* Loop through the slices */
		for (let i in data) {
			let angle = oldangle + data[i][0] / deg, // cumulative angle
				x = Math.cos(angle * Math.PI / 180.0) * radius, // x of arc's end point
				y = Math.sin(angle * Math.PI / 180.0) * radius, // y of arc's end point
				color = data[i][1] || 'red',
				laf = (data[i][0] > jung) ? 1 : 0, // arc spans more than 180 degrees: 1
				titulo = nulo ? '' : `${data[i][2]}: ${Math.round(((data[i][0])/sum)*100, 1)}%`,
				ax = cx + x, // absolute x
				ay = cy + y, // absolute y
				adx = cx + dx, // absolute dx
				ady = cy + dy; // absolute dy

			chartelem += `<path d="M${cx},${cy} L${adx},${ady} A${radius},${radius} 0 ${laf},1 ${ax},${ay} z" fill="${color}" stroke="#FFF" stroke-width="2" fill-opacity="${opacity}" stroke-linejoin="round" data-toggle="tooltip" data-container="${container}" data-placement="right" title="${titulo}"/>`;

			dx = x; // old end points become new starting point
			dy = y; // id.
			oldangle = angle;
		}

		return chartelem;
	},
	ajax = (d = {}) => {
		/*if (self.fetch) {
			if (!(d.data instanceof FormData)) {
				let c = d.data instanceof Node,
					a = new FormData(c ? d.data : undefined);
				if (!c)
					for (let i in d.data) a.append(i, d.data[i]);
				d.data = a;
			}
			return fetch(d.url, {
				method: d.method || 'post',
				headers: d.headers,
				body: d.data
			}).then(response => {
				if (response.ok) {
					return response[d.response || 'text']();
				} else {
					if (d.retry) ajax(d);
					return Promise.reject({
						status: response.status,
						statusText: response.statusText,
						err: text
					});
				}
			}).then(d.done);
		} else {*/
		const xhttp = d.beacon || new XMLHttpRequest(),
			contentType = d.contentType === void 0 || d.contentType;
		let data = (contentType ? new URLSearchParams(new FormData(d.form)).toString() : d.form) || '';

		if (d.data && !data) { for (let i in d.data) data += encodeURIComponent(i) + "=" + encodeURIComponent(d.data[i]) + "&" }

		if (d.beacon) navigator.sendBeacon(d.url, data) && ((typeof d.callback == 'function') && d.callback());
		else {
			xhttp.onreadystatechange = function() { if (this.readyState == 4 && this.status == 200)(d.done || (() => ''))(this.responseText) };
			xhttp.onerror = () => d.retry && ((typeof d.retry == 'function') ? d.retry : ajax)(d);

			xhttp.open(d.method || 'POST', d.url, d.async === void 0 || d.async);
			contentType && xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			xhttp.send(data);
		}
		return xhttp;
		// }
	},
	post = (url, data, callback, r) => ajax({ url: url, data: data, done: callback || data, retry: r }),
	beacon = (url, data, callback) => ajax({ url: url, data: data, beacon: true, done: callback }),
	ajaxForm = (url, f, data, callback) => {
		let form;
		if (typeof data == 'function' || data == callback) {
			form = f;
			callback = data;
		} else {
			form = new FormData(f);
			for (let i in data) form.append(i, data[i]);
		}
		return ajax({
			url: url,
			form: form,
			contentType: (data == callback),
			done: callback
		});
	},
	arrayToNodeList = a => { for (var i = -1, l = a.length, p = ''; ++i !== l; p += isNode(a[i]) ? `${a[i].path()},` : '', console.log(p)); return p ? QSA(p.slice(0, -1)) : document.createDocumentFragment().childNodes; },
	isNode = o => o && typeof o == 'object' && 'nodeType' in o,
	nodeListToArray = n => { for (var i = -1, l = n.length, a = new Array(l); ++i !== l; a[i] = n[i]); return a; },
	range = (f, t) => {
		const a = [],
			ty = isNaN(f) ? 'l' : 'n';
		void 0 == t && (t = f, f = (ty == 'n') ? 0 : 'a'), 'l' == ty && (t = t.toLowerCase().charCodeAt(0), f = f.toLowerCase().charCodeAt(0));
		for (let i = f - 1, ii = -1; ++i <= t; a[++ii] = ty == 'l' ? String.fromCharCode(i) : i);
		return a;
	},
	overlap = (a, b, specific) => {
		const ac = a.getBoundingClientRect(),
			bc = b.getBoundingClientRect(),
			Y = {},
			X = {};

		Y.top = (bc.bottom > ac.top);
		Y.bottom = (ac.top > bc.bottom);

		X.left = (bc.right > ac.left);
		X.right = (ac.left > bc.right);

		return specific ? { y: Y, x: X } : !((ac.right < bc.left || ac.left > bc.right || ac.bottom < bc.top || ac.top > bc.bottom));
	},
	/*wait = async function(a, b) {
		new Promise((resolve, reject) => {
			await (async function(){a()})();
			resolve(b)
		})
	}*/
	emptyNode = () => '<div></div>'.createHTML().children[0],
	/*fastSort = (arr, a=0) => {
		var len = arr.length;
		if (len < 2)
			return arr;
		var mid = Math.floor(len / 2),
			left = arr.slice(0, mid),
			right = arr.slice(mid),
			ar = ((left, right) => {
			var result = [],
				lLen = left.length,
				rLen = right.length,
				l = 0,
				r = 0;
			while (l < lLen && r < rLen)(left[l] < right[r]) ? result.push(left[l++]) : result.push(right[r++]);
			//remaining part needs to be addred to the result
			return result.concat(left.slice(l)).concat(right.slice(r));
		})(mergeSort(left), mergeSort(right));
		if a &&
		return
	},*/
	_listeners = [];

/*Append or prepend data to elemet*/
Node.prototype.paste = function(t, p) { return this.insertAdjacentHTML((['beforeEnd', 'afterBegin', 'beforeBegin', 'afterEnd'])[p || 0], t) || this };
/*Append or prepend data to NodeList*/
NodeList.prototype.mPaste = function(t, p) { return this.paste(t, p) };
NodeList.prototype.paste = function(t, p) {
	for (const i of this) i.paste(t, p);
	return this;
};
/*innerHTML data to elemet*/
Node.prototype.iHTML = function(e) { return void 0 != e && (this.innerHTML = '', ('string' == typeof e || 'number' == typeof e) ? this.innerHTML = e : this.appendChild(e)), void 0 != e ? this : this.innerHTML };
/*innerText data to elemet*/
Node.prototype.iText = function(e) { return void 0 != e && (this.innerText = e), void 0 != e ? this : this.innerText };
/*NodeList innerHTML data to elemet*/
NodeList.prototype.miHTML = function(e) { return this.iHTML(e) };
NodeList.prototype.iHTML = function(e) {
	if (e != void 0) { for (let i = -1, l = this.length; ++i != l; this.item(i).iHTML((typeof e == 'function') ? e(i.iHTML()) : e)); }
	return (e != void 0) ? this : this.toArray('map', e => e.iHTML());
};
/*NodeList innerText data to elemet*/
NodeList.prototype.miText = function(e) { return this.iText() };
NodeList.prototype.iText = function(e) {
	if (e != void 0) { for (let i = -1, l = this.length; ++i != l; this.item(i).iText((typeof e == 'function') ? e(i.iText()) : e)); }
	return (e != void 0) ? this : this.toArray('map', e => e.iText());
};
/*Get attribute of element with fallback*/
Node.prototype.gAttr = function(a, f) { return (this.attributes[a]) ? this.attributes[a].nodeValue : (f ? ((this.attributes[f]) ? this.attributes[f].nodeValue : void 0) : void 0); };
/*Set attribute of element*/
Node.prototype.sAttr = function(a, v = '') {
	if (this.attributes[a]) this.attributes[a].nodeValue = v;
	else this.setAttribute(a, v);
	return this;
};
/*Remove attribute of element*/
Node.prototype.rAttr = function(a) { for (let i = -1, at = a.split(' '), l = at.length; ++i != l; this.removeAttribute(at[i])); return this };
/*Has class shortcut*/
Node.prototype.hClass = function(c, t) {
	let that = this,
		cond = { 't': false, 'f': false };
	c.split(' ').every(cl => cond[(that.classList.contains(cl) ? 't' : 'f')] = true);
	return t ? cond.t : !cond.f;
};
/*Add class shortcut*/
Node.prototype.aClass = function(c) { return (c && this.classList.add(...c.split(' '))) || this };
/*Remove class shortcut*/
Node.prototype.rClass = function(c) {
	if (c) this.classList.remove(...c.split(' '));
	else this.rAttr('class');
	return this;
};
/*Is visible*/
Node.prototype.iVisible = function(c) { return (this.offsetWidth || this.offsetHeight || this.getClientRects().length) };
/*Switch class shortcut*/
Node.prototype.sClass = function(r, a, s) { return this.rClass(s ? a : r).aClass(s ? r : a) };
/*Toggle class shortcut*/
Node.prototype.tClass = function(c, t) { return (((t === void 0) ? this.hClass(c) : !t) ? c => this.rClass(c) : c => this.aClass(c))(c) };
/*Add class shortcut to NodeList*/
NodeList.prototype.maClass = function(c) { return this.aClass(c) };
NodeList.prototype.aClass = function(c) { for (let i = -1, l = this.length; ++i != l; this.item(i).aClass(c)); return this };
/*Remove class shortcut to NodeList*/
NodeList.prototype.mrClass = function(c) { return this.rClass(c); };
NodeList.prototype.rClass = function(c) { for (let i = -1, l = this.length; ++i != l; this.item(i).rClass(c)); return this };
/*Switch class shortcut to NodeList*/
NodeList.prototype.msClass = function(r, a, s) { return this.sClass(r, a, s); };
NodeList.prototype.sClass = function(c) { for (let i = -1, l = this.length; ++i != l; this.item(i).sClass(c)); return this };
/*Toggle class shortcut to NodeList*/
NodeList.prototype.mtClass = function(c, t) { return this.tClass(c, t) };
NodeList.prototype.tClass = function(c) { for (let i = -1, l = this.length; ++i != l; this.item(i).tClass(c)); return this };
/*NodeList Has class shortcut*/
NodeList.prototype.mhClass = function(c, t) { return this.hClass(c, t) };
NodeList.prototype.hClass = function(c, t) {
	const cond = { 't': false, 'f': false };
	for (let i = -1, l = this.length; ++i != l; cond[this.item(i).hClass(c) ? 't' : 'f'] = true);
	return t ? cond.t : !cond.f;
};
/*Get attribute of nodeList with fallback*/
NodeList.prototype.mgAttr = function(a, f) { return this.gAttr(a, f) };
NodeList.prototype.gAttr = function(a, f) { return this.toArray('map', e => e.gAttr(a, f)) };
/*Get ids of nodeList*/
NodeList.prototype.ids = function(a) { return this.toArray('map', e => e.id) };
/*Get valuess of nodeList*/
NodeList.prototype.values = function(a) { return this.toArray('map', e => e.id) };
/*NodeList multifunction to array*/
NodeList.prototype.multiArray = function(f, p) { return this.toArray('map', e => p ? e[f](...p) : e[f]) };
/*Set attribute to NodeList*/
NodeList.prototype.msAttr = function(a, v) { return this.sAttr(a, v) };
NodeList.prototype.sAttr = function(c) { for (let i = -1, l = this.length; ++i != l; this.item(i).sAttr(a, v)); return this };
/*Remove attribute to NodeList*/
NodeList.prototype.mrAttr = function(a, v) { return this.rAttr(a, v) };
NodeList.prototype.rAttr = function(c) { for (let i = -1, l = this.length; ++i != l; this.item(i).rAttr(a, v)); return this };
/*Remove elements from NodeList*/
NodeList.prototype.removes = function() { return this.remove() };
NodeList.prototype.remove = function() { for (let i = -1, l = this.length; ++i != l; this.item(i).remove()); };
/*Add onclick to elements from Node*/
Node.prototype.oClick = function(c, f) {
	if (f === void 0) f = c, c = '';
	this.onclick = c ? e => (e.target.parent(c) ? (() => f(e)) : (() => void 0))() : f
	return this;
};
/*Add onclick to elements from NodeList*/
NodeList.prototype.oClick = function(c, f) {
	for (let e of this) e.oClick(c, f);
	return this;
};
/*Add mouseenter and mouseleave to elements from NodeList*/
NodeList.prototype.oHover = function(e, l) {
	for (let i of this) i.onmouseenter = e, i.onmouseleave = l
	return this;
};
/*Multiple events (click, input, etc) to Node*/
Node.prototype.oevent = function(e, s, f2) {
	let that = this,
		clase = s,
		funcion = (typeof s == 'function') ? s : f2,
		events = e.trim().split(' ');

	for (let i of events) that[`on${i}`] = (clase == funcion) ? funcion : function(e) { if (clase == funcion || e.target.closest(clase)) funcion(e) };
	return this;
}
/*Multiple events (click, input, etc) to NodeList*/
NodeList.prototype.oEvent = function(e, s, f) {
	for (let i of this) i.oevent(e, s, f)
	return this;
}
/*Set time out alternative*/
/*Node.prototype.wait = async function(t) {
	let that = this,
		wait = () => new Promise(() =>setTimeout(() => console.log(that), t)),
		done = await wait();
	return done.then(function(done) {
	console.log(done); // --> 'done!'
	});;
	// return this;
};*/
Node.prototype.wait = NodeList.prototype.wait = function(t = 200) { return new Promise((resolve, reject) => setTimeout(() => resolve(this), t)) };
/*Add/Subtract days from string or object*/
String.prototype.tDate = function(i, o) {
	let date = new Date(this.split('-'));
	if (i) date.setDate(date.getDate() + i);
	return o ? date : date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, 0) + '-' + String(date.getDate()).padStart(2, 0);
};
/*Date to string*/
Date.prototype.DtoS = function() { return this.getFullYear() + '-' + String(this.getMonth() + 1).padStart(2, 0) + '-' + String(this.getDate()).padStart(2, 0) }
/*String to date*/
/*String.prototype.toDate = function(f='dd/mm/ hh:ii:ss') {
	let normalized = this.replace(/[^a-zA-Z0-9]/g, '-'),
		normalizedFormat = f.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
		formatItems = normalizedFormat.split('-'),
		dateItems = normalized.split('-'),
		monthIndex = formatItems.indexOf("mm"),
		dayIndex = formatItems.indexOf("dd"),
		yearIndex = formatItems.indexOf("yyyy"),
		hourIndex = formatItems.indexOf("hh"),
		minutesIndex = formatItems.indexOf("ii"),
		secondsIndex = formatItems.indexOf("ss"),
		t = new Date(),
		year = yearIndex > -1 ? dateItems[yearIndex] : t.getFullYear(),
		month = monthIndex > -1 ? dateItems[monthIndex] - 1 : t.getMonth() - 1,
		day = dayIndex > -1 ? dateItems[dayIndex] : t.getDate(),
		hour = hourIndex > -1 ? dateItems[hourIndex] : t.getHours(),
		minute = minutesIndex > -1 ? dateItems[minutesIndex] : t.getMinutes(),
		second = secondsIndex > -1 ? dateItems[secondsIndex] : t.getSeconds();

	return new Date(year, month, day, hour || t.getHours(), minute || t.getMinutes(), second || t.getSeconds());
};*/
/*If is a valid date*/
String.prototype.iDate = function(i, o) { return new Date(this) != 'Invalid Date' };
/*Get element index*/
Node.prototype.gIndex = function() { return Array.prototype.slice.call(this.parentElement.children).indexOf(this) };
/*Clone node*/
Node.prototype.cloneN = function(cEvents = true) {
	let that = this,
		clone = that.cloneNode(false);

	if (cEvents) {
		for (let i in that) {
			if (/on/i.exec(i)) clone[i] = (/on/i.exec(i).index == 0) ? that[i] : clone[i];
		}
	}

	if (that.childNodes.length) {
		for (let i of that.childNodes) clone.appendChild(i.cloneN(cEvents));
	}

	return clone;
};
/*Paste page into node with ajax*/
Node.prototype.loadP = function(url, d) {
	let that = this;
	ajax({
		url: url,
		async: false,
		data: d || void 0,
		method: d ? 'POST' : 'GET',
		done: data => that.innerHTML = data
	});
	return this;
};
/*Replace element with an HTML string*/
String.prototype.createHTML = function() { return document.createRange().createContextualFragment(this) };
/*Replace element with an HTML string*/
Node.prototype.replaceElement = function(s) {
	let e = (typeof s == 'string') ? s.createHTML() : s;
	this.replaceWith(e);
	return e;
};
/*Next element*/
Node.prototype.nextE = function(p = 1) { for (var i = -1, e = this; ++i != p && e.nextElementSibling; e = e.nextElementSibling); return e };
NodeList.prototype.nextE = function(p = 1) { for (var i = -1, e = [], a = this.toArray(), l = a.length, c; ++i != l; c = a[i].nextE(p), e[i] = e.includes(c) ? null : c); return arrayToNodeList(e) };
/*Prev element*/
Node.prototype.prevE = function(p = 1) { for (var i = -1, e = this; ++i != p && e.previousElementSibling; e = e.previousElementSibling); return e };
NodeList.prototype.prevE = function(p = 1) { for (var i = -1, e = [], a = this.toArray(), l = a.length, c; ++i != l; c = a[i].prevE(p), e[i] = e.includes(c) ? null : c); return arrayToNodeList(e) };
/*Get last character of string*/
String.prototype.lastC = function() { return this[this.length - 1]; };
/*Get first character of string*/
String.prototype.firstC = function() { return this[0]; };
/*Return NodeList of closest*/
NodeList.prototype.parent = function(e) { for (var i = -1, e = [], a = this.toArray(), l = a.length, c; ++i != l; c = a[i].parent(p), e[i] = e.includes(c) ? null : c); return arrayToNodeList(e) };
/*Returns NodeList of elements touching Node*/
Node.prototype.touching = function(b) { for (var i = -1, e = [], a = nodeListToArray(b || this.parentElement.children), l = a.length, c; ++i != l; c = a[i], e[i] = !(e.includes(c)) && overlap(this, c) && c != this ? c : null); return arrayToNodeList(e) };
/*Makes an NodeList to an Array */
NodeList.prototype.toArray = function(f, p) { return f ? nodeListToArray(this)[f](p) : nodeListToArray(this) };
/*parentElemet n number of times on Node or .closest()*/
Node.prototype.parent = function(n = 1) {
	let e = this;
	if (isNaN(n)) e = this.closest(n);
	else {
		for (let i = -2; ++i != n; e = e.parentElement);
	}
	return e;
};
/*Get and set styles to node or nodelist*/
Node.prototype.css = function(s, v) {
	let that = this;
	if (v !== void 0) that.style[s] = v;
	else if (typeof s == 'object') {
		for (let i in s) that.style.setProperty(i, s[i]);
	}
	return (v !== void 0 || typeof s == 'object') ? that : getComputedStyle(that).getPropertyValue(s);
};
NodeList.prototype.css = function(s, v) {
	const cs = [],
		cond = v === void 0 || typeof s !== 'object';
	if (cond)
		for (let i = -1, l = this.length; ++i != l; cs[i] = this.item(i).css(s, v));
	return cond ? this : cs;
};
/*Set property to all elements in NodeList*/
NodeList.prototype.sProperty = function(p, v) {
	for (let i of this) i[p] = v;
	return this;
};
/*Set/get property to all elements in NodeList or node*/
Node.prototype.prop = function(s, v) {
	if (v !== void 0) this[s] = v;
	else if (typeof s == 'object') {
		for (let i in s) this[i] = s[i];
	}
	return (v !== void 0 || typeof s == 'object') ? this : this[s];
};
NodeList.prototype.prop = function(s, v) {
	const cs = [],
		cond = v === void 0 || typeof s !== 'object';
	if (cond) {
		for (let i = -1, l = this.length; ++i != l; cs[i] = this.item(i).prop(s, v));
	}
	return cond ? this : cs;
};
/*Find by property value in NodeList*/
NodeList.prototype.propFilter = function(p, v) {
	const vls = [];
	for (let i = -1, a = this.toArray(), l = a.length; ++i != l; vls[i] = v === a[a.indexOf(a[i])][p] ? a[a.indexOf(a[i])] : null);
	return arrayToNodeList(vls);
};
/*Get and set attributes to node or nodelist*/
Node.prototype.attr = function(s, v) {
	let that = this;
	if (v !== void 0) that.sAttr(s, v);
	else if (typeof s == 'object') {
		for (let i in s) that.sAttr(i, s[i]);
	}
	return (v !== void 0 || typeof s == 'object') ? that : that.gAttr(s);
};
NodeList.prototype.attr = function(s, v) {
	const cs = [],
		cond = v === void 0 || typeof s !== 'object';
	if (cond) {
		for (let i = -1, l = this.length; ++i != l; cs[i] = this.item(i).attr(s, v));
	}
	return cond ? this : cs;
};
/*Get elements unique path*/
Node.prototype.path = function() {
	let element = this,
		path = [],
		previousElementSibling = element => { if (element.previousElementSibling !== 'undefined') { return element.previousElementSibling } else { while (element = element.previousSibling) { if (element.nodeType === 1) { return element } } } };

	while (element.nodeType === Node.ELEMENT_NODE) {
		let selector = element.nodeName,
			sibling = element,
			siblingSelectors = [];
		while (sibling !== null && sibling.nodeType === Node.ELEMENT_NODE) {
			siblingSelectors.unshift(sibling.nodeName);
			sibling = previousElementSibling(sibling);
		}
		if (siblingSelectors[0] !== 'HTML') siblingSelectors[0] = siblingSelectors[0] + ':first-child';
		selector = siblingSelectors.join('+');
		path.unshift(selector);
		element = element.parentNode;
	}
	return path.join('>');
};
/*Sort elements by value*/
Node.prototype.sort = function(f, s, o) {
	let itms = nodeListToArray(this.children);
	typeof s != 'function' && (o = s, s == void 0);
	itms.sort((a, b) => (f(a) == f(b)) ? ((!s || (s(a) == s(b))) ? 0 : ((s(a) > s(b)) ? 1 : -1)) : (((f(a) > f(b) && !o) || (f(a) < f(b) && o)) ? 1 : -1));
	for (i = 0; i < itms.length; ++i) this.appendChild(itms[i]);
	return this;
};
/*Know if element is inside a NodeList*/
Node.prototype.in = function(l) { return nodeListToArray((l instanceof NodeList || l instanceof HTMLCollection) ? l : ('string' === typeof l ? QSA(l) : l.children)).includes(this) };
/*Exclude element from NodeList*/
NodeList.prototype.not = function(...a) { for (let i = -1, l = a.length, a = this.toArray(); ++i != l; delete a[a.indexOf(a[i])]); return arrayToNodeList(a) };
/*
Modify addEventListener function to store all events in an array
for later use in the function removeEventsListeners
wich removes all events from a specific type
*/
EventTarget.prototype.listener = function(type, listener, useCapture) {
	_listeners.push({ target: this, type: type, listener: listener });
	this.addEventListener(type, listener, useCapture);
};
EventTarget.prototype.rListener = function(targetType) {
	let types = targetType.split(' ');
	for (let t of types) {
		for (let item of _listeners) {
			if (item.target == this && item.type == t) this.removeEventListener(item.type, item.listener);
		}
	}
};