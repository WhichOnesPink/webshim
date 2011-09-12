(function(j,h,i){var k=h.audio&&h.video,n=!1;if(k){var m=document.createElement("video");h.videoBuffered="buffered"in m;n="loop"in m;h.videoBuffered||(i.addPolyfill("mediaelement-native-fix",{feature:"mediaelement",test:h.videoBuffered,dependencies:["dom-support"]}),i.cfg.waitReady&&j.readyWait++,i.loader.loadScript("mediaelement-native-fix",function(){i.cfg.waitReady&&j.ready(!0)}))}j.webshims.ready("dom-support",function(d,g,h,i,j){var m=g.cfg.mediaelement,f=g.mediaelement,o=!h.swfobject||swfobject.hasFlashPlayerVersion("9.0.115"),
r=function(){g.ready("mediaelement-swf",function(){if(!f.createSWF)g.modules["mediaelement-swf"].test=!1,delete d.event.special["mediaelement-swfReady"],g.loader.loadList(["mediaelement-swf"])})},s=function(a,b){var a=d(a),c={src:a.attr("src")||"",elem:a,srcProp:a.prop("src")};if(!c.src)return c;var e=a.attr("type");if(e)c.type=e,c.container=d.trim(e.split(";")[0]);else if(b||(b=a[0].nodeName.toLowerCase(),b=="source"&&(b=(a.closest("video, audio")[0]||{nodeName:"video"}).nodeName.toLowerCase())),
e=f.getTypeForSrc(c.src,b))c.type=e,c.container=e,g.warn("you should always provide a proper mime-type using the source element. "+c.src+" detected as: "+e),d.nodeName(a[0],"source")&&a.attr("type",e);if(e=a.attr("media"))c.media=e;return c};g.loader.loadList(["swfobject"]);g.ready("swfobject",function(){(o=swfobject.hasFlashPlayerVersion("9.0.115"))&&g.ready("WINDOWLOAD",r)});k&&g.capturingEvents(["play","playing","waiting","paused","ended","durationchange","loadedmetadata","canplay","volumechange"]);
f.mimeTypes={audio:{"audio/ogg":["ogg","oga","ogm"],"audio/mpeg":["mp2","mp3","mpga","mpega"],"audio/mp4":["mp4","mpg4","m4r"],"audio/wav":["wav"],"audio/x-m4a":["m4a"],"audio/x-m4p":["m4p"],"audio/3gpp":["3gp","3gpp"],"audio/webm":["webm"]},video:{"video/ogg":["ogg","ogv","ogm"],"video/mpeg":["mpg","mpeg","mpe"],"video/mp4":["mp4","mpg4","m4v"],"video/quicktime":["mov","qt"],"video/x-msvideo":["avi"],"video/x-ms-asf":["asf","asx"],"video/flv":["flv","f4v"],"video/3gpp":["3gp","3gpp"],"video/webm":["webm"]}};
f.mimeTypes.source=d.extend({},f.mimeTypes.audio,f.mimeTypes.video);f.getTypeForSrc=function(a,b){if(a.indexOf("youtube.com/watch?")!=-1)return"video/youtube";var a=a.split("?")[0].split("."),a=a[a.length-1],c;d.each(f.mimeTypes[b],function(b,d){if(d.indexOf(a)!==-1)return c=b,!1});return c};f.srces=function(a,b){a=d(a);if(b)a.removeAttr("src").removeAttr("type").find("source").remove(),d.isArray(b)||(b=[b]),b.forEach(function(b){var c=i.createElement("source");typeof b=="string"&&(b={src:b});c.setAttribute("src",
b.src);b.type&&c.setAttribute("type",b.type);b.media&&c.setAttribute("media",b.media);a.append(c)});else{var b=[],c=a[0].nodeName.toLowerCase(),e=s(a,c);e.src?b.push(e):d("source",a).each(function(){e=s(this,c);e.src&&b.push(e)});return b}};d.fn.loadMediaSrc=function(a,b){return this.each(function(){b!==j&&(d(this).removeAttr("poster"),b&&d.attr(this,"poster",b));f.srces(this,a);d(this).mediaLoad()})};f.swfMimeTypes=["video/3gpp","video/x-msvideo","video/quicktime","video/x-m4v","video/mp4","video/m4p",
"video/x-flv","video/flv","audio/mpeg","audio/aac","audio/mp4","audio/x-m4a","audio/m4a","audio/mp3","audio/x-fla","audio/fla","youtube/flv","jwplayer/jwplayer","video/youtube"];f.canSwfPlaySrces=function(a,b){var c="";o&&(a=d(a),b=b||f.srces(a),d.each(b,function(a,b){if(b.container&&b.src&&f.swfMimeTypes.indexOf(b.container)!=-1)return c=b,!1}));return c};var l={};f.canNativePlaySrces=function(a,b){var c="";if(k){var a=d(a),e=(a[0].nodeName||"").toLowerCase();if(!l[e])return c;b=b||f.srces(a);d.each(b,
function(b,d){if(d.type&&l[e].prop._supvalue.call(a[0],d.type))return c=d,!1})}return c};f.setError=function(a,b){b||(b="can't play sources");d(a).data("mediaerror",b);g.warn("mediaelementError: "+b);setTimeout(function(){d(a).data("mediaerror")&&d(a).trigger("mediaerror")},1)};var t=function(){var a;return function(b,c,e){g.ready("mediaelement-swf",function(){f.createSWF?f.createSWF(b,c,e):a||(a=!0,r(),t(b,c,e))})}}(),p=function(a,b,c,e,d){c||c!==!1&&b&&b.isActive=="flash"?(c=f.canSwfPlaySrces(a,
e))?t(a,c,b):d?f.setError(a,!1):p(a,b,!1,e,!0):(c=f.canNativePlaySrces(a,e))?b&&b.isActive=="flash"&&f.setActive(a,"html5",b):d?f.setError(a,!1):p(a,b,!0,e,!0)},u=/^(?:embed|object)$/i,q=function(a,b){var c=g.data(a,"mediaelementBase")||g.data(a,"mediaelementBase",{}),e=f.srces(a),h=a.parentNode;clearTimeout(c.loadTimer);d.data(a,"mediaerror",!1);if(e.length&&h&&!u.test(h.nodeName||""))b=b||g.data(a,"mediaelement"),p(a,b,m.preferFlash||j,e)};d(i).bind("ended",function(a){var b=g.data(a.target,"mediaelement");
(!n||b&&b.isActive!="html5"||d.prop(a.target,"loop"))&&setTimeout(function(){!d.prop(a.target,"paused")&&d.prop(a.target,"loop")&&d(a.target).prop("currentTime",0).play()},1)});n||g.defineNodeNamesBooleanProperty(["audio","video"],"loop");g.addReady(function(a,b){d("video, audio",a).add(b.filter("video, audio")).each(function(){q(this)})});["audio","video"].forEach(function(a){var b=g.defineNodeNameProperty(a,"load",{prop:{value:function(){var a=g.data(this,"mediaelement");q(this,a);k&&(!a||a.isActive==
"html5")&&b.prop._supvalue&&b.prop._supvalue.apply(this,arguments)}}});l[a]=g.defineNodeNameProperty(a,"canPlayType",{prop:{value:function(b){var e="";k&&l[a].prop._supvalue&&(e=l[a].prop._supvalue.call(this,b),e=="no"&&(e=""));!e&&o&&(b=d.trim(b.split(";")[0]),f.swfMimeTypes.indexOf(b)!=-1&&(e="maybe"));return e}}})});g.onNodeNamesPropertyModify(["audio","video"],["src","poster"],{set:function(){var a=this,b=g.data(a,"mediaelementBase")||g.data(a,"mediaelementBase",{});clearTimeout(b.loadTimer);
b.loadTimer=setTimeout(function(){q(a);a=null},9)}});g.isReady("mediaelement-core",!0)})})(jQuery,Modernizr,jQuery.webshims);