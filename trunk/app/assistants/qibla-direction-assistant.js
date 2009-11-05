function QiblaDirectionAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

QiblaDirectionAssistant.prototype.setup = function() {

	try {
		menuHelper.setupMenu(this.controller, "QiblaDirection");
	} catch (e) { }

}

QiblaDirectionAssistant.prototype.calcDirection = function ()
{
	var result = {};
	try {
		
		result = qiblaDirection.calculate(appData.location);
		
		
		var angleToUse = 0;
		var compassAngle = 0;
		if (appData.preferences.qiblaMethod == "Mercator") {
			if (appData.preferences.qiblaDirectionBackground == "map")
				angleToUse = result.mercator;
			else 
				angleToUse = result.mercatorMag;
		}
		else {
			if (appData.preferences.qiblaDirectionBackground == "map")
				angleToUse = result.azimuth;
			else 
				angleToUse = result.azimuthMag;
		}
		
		if (appData.preferences.qiblaDirectionBackground == "map") {
			$('directionBackground').update("<div id='mymap'><div style='padding-top:70px;'>Loading Map...</div></div><img src=\"images/Compass_trans.png\" id='compass_img' style='position: absolute;'>");
			
			this.img = new Image();
			this.img.onload = this.updateBackground.bind(this);
			this.img.onerror = this.backgroundLoadError.bind(this);
			this.img.src= "http://maps.google.com/maps/api/staticmap?center=" + appData.location.latitude + "," + appData.location.longitude + "&zoom=11&size=" + screen.width + "x" + (screen.height - 28) + "&maptype=roadmap&sensor=false&key=ABQIAAAAJGDfJAJaZVQh0APprhCCmBSPMfPq2s45eHvZIOwK1zU0RUMXaBRhdhWA9YWDS3f1ZPzQjWahcvKLyg";
 
			// rotate compass to match azimuth...
			if (appData.preferences.qiblaMethod == "Mercator")
				compassAngle = result.mercator - result.mercatorMag;
			else 
				compassAngle = result.azimuth - result.azimuthMag;
				
			$('compass_img').setStyle('-webkit-transform: rotate(' + compassAngle + 'deg);');
			
		} else {
			$('directionBackground').update("<img src=\"images/Compass_trans.png\" id='compass_img' style='position: absolute;'>");
		}
		
		
		$('arrow').show().setStyle({
			"top": (((screen.height - 28) / 2) - 119) + "px"
		});		
		$('arrow').setStyle('-webkit-transform: rotate(' + angleToUse + 'deg);');
		
		
		$('compass_img').setStyle({"left": ( (screen.width / 2) - 160) + "px", "top": (((screen.height - 28) / 2) - 122) + "px"});
		
		// rotate compass to match azimuth...
		
		
	} catch (e) {  }
}

QiblaDirectionAssistant.prototype.updateBackground = function () {
	$('mymap').update("<img src=\"" + this.img.src + "\">");
}
QiblaDirectionAssistant.prototype.backgroundLoadError = function () {
	$('mymap').update("");
	Mojo.Controller.errorDialog("The Map image failed to load.  Make sure you have a data connection available.");
}


QiblaDirectionAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	  
	  if (!appData.location["default"]) {
	  	this.calcDirection();
		$('mylocation').update(appData.location.label);
	  } else {
	  	this.controller.showAlertDialog({
		    onChoose: this.firstLocationUpdate.bind(this),
		    title: $L("Location Required"),
		    message: $L("Your location is required to determine your Qibla Direction."),
		    choices:[
		         {label:$L('Update My Location Now'), value:"update", type:'affirmative'},  
		         {label:$L("I will update later"), value:"cancel", type:'dismiss'}    
		    ]
		});

	  }
}

QiblaDirectionAssistant.prototype.firstLocationUpdate = function (value) {
	//function(value) {this.outputDisplay.innerHTML = $L("Alert result = ") + value;},
	
	if (value == "update")
		this.controller.stageController.pushScene("location");
}


QiblaDirectionAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

QiblaDirectionAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}


String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

