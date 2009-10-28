function AzanAssistant(whichPrayer) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	 
	this.prayer = whichPrayer;
}

AzanAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
	this.updateDashboard(this.prayer);
}

AzanAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}

AzanAssistant.prototype.updateDashboard = function(prayer)
{
	var info = {prayer: prayer};
	/*Mojo.Controller.getAppController().showBanner({
		messageText: "Time for " + prayer,
		soundclass: "alert",
		sound: undefined
	}, {action: 'launchApp'});
	*/
	// Use render to convert the object and its properties along with a view file into a string
	// containing HTML
	var renderedInfo = Mojo.View.render({object: info, template: 'azan/message'});
	var infoElement = this.controller.get('message');
	infoElement.update(renderedInfo);
}

AzanAssistant.prototype.launchMain = function() {
	var appController = Mojo.Controller.getAppController();
	appController.assistant.handleLaunch({action:"launchApp"});
	this.controller.window.close();
};


AzanAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

AzanAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
