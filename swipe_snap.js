//	Swipe & Snap
//	Copyright 2019, MIT License
//	http://github.com/UnitedHotcakesPreferred/swipe-snap

jQuery(document).ready(function() {	// set display landmarks

var	portAxis = jQuery('div.swipe_snap');
	if (!portAxis.find('li').hasClass('select')) {
		portAxis.find('li:first-child + li').addClass('select');
		portAxis.find('li > a')[0].className = 'asdf';
		portAxis.find('a.asdf').append(document.createElement('img'));
		portAxis.find('a.asdf').children('img').attr({alt: '', src: portAxis.find('a.asdf').attr('href')});
	}
	if ('ontouchstart' in self) portAxis.addClass('isTouch');
	else {
	var	vDisplay = navigator.userAgent.toLowerCase();
		if (vDisplay.indexOf('phone') < 0 && vDisplay.indexOf('mobile') < 0 && vDisplay.indexOf('tablet') < 0) portAxis.addClass('isMouse');
	}
	jQuery('.asdf').removeClass('asdf');
});
jQuery(self).on('load', function() {
var	portAxis = jQuery('div.swipe_snap'),
	portArea = portAxis.children('div'),
	port = portArea[0],
	isVert = portAxis.hasClass('vertical'),
	isMouse = portAxis.hasClass('isMouse'),

	plateID = function() {		// return ID attribute name

		return ('plate' + percentxt(arguments[0]));
	},
	jPlate = function() {		// return selector

		return ((arguments.length > 1 ? 'li.' : 'li#') + plateID(arguments[0]));
	},
	percentxt = function() {	// return 2 figures
	var	count = arguments[0];
		return ((count > 9 ? '' : '0') + count.toString());
	},
	scrollPull = function() {	// scroll horizontal or vertical
	var	speed = arguments[2],
		newSnap = arguments[1];
		portArea.find(jPlate(arguments[0])).addClass('focus');
		if (isVert) if (speed) portArea.animate({scrollTop: newSnap}, speed);
			else portArea.scrollTop(newSnap);
		else if (speed) portArea.animate({scrollLeft: newSnap}, speed);
			else portArea.scrollLeft(newSnap);
	},
	jump = function() {		// advance scroll
	var	count = arguments[0],
		ixJump = (arguments[1] && portArea.find(jPlate(count)).hasClass('select') ? 1 : 0) + count - 1,
		newSnap = ixJump * port.snapLength;

		if (newSnap != (jQuery('div.swipe_snap').hasClass('vertical') ? portArea.scrollTop() : portArea.scrollLeft())) {
			scrollPull(ixJump+1, newSnap, (portArea.find(jPlate(ixJump)).hasClass('swipe_out') ? 750 : 0));
		}
	},
	updateDisplay = function() {	// scroll on drag, snap or select

	var	startDrag, pageFrac, toSelect,
		isTouch = portAxis.hasClass('isTouch'),
		endEvent = (isTouch) ? 'touchend' : 'mouseup',
		moveEvent = (isTouch) ? 'touchmove' : 'mousemove',
		startEvent = (isTouch) ? 'touchstart' : 'mousedown',
		pageTotal = portArea.find('li a:first-child').length,
		scrollFrom = (isVert) ? portArea.scrollTop() : portArea.scrollLeft(),
		count = (isNaN(arguments[0])) ? Math.floor(scrollFrom/port.snapLength) : arguments[0]-1,	// crawl or set advance

		newSnap = port.snapLength * count++,
		isSelect = portArea.find('li.select'),
		getTouch = function(event) {
		var	eTouch = (event.originalEvent.touches) ? event.originalEvent.touches[0] : event;
			return (isVert ? eTouch.pageY : eTouch.pageX);
		};
		toSelect = portArea.find(jPlate(count));
		if (!toSelect.hasClass('select')) {
			if (portArea.hasClass('enable') && portArea.find(jPlate(count - 1)).hasClass('select')) {
				isSelect.removeClass('fade');
				toSelect.addClass('fade');
			}
			isSelect.removeClass('select');
			toSelect.addClass('select');
			portArea.find('li.focus').removeClass('focus');
		}
		if (port.timeoutID) self.clearTimeout(port.timeoutID);
		if (newSnap != scrollFrom) port.timeoutID = self.setTimeout(function() { scrollPull(count, newSnap, 99); }, 300);

	//	update display

		pageFrac = 'Page ' + count.toString() + ' of ' + pageTotal.toString();
		jQuery('.page_number').text(pageFrac);
		jQuery('li.hilite').removeClass('hilite');
		jQuery(jPlate(count, 1)).addClass('hilite');
		if (isMouse) {
			portArea.find(jPlate(count)).find('a:last-child').attr('title', pageFrac);
			if (count < pageTotal) portArea.find(jPlate(count + 1)).find('a:last-child').attr('title', 'Next');
			if (count > 1) portArea.find(jPlate(count - 1)).find('a:last-child').attr('title', 'Previous');
		} else {

	//	set-up next drag

			isSelect.find('a:last-child').off(startEvent).off(moveEvent).off(endEvent);
			portArea.find('li.select a:last-child').on(startEvent, function(event) {
				startDrag = getTouch(event);
				event.preventDefault();
			}).on(endEvent, function(event) {
				startDrag = 0;
				event.preventDefault();
			}).on(moveEvent, function(event) {
			var	endDrag = getTouch(event);
				event.preventDefault();
				if (startDrag && startDrag != endDrag) {
					jump(startDrag < endDrag ? count - 1 : count + 1);
					startDrag = 0;
				}
			});
		}
	},
	enable = function() {		// load & fit images
	var	displayHeight,
		toc = jQuery('ul.toc'),
		widthHTML = document.documentElement.clientWidth,
		minGap = (isMouse) ? 72 : widthHTML - portAxis.width(),	// what to shave-off to fit in display

		navSize = (isMouse || (screen.width >= 768 && screen.height >= 768)) ? 44 : 33,	// prev/next width
		listLI = portArea.find('li'),
		imgArea = listLI.find('img'),
		navWidth = (isVert) ? 0 : navSize,
		navHeight = navSize - navWidth,
		borderGap = (isMouse) ? 6 : 0,
		padWidth = (isMouse) ? navSize : navWidth,
		padHeight = (isMouse) ? navSize : navHeight,
		barWidth = (isMouse && isVert) ? portArea.width() - portArea.children('ul').width() : 0,
		imgWidth = imgArea.width(),
		imgHeight = imgArea.height(),
		portWidth = widthHTML - minGap,
		portHeight = document.documentElement.clientHeight - minGap,
		fitWidth = (portWidth < imgWidth + barWidth + borderGap + 2 * padWidth),
		fitHeight = (portHeight < imgHeight + borderGap + 2 * navHeight),
		giveTotal = (portAxis.hasClass('basic_slates')) ? 'span' : 'span.page_total',	// default to center basic words & phrases
		pageTotal = listLI.find('a:last-child').length,
		px = function() {
			return (arguments[0].toString() + 'px');
		},
		addImg = function() {	// insert image in link

		var	objHref = arguments[0];
			if (!objHref.children('img').length) {
				objHref.append(document.createElement('img'));
				objHref.children('img').attr({alt: '', src: objHref.attr('href')});
			}
		};
		toc.html('');
		for (var ix=1;ix<=pageTotal;ix++) {
			if (listLI[ix].getElementsByTagName('a').length) {
			var	tocLast, displayLI,
				countxt = ix.toString(),
				ixHref = 'javascript://Page-' + countxt;
				toc.append(document.createElement('li'));
				listLI[ix].setAttribute('id', plateID(ix));
				listLI[ix].count = ix;
				displayLI = portArea.find(jPlate(ix));

				addImg(displayLI.children('a:first-child'));
				if (displayLI.children('a + a').length) {
					addImg(displayLI.children('a + a:last-child'));
					if (displayLI.children('a + a + a').length) addImg(displayLI.children('a:first-child + a'));
				}
				displayLI.find('span.page_total a').text(countxt + ' / ' + pageTotal.toString());
				displayLI.find('a:last-child').attr('href', ixHref).on('click', function() {
				var	count = (this.parentElement.count) ? this.parentElement.count : this.parentElement.parentElement.count;
					jump(count, (isMouse && count < pageTotal));
				});
				tocLast = toc.children('li:last-child');
				tocLast.addClass(plateID(ix));
				tocLast.append(document.createElement('a'));
				tocLast.children('a').text(percentxt(ix)).attr('href', ixHref).on('click', function() {
					if (this.parentElement.className.indexOf(portArea.find('li.select').attr('id')) < 0) {
						jump(jQuery('li#' + this.parentElement.className)[0].count);
					}
				});
			}
		}
		if (fitHeight) {
			imgHeight = portHeight - (borderGap + 2 * padHeight);
			imgArea.attr('style', 'max-height: ' + px(imgHeight));
			imgWidth = imgArea.width();
			fitWidth = (portWidth < imgWidth + barWidth + 2 * padWidth);
		}
		if (fitWidth) {
			imgWidth = portWidth - (borderGap + barWidth + 2 * padWidth);
			imgArea.attr('style', 'max-width: ' + px(imgWidth));
			imgHeight = imgArea.height();
		}
		displayHeight = px(imgHeight + 2 * navHeight);
		if (isVert) {
			if (fitWidth || fitHeight) listLI.find('img').attr('style', 'height: ' + px(imgHeight));
			listLI.find('a:last-child, span:first-child').css({'width': px(imgWidth), 'height': px(imgHeight)});
			listLI.children('strong').html(isMouse ? document.createElement('sub') : '&circ;');
			listLI.find('strong sub').append('&circ;');
			portArea.css('max-height', displayHeight);
		} else {
			if (fitWidth || fitHeight) listLI.find('img').attr('style', 'width: ' + px(imgWidth));
			listLI.find('span').children('a').css({'width': px(imgWidth), 'height': px(imgHeight)});
			listLI.children('strong + span').css('min-width', px(navSize));
			portArea.find('li:first-child > strong').css('margin-right', px(imgWidth/2));
			portArea.find('li:last-child > strong').css('margin-left', px(imgWidth/2));
		}
		if (isMouse) portArea.css('padding', px(navWidth) + ' ' + px(navHeight));
		listLI.children(giveTotal).children('a').css('line-height', px(imgHeight));
		listLI.children('strong').css({'width': (isVert ? px(imgWidth) : px(navSize)), 'font-size': (navSize > 33 ? '32px' : '24px')});
		listLI.find('a').on('focus', function() { this.blur(); });
		portArea.find('li:first-child, li:last-child').css('line-height', (navHeight ? px(navHeight) : displayHeight));
		portArea.css('max-width', px(imgWidth + barWidth + 2 * navWidth));
		port.snapLength = (isVert) ? imgArea.height() : imgArea.width();
		port.onscroll = updateDisplay;
		if (barWidth) jQuery('.page_number').css('margin-right', px(barWidth));
		updateDisplay(isNaN(arguments[0]) ? 1 : arguments[0]);
	};
	jQuery(self).on('resize', function() {

	//	keep display order on resize

		portArea.find('img').attr('style', '');
		enable(portArea.find('li.select')[0].count);
	});
	enable();
});