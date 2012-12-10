/*
	anvil.testem - Testem runner integration for anvil.js
	version:	0.0.1
	author:		Alex Robson <alex@sharplearningcurve.com> (http://sharplearningcurve.com)
	copyright:	2011 - 2012
	license:	Dual licensed
				MIT (http://www.opensource.org/licenses/mit-license)
				GPL (http://www.opensource.org/licenses/gpl-license)
*/
var Api = require( "testem" ),
	api = new Api();

module.exports = function( _, anvil ) {

	return anvil.plugin( {
		name: "anvil.testem",
		activity: "test",
		commander: [
			[ "--testem", "invokes the testem runner" ]
		],
		config: {
			
		},

		configure: function( config, command, done ) {
			if( command.testem ) {
				this.config.mode = "dev";
				if( !config.src_files || _.isEmpty( config.srcFiles ) ) {
					var sourcePattern = anvil.fs.buildPath( config.source, "/**.js" ),
						specPattern = anvil.fs.buildPath( config.spec, "/**.js" ),
						outputPattern = anvil.fs.buildPath( config.output, "/**.js" );
					this.config.src_files = [ sourcePattern, specPattern, outputPattern ];
				}
			}
			if( command.ci ) {
				this.config.mode = "ci";
			}
			done();
		},

		run: function( done ) {
			if( this.config.mode === "dev" ) {
				api.startDev( this.config );
			} else if ( this.config.mode === "ci" ) {
				api.startCI( this.config );
			}
			done();
		}
	} );
};