/*
	anvil.testem - Testem runner integration for anvil.js
	version:	0.1.1
	author:		Alex Robson <alex@sharplearningcurve.com> (http://sharplearningcurve.com)
	copyright:	2011 - 2012
	license:	Dual licensed
				MIT (http://www.opensource.org/licenses/mit-license)
				GPL (http://www.opensource.org/licenses/gpl-license)
*/
var Api;

module.exports = function( _, anvil ) {

	return anvil.plugin( {
		name: "anvil.testem",
		activity: "test",
		commander: [
			[ "--testem", "invokes the testem runner" ]
		],
		config: {
			
		},
		api: undefined,

		configure: function( config, command, done ) {
			var self = this;
			if( command.testem || config.autoTest ) {
				this.config.mode = "dev";
				if( !config.src_files || _.isEmpty( config.srcFiles ) ) {
					var sourcePattern = anvil.fs.buildPath( config.source, "/**.js" ),
						specPattern = anvil.fs.buildPath( config.spec, "/**.js" ),
						outputPattern = anvil.fs.buildPath( config.output, "/**.js" );
					this.config.src_files = [ sourcePattern, specPattern, outputPattern ];
				}
				anvil.on( "rebuild", function( step ) {
					if( step !== "test" ) {
						self.logger.clear();
					}
				} );
				anvil.console.off();
			}
			done();
		},

		run: function( done ) {
			var self = this,
				api = this.api;

			if( !api || !api.app ) {
				Api = require( "testem" );
				this.api = api = new Api();
				if( this.config.mode === "dev" ) {
					api.startDev( this.config );
					var logger = api.getLogger( "build" );

					anvil.on( "log.error", function( message ) {
						if( anvil.config.log[ "error" ] ) {
							logger.addMessage( "log", message + "\n", "red" );
						}
					} );
					anvil.on( "log.step", function( message ) {
						if( anvil.config.log[ "step" ] ) {
							logger.addMessage( "log", message + "\n", "blue" );
						}
					} );
					anvil.on( "log.event", function( message ) {
						if( anvil.config.log[ "event" ] ) {
							logger.addMessage( "log", "..." + message + "\n", "black" );
						}
					} );
					anvil.on( "log.warning", function( message ) {
						if( anvil.config.log[ "warning" ] ) {
							logger.addMessage( "log", "..." + message + "\n", "yellow" );
						}
					} );
					anvil.on( "log.debug", function( message ) {
						if( anvil.config.log[ "debug" ] ) {
							logger.addMessage( "log", "..." + message + "\n", "magenta" );
						}
					} );
					anvil.on( "log.complete", function( message ) {
						if( anvil.config.log[ "complete" ] ) {
							logger.addMessage( "log", message + "\n", "green" );
						}
					} );
					setTimeout( function() {
						api.addTab( logger );
						logger.addMessage( "log", "" );
					}, 1000 );
					self.logger = logger;
				}
			} else {
				api.restart();
			}
			done();
		}
	} );
};