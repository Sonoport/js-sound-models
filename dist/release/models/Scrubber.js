/*javascript-sound-models - v1.0.3 - 2014-07-15 */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library.");

define("core/Config",[],function(){function e(){}return e.LOG_ERRORS=!0,e.ZERO=parseFloat("1e-37"),e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e.CHUNK_LENGTH=256,e}),define("core/WebAudioDispatch",[],function(){function e(e,t,n){if(!n)return void console.warn("No AudioContext provided");var o=n.currentTime;o>=t||.005>t-o?e():window.setTimeout(function(){e()},1e3*(t-o))}return e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/WebAudioDispatch","core/AudioContextMonkeyPatch"],function(e){function t(e){void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.releaseGainNode.numberOfOutputs}});var t=0;Object.defineProperty(this,"maxSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),t=Math.round(e)},get:function(){return t}});var n=0;Object.defineProperty(this,"minSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),n=Math.round(e)},get:function(){return n}}),this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.modelName="Model",this.releaseGainNode.connect(this.audioContext.destination)}return t.prototype.connect=function(e,t,n){e instanceof AudioNode?this.releaseGainNode.connect(e,t,n):e.inputNode instanceof AudioNode?this.releaseGainNode.connect(e.inputNode,t,n):console.error("No Input Connection - Attempts to connect "+typeof t+" to "+typeof this)},t.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},t.prototype.start=function(e,t,n,o){var r=this.audioContext.currentTime;"undefined"!=typeof o?(this.releaseGainNode.gain.cancelScheduledValues(r),this.releaseGainNode.gain.setValueAtTime(0,r),this.releaseGainNode.gain.linearRampToValueAtTime(1,r+o)):this.releaseGainNode.gain.setValueAtTime(1,r),this.isPlaying=!0},t.prototype.stop=function(t){10/this.audioContext.sampleRate;"undefined"==typeof t&&(t=0);var n=this;e(function(){n.isPlaying=!1},t,this.audioContext),this.releaseGainNode.gain.cancelScheduledValues(t)},t.prototype.release=function(e,t){if(this.isPlaying){var n=.5,o=1/this.audioContext.sampleRate;"undefined"==typeof e&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),this.stop(e+t+o)}},t.prototype.play=function(){this.start(0)},t.prototype.pause=function(){this.isPlaying=!1},t.prototype.listParams=function(){var e=[];for(var t in this){var n=this[t];n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")&&e.push(n)}return e},t}),define("core/SPAudioParam",["core/WebAudioDispatch"],function(e){function t(t,n,o,r,a,i,u,c){var s,l=1e-4,f=500,d=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(e){return typeof e!=typeof r?void console.error("Attempt to set a "+typeof r+" parameter to a "+typeof e+" value"):("number"==typeof e&&(e>o?(console.warn(this.name+" clamping to max"),e=o):n>e&&(console.warn(this.name+" clamping to min"),e=n)),"function"==typeof i&&(e=i(e)),"function"==typeof u&&c?u(a,e,c):a?a instanceof AudioParam?a.value=e:a instanceof Array&&a.forEach(function(t){t.value=e}):window.clearInterval(s),void(d=e))},get:function(){if(a){if(a instanceof AudioParam)return a.value;if(a instanceof Array)return a[0].value}return d}}),a&&(a instanceof AudioParam||a instanceof Array)){var p=a[0]||a;this.defaultValue=p.defaultValue,this.minValue=p.minValue,this.maxValue=p.maxValue,this.value=p.defaultValue,this.name=p.name}t&&(this.name=t),"undefined"!=typeof r&&(this.defaultValue=r,this.value=r),"undefined"!=typeof n&&(this.minValue=n),"undefined"!=typeof o&&(this.maxValue=o),this.setValueAtTime=function(t,n){if("function"==typeof i&&(t=i(t)),a)a instanceof AudioParam?a.setValueAtTime(t,n):a instanceof Array&&a.forEach(function(e){e.setValueAtTime(t,n)});else{var o=this;e(function(){o.value=t},n,c)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof i&&(e=i(e)),a)a instanceof AudioParam?a.setTargetAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setTargetAtTime(e,t,n)});else{var o=this,r=o.value,u=c.currentTime;s=window.setInterval(function(){c.currentTime>=t&&(o.value=e+(r-e)*Math.exp(-(c.currentTime-u)/n),Math.abs(o.value-e)<l&&window.clearInterval(s))},f)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof i)for(var o=0;o<e.length;o++)e[o]=i(e[o]);if(a)a instanceof AudioParam?a.setValueCurveAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setValueCurveAtTime(e,t,n)});else{var r=this,u=c.currentTime;s=window.setInterval(function(){if(c.currentTime>=t){var o=Math.floor(e.length*(c.currentTime-u)/n);o<e.length?r.value=e[o]:window.clearInterval(s)}},f)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof i&&(e=i(e)),a)a instanceof AudioParam?a.exponentialRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,o=n.value,r=c.currentTime;0===o&&(o=.001),s=window.setInterval(function(){var a=(c.currentTime-r)/(t-r);n.value=o*Math.pow(e/o,a),c.currentTime>=t&&window.clearInterval(s)},f)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof i&&(e=i(e)),a)a instanceof AudioParam?a.linearRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,o=n.value,r=c.currentTime;s=window.setInterval(function(){var a=(c.currentTime-r)/(t-r);n.value=o+(e-o)*a,c.currentTime>=t&&window.clearInterval(s)},f)}},this.cancelScheduledValues=function(e){a?a instanceof AudioParam?a.cancelScheduledValues(e):a instanceof Array&&a.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(s)}}return t.createPsuedoParam=function(e,n,o,r,a){return new t(e,n,o,r,null,null,null,a)},t}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,o=!0,r=5e3,a=.5,i=2e4,u=.01,c=1024,s=16,l=[],f=0,d=function(e,t){for(var n=0,o=t+s;t+s+c>o;++o)n+=Math.abs(e[o]);return u>n/c},p=function(e){return function(t,n,o){var r;return r=o%2===0?n[e]>a:n[e]<-a,t&&r}},h=function(e){var o=null,a=null;t=0,n=f;for(var u=0;null===o&&f>u&&i>u;){if(e.reduce(p(u),!0)&&(1!==e.length||d(e[0],u))){o=u;break}u++}for(u=f;null===a&&u>0&&i>f-u;){if(e.reduce(p(u),!0)){a=u;break}u--}return null!==o&&null!==a&&a>o+r?(t=o+r/2,n=a-r/2,!0):!1},m=function(e){return function(t,n){return t&&Math.abs(n[e])<u}},y=function(e){var o=!0;for(t=0;i>t&&f>t&&(o=e.reduce(m(t),!0));)t++;for(n=f;i>f-n&&n>0&&(o=e.reduce(m(n),!0));)n--;t>n&&(t=0)};f=e.length;for(var v=0;v<e.numberOfChannels;v++)l.push(new Float32Array(e.getChannelData(v)));return h(l)||(y(l),o=!1),{marked:o,start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,r,a){function i(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.addEventListener("progress",a,!1),o.onload=function(){u(o.response,t)},o.send()}else if("[object File]"===e||"[object Blob]"===e){var r=new FileReader;r.addEventListener("progress",a,!1),r.onload=function(){u(r.result,t)},r.readAsArrayBuffer(n)}}function u(t,a){o.decodeAudioData(t,function(t){if(f=!0,c=t,s=0,l=c.length,"wav"!==a[0]){var n=e(c);n&&(s=n.start,l=n.end)}r&&"function"==typeof r&&r(!0)},function(){console.warn("Error Decoding "+n),r&&"function"==typeof r&&r(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var c,s=0,l=0,f=!1,d=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},p=function(e,t){"undefined"==typeof t&&(t=c.length),d(e)?d(t)||(console.warn("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer"),t=isNan(t)?0:Math.round(Number(t))):(e=isNan(e)?0:Math.round(Number(e)),console.warn("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer. Coercing it to an Integer - start")),e>t&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter "+e+" should be smaller than end parameter "+t+" . Setting them to the same value "+e),t=e),(e>l||s>e)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length+" . Setting start to "+s),e=s),(t>l||s>t)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length+" . Setting start to "+l),t=l);var n=t-e;if(!c)return console.error("No Buffer Found - Buffer loading has not completed or has failed."),null;for(var r=o.createBuffer(c.numberOfChannels,n,c.sampleRate),a=0;a<c.numberOfChannels;a++){var i=new Float32Array(c.getChannelData(a));r.getChannelData(a).set(i.subarray(e,t))}return r};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=l-s),p(s+e,s+t)},this.getRawBuffer=function(){return f?c:(console.error("No Buffer Found - Buffer loading has not completed or has failed."),null)},this.isLoaded=function(){return f},i()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o,r){function a(){var e=Object.prototype.toString.call(t);"[object Array]"===e?t.length>=c.minSources&&t.length<=c.maxSources?(s=t.length,l=new Array(s),t.forEach(function(e,t){i(e,u(t))})):(console.error("Unsupported number of Sources. "+c.modelName+" only supports a minimum of "+c.minSources+" and a maximum of "+c.maxSources+" sources. Trying to load "+t.length+"."),o(!1,l)):t?(s=1,l=new Array(s),i(t,u(0))):(console.log("Setting empty source. No sound may be heard"),o(!0,l))}function i(t,n){var o=Object.prototype.toString.call(t);if("[object String]"===o||"[object File]"===o)var a=new e(t,c.audioContext,function(e){e?n(e,a.getBuffer()):n(e)},function(e){r&&"function"==typeof r&&r(e,t)});else"[object AudioBuffer]"===o?n(!0,t):(console.error("Incorrect Parameter Type - Source is not a URL, File or AudioBuffer"),n(!1,{}))}function u(e){return function(t,n){if(t&&(l[e]=n),s--,0===s){for(var r=!0,a=0;a<l.length;++a)if(!l[a]){r=!1;break}o(r,l)}}}var c=this;this.audioContext=n;var s=0,l=[];a()}return t}),define("models/Scrubber",["core/Config","core/BaseSound","core/SPAudioParam","core/MultiFileLoader"],function(e,t,n,o){function r(a,i,u,c){function s(t,n,r){o.call(x,t,x.audioContext,F(n),r),d=e.WINDOW_LENGTH,p=d/2,w=0,y=f(d,1);for(var a=0;d>a;a++)y[a]=.25*(1-Math.cos(2*Math.PI*(a+.5)/d));T=new Float32Array(e.CHUNK_LENGTH)}function l(e){if(x.isPlaying&&x.isInitialized)for(var t,n,o=e.outputBuffer.length;o>0;){if(w>0&&o>0){var r=Math.min(o,w);for(n=0;A>n;n++){var a=h[n].subarray(p-w,p-w+r);e.outputBuffer.getChannelData(n).set(a,e.outputBuffer.length-o)}o-=r,w-=r}if(o>0){var i,u=x.playPosition.value;if(Math.abs(P-u)*v>S*g)N=u,i=0;else{var c=V*N+(1-V)*u;i=(c-N)*v/p,N=c}for(P=u,t=0;d-p>t;t++)for(n=0;A>n;n++)h[n][t]=h[n][t+p];for(t=d-p;d>t;t++)for(n=0;A>n;n++)h[n][t]=0;for(t=0;d-p>t;t++)for(n=0;A>n;n++)m[n][t]=m[n][t+p];var s=0,l=0;for(t=0;d-p>t;t++){var f=0;for(n=0;A>n;n++)f+=m[n][t];f>l&&(s=t,l=f)}var C=parseInt(N*(v-d)),F=0,I=0;for(t=0;d>t;t++){var M=0,D=(C+t)%v;for(n=0;A>n;n++)M+=b[n][D];M>I&&(I=M,F=t)}var R=F-s;for(C+=R,t=0;d>t;t++){var E=(C+t)%v;for(0>E&&(E=0),n=0;A>n;n++)m[n][t]=b[n][E]}var L=x.noMotionFade.value,_=1;L&&Math.abs(i)<B&&(_=0),O=G*O+(1-G)*_;var j=x.muteOnReverse.value;for(0>i&&j&&(O=0),t=0;d>t;t++)for(n=0;A>n;n++)h[n][t]+=O*y[t]*m[n][t];w=p}}else for(n=0;A>n;n++)e.outputBuffer.getChannelData(n).set(T)}function f(e,t){var n=[];(void 0===t||null===t)&&(t=1);for(var o=0;t>o;o++)n.push(new Float32Array(e));return n}if(!(this instanceof r))throw new TypeError("Scrubber constructor cannot be called as a function.");t.call(this,i),this.maxSources=1,this.minSources=1,this.modelName="Scrubber";var d,p,h,m,y,v,A,g,C,T,x=this,b=[],w=0,P=0,N=0,O=0,S=1,V=.95,B=.05,G=.8,F=function(t){return function(n,o){var r=o[0];v=r.length,A=r.numberOfChannels,g=r.sampleRate;for(var a=0;A>a;a++)b.push(r.getChannelData(a));C=x.audioContext.createScriptProcessor(e.CHUNK_LENGTH,0,A),C.onaudioprocess=l,C.connect(x.releaseGainNode),h=f(d,A),m=f(d,A),n&&(x.isInitialized=!0),"function"==typeof t&&t(n)}};this.setSources=function(e,t,n){this.isInitialized=!1,s(e,t,n)},this.playPosition=n.createPsuedoParam("playPosition",0,1,0,this.audioContext),this.noMotionFade=n.createPsuedoParam("noMotionFade",!0,!1,!0,this.audioContext),this.muteOnReverse=n.createPsuedoParam("muteOnReverse",!0,!1,!0,this.audioContext),s(a,u,c)}return r.prototype=Object.create(t.prototype),r});