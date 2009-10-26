function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
	
	//this.controller.pushScene("azan-popup");
	
}


StageAssistant.prototype.handleCommand = function(event) {
	
	var stageController = this.controller.getActiveStageController();
    var currentScene = stageController.activeScene();
	
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case "do-PrayerTimes":
				stageController.swapScene("main");
				break;
				
			case "do-MoonPhase":
				stageController.swapScene("moon-phase");
				break;
				
			case "do-QiblaDirection":
				stageController.swapScene("qibla-direction");
				break;
				
			case "do-About":
				stageController.pushScene("about");
				break;
				
			case "do-appPrefs":
				stageController.pushScene("preferences");
				break;
		}
	}
}