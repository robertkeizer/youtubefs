const assert = require( "assert" );
const YoutubeFS = require( "../" );

describe( "Main", function( ){
	it( "Is a function", function( ){
		assert.ok( typeof( YoutubeFS ) == "function" );
	} );
} );
