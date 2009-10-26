function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
	
	prayerTimeManager.setView(this.controller);
	
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
	  	prayerTimeManager.calcTimes();
	  else 
	  	Mojo.Controller.errorDialog($L("Your Location is required to calculate Prayer Times.  Please update your location by using the button in the upper right."));
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
			locationManager.updateLocation(this.controller, this.locationUpdate.bind(this), this.locationUpdateComplete.bind(this), this.locationUpdateError.bind(this));
		
          
        	break;
			
		default:
			// see if our app menu helper can use this...
			break;
		}
    }
};

MainAssistant.prototype.locationUpdateComplete = function() {
	prayerTimeManager.calcTimes();
	this.stopSpinner();
}

MainAssistant.prototype.locationUpdateError = function() {
	this.stopSpinner();
}

MainAssistant.prototype.locationUpdate = function () {
	//Mojo.Controller.errorDialog("in update");
	try {
		this.updateViewMenu();
	}catch (e) { 
		Mojo.Controller.errorDialog(e.message);
	}
}


MainAssistant.prototype.updateViewMenu = function ()
{
	this.viewMenuModel.items[1].items[0].label=appData.location.label;
	this.controller.modelChanged(this.viewMenuModel);
}


String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
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

MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

