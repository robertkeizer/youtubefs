const async = require( "async" );
const uuid = require( "uuid" );
const tmp = require( "tmp" );

const Tasks = function( ){
	this.ident = uuid.v4();

	this._cleanups = [ ];
};

Tasks.prototype.tmpFusePath = function( cb ){
	const self = this;
	tmp.dir( function( err, path, cleanupCb ){
		if( err ){ return cb( err ); }

		self._cleanups.push( function( cb ){
			cleanupCb( { unsafe: true } );
			return cb( null );
		} );

		return cb( null, path );
	} );
};

Tasks.prototype.cleanup = function( cb ){
	async.each( this._cleanups, function( _cleanup, cb ){
		_cleanup( cb );
	}, cb );
};

Tasks.prototype.generateInvalidConfig = function( ){
	return {
		"invalid": "youbet"
	};
};

Tasks.prototype.generateValidConfig = function( cb ){
	const self = this;
	async.waterfall( [ function( cb ){
		self.tmpFusePath( cb );
	}, function( _tmpPath, cb ){
		return cb( null, {
			"fuse": {
				mountPath: _tmpPath
			},
			"youtube": {
				
			}
		} );
	} ], cb );
};

module.exports = Tasks;
