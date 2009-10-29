function AppAssistant(appController) {
	this.MainStageName = "mainstage";
	this.AzanStageName = "azanstage";	
	this.AzanPopupStageName = "azanpopup";
}

AppAssistant.prototype.setup = function() {

}



AppAssistant.prototype.handleLaunch = function (launchParams) {
	Mojo.Log.info("launching application");
	try {
		// Look for an existing main stage by name.
		var stageProxy = this.controller.getStageProxy(this.MainStageName);
		var stageController = this.controller.getStageController(this.MainStageName);


		if (!launchParams || launchParams.action == "launchApp") {
			if (stageProxy) {
				// If the stage exists, just bring it to the front by focusing its window.
				// Or, if it is just the proxy, then it is being focused, so exit.
				if (stageController) {
					stageController.window.focus();
				}
			}
			else {
				// Create a callback function to set up the new main stage
				// after it is done loading. It is passed the new stage controller
				// as the first parameter.
				var pushMainScene = function(stageController){
					stageController.pushScene("main");
				};
				var stageArguments = {
					name: this.MainStageName,
					lightweight: false
				};
				// Specify the stage type with the last property.
				this.controller.createStageWithCallback(stageArguments, pushMainScene, "card");
				
			}
		} else {
			
			// have launch params...
			switch (launchParams.action)
			{
				case "playAzan":
					this.handlePlayAzan(launchParams.prayer);
					break;
					
				case "updateTimes":
					prayerTimeManager.calcTimes();
					//Mojo.Controller.getAppController().showBanner("Updating Times", {action: 'launchApp'});
					break;
			}
		}
	} catch (e) {
		Mojo.Controller.getAppController().showBanner(e.message, {action: 'launchApp'});
	}
	
};

AppAssistant.prototype.handlePlayAzan = function(whichAzan){

	appData = new AppData();
	
	if (appData.preferences['notify' + whichAzan] == "none")	
		return;
		
	if (appData.preferences['notify' + whichAzan] == "azan"){
		this.handleAzanPopup(whichAzan);
		return;
	}

	var dashboardStage = Mojo.Controller.getAppController().getStageProxy(this.AzanStageName);
	if(dashboardStage) {
		dashboardStage.delegateToSceneAssistant("updateDashboard", whichAzan);
	} else {
		
		var pushDashboard = function(stageController){
			stageController.pushScene('azan', whichAzan);
		};
		var stageArgs = {
				name: this.AzanStageName, 
				lightweight: true, 
				assistant: "AzanStageAssistant",
				soundclass: "notifications",
				sound: undefined
			};
		Mojo.Controller.getAppController().playSoundNotification("notifications");
		Mojo.Controller.getAppController().createStageWithCallback(stageArgs, pushDashboard, 'dashboard');
	}
}

AppAssistant.prototype.handleAzanPopup = function(whichAzan){

	var stageProxy = this.controller.getStageProxy(this.AzanPopupStageName);
	var stageController = this.controller.getStageController(this.AzanPopupStageName);
	
	if (stageProxy) {
		// If the stage exists, just bring it to the front by focusing its window.
		// Or, if it is just the proxy, then it is being focused, so exit.
		if (stageController) {
			stageController.window.focus();
		}
	}
	else {
		// Create a callback function to set up the new main stage
		// after it is done loading. It is passed the new stage controller
		// as the first parameter.
		var pushMainScene = function(stageController){
			stageController.pushScene("azan-popup", whichAzan);
		};
		var stageArguments = {
			name: this.AzanPopupStageName,
			lightweight: true,
			height: 148,
			soundclass:"ringtones",
			sound: "sounds/" + appData.preferences.azanType + "_azan.mp3"
		};
		

		
		// Specify the stage type with the last property.
		this.controller.createStageWithCallback(stageArguments, pushMainScene, "popupalert");
		
	}
}



AppAssistant.prototype.handleCommand = function(event) {
	
	
	
	var stageController = Mojo.Controller.getAppController().getStageController(this.MainStageName);
	
	if (stageController && event.type == Mojo.Event.command) {
		var currentScene = stageController.activeScene();
		
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
