## Lift Stopwatch
![logo]("http://toomeenoo.ml/img/Square71x71Logo.scale-240.png")

This app will help you to stay in rythm during your exercise. Simply set up parameters how fast and how long you want to lift (does not matter what) and press start.

## Requirements

Cordova app development enviroment, recomended is MS Visual Studio. The app is web-based, so it can be downloaded and run from browser (see section thin client)

## Thin Client

If you want to run this app on your computer you will only need download the "www" folder, and open index.html
When you do this nothing happens. You will came back here to read that you have to press magic key "L" on your keboard, or type "ViewManager.load(1)" to web console. It is because in normal case the phone or computer tells this way to thep app that is ready and that things should start to move on.

;tldr "Lift Stopwatch/www/index.html" press "L"

## File description

 |-Lift Stopwatch.sln	(visual studio solution)<br />
 |-Lift Stopwatch	(core directory)<br />
 | |-merges	(individual scriprs for different platforms)<br />
 | |-plugins	(folder for cordova plugins used by app, described under plugins)<br />
 | |-res	(visual resources for aplicaion, icons, screens, etc)<br />
 | |-www	(default webview folder)<br />
 | | |-css	(styles folder)<br />
 | | |-docs	(html documents folder)<br />
 | | |-scripts	(main code folder)<br />
 | | |-images	(used graphics folder)<br />
 | | |-index.html (main file)<br />
 | |-Lift Stopwatch.jsproj	(visual studio project)<br />
 | |-config.xml	(cordova configuration file)<br />
 | |-bower.json	(helper file)<br />
 | |-package.json	(idenification file)<br />
 | |-taco.json	(helper file)<br />


## Additional changes

+ (My) Code is refractored, as it was possible with current structure
+ data input method is changed on screens "setup1" and "setup2" from text / button input to range selector. 
+ Ads are reworked, method and efficiency. 
+ Added functionality to set different time to move up and down

## Author

Tomáš Molinari - TooMeeNoo
- know more at [my site](http://toomeenoo.ml)


## License

This version is under MIT open license, see plugins for detailed information about plugin license.
