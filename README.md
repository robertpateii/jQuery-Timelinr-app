jQuery-Timelinr-app
===================

A node application for hosting the Timelinr plugin on a webpage and adding images to it.


The latest from [juanbrujo/jQuery-Timelinr](https://github.com/juanbrujo/jQuery-Timelinr) can be copied right into the /public directory.

To host this, you'll need to create a heroku account and setup a Google project for an OAuth API key.

Admins are defined by their google account IDs.

Todo:
* Validate/escape the form submissions on the server side to prevent admins from injecting code on the homepage.
* Add more OAuth sources.
* Migrate off of the jade template engine to something more html focused such as ejs
