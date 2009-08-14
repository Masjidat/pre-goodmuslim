function MoonPhaseAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

MoonPhaseAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
	
	try {
		var result = moonPhase.calculate();
		$('moonImage').src = result.moonImage;
			$('moonPhase').update(result.moonPhase);
	} catch (e) { $('logger').update(e.message)}
	
	menuHelper.setupMenu(this.controller, "MoonPhase");
			

}

MoonPhaseAssistant.prototype.handleCommand = function(event) {
  this.controller=Mojo.Controller.stageController.activeScene();
    if(event.type == Mojo.Event.command) {

      switch(event.command) {
		default:
			// see if our app menu helper can use this...
			menuHelper.handleCommand(this.controller, event);
			break;
		}
    }
};

MoonPhaseAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


MoonPhaseAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MoonPhaseAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
