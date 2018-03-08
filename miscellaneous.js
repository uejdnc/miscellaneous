/*
	QS = Shortcut of querySelector
	QSA = Shortcut of querySelectorAll
	today = Today's date on string
	diffDate = Difference in days from two strings
	isJSON = If string is valid JSON
	bTime = Beautify Time
	oSumE = Sum elements in object
	maxV = Get max value of JSON
*/
var QS = (e, p) => (p || document).querySelector(e),
	QSA = (e, p) => (p || document).querySelectorAll(e),
	QID = (e, p) => (p || document).getElementById(e),
	QC = (e, p) => (p || document).getElementsByClassName(e),
	QTAG = (e, p) => (p || document).getElementsByTagName(e),
	today = () => new Date().toJSON().slice(0, 10),
	oSumE = (o) => Object.values(o).reduce((a, b) => parseInt(a) + parseInt(b)),
	cssVar = (v, e = QS(':root')) => getComputedStyle(e).getPropertyValue(`--${v}`),
	maxV = (array, key) => {
		let max = 0;
		for (let i in array) max = (array[i][key] >= max) ? array[i][key] : max;
		return max;
	},
	bTime = t => {
		t = Math.round(parseInt(isNaN(t) ? 0 : t));
		return (((t > 59) ? `${parseInt(t / 60)}h ` : '') + ((t % 60) ? `${(t % 60)}'` : '')).trim() || `${t}'`;
	},
	diffDate = (i, f, amount = (1000 * 3600 * 24)) => {
		let date1 = new Date(i),
			date2 = new Date(f),
			timeDiff = Math.abs(date2.getTime() - date1.getTime());

		return Math.ceil(timeDiff / amount);
	},
	isJSON = (str) => {
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

		if (d.data && !data) { for (key in d.data) data += encodeURIComponent(key) + "=" + encodeURIComponent(d.data[key]) + "&" }

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
	toDataURL = (src, callback, outputFormat) => {
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = function() {
			let canvas = document.createElement('CANVAS'),
				ctx = canvas.getContext('2d'),
				dataURL;
			canvas.height = this.naturalHeight;
			canvas.width = this.naturalWidth;
			ctx.drawImage(this, 0, 0);
			dataURL = canvas.toDataURL(outputFormat);
			callback(dataURL);
		};
		img.src = src;
		if (img.complete || img.complete === undefined) {
			img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			img.src = src;
		}
	};

/*Append or prepend data to elemet*/
Node.prototype.paste = function(t, p) {
	let pos = ['beforeEnd', 'afterBegin', 'beforeBegin', 'afterEnd'];

	this.insertAdjacentHTML(pos[p || 0], t);
	return this;
};
/*Append or prepend data to elemet*/
Node.prototype.iHTML = function(e) {
	if (e) {
		this.innerHTML = '';
		if (typeof e == 'string') this.innerHTML = e;
		else this.appendChild(e);
	}
	return e ? this : this.innerHTML;
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
	this.classList.add(...c.split(' '));
	return this;
};
/*Remove class shortcut*/
Node.prototype.rClass = function(c) {
	this.classList.remove(...c.split(' '));
	return this;
};
/*Is visible*/
Node.prototype.iVisible = function(c) {
	return (this.offsetWidth || this.offsetHeight || this.getClientRects().length);
};
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
NodeList.prototype.maClass = function(c) {
	this.forEach((e) => e.aClass(c));
	return this;
};
/*Remove class shortcut to NodeList*/
NodeList.prototype.mrClass = function(c) {
	this.forEach((e) => e.rClass(c));
	return this;
};
/*Switch class shortcut to NodeList*/
NodeList.prototype.msClass = function(r, a, s) {
	this.forEach((e) => e.sClass(r, a, s));
	return this;
};
/*Toggle class shortcut to NodeList*/
NodeList.prototype.mtClass = function(c, t) {
	this.forEach((e) => e.tClass(c, t));
	return this;
};
/*Get attribute of nodeList with fallback*/
NodeList.prototype.mgAttr = function(a, f) { return Array.from(this).map(e => e.gAttr(a, f)) };
/*Get ids of nodeList with fallback*/
NodeList.prototype.ids = function(a, f) { return Array.from(this).map(e => e.id) };
/*NodeList multifunction to array*/
NodeList.prototype.multiArray = function(f, p) { return Array.from(this).map(e => p ? e[f](...p) : e[f]) };
/*Set attribute to NodeList*/
NodeList.prototype.msAttr = function(a, v) {
	this.forEach(e => e.sAttr(a, v));
	return this;
};
/*Remove attribute to NodeList*/
NodeList.prototype.mrAttr = function(a, v) {
	this.forEach(e => e.rAttr(a, v));
	return this;
};
/*Remove elements from NodeList*/
NodeList.prototype.removes = function(c) { for (let e of this) e.remove() };
/*Add onclick to elements from NodeList*/
NodeList.prototype.oClick = function(c) {
	for (let e of this) e.onclick = c
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

		if (that.childNodes.length) {
			[].slice.call(that.childNodes).forEach(function(that) {
				clone.appendChild(that.cloneN());
			});
		}
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
String.prototype.createHTML = function() { return document.createRange().createContextualFragment(this) }
/*Replace element with an HTML string*/
Node.prototype.replaceElement = function(s) {
	this.replaceWith((typeof s == 'string') ? s.createHTML() : s);
}
/*Next element*/
Node.prototype.nextE = function(p = 1) {
	let e = this;
	try {
		for (let i = 0; i < p; i++) e = e.nextElementSibling;
	} catch (e) {
		return undefined;
	}
	return e;
}
/*Prev element*/
Node.prototype.prevE = function(p = 1) {
	let e = this;
	try {
		for (let i = 0; i < p; i++) e = e.previousElementSibling;
	} catch (e) {
		return undefined;
	}
	return e;
}