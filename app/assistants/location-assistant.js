function LocationAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

LocationAssistant.prototype.setup = function() {


	this.controller.setupWidget("locationUpdateButton", this.attributes = {}, this.model = {
		label: "Use my Current Location",
		disabled: false
	});
	
	this.controller.listen("locationUpdateButton", Mojo.Event.tap, this.updateLocation.bind(this))

	/* setup Get Location activity indicator */
	this.spinnerSAttrs = {
		spinnerSize: 'large'
	}
	this.spinnerModel = {
		spinning: false
	}
	this.controller.setupWidget('spinnerId', this.spinnerSAttrs, this.spinnerModel);
	
	$('location_name').update(appData.location.label);
	$('latlong').update(this.roundThreePlaces(appData.location.latitude) + ", " + this.roundThreePlaces(appData.location.longitude));

	this.controller.setupWidget(Mojo.Menu.appMenu,
        this.attributes = {
           omitDefaultItems: true
        },
        this.model = {
            visible: true,
            items: [ 
				Mojo.Menu.editItem,
				{ label: "My Location", command: "do-location", disabled: true }, 
				{ label: "Preferences", command: "do-appPrefs"},
				{ label: "Help", command: "do-About"}
            ]
        });

}

LocationAssistant.prototype.updateLocation = function(event){

	$('location_name').update("Updating...");
	$('latlong').update("Updating...");
	
	appData.location.label = "NA";
	
	this.startSpinner();
	locationManager.updateLocation(this.controller, this.locationUpdate.bind(this), this.locationUpdateComplete.bind(this), this.locationUpdateError.bind(this));	
}

LocationAssistant.prototype.roundThreePlaces = function (num)
{
	if (isNaN(num))
		return "NA";
	return Math.round(num * 1000) / 1000;
}

LocationAssistant.prototype.locationUpdateComplete = function() {

	$('location_name').update(appData.location.label);
	this.stopSpinner();
	
	Mojo.Controller.getAppController().showBanner("Your Location has been updated.", {action: 'launchApp'});
	
	this.closeScene.bind(this).delay(1);
	
} 

LocationAssistant.prototype.closeScene = function(){
	this.controller.stageController.popScene("");
}

LocationAssistant.prototype.locationUpdateError = function() {
	this.stopSpinner();
}

LocationAssistant.prototype.locationUpdate = function () {
	
	// try to update our values...
	$('latlong').update(this.roundThreePlaces(appData.location.latitude) + ", " + this.roundThreePlaces(appData.location.longitude));
	
}


LocationAssistant.prototype.startSpinner = function() {
	this.spinnerModel.spinning = true;
	this.controller.modelChanged(this.spinnerModel); 
	$('my-scrim').show();      
}

LocationAssistant.prototype.stopSpinner = function () {
	this.spinnerModel.spinning = false;
	this.controller.modelChanged(this.spinnerModel); 
	$('my-scrim').hide();      
}


LocationAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


LocationAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

LocationAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
