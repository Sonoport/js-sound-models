/*javascript-sound-models - v2.0.0 - Wed Feb 18 2015 12:11:57 GMT+0800 (SGT) */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library v2.0.0.");
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.SPAudioBuffer||(f.SPAudioBuffer={})).js=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @module Core
 */

"use strict";
/**
 * Wrapper around AudioBuffer to support audio source caching and allowing clipping of audiobuffers to various lengths.
 *
 * @class SPAudioBuffer
 * @constructor
 * @param {AudioContext} audioContext WebAudio Context.
 * @param {String/AudioBuffer/File} URL The source URL or File object or an AudioBuffer to encapsulate.
 * @param {Number} startPoint The startPoint of the AudioBuffer in seconds.
 * @param {Number} endPoint The endPoint of the AudioBuffer in seconds.
 * @param [AudioBuffer] audioBuffer An AudioBuffer object incase the URL has already been downloaded and decoded.
 */
function SPAudioBuffer( audioContext, URL, startPoint, endPoint, audioBuffer ) {

    // new SPAudioBuffer("http://example.com", 0.8,1.0)
    // new SPAudioBuffer("http://example.com", 0.8,1.0, [object AudioBuffer])
    // new SPAudioBuffer([object File], 0.8,1.0)
    // new SPAudioBuffer([object AudioBuffer], 0.8,1.0)

    if ( !( audioContext instanceof AudioContext ) ) {
        console.error( 'First argument to SPAudioBuffer must be a valid AudioContext' );
        return;
    }

    // Private Variables
    var buffer_;
    var rawBuffer_;
    var startPoint_;
    var endPoint_;

    this.audioContext = audioContext;

    // Variables exposed by AudioBuffer

    this.duration = null;

    /**
     * The number of discrete audio channels.
     *
     * @property numberOfChannels
     * @type Number
     * @readOnly
     */
    Object.defineProperty( this, 'numberOfChannels', {
        get: function () {
            return this.buffer ? this.buffer.numberOfChannels : 0;
        }
    } );

    /**
     * The sample-rate for the PCM audio data in samples per second.
     *
     * @property sampleRate
     * @type Number
     * @readOnly
     */
    Object.defineProperty( this, 'sampleRate', {
        get: function () {
            return this.buffer ? this.buffer.sampleRate : 0;
        }
    } );

    /**
     * Returns the Float32Array representing the PCM audio data for the specific channel.
     *
     * @method getChannelData
     * @param {Number} channel This parameter is an index representing the particular channel to get data for. An index value of 0 represents the first channel.
     *
     */
    this.getChannelData = function ( channel ) {
        if ( !this.buffer ) {
            return null;
        } else {
            return this.buffer.getChannelData( channel );
        }
    };

    /*
     * For Duck-Type-Checking
     */
    this.isSPAudioBuffer = true;

    /**
     * The actual AudioBuffer that this SPAudioBuffer object is wrapping around. The getter of this property returns a clipped AudioBuffer based on the startPoint and endPoint properties.
     *
     * @property buffer
     * @type AudioBuffer
     * @default null
     */
    Object.defineProperty( this, 'buffer', {
        set: function ( buffer ) {

            if ( startPoint_ === null ) {
                this.startPoint = 0;
            } else if ( startPoint_ > buffer.length / buffer.sampleRate ) {
                console.error( "SPAudioBuffer : startPoint cannot be greater than buffer length" );
                return;
            }
            if ( endPoint_ === null ) {
                this.endPoint = this.rawBuffer_.length;
            } else if ( endPoint_ > buffer.length / buffer.sampleRate ) {
                console.error( "SPAudioBuffer : endPoint cannot be greater than buffer length" );
                return;
            }

            rawBuffer_ = buffer;
            this.updateBuffer();
        }.bind( this ),
        get: function () {
            return buffer_;
        }
    } );

    /**
     * URL or File object that is the source of the sound in the buffer. This property can be used for indexing and caching decoded sound buffers.
     *
     * @property sourceURL
     * @type String/File
     * @default null
     */
    this.sourceURL = null;

    /**
     * The starting point of the buffer in seconds. This, along with the {{#crossLink "SPAudioBuffer/endPoint:property"}}endPoint{{/crossLink}} property, decides which part of the original buffer is clipped and returned by the getter of the {{#crossLink "SPAudioBuffer/buffer:property"}}buffer{{/crossLink}} property.
     *
     * @property startPoint
     * @type Number
     * @default null
     * @minvalue 0
     */
    Object.defineProperty( this, 'startPoint', {
        set: function ( startPoint ) {
            if ( endPoint_ !== undefined && startPoint >= endPoint_ ) {
                console.error( "SPAudioBuffer : startPoint cannot be greater than endPoint" );
                return;
            }

            if ( rawBuffer_ && ( startPoint * rawBuffer_.sampleRate ) >= rawBuffer_.length ) {
                console.error( "SPAudioBuffer : startPoint cannot be greater than or equal to buffer length" );
                return;
            }

            startPoint_ = startPoint;
            this.updateBuffer();
        }.bind( this ),
        get: function () {
            return startPoint_;
        }
    } );

    /**
     * The ending point of the buffer in seconds. This, along with the {{#crossLink "SPAudioBuffer/startPoint:property"}}startPoint{{/crossLink}} property, decides which part of the original buffer is clipped and returned by the getter of the {{#crossLink "SPAudioBuffer/buffer:property"}}buffer{{/crossLink}} property.
     *
     * @property endPoint
     * @type Number
     * @default null
     * @minvalue 0
     */
    Object.defineProperty( this, 'endPoint', {
        set: function ( endPoint ) {
            if ( startPoint_ !== undefined && endPoint <= startPoint_ ) {
                console.error( "SPAudioBuffer : endPoint cannot be lesser than startPoint" );
                return;
            }

            if ( rawBuffer_ && ( endPoint * rawBuffer_.sampleRate ) >= rawBuffer_.length ) {
                console.error( "SPAudioBuffer : endPoint cannot be greater than buffer or equal to length" );
                return;
            }

            endPoint_ = endPoint;
            this.updateBuffer();
        }.bind( this ),
        get: function () {
            return endPoint_;
        }
    } );

    this.updateBuffer = function () {
        if ( !rawBuffer_ ) {
            this.duration = 0;
        } else {
            if ( startPoint_ === null || startPoint_ === undefined ) {
                startPoint_ = 0;
            }
            if ( endPoint_ === null || endPoint_ === undefined ) {
                endPoint_ = rawBuffer_.duration;
            }

            this.duration = endPoint_ - startPoint_;
            this.length = Math.ceil( rawBuffer_.sampleRate * this.duration ) + 1;

            if ( this.length > 0 ) {
                // Start trimming
                if ( !buffer_ ||
                    buffer_.length != this.length ||
                    buffer_.numberOfChannels != rawBuffer_.numberOfChannels ||
                    buffer_.sampleRate != rawBuffer_.sampleRate
                ) {
                    buffer_ = this.audioContext.createBuffer( rawBuffer_.numberOfChannels, this.length, rawBuffer_.sampleRate );
                }

                var startIndex = Math.floor( startPoint_ * rawBuffer_.sampleRate );
                var endIndex = Math.ceil( endPoint_ * rawBuffer_.sampleRate );

                for ( var i = 0; i < rawBuffer_.numberOfChannels; i++ ) {
                    var aData = new Float32Array( rawBuffer_.getChannelData( i ) );
                    buffer_.getChannelData( i )
                        .set( aData.subarray( startIndex, endIndex ) );
                }
            }
        }
    };

    var urlType = Object.prototype.toString.call( URL );
    var startPointType = Object.prototype.toString.call( startPoint );
    var endPointType = Object.prototype.toString.call( endPoint );
    var bufferType = Object.prototype.toString.call( audioBuffer );

    if ( urlType === "[object String]" || urlType === "[object File]" ) {
        this.sourceURL = URL;
    } else if ( urlType === "[object AudioBuffer]" ) {
        this.buffer = URL;
    } else {
        console.warn( "Incorrect Parameter Type. url can only be a String, File or an AudioBuffer" );
    }

    if ( startPointType === "[object Number]" ) {
        this.startPoint = parseFloat( startPoint );
    } else {
        if ( startPointType !== "[object Undefined]" ) {
            console.warn( "Incorrect Parameter Type. startPoint should be a Number" );
        }
    }

    if ( endPointType === "[object Number]" ) {
        this.endPoint = parseFloat( endPoint );
    } else {
        if ( startPointType !== "[object Undefined]" ) {
            console.warn( "Incorrect Parameter Type. endPoint should be a Number" );
        }
    }

    if ( bufferType === "[object AudioBuffer]" && !this.buffer ) {
        this.buffer = audioBuffer;
    }
}
module.exports = SPAudioBuffer;

},{}]},{},[1])(1)
});