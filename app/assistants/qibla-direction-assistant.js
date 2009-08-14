function QiblaDirectionAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

QiblaDirectionAssistant.prototype.setup = function() {

	this.viewMenuModel = {
            visible: true,
            items: [{}, {
				items: [{
					label: appData.location.label,
					command: " ",
					width: 257
				}, {
					label: "Refresh",
					icon: 'refresh',
					command: "do-Update",
					disabled: false
				},{}]
			}
            ]
        };

	this.controller.setupWidget(Mojo.Menu.viewMenu,
        {
           
        },
        this.viewMenuModel);
	
	/* setup Get Location activity indicator */
	this.spinnerSAttrs = {
		spinnerSize: 'large'
	}
	this.spinnerModel = {
		spinning: false
	}
	this.controller.setupWidget('spinnerId', this.spinnerSAttrs, this.spinnerModel);
	
	try {
		menuHelper.setupMenu(this.controller, "QiblaDirection");
	} catch (e) { }

}

QiblaDirectionAssistant.prototype.updateViewMenu = function ()
{
	this.viewMenuModel.items[1].items[0].label=appData.location.label;
	this.controller.modelChanged(this.viewMenuModel);
}

QiblaDirectionAssistant.prototype.calcDirection = function ()
{
	var result = {};
	try {
		
		result = qiblaDirection.calculate(appData.location);
		
		
		var angleToUse = 0;
		if (appData.preferences.qiblaMethod == "Mercator")
			angleToUse = result.mercator;
		else 
			angleToUse = result.azimuthMag;
		
		$('arrow').setStyle('-webkit-transform: rotate(' + angleToUse + 'deg);');
		
		
	} catch (e) { $('logger').update(e.message); }
}

QiblaDirectionAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	  
	  if (!appData.location["default"])
	  	this.calcDirection();
	  else 
	  	Mojo.Controller.errorDialog($L("Your Location is required to calculate the Qibla Direction.  Please update your location by using the button in the upper right."));
}


QiblaDirectionAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

QiblaDirectionAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

QiblaDirectionAssistant.prototype.handleLocationResponse = function (event) {
	
	
	appData.location = {
		
		"latitude": event.latitude,
		"longitude": event.longitude,
		"altitude": event.altitude,
		"label": 'Working',
		'default': false
		
	};
	
	appData.saveLocation();
	this.updateViewMenu();

	this.calcDirection();
	
	// got lat long... lets reverse it... and get the city state..
	this.controller.serviceRequest('palm://com.palm.location', {
			method : 'getReverseLocation',
	        parameters: {
				latitude: event.latitude,
	            longitude: event.longitude
	                },
	        onSuccess: this.handleServiceResponseReverse.bind(this),
	        onFailure: this.handleServiceResponseReverseError.bind(this)
	    });

	
}

QiblaDirectionAssistant.prototype.handleLocationResponseError = function (event) {
	
	Mojo.Controller.errorDialog($L("Sorry, we couldn't get your location."));
	this.stopSpinner();
	
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

QiblaDirectionAssistant.prototype.handleServiceResponseReverse = function (event) {
	

	var ad = event.address.split(";");
	ad.pop();
	
	var my_ad = ad.pop();
	// see if there is a zipcode in there... and pull it out..
	var parts = my_ad.trim().split(" ");
	last_part = parts.pop();
	if (isNaN(last_part) || last_part.length != 5) {
		// not a zipcode.. push it back in..
		parts.push(last_part);
	}
	my_ad = parts.join(" ");
	
	
	
	this.stopSpinner();
	appData.location.label = my_ad;
	this.updateViewMenu();
	appData.saveLocation();
	
	
	
}

QiblaDirectionAssistant.prototype.handleServiceResponseReverseError = function (event) {
	// do nothing..
	Mojo.Controller.errorDialog($L("Sorry, we couldn't get your city name."));
	this.stopSpinner();
}

QiblaDirectionAssistant.prototype.startSpinner = function() {
	this.spinnerModel.spinning = true;
	this.controller.modelChanged(this.spinnerModel); 
	$('my-scrim').show();      
}

QiblaDirectionAssistant.prototype.stopSpinner = function () {
	this.spinnerModel.spinning = false;
	this.controller.modelChanged(this.spinnerModel); 
	$('my-scrim').hide();      
}

QiblaDirectionAssistant.prototype.handleCommand = function(event) {
  this.controller=Mojo.Controller.stageController.activeScene();
    if(event.type == Mojo.Event.command) {

      switch(event.command) {
        case 'do-Update':
		
			this.startSpinner();		
			this.controller.serviceRequest('palm://com.palm.location', {
				method : 'getCurrentPosition',
		        parameters: {
					responseTime: 1,
		            subscribe: false,
					accuracy: 2
		                },
		        onSuccess: this.handleLocationResponse.bind(this),
		        onFailure: this.handleLocationResponseError.bind(this)
		    });
		
          
        	break;
			
		default:
			// see if our app menu helper can use this...
			menuHelper.handleCommand(this.controller, event);
			break;
		}
    }
};
