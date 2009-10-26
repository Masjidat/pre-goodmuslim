function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
	Mojo.Controller.getAppController().showBanner("test banner");
	
	this.controller.setupWidget(Mojo.Menu.viewMenu,
        {
           
        },
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
	

	try {
		menuHelper.setupMenu(this.controller, "PrayerTimes");
	} catch (e) { $('logger').update(e.message);}
	
	this.model = {
     buttonLabel : "Button 5"
	};
	this.controller.setupWidget('myButton', {}, this.model);
	//add a listener
	this.controller.listen('myButton', Mojo.Event.tap, this.tapped.bind(this));
	
	
}

MainAssistant.prototype.activate = function(event) {

	  if (!appData.location["default"])
	  	this.calcTimes();
	  else 
	  	Mojo.Controller.errorDialog($L("Your Location is required to calculate Prayer Times.  Please update your location by using the button in the upper right."));
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

MainAssistant.prototype.setAlarm = function (key, time) {

	//parameters for the alarm service call	
	var params = {
			"wakeup": true,
			"key": "com.xivix.goodmuslim." + key,
			"uri": "palm://com.palm.applicationManager/launch",
			"params": '{"id":"com.xivix.goodmuslim","params":{"action":"playAzan", "prayer":"' + key + '"}}',
			};
	
	
	var d = time;
	
	if (d.getTime() < new Date().getTime())
		return;
	//d = new Date(new Date().getTime() + (1 * 60 * 1000));

	//make sure to use UTC time
	params['at'] = d.format("UTC:mm/dd/yyyy HH:MM:ss");
	
	/*
	 params["at"] = (d.getUTCMonth()+1)+'/'+d.getUTCDate()+'/'+d.getUTCFullYear()
					+" "+d.getUTCHours()+":"+d.getUTCMinutes();
	 */
					
	//$('logger').update($('logger').innerHTML + "<BR>" + key +  params["at"]);
    //set the alarm
	this.controller.serviceRequest('palm://com.palm.power/timeout', { 
		method: "set",
		parameters: params,
		onSuccess:  this.handleAlarmSetResponse.bind(this),
		onFailure:  this.handleAlarmSetResponseError.bind(this)
	});
}

MainAssistant.prototype.handleAlarmSetResponse = function (event)
{
	//$('logger').update($('logger').innerHTML + "<BR>" + "event received" + event.returnValue);
}

MainAssistant.prototype.handleAlarmSetResponseError = function (error)
{
	$('logger').update("error received: " + error);
}

MainAssistant.prototype.calcTimes = function () {
	

	prayTime.setCalcMethod(prayTime[appData.preferences.calculationMethod]);
	prayTime.setAsrMethod(prayTime[appData.preferences.juristicMethod]);
	prayTime.setHighLatsMethod(prayTime[appData.preferences.latitudeAdjustment]);
	prayTime.setTimeFormat(prayTime[appData.preferences.timeFormat]);	
	
	var prayerTimesArray = prayTime.getPrayerTimes (new Date(), appData.location.latitude, appData.location.longitude, 'auto');
	
	appData.preferences.latestTimes = prayerTimesArray;
		
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
		
		this.setAlarm(prayTime.timeNames[i], thisPrayer);
		
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
			
		default:
			// see if our app menu helper can use this...
			break;
		}
    }
};

MainAssistant.prototype.handleLocationResponse = function (event) {
	

	
	appData.location = {
		
		"latitude": event.latitude,
		"longitude": event.longitude,
		"altitude": event.altitude,
		"label": 'Working',
		'default': false
		
	};
	appData.saveLocation();
	this.updateViewMenu();
	
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

MainAssistant.prototype.updateViewMenu = function ()
{
	this.viewMenuModel.items[1].items[0].label=appData.location.label;
	this.controller.modelChanged(this.viewMenuModel);
}

MainAssistant.prototype.handleLocationResponseError = function (event) {
	
	Mojo.Controller.errorDialog($L("Sorry, we couldn't get your location."));
	this.stopSpinner();
	
}
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

MainAssistant.prototype.handleServiceResponseReverse = function (event) {
	
	var ad = event.address.split(";");
	ad.pop();
	
	var my_ad = ad.pop();
	
	// see if there is a zipcode in there... and pull it out..
	var parts = my_ad.trim().split(" ");
	last_part = parts.pop();
	if (isNaN(last_part) || last_part.length != 5) {
		try {
			//$('logger').update(last_part);
		} 
		catch (e) {
			$('logger').update(e.message);
		}
		// not a zipcode.. push it back in..
		parts.push(last_part);
	}
	my_ad = parts.join(" ");
	
	
	this.calcTimes();
	
	this.stopSpinner();
	
	appData.location.label = my_ad;
	this.updateViewMenu();
	appData.saveLocation();
	

}

MainAssistant.prototype.tapped = function(event) {
     $('logger').update("button pressed");
	 /*
	  this.controller.serviceRequest('palm://com.palm.power/timeout', {
		method: "set",
		parameters: {
			"wakeup": true,
			"key": "com.xivix.goodmuslim.fajr",
			"uri": "palm://com.palm.applicationManager/launch",
			"params": '{"id":"com.xivix.goodmuslim","params":{"action":"playAzan", "prayer":"fajr"}}',
			"at": "10/25/2009 03:20:00"
			},
		onSuccess: function() { $('logger').update(new Date());},
		onFailure: function() { $('logger').update("can't set timer");}
	});
	*/
	try {
		this.audioPlayer = new Audio();
		var file = Mojo.appPath + "sounds/azan.mp3";
		this.audioPlayer.src = file;
		$('logger').update(file);
	} 
	catch (e) {
		$('logger').update(e.message);
	}
	//Mojo.Controller.getAppController().assistant.handleLaunch( {"action":"playAzan", "prayer": "Fajr"} );
}

MainAssistant.prototype.handleServiceResponseReverseError = function (event) {
	// do nothing..
	Mojo.Controller.errorDialog($L("Sorry, we couldn't get your city name."));
	this.stopSpinner();
}


MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

