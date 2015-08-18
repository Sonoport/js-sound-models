/*soundmodels - v2.5.8 - Tue Aug 18 2015 10:40:17 GMT+0800 (SGT) */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Compressor = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
!function(e,o){"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){function e(e){return typeof console===f?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):c}function o(e,o){var n=e[o];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function n(e,o){return function(){typeof console!==f&&(t(o),r[e].apply(r,arguments))}}function t(e){for(var o=0;o<u.length;o++){var n=u[o];r[n]=e>o?c:r.methodFactory(n,e)}}function l(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage.loglevel=o)}catch(n){}try{window.document.cookie="loglevel="+o+";"}catch(n){}}function i(){var e;try{e=window.localStorage.loglevel}catch(o){}if(typeof e===f)try{e=/loglevel=([^;]+)/.exec(window.document.cookie)[1]}catch(o){}void 0===r.levels[e]&&(e="WARN"),r.setLevel(r.levels[e],!1)}var r={},c=function(){},f="undefined",u=["trace","debug","info","warn","error"];r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=function(o,t){return e(o)||n(o,t)},r.setLevel=function(e,o){if("string"==typeof e&&void 0!==r.levels[e.toUpperCase()]&&(e=r.levels[e.toUpperCase()]),!("number"==typeof e&&e>=0&&e<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+e;return o!==!1&&l(e),t(e),typeof console===f&&e<r.levels.SILENT?"No console available for logging":void 0},r.enableAll=function(e){r.setLevel(r.levels.TRACE,e)},r.disableAll=function(e){r.setLevel(r.levels.SILENT,e)};var a=typeof window!==f?window.log:void 0;return r.noConflict=function(){return typeof window!==f&&window.log===r&&(window.log=a),r},i(),r});

},{}],2:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;

},{}],3:[function(_dereq_,module,exports){
"use strict";function BaseEffect(t){function e(t){function e(){log.debug("Booting ",t),n.start(0),n.stop(t.currentTime+1e-4),window.liveAudioContexts.push(t),window.removeEventListener("touchstart",e)}var i=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(i&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(t)<0)){var n=t.createOscillator(),o=t.createGain();o.gain.value=0,n.connect(o),o.connect(t.destination),window.addEventListener("touchstart",e)}}void 0===t||null===t?(log.debug("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=t,e(this.audioContext),this.inputNode=null,Object.defineProperty(this,"numberOfInputs",{enumerable:!0,configurable:!1,get:function(){return this.inputNode.numberOfOutputs||0}}),this.outputNode=null,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.outputNode.numberOfOutputs||0}}),this.isPlaying=!1,this.isInitialized=!1,this.destinations=[],this.effectName="Effect",this.isBaseEffect=!0,this.parameterList_=[]}_dereq_("../core/AudioContextMonkeyPatch")();var log=_dereq_("loglevel");BaseEffect.prototype.connect=function(t,e,i){t instanceof AudioNode?(this.outputNode.connect(t,e,i),this.destinations.push({destination:t,output:e,input:i})):t.inputNode instanceof AudioNode?(this.outputNode.connect(t.inputNode,e,i),this.destinations.push({destination:t.inputNode,output:e,input:i})):log.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseEffect.prototype.disconnect=function(t){this.outputNode.disconnect(t),this.destinations=[]},BaseEffect.prototype.registerParameter=function(t,e){(void 0===e||null===e)&&(e=!1),Object.defineProperty(this,t.name,{enumerable:!0,configurable:e,value:t});var i=this,n=!1;this.parameterList_.forEach(function(e,o){e.name===t.name&&(i.parameterList_.splice(o,1,t),n=!0)}),n||this.parameterList_.push(t)},BaseEffect.prototype.listParams=function(){return this.parameterList_},module.exports=BaseEffect;

},{"../core/AudioContextMonkeyPatch":2,"loglevel":1}],4:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=2048,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;

},{}],5:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,i,n,o,u,r){var l,f=1e-4,c=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(f){if(log.debug("Setting param",t,"value to",f),typeof f!=typeof n)return void log.error("Attempt to set a",typeof n,"parameter to a",typeof f,"value");if("number"==typeof f&&(f>i?(log.debug(this.name,"clamping to max"),f=i):a>f&&(log.debug(this.name+" clamping to min"),f=a)),s=f,"function"==typeof u&&(f=u(f)),m||(log.debug("Clearing Automation for",t),window.clearInterval(l)),m=!1,"function"==typeof r&&e.audioContext)r(o,f,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(f,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):(log.debug("Setting param",t,"through setter"),a.setValueAtTime(f,e.audioContext.currentTime))})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof n?(this.defaultValue=n,this.value=n):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof i?this.maxValue=i:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var i=this;webAudioDispatch(function(){i.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,i){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,i)});else{var n=this,r=n.value,s=e.audioContext.currentTime;log.debug("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,n.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/i),Math.abs(n.value-t)<f&&window.clearInterval(l))},c)}},this.setValueCurveAtTime=function(t,a,i){if(o){if("function"==typeof u)for(var n=0;n<t.length;n++)t[n]=u(t[n]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,i)})}else{var r=this,f=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var n=Math.floor(t.length*(e.audioContext.currentTime-f)/i);n<t.length?(m=!0,r.value=t[n]):window.clearInterval(l)}},c)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;0===n&&(n=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n*Math.pow(t/n,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n+(t-n)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config"),log=_dereq_("loglevel");SPAudioParam.createPsuedoParam=function(e,t,a,i,n){return new SPAudioParam(e,t,a,i,n,null,null,null)},module.exports=SPAudioParam;

},{"../core/Config":4,"../core/WebAudioDispatch":6,"loglevel":1}],6:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(e,i,o){if(!o)return void log.error("No AudioContext provided");var t=o.currentTime;return t>=i||.005>i-t?(log.debug("Dispatching now"),e(),null):(log.debug("Dispatching in",1e3*(i-t),"ms"),window.setTimeout(function(){log.debug("Diff at dispatch",1e3*(i-o.currentTime),"ms"),e()},1e3*(i-t)))}var log=_dereq_("loglevel");module.exports=WebAudioDispatch;

},{"loglevel":1}],7:[function(_dereq_,module,exports){
"use strict";function Compressor(e){if(!(this instanceof Compressor))throw new TypeError("Compressor constructor cannot be called as a function.");BaseEffect.call(this,e),this.maxSources=0,this.minSources=0,this.effectName="Compressor";var r=this.audioContext.createDynamicsCompressor();this.inputNode=r,this.outputNode=r,this.registerParameter(new SPAudioParam(this,"attack",0,1,.003,r.attack),!1),this.registerParameter(new SPAudioParam(this,"knee",0,40,30,r.knee),!1),this.registerParameter(new SPAudioParam(this,"ratio",0,20,12,r.ratio),!1),this.registerParameter(new SPAudioParam(this,"release",0,1,.25,r.release),!1),this.registerParameter(new SPAudioParam(this,"threshold",-100,0,-24,r.threshold),!1),this.isInitialized=!0}var BaseEffect=_dereq_("../core/BaseEffect"),SPAudioParam=_dereq_("../core/SPAudioParam");Compressor.prototype=Object.create(BaseEffect.prototype),module.exports=Compressor;
},{"../core/BaseEffect":3,"../core/SPAudioParam":5}]},{},[7])(7)
});