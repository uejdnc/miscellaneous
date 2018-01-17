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
		t = Math.round(parseInt(t));
		return (((t > 59) ? parseInt(t / 60) + 'h ' : '') + ((t % 60) ? (t % 60) + '\'' : '')).trim();
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
	}

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
	if (cond) this.classList.remove(...c.split(' '));
	else this.classList.add(...c.split(' '));
};
/*Add class shortcut to NodeList*/
NodeList.prototype.maClass = function(c) { this.forEach((e) => e.classList.add(...c.split(' '))) };
/*Remove class shortcut to NodeList*/
NodeList.prototype.mrClass = function(c) { this.forEach((e) => e.classList.remove(...c.split(' '))) };
/*Switch class shortcut to NodeList*/
NodeList.prototype.msClass = function(r, a, s) { this.forEach((e) => { e.classList.remove(...(s ? a : r).split(' ')), e.classList.add(...(s ? r : a).split(' ')) }) };
/*Toggle class shortcut to NodeList*/
NodeList.prototype.mtClass = function(c, t) {
	let cond = (t === undefined) ? this[0].hClass(c) : !t;

	if (cond) this.forEach((e) => e.classList.remove(...c.split(' ')));
	else this.forEach((e) => e.classList.add(...c.split(' ')));
};
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