function PreferencesAssistant(  ) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	  	
	  this.preferences = appData.preferences;
	//	this.preferences = {};


	  this.optionConventions = [
			{value:'Jafari', label:$L('Ithna Ashari')},
			{value:'Karachi', label:$L('U. of Islamic Sciences, Karachi')},
			{value:'ISNA', label:$L('ISNA')},
			{value:'MWL', label:$L('MWL')},
			{value:'Makkah', label:$L('Umm al-Qura, Makkah')},
			{value:'Egypt', label:$L('Egyptian General Authority')},
			{value:'Tehran', label:$L('University of Tehran')}  	
	  ];
	  
	  this.optionAsr = [
			{value:'Shafii', label:$L('Shafii (Standard)')},
			{value:'Hanafi', label:$L('Hanafi')}
	  ];
	  
	  this.optionHighLat = [
			{value:'None', label:$L('None')},
			{value:'MidNight', label:$L('Middle of the Night')},
			{value:'OneSeventh', label:$L('1/7th of the Night')},
			{value:'AngleBased', label:$L('Angle / 60th of the Night')}
	  ];
	  
	  this.optionTimeFormat = [
			{value:'Time12', label:$L('12 Hour Clock')},
			{value:'Time24', label:$L('24 Hour Clock')}
	  ];
	  
	  this.optionQibla = [
			{value:'GreatCircle', label:$L('Great Circle (Standard)')},
			{value:'Mercator', label:$L('Mercator / Rhumb Lines')}
	  ];
	  
	  this.optionFajr = [
	  		{value: 'none', label:$L('None')},
			{value: 'notification', label:$L('Notification')},
			{value: 'azan', label:$L('Play Azan')}
	  ];
	  
	  this.optionDhuhr = [
	  		{value: 'none', label:$L('None')},
			{value: 'notification', label:$L('Notification')},
			{value: 'azan', label:$L('Play Azan')}
	  ];
	  
	  this.optionAsr = [
	  		{value: 'none', label:$L('None')},
			{value: 'notification', label:$L('Notification')},
			{value: 'azan', label:$L('Play Azan')}
	  ];
	  
	  this.optionMaghrib = [
	  		{value: 'none', label:$L('None')},
			{value: 'notification', label:$L('Notification')},
			{value: 'azan', label:$L('Play Azan')}
	  ];
	  
	  this.optionIsha = [
	  		{value: 'none', label:$L('None')},
			{value: 'notification', label:$L('Notification')},
			{value: 'azan', label:$L('Play Azan')}
	  ];
	  
	  	  	


}

PreferencesAssistant.prototype.setup = function() {


	this.controller.setupWidget('convention', {label: $L('Convention'), multiline: true, choices: this.optionConventions, modelProperty:'calculationMethod'}, this.preferences);
	this.controller.setupWidget('asrmethod', {label: $L('Method'), multiline: true, choices: this.optionAsr, modelProperty:'juristicMethod'}, this.preferences);
	this.controller.setupWidget('highlats', {label: $L('Adjustment'), multiline: true, choices: this.optionHighLat, modelProperty:'latitudeAdjustment'}, this.preferences);
	this.controller.setupWidget('timeformat', {label: $L('Format'), multiline: true, choices: this.optionTimeFormat, modelProperty:'timeFormat'}, this.preferences);
	this.controller.setupWidget('qiblamethod', {label: $L('Method'), multiline: true, choices: this.optionQibla, modelProperty:'qiblaMethod'}, this.preferences);
	
	this.controller.setupWidget('notifyFajr', {label: $L('Fajr'), multiline: true, choices: this.optionFajr, modelProperty:'notifyFajr'}, this.preferences);
	this.controller.setupWidget('notifyDhuhr', {label: $L('Dhuhr'), multiline: true, choices: this.optionDhuhr, modelProperty:'notifyDhuhr'}, this.preferences);
	this.controller.setupWidget('notifyAsr', {label: $L('Asr'), multiline: true, choices: this.optionAsr, modelProperty:'notifyAsr'}, this.preferences);
	this.controller.setupWidget('notifyMaghrib', {label: $L('Maghrib'), multiline: true, choices: this.optionMaghrib, modelProperty:'notifyMaghrib'}, this.preferences);
	this.controller.setupWidget('notifyIsha', {label: $L('Isha'), multiline: true, choices: this.optionIsha, modelProperty:'notifyIsha'}, this.preferences);
	
	this.controller.listen("convention", Mojo.Event.propertyChange, this.savePreferences.bind(this));
	this.controller.listen("asrmethod", Mojo.Event.propertyChange, this.savePreferences.bind(this));
	this.controller.listen("highlats", Mojo.Event.propertyChange, this.savePreferences.bind(this));
	this.controller.listen("timeformat", Mojo.Event.propertyChange, this.savePreferences.bind(this));
	this.controller.listen("qiblamethod", Mojo.Event.propertyChange, this.savePreferences.bind(this));
	
	this.controller.listen("notifyFajr", Mojo.Event.propertyChange, this.savePreferences.bind(this));
	this.controller.listen("notifyDhuhr", Mojo.Event.propertyChange, this.savePreferences.bind(this));
	this.controller.listen("notifyAsr", Mojo.Event.propertyChange, this.savePreferences.bind(this));
	this.controller.listen("notifyMaghrib", Mojo.Event.propertyChange, this.savePreferences.bind(this));
	this.controller.listen("notifyIsha", Mojo.Event.propertyChange, this.savePreferences.bind(this));

	this.controller.setupWidget(Mojo.Menu.appMenu,
        this.attributes = {
           omitDefaultItems: true
        },
        this.model = {
            visible: true,
            items: [ 
				Mojo.Menu.editItem,
				{ label: "Preferences", command: "do-appPrefs", disabled: true },
				{ label: "Help", command: "do-About"}
            ]
        });

}



PreferencesAssistant.prototype.savePreferences = function (event) {
	
	appData.savePreferences();
	
}

PreferencesAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


PreferencesAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

PreferencesAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
