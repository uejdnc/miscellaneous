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
	maxV = Get max value of JSON
	bTime = Format minutes to h ' (Hours and minutes)
	diffDate = Difference in days from two strings
	isJSON = If string is valid JSON
	sLineChart = Creates a lineChart
	pieChart = Create a svg pie chart
	ajax = Makes xmlhttp request via post or get, it could also sen beacons
	post = Send data through post (ajax shortcut)
	beacon = Send a beacon (ajax shortcut)
	arrayToNodeList = Converts an array to a NodeList
	nodeListToArray = Converts a NodeList to an array
	range = Returns a given range, it could be numbers or letters
	overlap = Returns boolean on whether two elements overlap
	_listeners = Variable to store the listeners set with the .listen() function
*/
var QS = (e, p) => (p || document).querySelector(e),
	QSA = (e, p) => (p || document).querySelectorAll(e),
	QID = (e, p) => (p || document).getElementById(e),
	QC = (e, p) => (p || document).getElementsByClassName(e),
	QTAG = (e, p) => (p || document).getElementsByTagName(e),
	QIFR = (e, f) => f ? (QS(e).contentWindow[f] || (() => undefined)) : QS(e).contentWindow,
	today = () => new Date().toJSON().slice(0, 10),
	oSumE = o => Object.values(o).reduce((a, b) => parseInt(a) + parseInt(b)),
	cssVar = (v, e = QS(':root')) => e.css(`--${v}`),
	maxV = (array, key) => {
		let max = 0;
		for (let i in array) max = (array[i][key] >= max) ? array[i][key] : max;
		return max;
	},
	bTime = (t, f) => {
		t = Math.round(parseInt(isNaN(t) ? 0 : t));
		let hours = (t > 59) ? parseInt(t / 60) : 0,
			minutes = (t % 60) ? (t % 60) : 0;
		return f ? { hours: hours, minutes: minutes } : ((hours ? `${hours}h ` : '') + (minutes ? `${minutes}'` : '')).trim() || `${t}'`;
	},
	diffDate = (i, f, amount = (1000 * 3600 * 24)) => {
		let date1 = new Date(i),
			date2 = new Date(f),
			timeDiff = Math.abs(date2.getTime() - date1.getTime());

		return Math.ceil(timeDiff / amount);
	},
	isJSON = str => {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return JSON.parse(str);
	},
	sLineChart = (data, orientation, container, sum = 0, dd) => {
		let lines = '',
			max = data.length;

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
	ajax = d => {
		if (!d) d = {};
		let xhttp = d.beacon || new XMLHttpRequest(),
			contentType = d.contentType === undefined || d.contentType,
			data = (contentType ? new URLSearchParams(new FormData(d.form)).toString() : d.form) || '';

		if (d.data && !data) { for (let key in d.data) data += encodeURIComponent(key) + "=" + encodeURIComponent(d.data[key]) + "&" }

		if (d.beacon == true) navigator.sendBeacon(d.url, data) && ((typeof d.callback == 'function') && d.callback());
		else {
			xhttp.onreadystatechange = function() { if (this.readyState == 4 && this.status == 200)(d.done || (() => ''))(this.responseText) };
			xhttp.onerror = () => d.retry && ((typeof d.retry == 'function') ? d.retry : ajax)(d);

			xhttp.open(d.method || 'POST', d.url, d.async === undefined || d.async);
			if (contentType) xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			xhttp.send(data);
		}
		return xhttp;
	},
	post = (url, data, callback, r) => ajax({ url: url, data: data, done: callback, retry: r }),
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
	arrayToNodeList = (a) => {
		let rand = Math.floor(Math.random() * (1e4 - 1)) + 1;
		for (let i of a) i.sAttr('nodelistinprocess', rand);
		return QSA(`[nodelistinprocess="${rand}"]`).mrAttr('nodelistinprocess');
	},
	nodeListToArray = (n) => [...n],
	range = (f, t) => {
		let a = [],
			ty = (isNaN(f)) ? 'l' : 'n';

		if (t == undefined) t = f, f = (ty == 'n') ? 0 : 'a';
		if (ty == 'l') t = t.toLowerCase().charCodeAt(0), f = f.toLowerCase().charCodeAt(0);
		for (let i = f; i <= t; i++) a.push((ty == 'l') ? String.fromCharCode(i) : i);
		return a;
	},
	overlap = (a, b, specific) => {
		let ac = a.getBoundingClientRect(),
			bc = b.getBoundingClientRect(),
			Y = {},
			X = {};

		Y.top = (bc.bottom > ac.top);
		Y.bottom = (ac.top > bc.bottom);

		X.left = (bc.right > ac.left);
		X.right = (ac.left > bc.right);

		return specific ? { y: Y, x: X } : !((ac.right < bc.left || ac.left > bc.right || ac.bottom < bc.top || ac.top > bc.bottom));
	},
	_listeners = [];

/*Append or prepend data to elemet*/
Node.prototype.paste = function(t, p) {
	let pos = ['beforeEnd', 'afterBegin', 'beforeBegin', 'afterEnd'];

	this.insertAdjacentHTML(pos[p || 0], t);
	return this;
};
/*Append or prepend data to NodeList*/
NodeList.prototype.mPaste = function(t, p) { return this.paste(t, p) };
NodeList.prototype.paste = function(t, p) {
	for (let i of this) i.paste(t, p);

	return this;
};
/*innerHTML data to elemet*/
Node.prototype.iHTML = function(e) {
	if (e != undefined) {
		this.innerHTML = '';
		if (typeof e == 'string') this.innerHTML = e;
		else this.appendChild(e);
	}
	return (e != undefined) ? this : this.innerHTML;
};
/*innerText data to elemet*/
Node.prototype.iText = function(e) {
	if (e != undefined) this.innerText = e;
	return (e != undefined) ? this : this.innerText;
};
/*NodeList innerHTML data to elemet*/
NodeList.prototype.miHTML = function(e) { return this.iHTML(e) };
NodeList.prototype.iHTML = function(e) {
	if (e != undefined) {
		for (let i of this) i.iHTML((typeof e == 'function') ? e(i.iHTML()) : e);
	}
	// return (e != undefined) ? this : this.innerHTML;
	return (e != undefined) ? this : this.toArray('map', e => e.iHTML());
};
/*NodeList innerText data to elemet*/
NodeList.prototype.miText = function(e) { return this.iText() };
NodeList.prototype.iText = function(e) {
	if (e != undefined) {
		for (let i of this) i.iText((typeof e == 'function') ? e(i.iText()) : e);
	}
	return (e != undefined) ? this : this.toArray('map', e => e.iText());
};
/*Get attribute of element with fallback*/
Node.prototype.gAttr = function(a, f) { return (this.attributes[a]) ? this.attributes[a].nodeValue : (f ? ((this.attributes[f]) ? this.attributes[f].nodeValue : undefined) : undefined); };
/*Set attribute of element*/
Node.prototype.sAttr = function(a, v) {
	if (this.attributes[a]) this.attributes[a].nodeValue = v;
	else this.setAttribute(a, v);
	return this;
};
/*Remove attribute of element*/
Node.prototype.rAttr = function(a) {
	let that = this;
	a.split(' ').forEach(e => that.removeAttribute(e));
	return this;
};
/*Has class shortcut*/
Node.prototype.hClass = function(c, t) {
	let that = this,
		cond = { 't': false, 'f': false };
	c.split(' ').every(cl => cond[(that.classList.contains(cl) ? 't' : 'f')] = true);
	return t ? cond.t : !cond.f;
};
/*Add class shortcut*/
Node.prototype.aClass = function(c) {
	if (c) this.classList.add(...c.split(' '));
	return this;
};
/*Remove class shortcut*/
Node.prototype.rClass = function(c) {
	if (c) this.classList.remove(...c.split(' '));
	else this.rAttr('class');
	return this;
};
/*Is visible*/
Node.prototype.iVisible = function(c) { return (this.offsetWidth || this.offsetHeight || this.getClientRects().length) };
/*Switch class shortcut*/
Node.prototype.sClass = function(r, a, s) {
	this.rClass(s ? a : r), this.aClass(s ? r : a);
	return this;
};
/*Toggle class shortcut*/
Node.prototype.tClass = function(c, t) {
	(((t === undefined) ? this.hClass(c) : !t) ? c => this.rClass(c) : c => this.aClass(c))(c);
	return this;
};
/*Add class shortcut to NodeList*/
NodeList.prototype.maClass = function(c) { return this.aClass(c) };
NodeList.prototype.aClass = function(c) {
	this.forEach((e) => e.aClass(c));
	return this;
};
/*Remove class shortcut to NodeList*/
NodeList.prototype.mrClass = function(c) { return this.rClass(c); };
NodeList.prototype.rClass = function(c) {
	this.forEach((e) => e.rClass(c));
	return this;
};
/*Switch class shortcut to NodeList*/
NodeList.prototype.msClass = function(r, a, s) { return this.sClass(r, a, s); };
NodeList.prototype.sClass = function(r, a, s) {
	this.forEach((e) => e.sClass(r, a, s));
	return this;
};
/*Toggle class shortcut to NodeList*/
NodeList.prototype.mtClass = function(c, t) { return this.tClass(c, t) };
NodeList.prototype.tClass = function(c, t) {
	this.forEach((e) => e.tClass(c, t));
	return this;
};
/*NodeList Has class shortcut*/
NodeList.prototype.mhClass = function(c, t) { return this.hClass(c, t) };
NodeList.prototype.hClass = function(c, t) {
	let that = this,
		cond = { 't': false, 'f': false };
	that.forEach(i => cond[(i.hClass(c, t) ? 't' : 'f')] = true);
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
NodeList.prototype.sAttr = function(a, v) {
	this.forEach(e => e.sAttr(a, v));
	return this;
};
/*Remove attribute to NodeList*/
NodeList.prototype.mrAttr = function(a, v) { return this.rAttr(a, v) };
NodeList.prototype.rAttr = function(a, v) {
	this.forEach(e => e.rAttr(a, v));
	return this;
};
/*Remove elements from NodeList*/
NodeList.prototype.removes = function(c) { return this.remove() };
NodeList.prototype.remove = function(c) { for (let e of this) e.remove() };
/*Add onclick to elements from Node*/
Node.prototype.oClick = function(c, f) {
	if (f === undefined) f = c, c = '';
	this.onclick = c ? e => (e.target.parent(c) ? (() => f(e)) : (() => undefined))() : f
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
Node.prototype.wait = function(t) {
	let before = Date.now();
	while (Date.now() < before + t) {};
	return this;
};
NodeList.prototype.wait = function(t) {
	let before = Date.now();
	while (Date.now() < before + t) {};
	return this;
};
/*Add/Subtract days from string or object*/
String.prototype.tDate = function(i, o) {
	let date = new Date(this.split('-'));
	if (i) date.setDate(date.getDate() + i);
	return o ? date : date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, 0) + '-' + String(date.getDate()).padStart(2, 0);
};
/*Date to string*/
Date.prototype.DtoS = function() { return this.getFullYear() + '-' + String(this.getMonth() + 1).padStart(2, 0) + '-' + String(this.getDate()).padStart(2, 0) }
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
		data: d || undefined,
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
Node.prototype.nextE = function(p = 1) {
	let e = this;
	try {
		for (let i = 0; i < p; i++) e = e.nextElementSibling;
	} catch (e) {
		return undefined;
	}
	return e;
};
/*Prev element*/
Node.prototype.prevE = function(p = 1) {
	let e = this;
	try {
		for (let i = 0; i < p; i++) e = e.previousElementSibling;
	} catch (e) {
		return undefined;
	}
	return e;
};
/*Get last character of string*/
String.prototype.lastC = function() { return this[this.length - 1]; };
/*Get first character of string*/
String.prototype.firstC = function() { return this[0]; };
/*Return NodeList of closest*/
NodeList.prototype.parent = function(e) {
	let arr = [];
	for (let i of this) {
		if (i.parent(e) && !arr.includes(i)) arr.push(i.parent(e));
	}
	return arrayToNodeList(arr);
};
/*Returns NodeList of elements touching Node*/
Node.prototype.touching = function(c) {
	let that = this,
		list = c || this.parentElement.children,
		touching = [];
	for (let i of list) {
		if (overlap(that, i) && i != that) touching.push(i);
	}

	return arrayToNodeList(touching);
};
/*Makes an NodeList to an Array */
NodeList.prototype.toArray = function(f, p) { return f ? nodeListToArray(this)[f](p) : nodeListToArray(this) };
/*parentElemet n number of times on Node or .closest()*/
Node.prototype.parent = function(n = 1) {
	let e = this;
	if (isNaN(n)) e = this.closest(n);
	else {
		for (let i of range(n - 1)) e = e.parentElement;
	}
	return e;
};
/*Get and set styles to node or nodelist*/
Node.prototype.css = function(s, v) {
	let that = this;
	if (v !== undefined) {
		that.style[s] = v;
	} else if (typeof s == 'object') {
		for (let i in s) that.style[i] = s[i];
	}
	return (v !== undefined || typeof s == 'object') ? that : getComputedStyle(that).getPropertyValue(s);
};
NodeList.prototype.css = function(s, v) {
	let cs = [];
	for (let i of this) cs.push(i.css(s, v));

	return (v !== undefined || typeof s == 'object') ? this : cs;
};
/*Set property to all elements in NodeList*/
NodeList.prototype.sProperty = function(p, v) {
	for (let i of this) i[p] = v;
	return this;
};
/*Set/get property to all elements in NodeList*/
NodeList.prototype.property = function(p, v) {
	let vls = [];
	if (v === undefined)
		for (let i of this) vls.push(i[p]);
	else
		for (let i of this) i[p] = v;
	return (v === undefined) ? vls : this;
};
/*Get and set attributes to node or nodelist*/
Node.prototype.attr = function(s, v) {
	let that = this;
	if (v !== undefined) that.sAttr(s, v);
	else if (typeof s == 'object') {
		for (let i in s) that.sAttr(i, s[i]);
	}
	return (v !== undefined || typeof s == 'object') ? that : that.gAttr(s);
};
NodeList.prototype.attr = function(s, v) {
	let cs = [];
	for (let i of this) cs.push(i.attr(s, v));

	return (v !== undefined || typeof s == 'object') ? this : cs;
};
/*Sort elements by value*/
Node.prototype.sort = function(f, s, o) {
	let itemsArr = nodeListToArray(this.children);
	if (typeof s != 'function') o = s, s == undefined;
	itemsArr.sort((a, b) => (f(a) == f(b)) ? ((!s || (s(a) == s(b))) ? 0 : ((s(a) > s(b)) ? 1 : -1)) : (((f(a) > f(b) && !o) || (f(a) < f(b) && o)) ? 1 : -1));
	for (i = 0; i < itemsArr.length; ++i) this.appendChild(itemsArr[i]);
	return this;
};
/*Know if element is inside a NodeList*/
Node.prototype.in = function(nl) { return nodeListToArray((nl instanceof NodeList || nl instanceof HTMLCollection) ? nl : nl.children).includes(this) };
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