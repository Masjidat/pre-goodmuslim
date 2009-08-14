function MainAssistant() {

}

MainAssistant.prototype.setup = function() {

	
	this.controller.setupWidget(Mojo.Menu.appMenu,
        this.attributes = {
           omitDefaultItems: true
        },
        this.model = {
            visible: true,
            items: [ 
                { icon: "refresh", label:"Update Location", command: "do-Update"},
				{ label: "About this App", command: "do-About"},
				{ label: "Preferences", command: "do-Preferences"}
            ]
        });
		
	// set the right date..
	var d = new Date();
	var dstring = "" + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
	$('my_date').innerHTML = dstring;
	
	/* setup Get Location activity indicator */
	this.spinnerSAttrs = {
		spinnerSize: 'large'
	}
	this.spinnerModel = {
		spinning: false
	}
	this.controller.setupWidget('spinnerId', this.spinnerSAttrs, this.spinnerModel);
	
	if (appData.location.label)
		$('my_location').update(appData.location.label);	


	
}

MainAssistant.prototype.parseTime = function(time)
{
	var prayer_time = new Date();
	var parts;
	var ampm;
	
	if (appData.preferences.timeFormat == "Time12") {
		parts = time.split(" ");
		ampm = parts.pop();
		time = parts.pop();
	}
	
	var parts = time.split(":");
	var hours = parseInt(parts[0]);
	var minutes = parseInt(parts[1]);
	
	if (appData.preferences.timeFormat == "Time12" && ampm == "pm" && hours < 11)
		hours += 12;
	
	prayer_time.setMinutes(minutes);
	prayer_time.setHours(hours);	
	
	return prayer_time;
}

MainAssistant.prototype.calcTimes = function () {
	

	prayTime.setCalcMethod(prayTime[appData.preferences.calculationMethod]);
	prayTime.setAsrMethod(prayTime[appData.preferences.juristicMethod]);
	prayTime.setHighLatsMethod(prayTime[appData.preferences.latitudeAdjustment]);
	prayTime.setTimeFormat(prayTime[appData.preferences.timeFormat]);	
	
	var prayerTimesArray = prayTime.getPrayerTimes (new Date(), appData.location.latitude, appData.location.longitude, 'auto')
		
	var now = new Date();
	var tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
	
	
		
	for (i = 0; i < 7; i++)
	{

		$('times_' + i).update(prayerTimesArray[i]);


		if (i == 1 || i == 4)
			continue;
			
		var thisPrayer = this.parseTime(prayerTimesArray[i]);
		var nextPrayer = this.parseTime(prayerTimesArray[(i + 1) % 7]);
		if (i == 6) 
			nextPrayer = new Date(nextPrayer.getTime() + (60 * 60 * 24 * 1000));
		
		if (now.getTime() > thisPrayer.getTime() && now.getTime() < nextPrayer.getTime()) {
			$('times_' + i).addClassName("highlighted");
		} else {
			$('times_' + i).removeClassName("highlighted");
		}
		
	}

	
	if (prayerTimesArray[4] == prayerTimesArray[5])
		$('sunset_row').hide();
	else 
		$('sunset_row').show();
}

MainAssistant.prototype.startSpinner = function() {
	this.spinnerModel.spinning = true;
	this.controller.modelChanged(this.spinnerModel); 
	$('my-scrim').show();      
}

MainAssistant.prototype.stopSpinner = function () {
	this.spinnerModel.spinning = false;
	this.controller.modelChanged(this.spinnerModel); 
	$('my-scrim').hide();      
}


MainAssistant.prototype.handleCommand = function(event) {
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
			
		case "do-About":
			this.controller.stageController.pushScene("about");
			break;
			
		case "do-Preferences":
			this.controller.stageController.pushScene("preferences");
			break;
		}
    }
};

MainAssistant.prototype.handleLocationResponse = function (event) {
	
	$('my_location').update("" + event.latitude + " - " + event.longitude);
	
	appData.location = {
		
		"latitude": event.latitude,
		"longitude": event.longitude,
		"altitude": event.altitude
		
	};
	appData.saveLocation();
	
	this.calcTimes();
	
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

MainAssistant.prototype.handleLocationResponseError = function (event) {
	
	Mojo.Controller.errorDialog($L("Sorry, we couldn't get your location."));
	this.stopSpinner();
	
}

MainAssistant.prototype.handleServiceResponseReverse = function (event) {
	
	var ad = event.address.split(";");
	ad.pop();
	
	var my_ad = ad.pop();
	$('my_location').update(my_ad);
	
	this.calcTimes();
	
	this.stopSpinner();
	
	appData.location.label = my_ad;
	appData.saveLocation();
	
	
	
}

MainAssistant.prototype.handleServiceResponseReverseError = function (event) {
	// do nothing..
	Mojo.Controller.errorDialog($L("Sorry, we couldn't get your city name."));
	this.stopSpinner();
}

MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	  
	this.calcTimes();
}


MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

