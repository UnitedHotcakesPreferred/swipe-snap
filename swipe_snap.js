//	Swipe & Snap
//	Copyright 2019 MIT License
//	github.com/UnitedHotcakesPreferred/swipe-snap

jQuery(document).ready(function() {	// set landmark classes

var	portAxis = jQuery('div.swipe_snap');
	if (!portAxis.find('li').hasClass('select')) {
		portAxis.find('li > a')[0].appendChild(document.createElement('img'));
		portAxis.find('li > a img').attr({alt: '', src: portAxis.find('li > a img').parent().attr('href')});
		portAxis.find('li:first-child + li').addClass('select');
	}
	if ('ontouchstart' in self) portAxis.addClass('isTouch');
	else {
	var	vDisplay = navigator.userAgent.toLowerCase();
		if (vDisplay.indexOf('phone') < 0 && vDisplay.indexOf('mobile') < 0 && vDisplay.indexOf('tablet') < 0) portAxis.addClass('isMouse');
	}
});
jQuery(self).on('load', function() {
var	timeoutID, snapLength,
	portAxis = jQuery('div.swipe_snap'),
	portArea = portAxis.children('div'),
	isMouse = portAxis.hasClass('isMouse'),
	isVert = portAxis.hasClass('vertical'),

	plateID = function() {		// give ID name

		return ('plate' + (arguments[0] > 9 ? '' : '0') + arguments[0].toString());
	},
	jPlate = function() {		// style ID or class

		return ((arguments.length > 1 ? 'li.' : 'li#') + plateID(arguments[0]));
	},
	scrollPull = function() {	// scroll how
	var	speed = arguments[2],
		newSnap = arguments[1];
		portArea.find(jPlate(arguments[0])).addClass('focus');
		if (isVert) if (speed) portArea.animate({scrollTop: newSnap}, speed);
			else portArea.scrollTop(newSnap);
		else if (speed) portArea.animate({scrollLeft: newSnap}, speed);
			else portArea.scrollLeft(newSnap);
	},
	jump = function() {		// scroll where

	var	newFocus =	arguments[0] - (arguments[1] && portArea.find(jPlate(arguments[0])).hasClass('select') ? 0 : 1),
		newSnap =	snapLength * newFocus++;

		if (newSnap != (isVert ? portArea.scrollTop() : portArea.scrollLeft())) {
			scrollPull(newFocus--, newSnap, (portArea.find(jPlate(newFocus)).hasClass('select') && portArea.find(jPlate(newFocus)).hasClass('swipe_out') ? 750 : 0));
		}
	},
	enable = function() {		// load & fit images
	var	displayHeight,
		toc = jQuery('ul.toc'),
		minGap = (isMouse) ? 72 : jQuery(document).width() - portAxis.width(),	// get gutter
		listLI = portArea.find('li'),
		imgArea = listLI.find('img'),
		navSize = (screen.width >= 768 && screen.height >= 768) ? 44 : 33,	// prev/next width
		navWidth = (isVert) ? 0 : navSize,
		navHeight = navSize - navWidth,
		borderGap = (isMouse) ? 6 : 0,
		padHeight = (isMouse) ? navSize : navHeight,
		padWidth = (isMouse) ? navSize : navWidth,
		barWidth = (isMouse && isVert) ? portArea.width() - portArea.children('ul').width() : 0,
		imgWidth = imgArea.width(),
		imgHeight = imgArea.height(),
		portWidth = jQuery(document).width() - minGap,
		portHeight = jQuery(self).height() - minGap,
		pageTotal = listLI.find('a:last-child').length,
		giveTotal = (portAxis.hasClass('basic_slates')) ? 'span' : 'span.page_total',	// class to center
		fitHeight = (portHeight < imgHeight + borderGap + 2 * navHeight),
		fitWidth = (portWidth < imgWidth + barWidth + borderGap + 2 * padWidth),
		px = function() {
			return (arguments[0].toString() + 'px');
		},
		addImg = function() {

		var	objHref = arguments[0];
			if (!objHref.children('img').length) {
				objHref.append(document.createElement('img'));
				objHref.children('img').attr({alt: '', src: objHref.attr('href')});
			}
		},
		updateDisplay = function() {

	//	scroll effects

		var	endTug, startTug, startFirst, pageFrac, toSelect,
			isTouch = portAxis.hasClass('isTouch'),
			endEvent = (isTouch) ? 'touchend' : 'mouseup',
			moveEvent = (isTouch) ? 'touchmove' : 'mousemove',
			startEvent = (isTouch) ? 'touchstart' : 'mousedown',
			pageTotal = portArea.find('li a:first-child').length,
			scrollFrom = (isVert) ? portArea.scrollTop() : portArea.scrollLeft(),
			count = (isNaN(arguments[0])) ? Math.floor(scrollFrom/snapLength) : arguments[0] - 1,	// crawl or jump

			newSnap = snapLength * count++,
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
			if (timeoutID) self.clearTimeout(timeoutID);
			if (newSnap != scrollFrom) timeoutID = self.setTimeout(function() { scrollPull(count, newSnap, 99); }, 300);

	//	display progress

			pageFrac = 'Page ' + count.toString() + ' of ' + pageTotal.toString();
			jQuery('.page_number').text(pageFrac);
			jQuery('li.hilite').removeClass('hilite');
			jQuery(jPlate(count, 1)).addClass('hilite');
			if (isMouse) {
				portArea.find(jPlate(count)).find('a:last-child').attr('title', pageFrac);
				if (count < pageTotal) portArea.find(jPlate(count + 1)).find('a:last-child').attr('title', 'Next');
				if (count > 1) portArea.find(jPlate(count - 1)).find('a:last-child').attr('title', 'Previous');
			} else {

	//	by swipe

				isSelect.find('a:last-child').off(startEvent).off(moveEvent).off(endEvent);
				portArea.find('li.select a:last-child').on(startEvent, function(event) {
					event.preventDefault();
					startFirst = startTug = getTouch(event);
				}).on(moveEvent, function(event) {
					event.preventDefault();
					if (endTug != getTouch(event)) {
						if (endTug) startTug = endTug;
						endTug = getTouch(event);
					}
				}).on(endEvent, function(event) {
					event.preventDefault();
					if ((startFirst > endTug && startTug > endTug) || (endTug > startTug && endTug > startFirst)) {
						jump(startTug < endTug ? count - 1 : count + 1);
					}
				});
			}
		};
		portArea.off();
		toc.html('');
		for (var ix=1;ix<=pageTotal;ix++) {
			if (listLI[ix].getElementsByTagName('a').length) {
			var	tocLast, displayLI,
				ixHref = 'javascript://Page-' + ix.toString();
				toc.append(document.createElement('li'));
				listLI[ix].setAttribute('id', plateID(ix));
				listLI[ix].count = ix;
				displayLI = portArea.find(jPlate(ix));

				addImg(displayLI.children('a:first-child'));
				if (displayLI.children('a + a').length) {
					addImg(displayLI.children('a + a:last-child'));
					if (displayLI.children('a + a + a').length) addImg(displayLI.children('a:first-child + a'));
				}
				displayLI.find('span.page_total a').text(ix.toString() + ' / ' + pageTotal.toString());
				displayLI.find('a:last-child').attr('href', ixHref).on('click', function() {
				var	count = (this.parentElement.count) ? this.parentElement.count : this.parentElement.parentElement.count;
					jump(count, (isMouse && count < pageTotal));
					return false;
				});
				tocLast = toc.children('li:last-child');
				tocLast.addClass(plateID(ix));
				tocLast.append(document.createElement('a'));
				tocLast.children('a').text((ix > 9 ? '' : '0') + ix.toString()).attr('href', ixHref).on('click', function() {
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
		snapLength = (isVert) ? imgHeight : imgWidth;
		listLI.children(giveTotal).children('a').css('line-height', px(imgHeight));
		listLI.children('strong').css({'width': px(isVert ? imgWidth : navSize), 'font-size': px(navSize > 33 ? 32 : 24)});
		listLI.find(isVert ? 'a:last-child' : 'span a').css({'width': px(imgWidth), 'height': px(imgHeight)});
		listLI.find('a').on('focus', function() { this.blur(); });
		if (fitWidth || fitHeight) listLI.find('img').attr(
			'style',
			(isVert ? 'max-' : '') + 'width: ' + px(imgWidth) + '; ' + (isVert ? '' : 'max-') + 'height: ' + px(imgHeight)
		);
		if (isVert) {
			listLI.children('strong').html(isMouse ? document.createElement('sub') : '&circ;');
			listLI.find('strong sub').append('&circ;');
			portArea.css('max-height', displayHeight);
		} else {
			listLI.children('strong + span').css({'min-width': px(navSize), 'background': portArea.css('background-color')});
			portArea.find('li:first-child > strong').css('margin-right', px(imgWidth/2));
			portArea.find('li:last-child > strong').css('margin-left', px(imgWidth/2));
		}
		portArea.find('li:first-child, li:last-child').css('line-height', (navHeight ? px(navHeight) : displayHeight));
		portArea.css('max-width', px(imgWidth + barWidth + 2 * navWidth));
		portArea.css('padding', isMouse ? px(navWidth) + ' ' + px(navHeight) : '0');
		portArea.on('scroll', updateDisplay);
		updateDisplay(isNaN(arguments[0]) ? 1 : arguments[0]);
		jQuery('.page_number').css('margin-right', barWidth ? px(barWidth) : '0');
	};
	if (isMouse) jQuery(document).on('keydown', function (event) {

	//	go right/left keys

	var	getKey = (event.key.indexOf('Right') >= 0) ? 1 : (event.key.indexOf('Left') >= 0) ? -1 : false;
		if (getKey) {
			event.preventDefault();
			jump(portArea.find('li.select')[0].count + getKey);
		}
	});
	jQuery(self).on('resize', function() {

	//	keep place on resize

		portArea.find('img, strong').attr('style', '');
		enable(portArea.find('li.select')[0].count);
	});
	enable();
});