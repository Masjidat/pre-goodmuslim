function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
	
	prayerTimeManager.setView(this.controller);
		
	try {
		menuHelper.setupMenu(this.controller, "PrayerTimes");
	} catch (e) { $('logger').update(e.message);}
	
	
}

MainAssistant.prototype.activate = function(event) {

	  if (!appData.location["default"]) {
	  	prayerTimeManager.calcTimes();
		// set the right date..
		var d = new Date();
		var dstring = "" + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
		$('my_date').innerHTML = appData.location.label + " - " + dstring;
	  } else {
	  	this.controller.showAlertDialog({
		    onChoose: this.firstLocationUpdate.bind(this),
		    title: $L("Location Required"),
		    message: $L("Your location is required to calculate prayer times."),
		    choices:[
		         {label:$L('Update My Location Now'), value:"update", type:'affirmative'},  
		         {label:$L("I will update later"), value:"cancel", type:'dismiss'}    
		    ]
		});

	  }
}

MainAssistant.prototype.firstLocationUpdate = function (value) {
	//function(value) {this.outputDisplay.innerHTML = $L("Alert result = ") + value;},
	
	if (value == "update")
		this.controller.stageController.pushScene("location");
}


String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}


MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

