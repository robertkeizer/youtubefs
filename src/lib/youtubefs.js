const util = require( "util" );
const events = require( "events" );

const fuse = require( "fuse-bindings" );
const Joi = require( "joi" );

// Simple object used to be very clear about
// anything that is emitted by this class.
const _EVENTS = {
	STARTING_UP: "starting",
	STOPPING: "stopping"
};

const YoutubeFS = function( config, cb ){

	// Let's make sure we're an event emitter!
	events.EventEmitter.call( this );

	// If cb isn't defined, let's use a noop so that we can
	// safely not care in the future if it exists or doesn't.
	if( !cb ){ cb = function(){}; }

	const self = this;
	Joi.validate( config, Joi.object( ).keys( {
		"fuse": Joi.object( ).keys( {
			mountPath: Joi.string( ).required( )
		} ).required( ),
		"youtube": Joi.object( ).keys( {
			
		} )
	} ), function( err, result ){
		if( err ){ return self._handleError( err ); }

		// Because defaults can be set with Joi, we make sure
		// to set the instance wide config to be the object
		// that comes back from it.
		self.config = result;

		// You can thank node in the sense that our 
		// instantiator may not have got the listener going
		// quite yet.
		setTimeout( function( ){
			// Let's kick off the startup process.
			self._startup( cb );
		}, 100 );
	} );
};

// Simple wrapper for a single place errors can come from.
YoutubeFS.prototype._handleError = function( err ){
	this.emit( "error", err );
};

// This is called automatically when we've set the config.
YoutubeFS.prototype._startup = function( cb ){
	this.emit( _EVENTS.STARTING_UP );
	return cb( null );
};

YoutubeFS.prototype.stop = function( cb ){
	this.emit( _EVENTS.STOPPING );
	return cb( );
};

util.inherits( YoutubeFS, events.EventEmitter );

module.exports = YoutubeFS;
