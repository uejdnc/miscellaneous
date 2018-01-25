/*
QS = Shortcut of querySelector
QSA = Shortcut of querySelectorAll
today = Today's date on string
diffDate = Difference in days from two strings
isJSON = If string is valid JSON
bTime = Beautify Time
oSumE = Sum elements in object
*/
var QS = (e, p) => (p ? p : document).querySelector(e),
	QSA = (e, p) => (p ? p : document).querySelectorAll(e),
	today = () => { return new Date().toJSON().slice(0, 10) },
	oSumE = (o) => { return Object.values(o).reduce((a, b) => parseInt(a) + parseInt(b)) },
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
		return true;
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
	ajax = (d) => {
		let xhttp = new XMLHttpRequest(),
			data = new URLSearchParams(new FormData(d.form)).toString() || '';
		xhttp.onreadystatechange = function() { if (this.readyState == 4 && this.status == 200)(d.done || (() => ''))(this.responseText) };

		xhttp.open(d.method || 'POST', d.url, d.async || true);
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		if (d.data && !data) { for (key in d.data) data += encodeURIComponent(key) + "=" + encodeURIComponent(d.data[key]) + "&" }

		xhttp.send(data);
	};

/*Append or prepend data to elemet*/
Node.prototype.paste = function(t, p) { this.insertAdjacentHTML(p ? 'afterbegin' : 'beforeend', t) };
/*Get attribute to element with fallback*/
Node.prototype.gAttr = function(a, f) { return (this.attributes[a]) ? this.attributes[a].nodeValue : (f ? ((this.attributes[f]) ? this.attributes[f].nodeValue : undefined) : undefined); };
/*Set attribute to element*/
Node.prototype.sAttr = function(a, v) {
	if (this.attributes[a]) this.attributes[a].nodeValue = v;
	else this.setAttribute(a, v);
};
/*Has class shortcut*/
Node.prototype.hClass = function(c) { return (this) ? this.classList.contains(c) : ''; };
/*Add class shortcut*/
Node.prototype.aClass = function(c) { this.classList.add(...c.split(' ')) };
/*Remove class shortcut*/
Node.prototype.rClass = function(c) { this.classList.remove(...c.split(' ')) };
/*Switch class shortcut*/
Node.prototype.sClass = function(r, a, s) { this.classList.remove(...(s ? a : r).split(' ')), this.classList.add(...(s ? r : a).split(' ')) };
/*Toggle class shortcut*/
Node.prototype.tClass = function(c, t) {
	let cond = (t === undefined) ? this.hClass(c) : !t;
	if (cond) this.rClass(c);
	else this.aClass(c);
};
/*Add class shortcut to NodeList*/
NodeList.prototype.maClass = function(c) { this.forEach((e) => e.aClass(c)) };
/*Remove class shortcut to NodeList*/
NodeList.prototype.mrClass = function(c) { this.forEach((e) => e.rClass(c)) };
/*Switch class shortcut to NodeList*/
NodeList.prototype.msClass = function(r, a, s) { this.forEach((e) => e.sClass(r, a, s)) };
/*Toggle class shortcut to NodeList*/
NodeList.prototype.mtClass = function(c, t) { this.forEach((e) => e.tClass(c, t)) };
/*Remove elements from NodeList*/
NodeList.prototype.removes = function(c) { this.forEach(i => i.remove()) };
/*Add onclick to elements from NodeList*/
NodeList.prototype.oClick = function(c) { this.forEach(i => i.onclick = c) };
/*Add mouseenter and mouseleave to elements from NodeList*/
NodeList.prototype.oHover = function(e, l) { this.forEach((i) => { i.onmouseenter = e, i.onmouseleave = l || e; }) };
/*Multiple events (click, input, etc) to Node*/
Node.prototype.oevent = function(e, f) {
	let that = this,
		events = e.trim().split(' ');
	for (let i in events) that[`on${events[i]}`] = f;
}
/*Multiple events (click, input, etc) to NodeList*/
NodeList.prototype.oEvent = function(e, f) {
	let events = e.trim().split(' ');
	this.forEach((ele) => { for (let i in events) ele[`on${events[i]}`] = f });
}
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