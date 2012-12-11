## Anvil Testem

This adds testem integration to anvil. Testem is my favorite testing tool and getting it into anvil is a big win.

## Command Line

Testem is activated by adding a --testem argument to the anvil command line:

```bash
anvil --testem
```

It's recommended that you run testem in conjunction with Anvil's CI mode:

```bash
anvil --ci --testem
```

This will cause anvil to rebuild your solution on any file change and then re-trigger the test suites to run in testem.


## Configuration
The configuration section for this plugin matches testem's configuration options:

```javascript
"anvil.testem": {
	"port": which port to run testem at - default is 7357
    "launch": list of launchers to use ( Chrome, Firefox, PhantomJS, ...)
    "test_page": the page to use to run tests ( example: "spec/index.html" )
    "timeout": timeout for a browser
    "framework": test framework to use
    "src_files": files or patterns - unlikely you'd ever use this w/ anvil
}
```