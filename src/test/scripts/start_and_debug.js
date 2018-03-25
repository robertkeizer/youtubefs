const Tasks = require( "../tasks" );
const YoutubeFS = require( "../../" );

const tasks = new Tasks( );

let youtubefs = undefined;

tasks.generateValidConfig( function( err, config ){
	youtubefs = new YoutubeFS( config );
	youtubefs.once( "started", function( ){
		console.log( "Started; I have mount point of " );
		console.log( config.fuse.mountPath );
	} );
} );

process.on( "SIGINT", function( ){
	youtubefs.stop( );
} );
