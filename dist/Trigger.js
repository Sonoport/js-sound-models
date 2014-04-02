/*javascript-sound-models - v0.3.0 - 2014-04-02 */

define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/AudioContextMonkeyPatch"],function(){function e(e){this.audioContext="undefined"==typeof e?new AudioContext:e,this.numberOfInputs=0,this.numberOfOutputs=1,this.releaseGainNode=this.audioContext.createGain(),this.FADE_TIME=.5,this.FADE_TIME_PAD=1,this.isPlaying=!1,this.inputNode=null}return e.prototype.connect=function(t){if(t instanceof e){if(!t.inputNode)throw{name:"No Input Connection Exception",message:"Attempts to connect "+typeof t+" to "+typeof this,toString:function(){return this.name+": "+this.message}};this.releaseGainNode.connect(t.inputNode)}else{if(!(t instanceof AudioNode))throw{name:"Incorrect Output Exception",message:"Attempts to connect "+typeof t+" to "+typeof this,toString:function(){return this.name+": "+this.message}};this.releaseGainNode.connect(t)}},e.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},e.prototype.start=function(){this.isPlaying=!0},e.prototype.stop=function(e){this.isPlaying=!1,"undefined"==typeof e&&(e=0),this.releaseGainNode.gain.cancelScheduledValues(this.audioContext.currentTime+e)},e.prototype.release=function(e){e=e||this.FADE_TIME,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,this.audioContext.currentTime),this.releaseGainNode.gain.linearRampToValueAtTime(0,this.audioContext.currentTime+e)},e.prototype.play=function(){this.start(0)},e.prototype.pause=function(){},e}),define("core/SPAudioParam",[],function(){function e(e,t,n,o,i,r,a,u){var s,c=1e-4,l=500;this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="";var f=0;Object.defineProperty(this,"value",{enumerable:!0,set:function(e){if(typeof e!=typeof o)throw{name:"Incorrect value type Exception",message:"Attempt to set a "+typeof o+" parameter to a "+typeof e+" value",toString:function(){return this.name+": "+this.message}};"number"==typeof e&&(e>n?(console.log("Clamping to max"),e=n):t>e&&(console.log("Clamping to min"),e=t)),"function"==typeof r&&(e=r(e)),"function"==typeof a&&u?(a(i,e,u),f=e):i&&i instanceof AudioParam?i.value=e:(window.clearInterval(s),f=e)},get:function(){return i&&i instanceof AudioParam?i.value:f}}),i&&i instanceof AudioParam&&(this.defaultValue=i.defaultValue,this.minValue=i.minValue,this.maxValue=i.maxValue,this.value=i.defaultValue,this.name=i.name),(o||0===o)&&(this.defaultValue=o,this.value=o),e&&(this.name=e),(t||0===t)&&(this.minValue=t),(n||0===n)&&(this.maxValue=n),this.setValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),i&&i instanceof AudioParam)i.setValueAtTime(e,t);else{var n=this,o=t-u.currentTime;window.setTimeout(function(){n.value=e},1e3*o)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof r&&(e=r(e)),i&&i instanceof AudioParam)i.setTargetAtTime(e,t,n);else{var o=this,a=o.value,f=u.currentTime;s=window.setInterval(function(){u.currentTime>=t&&(o.value=e+(a-e)*Math.exp(-(u.currentTime-f)/n),Math.abs(o.value-e)<c&&window.clearInterval(s))},l)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof r)for(var o=0;o<e.length;o++)e[o]=r(e[o]);if(i&&i instanceof AudioParam)i.setValueCurveAtTime(e,t,n);else{var a=this,c=u.currentTime;s=window.setInterval(function(){if(u.currentTime>=t){var o=Math.floor(e.length*(u.currentTime-c)/n);o<e.length?a.value=e[o]:window.clearInterval(s)}},l)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),i&&i instanceof AudioParam)i.exponentialRampToValueAtTime(e,t);else{var n=this,o=n.value,a=u.currentTime;0===o&&(o=.001),s=window.setInterval(function(){var i=(u.currentTime-a)/(t-a);n.value=o*Math.pow(e/o,i),u.currentTime>=t&&window.clearInterval(s)},l)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),i&&i instanceof AudioParam)i.linearRampToValueAtTime(e,t);else{var n=this,o=n.value,a=u.currentTime;s=window.setInterval(function(){var i=(u.currentTime-a)/(t-a);n.value=o+(e-o)*i,u.currentTime>=t&&window.clearInterval(s)},l)}},this.cancelScheduledValues=function(e){i&&i instanceof AudioParam?i.cancelScheduledValues(e):window.clearInterval(s)}}return e.createPsuedoParam=function(t,n,o,i,r){return new e(t,n,o,i,null,null,null,r)},e}),define("core/SPPlaybackRateParam",[],function(){function e(e,t){this.defaultValue=e.defaultValue,this.maxValue=e.maxValue,this.minValue=e.minValue,this.name=e.name,this.units=e.units,Object.defineProperty(this,"value",{enumerable:!0,set:function(n){var o=t.audioContext.currentTime,i=t.bufferSourceNode;i.playbackState===i.PLAYING_STATE&&t.addNewEvent({type:"set",value:n,time:o}),e.value=n},get:function(){return e.value}}),this.linearRampToValueAtTime=function(n,o){e.linearRampToValueAtTime(n,o),t.addNewEvent({type:"linear",value:n,time:o})},this.exponentialRampToValueAtTime=function(n,o){e.exponentialRampToValueAtTime(n,o),t.addNewEvent({type:"exponential",value:n,time:o})},this.setValueCurveAtTime=function(n,o,i){e.setValueCurveAtTime(n,o,i),t.addNewEvent({type:"curve",curve:n,duration:i,time:o})},this.setTargetAtTime=function(n,o,i){e.setTargetAtTime(n,o,i),t.addNewEvent({type:"target",value:n,time:o,timeConstant:i})},this.setValueAtTime=function(n,o){e.setValueAtTime(n,o),t.addNewEvent({type:"set",value:n,time:o})},this.cancelScheduledValues=function(n){e.cancelScheduledValues(n),t.cancelScheduledValues(n)}}return e}),define("core/SPAudioBufferSourceNode",["core/SPPlaybackRateParam"],function(e){function t(t){var n=t.createBufferSource(),o=0,i=0,r=n.playbackRate.defaultValue,a=[];this.channelCount=n.channelCount,this.channelCountMode=n.channelCountMode,this.channelInterpretation=n.channelInterpretation,this.numberOfInputs=n.numberOfInputs,this.numberOfOutputs=n.numberOfOutputs,this.playbackState=n.playbackState,this.playbackRate=new e(n.playbackRate,this),Object.defineProperty(this,"loopEnd",{enumerable:!0,set:function(e){n.loopEnd=e},get:function(){return n.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,set:function(e){n.loopStart=e},get:function(){return n.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,set:function(e){n.onended=e},get:function(){return n.onended}}),Object.defineProperty(this,"gain",{enumerable:!0,set:function(e){n.gain=e},get:function(){return n.gain}}),Object.defineProperty(this,"loop",{enumerable:!0,set:function(e){n.loop=e},get:function(){return n.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,get:function(){return u(),n.playbackState===n.FINISHED_STATE?o:n.playbackState===n.PLAYING_STATE?c(t.currentTime):0}}),Object.defineProperty(this,"buffer",{enumerable:!0,set:function(e){n.buffer=e},get:function(){return n.buffer}}),this.addNewEvent=function(e){for(var t=0;t<a.length;t++){var n=a[t];if(n.type===e.type&&n.time===e.time)return void a.splice(t,1,e);if(a[t].time>e.time)break}a.splice(t,0,e)},this.cancelScheduledValues=function(e){u();for(var t=0;t<a.length;t++)a[t].time>=e&&(a.splice(t,1),t--)},this.connect=function(e){n.connect(e)},this.disconnect=function(e){n.disconnect(e)},this.start=function(e,r){n.start(e,r),i=e>t.currentTime?e:t.currentTime,o=(r||0)*n.buffer.sampleRate},this.stop=function(e){e<t.currentTime&&(e=t.currentTime),n.stop(e),this.addNewEvent({type:"stop",time:e,value:0})};var u=function(){for(var e=t.currentTime,u=0;u<a.length;u++){var c=a[u],f=u<a.length-1?a[u+1]:null,p=s(c,f);if(e>=p){var h=l(c,p),d=(n.loopEnd-n.loopStart)*n.buffer.sampleRate;o+=h*n.buffer.sampleRate%d,i=p,r=c.value||(c.curve?c.curve[c.curve.length-1]:r),a.splice(u,1),u--}}},s=function(e,t){var n=0;return n="linear"===e.type||"exponential"===e.type?e.time:"curve"===e.type?e.duration:t&&"linear"!==t.type&&"exponential"!==t.type?t.time:"target"===e.type?6.90776*e.timeConstant:e.time},c=function(e){var t=0,r=f();t=r?l(r,e):(e-i)*n.playbackRate.value;var a=o+t*n.buffer.sampleRate,u=(n.loopEnd-n.loopStart)*n.buffer.sampleRate;return a%u},l=function(e,t){var n=0;if("linear"===e.type){var o=t-i;n=(e.value-r)*o/2+r*o}else if("exponential"===e.type)n=(t-i)*(e.value-r)/Math.log(e.value/r);else if("set"===e.type||"stop"===e.type)n+=(e.time-i)*r,n+=(t-e.time)*e.value;else if("target"===e.type){n+=(e.time-i)*r;var a=e.timeConstant*(e.value-r),u=Math.exp((e.time-t)/e.timeConstant);n+=a*(u-1)+e.value*(t-e.time)}else if("curve"===e.type){n+=(e.time-i)*r;for(var s=e.duration/e.curve.length,c=0,l=0;l<e.curve.length;l++)e.time+c+s<=t&&(n+=e.curve[l]*s,c+=s);n+=t-(e.time+c)*e.curve[l]}return n},f=function(){for(var e=t.currentTime,n=0;n<a.length;n++){var o=a[n],i=n<a.length-1?a[n+1]:null,r=s(o,i);if(r>e&&(o.time<=e||"linear"===o.type||"exponential"===o.type))return o}return null}}return t}),define("core/DetectLoopMarkers",[],function(){function e(e){self=this;var t=0,n=0;this.PREPOSTFIX_LEN=5e3,this.SPIKE_THRESH=.5,this.MAX_MP3_SILENCE=2e4,this.SILENCE_THRESH=.1;var o=function(e){var o,i,r=-1,a=-1;n=e.length-1,i=new Float32Array(e.getChannelData(0)),2===e.numberOfChannels&&(o=new Float32Array(e.getChannelData(1)));for(var u=0;0>r&&u<e.length&&u<self.MAX_MP3_SILENCE;){if(i[u]>self.SPIKE_THRESH&&(1===e.numberOfChannels||o[u]<-self.SPIKE_THRESH)){r=u;break}u++}for(u=e.length-1;0>a&&u>0&&e.length-u<self.MAX_MP3_SILENCE;){if(i[u]>self.SPIKE_THRESH&&(1===e.numberOfChannels||o[u]<-self.SPIKE_THRESH)){a=u;break}u--}return r>0&&a>0&&a>r?(t=r+self.PREPOSTFIX_LEN/2,n=a-self.PREPOSTFIX_LEN/2,!0):(t=0,n=e.length,!1)},i=function(e,n){return e&&n[t]<self.SILENCE_THRESH},r=function(e){for(var o=[],r=!0,a=0;a<e.numberOfChannels;a++)o.push(new Float32Array(e.getChannelData(a)));for(t=0;t<self.MAX_MP3_SILENCE&&t<e.length&&(r=o.reduce(i,!0));)t++;for(n=e.length-1;e.length-n<self.MAX_MP3_SILENCE&&n>0&&(r=o.reduce(i,!0));)n++;t>n&&(t=0,nLoopLength_=e.length)};return 2===e.numberOfChannels&&o(e)||r(e),{start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,i){function r(){var t=/[^.]+$/.exec(n),r=new XMLHttpRequest;r.open("GET",n,!0),r.responseType="arraybuffer",r.onload=function(){o.decodeAudioData(r.response,function(n){if(c=!0,a=n,u=0,s=a.length,"wav"!==t[0]){var o=e(a);o&&(u=o.start,s=o.end)}i&&"function"==typeof i&&i(!0)},function(){console.log("Error Decoding "+n),i&&"function"==typeof i&&i(!1)})},r.send()}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var a,u=0,s=0,c=!1,l=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},f=function(e,t){if("undefined"==typeof t&&(t=a.length),!l(e))throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter is not an integer",toString:function(){return this.name+": "+this.message}};if(!l(t))throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer end parameter is not an integer",toString:function(){return this.name+": "+this.message}};if(e>t)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter should be smaller than end parameter",toString:function(){return this.name+": "+this.message}};if(e>s||u>e)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter should be within the buffer size : 0-"+a.length,toString:function(){return this.name+": "+this.message}};if(t>s||u>t)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer end parameter should be within the buffer size : 0-"+a.length,toString:function(){return this.name+": "+this.message}};for(var n=t-e,i=o.createBuffer(a.numberOfChannels,n,a.sampleRate),r=0;r<a.numberOfChannels;r++){var c=new Float32Array(a.getChannelData(r));i.getChannelData(r).set(c.subarray(e,t))}return i};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=s-u),f(u+e,u+t)},this.getRawBuffer=function(){return a},this.isLoaded=function(){return c},r()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o){function i(){var e=Object.prototype.toString.call(t);"[object Array]"===e?(s=t.length,t.forEach(function(e){r(e,a)})):void 0!==t&&null!==t&&(s=1,r(t,a))}function r(t,n){var o=Object.prototype.toString.call(t);if("[object String]"===o)var i=new e(t,u.audioContext,function(e){e&&n(e,i.getBuffer())});else{if("[object AudioBuffer]"!==o)throw{name:"Incorrect Parameter type Exception",message:"Looper argument is not a URL or AudioBuffer",toString:function(){return this.name+": "+this.message}};n(!0,t)}}function a(e,t){s--,c.push(t),0===s&&o(e,c)}var u=this,s=0,c=[];i()}return t}),define("models/Looper",["core/BaseSound","core/SPAudioParam","core/SPAudioBufferSourceNode","core/MultiFileLoader"],function(e,t,n,o){function i(r,a,u){function s(){o.call(c,r,u,h)}if(!(this instanceof i))throw new TypeError("Looper constructor cannot be called as a function.");e.call(this,u);var c=this,l=[],f=[],p=[],h=function(e,t){t.forEach(function(e){p.push(0),d(e)}),c.releaseGainNode.connect(u.destination),a(e)},d=function(e){var o=new n(c.audioContext),i=c.audioContext.createGain();o.buffer=e,o.loop=!0,o.loopEnd=e.duration,o.connect(i),i.connect(c.releaseGainNode);var r=new t("gainNode",0,1,1,i.gain,null,null,c.audioContext);l.push(o),f.push(i),c.multiTrackGain.push(r)},m=function(e,t,n){var o=6.90776,i=l[0]?l[0].playbackRate.value:1;t>i?l.forEach(function(e){e.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,c.riseTime.value*o)}):i>t&&l.forEach(function(e){e.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,c.decayTime.value*o)})},y=function(e,t){l.forEach(function(e){e.loopStart=t*e.buffer.duration})};this.riseTime=t.createPsuedoParam("riseTime",.05,10,1,this.audioContext),this.decayTime=t.createPsuedoParam("decayTime",.05,10,1,this.audioContext),this.startPoint=new t("startPoint",0,.99,0,null,null,y,this.audioContext),this.playSpeed=new t("playSpeed",-10,10,1,null,null,m,this.audioContext),this.multiTrackGain=[],this.setSources=function(){s()},this.play=function(){this.isPlaying||l.forEach(function(e,t){var n=p&&p[t]?p[t]:c.startPoint.value*e.buffer.duration;e.start(0,n)}),e.prototype.start.call(this,0)},this.start=function(t,n){this.isPlaying||l.forEach(function(e){"undefined"==typeof n&&(n=c.startPoint.value*e.buffer.duration),e.start(t,n)}),e.prototype.start.call(this,t)},this.stop=function(t){this.isPlaying&&(l=l.map(function(e,o){e.stop(t),p[o]=0;var i=new n(c.audioContext);return i.buffer=e.buffer,i.loopStart=i.buffer.duration*c.startPoint.value,i.loopEnd=i.buffer.duration,i.loop=!0,i.connect(f[o]),i})),e.prototype.stop.call(this,t)},this.pause=function(){this.isPlaying&&(l=l.map(function(e,t){e.stop(0),p[t]=e.playbackPosition/e.buffer.sampleRate,e.disconnect();var o=new n(c.audioContext);return o.buffer=e.buffer,o.loopStart=o.buffer.duration*c.startPoint.value,o.loopEnd=o.buffer.duration,o.loop=!0,o.connect(f[t]),o})),e.prototype.stop.call(this,0)},s()}return i}),define("core/SPEvent",[],function(){function e(t,n,o,i,r,a){if(!(this instanceof e))throw new TypeError("Looper constructor cannot be called as a function.");var u=["QENONE","QESTOP","QESTART","QESETPARAM","QESETSRC","QERELEASE"];if("undefined"==typeof n||0>n)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent argument timeStamp is not a positive number",toString:function(){return this.name+": "+this.message}};if("undefined"==typeof o||0>o)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent argument eventID is not a positive number",toString:function(){return this.name+": "+this.message}};if("undefined"!=typeof i||"undefined"!=typeof r&&"undefined"!=typeof a)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent can either have Parameter Information or AudioBuffer defined ",toString:function(){return this.name+": "+this.message}};if(u.indexOf(t)<0)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent has unknown type",toString:function(){return this.name+": "+this.message}};this.type=t,this.timeStamp=n,this.eventID=o,this.paramName=i,this.paramValue=r,this.audioBuffer=a}return e}),define("core/SoundQueue",["models/Looper","core/FileLoader","core/SPEvent"],function(e,t,n){function o(t,i){function r(){h(t.currentTime+1/l),window.requestAnimationFrame(r)}if(!(this instanceof o))throw new TypeError("SoundQueue constructor cannot be called as a function.");"undefined"==typeof i&&(i=4);var a,u=[],s=[],c=[],l=60,f=function(){for(var n=0;i>n;n++)c[n]=new e(null,null,t);window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,window.requestAnimationFrame(r)},p=function(e){if("QESTART"==e.type){if(c.length<1){var n=0;n++}var o=c.pop();o.start(e.time),s.push(o)}else if("QERELEASE"==e.type){for(a=0;a<s.length;a++)if(s[a].eventID==e.eventID){s[a].release(e.time);break}}else if("QESTOP"==e.type){var i=function(e){c.push(s[a]),s.splice(e,1)};for(a=0;a<s.length;a++)if(s[a].eventID==e.eventID){s[a].pause(e.time),window.setTimeOut(i(a),e.time-t.currentTime);break}}else if("QESETPARAM"==e.type){for(a=0;a<s.length;a++)if(s[a].eventID==e.eventID){s[a][e.parameterName].setValueAtTime(e.parameterValue,e.time);break}}else{if("QESETSRC"!=e.type)throw{name:"Incorrect Parameter type Exception",message:"SoundQueue doesn't recognize this type of event",toString:function(){return this.name+": "+this.message}};var r=function(e,t){s[e].setSources(t.sourceBuffer)};for(a=0;a<s.length;a++)if(s[a].eventID==e.eventID){window.setTimeOut(r(a,e),e.time-t.currentTime);break}}},h=function(e){for(var t=0;t<u.length;t++){var n=u[t];t.time<=e&&(p(n),u.splice(t,1),t--)}};this.queueStart=function(e,t){u.push(new n("QESTART",e,t))},this.queueRelease=function(e,t){u.push(new n("QERELEASE",e,t))},this.queueStop=function(e,t){u.push(new n("QESTOP",e,t))},this.queueSetParameter=function(e,t,o,i){u.push(new n("QESETPARAM",e,t,o,i))},this.queueSetSource=function(e,t,o){u.push(new n("QESETSRC",e,t,null,null,o))},this.connect=function(e){c.forEach(function(t){t.connect(e)}),s.forEach(function(t){t.connect(e)})},f()}return o}),define("core/Converter",[],function(){function e(){}return e.prototype.semitonesToRatio=function(e){return Math.pow(2,e/12)},e}),define("models/Trigger",["core/BaseSound","core/SoundQueue","core/SPAudioParam","core/MultiFileLoader","core/Converter"],function(e,t,n,o,i){function r(a,u,s){function c(){l=new t(s),o(a,s,d)}if(!(this instanceof r))throw new TypeError("Trigger constructor cannot be called as a function.");e.call(this,s);var l,f=[],p=0,h=0,d=function(e,t){f=t,u()};this.pitchShift=n.createPsuedoParam("pitchShift",-60,0,60,this.audioContext),this.pitchRand=n.createPsuedoParam("pitchRand",0,0,24,this.audioContext),this.eventRand=n.createPsuedoParam("eventRand",!0,!1,!1,this.audioContext),this.play=function(){h=this.eventRand?a.length>2?(h+1+Math.floor(Math.random()*(a.length-1)))%a.length:Math.floor(Math.random()*(a.length-1)):(h+1)%a.length;var e=s.currentTime,t=i.semitonesToRatio(this.pitchShift+Math.random()*this.pitchRand);l.queueSetParameter(e,p,"playSpeed",t),l.queueSetSource(e,p,f[h]),l.queueStart(e,p),p++},c()}return r});