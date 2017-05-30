// ==UserScript==
// @name Youtube Stopper
// @author k0ff
// @released 2015-08-30
// @updated 2015-09-01
// @description Script for stopping Youube's Video on opened tab in background
// @downloadURL https://raw.githubusercontent.com/k0ff/youtube-stopper/master/youtube-stopper.user.js
// @updateURL https://raw.githubusercontent.com/k0ff/youtube-stopper/master/youtube-stopper.user.js
// @icon https://k0ff.tk/youtube-stopper/youtube-stopper.icon.png
// @namespace http:/k0ff.tk/youtube-stopper/
// @include http*://*.youtube.com/*
// @version 2.3
// @grant none
// ==/UserScript==
if(!document.videos )
{
	document.videos = document.getElementsByTagName('video');
	if(!document.videos.length )
		document.videos = null;
}

//
function fire( element, eventName )
{
	var event;

	//
	if( document.createEvent )
	{
    	event = document.createEvent("HTMLEvents");
    	event.initEvent( eventName, true, true );
  	}
  	else
  	{
    	event = document.createEventObject();
    	event.eventType = eventName;
	}

	//
	event.eventName = eventName;

	//
	if( document.createEvent )
	{
    	element.dispatchEvent(event);
	}
	else
	{
    	element.fireEvent("on" + event.eventType, event);
  	}

  	//
}

//
function find()
{
	//
	if( window.$ )
	{
		if( window.$.version )
		{
			return window.$(".ytp-play-button")[0];
		}
		return window.$(".ytp-play-button");
	}

	//
	var elements = document.getElementsByTagName('button'),
		element;

	//	
	for( var i = 0; i < elements.length; i++ )
	{
		element = elements[i];
		if( element.className.indexOf("ytp-play-button") != -1 )
		{
			return element;
		}
	}
	return null;
}

//
function stop()
{
	setTimeout(function()
	{
		if( document.embeds )
		{
			for( var i = 0; i < document.embeds.length; i++ )
			{
				document.embeds[i].pauseVideo();
			}
		}
	},100);

	if( document.videos )
	{
		var button = find();
		if( button )
		{
			fire( button, "click" );
		}
	}

	if( document.videos )
	{
		for( var i = 0; i < document.videos.length; i++ )
		{
			document.videos[i].pause();
		}
	}
}

//
var focus = null;

//
if(  location.href.indexOf('embed') == -1 && (document.embeds || document.videos ))
{
	function loop()
	{
		if( focus === null )
		{
			focus = document.hasFocus();
		}

		if( ( document.readyState == "interactive" && document.videos && !document.videos[0].paused ) ||
			( document.readyState == "complete" ))
		{
			if(!focus )
				stop();	
		}
		else
		{
			setTimeout( loop, 0 );
		}
	}

	loop();
}
