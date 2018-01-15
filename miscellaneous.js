/*
QS = Shortcut of querySelector
QSA = Shortcut of querySelectorAll
today = Today's date on string
diffDate = Difference in days from two strings
*/
var QS = (e, p) => (p ? p : document).querySelector(e),
	QSA = (e, p) => (p ? p : document).querySelectorAll(e),
	today = () => { return new Date().toJSON().slice(0, 10) },
	diffDate = (i, f, amount = (1000 * 3600 * 24)) => {
		let date1 = new Date(i),
			date2 = new Date(f),
			timeDiff = Math.abs(date2.getTime() - date1.getTime());

		return Math.ceil(timeDiff / amount);
	};

/*Append or prepend data to elemet*/
Node.prototype.paste = function(t, p) { this.innerHTML = p ? t + this.innerHTML : this.innerHTML + t };
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
Node.prototype.aClass = function(c) { this.classList.add(c) };
/*Remove class shortcut*/
Node.prototype.rClass = function(c) { this.classList.remove(c) };
/*Toggle class shortcut*/
Node.prototype.tClass = function(c, t) {
	let cond = (t === undefined) ? this.hClass(c) : !t;
	if (cond) this.classList.remove(c);
	else this.classList.add(c);
};
/*Remove elements from NodeList*/
NodeList.prototype.removes = function(c) { this.forEach(i => i.remove()) };
/*Add onclick to elements from NodeList*/
NodeList.prototype.oClick = function(c) { this.forEach(i => i.onclick = c) };
/*Add mouseenter and mouseleave to elements from NodeList*/
NodeList.prototype.oHover = function(e, l) { this.forEach((i) => { i.onmouseenter = e, i.onmouseleave = l || e; }) };
/*Add/Subtract days from string or object*/
String.prototype.tDate = function(i, o) {
	let date = new Date(this.split('-'));
	if (i) date.setDate(date.getDate() + i);
	return o ? date : date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, 0) + '-' + String(date.getDate()).padStart(2, 0);
};
/*Date to string*/
Date.prototype.DtoS = function() {
	return this.getFullYear() + '-' + String(this.getMonth() + 1).padStart(2, 0) + '-' + String(this.getDate()).padStart(2, 0);
}
/*If is a valid date*/
String.prototype.iDate = function(i, o) { return new Date(this) != 'Invalid Date' };
/*Get element index*/
Node.prototype.gIndex = function() { return Array.prototype.slice.call(this.parentElement.children).indexOf(this) };
/*If string is valid JSON*/
function isJSON(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}