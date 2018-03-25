const util = require( "util" );
const events = require( "events" );

const async = require( "async" );
const fuse = require( "fuse-bindings" );
const Joi = require( "joi" );

// Simple object used to be very clear about
// anything that is emitted by this class.
const _EVENTS = {
	STARTING_UP: "starting",
	STARTED: "started",
	STOPPING: "stopping",
	STOPPED: "stopped"
};

const YoutubeFS = function( config, cb ){

	// Let's make sure we're an event emitter!
	events.EventEmitter.call( this );

	// If cb isn't defined, let's use a noop so that we can
	// safely not care in the future if it exists or doesn't.
	if( !cb ){ cb = function(){}; }

	const self = this;
	this._mounted = false;

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
	this._mounted = true;
	this.emit( _EVENTS.STARTING_UP );
	const self = this;
	fuse.mount( this.config.fuse.mountPath, {
		readdir: this._readdir,
		getattr: this._getattr,
		open: this._open,
		read: this._read
	}, function( err ){
		if( err ){ 
			return this._handleError( err );
		}

		self.emit( _EVENTS.STARTED );
	} );
};

YoutubeFS.prototype.stop = function( cb ){
	this.emit( _EVENTS.STOPPING );

	const self = this;
	async.waterfall( [ function( cb ){
		// Sanity check, if we're not mounted don't
		// try and unmount..
		if( self._mounted ){
			return fuse.unmount( self.config.fuse.mountPath, function( err ){
				return cb( null );
			} )
		}
		return cb( null );
	} ], function( err ){
		if( err ){ return cb( err ); }
		self.emit( _EVENTS.STOPPED );
	} );
};

YoutubeFS.prototype._readdir = function( _path, cb ){
	if( path === "/" ){
		return cb( 0, [ "test" ] );
	}
	cb( 0 );
};

YoutubeFS.prototype._getattr = function( _path, cb ){
	if( _path === "/" ){
		return cb( 0, {
			mtime: new Date( ),
			atime: new Date( ),
			ctime: new Date( ),
			nlink: 1,
			size: 100,
			mode: 16877,
			uid: process.getuid(),
			gid: process.getgid()
		} );
	}

	if( _path === "/test" ){
		return cb( 0, {
			mtime: new Date( ),
			atime: new Date( ),
			ctime: new Date( ),
			nlink: 1,
			size: 12,
			mode: 33188,
			uid: process.getuid(),
			gid: process.getgid()
		} );
	}

	cb( fuse.ENOENT );
};

YoutubeFS.prototype._open = function( _path, flags, cb ){
	console.log( "Open " + _path + " with flags of " + flags );
	cb( 0, 42 );
};

YoutubeFS.prototype._read = function( _path, fd, buf, len, pos, cb ){
	const str = "hello world\n".slice( pos, pos + len );
	if( !str ){ return cb( 0 ); }
	buf.write( str );
	return cb( str.length );
};

util.inherits( YoutubeFS, events.EventEmitter );

module.exports = YoutubeFS;
