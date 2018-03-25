const assert = require( "assert" );
const YoutubeFS = require( "../" );

const Tasks = require( "./tasks" );

describe( "Main", function( ){
	it( "Is a function", function( ){
		assert.ok( typeof( YoutubeFS ) == "function" );
	} );

	it( "Fails if invalid config passed", function( ){
		const tasks = new Tasks( );
		assert.throws( function( ){
			const _youtubeFs = new YoutubeFS( tasks.generateInvalidConfig() );
		} );
	} );

	it( "Emits a 'started' event if it gets that far", function( cb ){
		const tasks = new Tasks( );
		tasks.generateValidConfig( function( err, _config ){
			if( err ){ return cb( err ); }
			const youtubefs = new YoutubeFS( _config );
			youtubefs.once( "started", function( ){
				setTimeout( function( ){
					youtubefs.stop( );
				}, 500 );
			} );
			youtubefs.once( "stopped", function( ){
				cb( );
			} );
		} );
	} );

	it( "Emits a 'stopped' event if we shut it down", function( cb ){
		const tasks = new Tasks( );
		tasks.generateValidConfig( function( err, _config ){
			if( err ){ return cb( err ); }
			const youtubefs = new YoutubeFS( _config );
			youtubefs.once( "started", function( ){
				setTimeout( function( ){
					youtubefs.stop( function( ){ } ); //noop so that we confirm the event.
				}, 500 );
			} );
			youtubefs.once( "stopped", function( ){
				cb( );
			} );
		} );
	} );
} );
