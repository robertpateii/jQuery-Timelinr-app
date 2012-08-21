:: Install node-inspector and my fork of node supervisor for a nice little debug environment.
:: https://github.com/robertpateii/node-supervisor
:: My fork has --ignore and --debug flags which weren't present in the original when I needed them in late april 2012.
:: The original has been updated a few times since I forked, but does not use the syntax below.
:: If you figure out the new syntax open an issue and I'll fix it.
start cmd /k supervisor --ignore views --no-restart-on error --debug --quiet app.js
start cmd /c node-inspector
start chrome 127.0.0.1:8080/debug?port=5858
start chrome 127.0.0.1:3000
