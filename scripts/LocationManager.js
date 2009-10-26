function LocationManager() {
	
	
}


LocationManager.prototype.updateLocation = function(controller, onUpdate, onComplete, onError)
{
	this.controller = controller;
	this.onUpdate = onUpdate;
	this.onComplete = onComplete;
	this.onError = onError;
	
	appData.location.label = "Updating...";
	appData.saveLocation();
	this.onUpdate();
	
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
	
	
}

LocationManager.prototype.handleLocationResponseError = function (event) {
	
	Mojo.Controller.errorDialog($L("Sorry, we couldn't get your location."));
	if (appData.location.latitude != null && appData.location.longitude != null)
	{
		appData.location.label = appData.location.latitude + ", " + appData.location.longitude,
		appData.saveLocation();
		this.onUpdate();
	}
	this.onError();
	//this.stopSpinner();
	
}

LocationManager.prototype.handleLocationResponse = function (event) {

	appData.location = {
		
		"latitude": event.latitude,
		"longitude": event.longitude,
		"altitude": event.altitude,
		"label": event.latitude + ", " + event.longitude,
		'default': false
		
	};
	appData.saveLocation();
	this.onUpdate();
	
	//this.calcTimes();

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


LocationManager.prototype.handleServiceResponseReverse = function (event) {

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
	
	
	
	//this.stopSpinner();
	
	appData.location.label = my_ad;
	//this.updateViewMenu();
	appData.saveLocation();
	
	this.onUpdate();
	this.onComplete();
	

}

LocationManager.prototype.handleServiceResponseReverseError = function (event) {
	// do nothing..
	Mojo.Controller.errorDialog($L("Sorry, we couldn't get your city name."));
	this.onComplete();
}

var locationManager = new LocationManager();
