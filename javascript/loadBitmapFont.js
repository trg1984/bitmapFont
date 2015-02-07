var letter = new Array();
var conv = [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
	'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
	'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'å', 'ä', 'ö', 'Å', 'Ä', 'Ö', '.', ',', ';', '!',
	'?', '-', '+', '*', '/', '\\', ':', '_', '<', '>', '|', '%', '½', '$1/3$', '$1/4$', '"', '$endquote$',
	'#', '$', '€', '&', '[', ']', '{', '}', '(', ')', '=', '$geq$', '$leq$', '$approx$', '´', '`', "'",
	'1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '¨', '^', 'Ð'
];

loadBitmapFont = function(filename, height) {
	letter = new Array();
	var img = new Image();
	img.done = false;
	img.onload = function() {
		
		if (!img.done) {
			
			var scale = height / img.height;
			// Create a new canvas for editing.
			var canvas = document.createElement('canvas');
			var canvas2 = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			var ctx2 = canvas2.getContext('2d');
			
			addLetter = function (first, last) {
				// Collect the image to an array.
				letter[letter.length] = new Image();
				letter[letter.length - 1].width  = canvas2.width = last - first + 1 + 2 * margin;
				letter[letter.length - 1].height = canvas2.height = canvas.height;
				letter[letter.length - 1].id = letter[letter.length - 1].alt = conv[letter.length - 1];
				letter[letter.length - 1].style.width = letter[letter.length - 1].width + "px";
				letter[letter.length - 1].style.height = letter[letter.length - 1].height + "px";
				canvas2.style.width = canvas2.width + "px";
				canvas2.style.height = canvas2.height + "px";
				
				var tempImg = ctx.getImageData(first - margin, 0, canvas2.width, canvas2.height);
				ctx2.putImageData(tempImg, 0, 0);
				letter[letter.length - 1].src = canvas2.toDataURL("image/png");
				
				// Create CSS class.
				var style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML = 
					'.item' + (letter.length - 1) +' {' +
					' color: rgba(0, 0, 0, 0);' + 
					' font-size: 10px;' + 
					' line-height: 32px;' + 
					' padding-top: 0px;' + 
					' margin-bottom: -8px;' + 
					' display: inline-block;' + 
					' background-image: url(' + letter[letter.length - 1].src + ");" +
					' width: ' + letter[letter.length - 1].width + "px;" +  
					' height: ' + letter[letter.length - 1].height + "px;" + 
					'}\n' + 
					'@media print {' +
						'.item' + (letter.length - 1) +':before {' +
							' color: rgba(0, 0, 0, 0);' + 
							' font-size: 10px;' + 
							' line-height: 32px;' + 
							' margin-bottom: -8px;' + 
							' display: inline-block;' + 
							' content: url(' + letter[letter.length - 1].src + ");" +
							' width: ' + letter[letter.length - 1].width + "px;" +  
							' height: ' + letter[letter.length - 1].height + "px;" + 
						'}' +
					'}';
				document.getElementsByTagName('head')[0].appendChild(style);
			}
			
			// Resize canvas.
			canvas.width = img.width * scale;
			canvas.height = img.height * scale;
			canvas.style.width = canvas.width + "px";
			canvas.style.height = canvas.height + "px";
			
			// Draw the loaded image on the canvas.
			ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
			var temp = ctx.getImageData(0, 0, canvas.width, canvas.height);

			// Loop over each pixel. Figure out letter locations
			var	wid = canvas.width;
			var first = -1;
			var last = 0;
			var margin = 0;
			var letterBounds = new Array();
			for (var i = 0; i < canvas.width; i++)
			for (var j = 0; j < canvas.height; j++)
			if (temp.data[4 * (j * wid + i) + 3] > 0) {
			
				if (i - last <= 1)
					last = i;
				else if (i - last > 1) {
					if (first >= 0) {
						letterBounds[letterBounds.length] = {first: first, last : last};
						addLetter(first, last);
					}
					first = i;
					last = i;
				}
			}
			
			letterBounds[letterBounds.length] = {first: first, last : last};
			addLetter(first, last);
			ctx.putImageData(temp, 0, 0);
			img.done = true;
		}
	};
	img.src = filename;
}

charToItem = function(c) {
	var k = 1;
	while ((conv[k] != c) && (k < letter.length)) k++;
	if (k == letter.length) return -1;
	else return k;
}

rasterFont = function(letters, id, s) {
	var elem = document.getElementById(id);
	elem.style.fontSize = letters[0].height / 2;
	//elem.innerHTML = '<span>';
	elem.innerHTML = '';
	var ind = -1;
	var temp = '<span class="rasterText"><p><span class="word">';
	for(var i = 0; i < s.length; i++) {
		var charSym = s.charAt(i);
		ind = charToItem(charSym);
		if (ind >= 0) temp += '<span class="letter item' + ind + '">' + charSym + '</span>';
		else if (s.charAt(i) == "\n") temp  += '</span><br /><span class="word">';
		else temp  += '</span> <span class="word">';
	}
	temp += "</span></p>";
	temp = temp.replace(/<span class="word"><\/span>/g, '').replace(/<br \/><br \/>/g, '</p><p>');
	elem.innerHTML = temp;
	
	
	elem.innerHTML  += '</span>';
}