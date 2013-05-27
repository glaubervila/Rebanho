#!/bin/bash

#Build app With Sencha SDK Tools 2.0 Beta 3

/opt/SenchaSDKTools-2.0.0-beta3/sencha create jsb -a index.html -p app.jsb3

/opt/SenchaSDKTools-2.0.0-beta3/sencha build -p app.jsb3 -d ./
