const async = require( "async" );
const uuid = require( "uuid" );
const tmp = require( "tmp" );

const Tasks = function( ){
	this.ident = uuid.v4();
};

Tasks.prototype.tmpFusePath = function( cb ){
	const self = this;
	tmp.dir( function( err, path, cleanupCb ){
		return cb( err, path );
	} );
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
