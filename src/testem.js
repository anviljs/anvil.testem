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
				anvil.on( "rebuild", function( args ) {
					if( args.step !== "test" ) {
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

					anvil.on( "log.error", function( args ) {
						if( anvil.config.log[ "error" ] ) {
							logger.addMessage( "log", args.message + "\n", "red" );
						}
					} );
					anvil.on( "log.step", function( args ) {
						if( anvil.config.log[ "step" ] ) {
							logger.addMessage( "log", args.message + "\n", "blue" );
						}
					} );
					anvil.on( "log.event", function( args ) {
						if( anvil.config.log[ "event" ] ) {
							logger.addMessage( "log", "..." + args.message + "\n", "black" );
						}
					} );
					anvil.on( "log.warning", function( args ) {
						if( anvil.config.log[ "warning" ] ) {
							logger.addMessage( "log", "..." + args.message + "\n", "yellow" );
						}
					} );
					anvil.on( "log.debug", function( args ) {
						if( anvil.config.log[ "debug" ] ) {
							logger.addMessage( "log", "..." + args.message + "\n", "magenta" );
						}
					} );
					anvil.on( "log.complete", function( args ) {
						if( anvil.config.log[ "complete" ] ) {
							logger.addMessage( "log", args.message + "\n", "green" );
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