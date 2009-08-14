function AppData(){

	// try loading these items from a cookie...
	var cookie = new Mojo.Model.Cookie("preferences");
	this.preferences = cookie.get();
	
	if (!this.preferences) {
		this.preferences = {
			'default': true,
			"calculationMethod": 'ISNA',
			"juristicMethod": 'Shafii',
			"latitudeAdjustment": 'None',
			"timeFormat": 'Time12',
			"qiblaMethod": 'GreatCircle'
		};
	}
	
	cookie = new Mojo.Model.Cookie("location");
	this.location = cookie.get();
	if (!this.location) {
		this.location = {
			'default': true,
			'label': 'No Location'
		}
	}
}

AppData.prototype.saveLocation = function () {
	

	var cookie = new Mojo.Model.Cookie("location");
	cookie.put(this.location);
	
}

AppData.prototype.savePreferences = function () {
	
	var cookie = new Mojo.Model.Cookie("preferences");
	cookie.put(this.preferences);
	
}

var appData = new AppData();
