function PrayerTimeManager()
{
	this.view = null;
}

PrayerTimeManager.prototype.calcTimes = function() {

	prayTime.setCalcMethod(prayTime[appData.preferences.calculationMethod]);
	prayTime.setAsrMethod(prayTime[appData.preferences.juristicMethod]);
	prayTime.setHighLatsMethod(prayTime[appData.preferences.latitudeAdjustment]);
	prayTime.setTimeFormat(prayTime[appData.preferences.timeFormat]);	
	
	var prayerTimesArray = prayTime.getPrayerTimes (new Date(), appData.location.latitude, appData.location.longitude, 'auto');
	
	appData.preferences.latestTimes = prayerTimesArray;
	
	this.updateDisplay();
	
	this.updateAlarms();
}

PrayerTimeManager.prototype.updateAlarms = function() {
	
	for (i = 0; i < 7; i++) {
		
		if (i == 1 || i == 4) 
			continue;
		
		var thisPrayer = this.parseTime(appData.preferences.latestTimes[i]);
		this.setAlarm(prayTime.timeNames[i], thisPrayer);	
	}
	
	this.setUpdateAlarm();
	
}

PrayerTimeManager.prototype.updateDisplay = function() {
	if (!this.view)
		return;
		
	var now = new Date();
	var tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
	
	
		
	for (i = 0; i < 7; i++)
	{

		this.view.get('times_' + i).update(appData.preferences.latestTimes[i]);


		if (i == 1 || i == 4)
			continue;
			
		var thisPrayer = this.parseTime(appData.preferences.latestTimes[i]);
		var nextPrayer = this.parseTime(appData.preferences.latestTimes[(i + 1) % 7]);
		if (i == 6) 
			nextPrayer = new Date(nextPrayer.getTime() + (60 * 60 * 24 * 1000));
		
		if (now.getTime() > thisPrayer.getTime() && now.getTime() < nextPrayer.getTime()) {
			this.view.get('times_' + i).addClassName("highlighted");
		} else {
			this.view.get('times_' + i).removeClassName("highlighted");
		}
		
		this.setAlarm(prayTime.timeNames[i], thisPrayer);
		
	}
	
	if (appData.preferences.latestTimes[4] == appData.preferences.latestTimes[5])
		this.view.get('sunset_row').hide();
	else 
		this.view.get('sunset_row').show();
}

PrayerTimeManager.prototype.parseTime = function(time)
{
	var prayer_time = new Date();
	var parts;
	var ampm;
	
	if (appData.preferences.timeFormat == "Time12") {
		parts = time.split(" ");
		ampm = parts.pop();
		time = parts.pop();
	}
	
	var parts = time.split(":");
	var hours = parseInt(parts[0]);
	var minutes = parseInt(parts[1]);
	
	if (appData.preferences.timeFormat == "Time12" && ampm == "pm" && hours < 11)
		hours += 12;
	
	prayer_time.setMinutes(minutes);
	prayer_time.setHours(hours);	
	
	return prayer_time;
}

PrayerTimeManager.prototype.setView = function(view) {
	this.view = view;
}

PrayerTimeManager.prototype.setUpdateAlarm = function () 
{
	
	// set the alarm for midnight the next day...
	var d = new Date();
	
	// set midnight today...
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0);
	
	// add 27 hours.. to cover any DST issues..
	d = new Date(d.getTime() + (27 * 60 * 60 * 1000));
	
	// set to 2am + 2 minutes.
	d.setHours(2);
	d.setMinutes(2);
	d.setSeconds(0); 
	
	//d = new Date( new Date().getTime() + (2 * 60 * 1000));
	
	// set the alarm..
	var params = {
			"wakeup": true,
			"key": "com.xivix.goodmuslim.updateTimes",
			"uri": "palm://com.palm.applicationManager/launch",
			"params": '{"id":"com.xivix.goodmuslim","params":{"action":"updateTimes"}}',
			"at": d.format("UTC:mm/dd/yyyy HH:MM:ss")
			};
			
	new Mojo.Service.Request('palm://com.palm.power/timeout', { 
		method: "set",
		parameters: params,
		onSuccess:  this.handleAlarmSetResponse.bind(this),
		onFailure:  this.handleAlarmSetResponseError.bind(this)
	});
	
}

PrayerTimeManager.prototype.setAlarm = function (key, time) {
	
	//Mojo.Controller.errorDialog(key);
	// clear any existing alarm...
	new Mojo.Service.Request('palm://com.palm.power/timeout', {
		method: "clear",
		parameters: {
			"key" : "com.xivix.goodmuslim." + key
			}
	});

	//parameters for the alarm service call	
	var params = {
			"wakeup": true,
			"key": "com.xivix.goodmuslim." + key,
			"uri": "palm://com.palm.applicationManager/launch",
			"params": '{"id":"com.xivix.goodmuslim","params":{"action":"playAzan", "prayer":"' + key + '"}}'
			};
	
	
	var d = time;
	
	// if the notification type for this prayer is 'none'
	// then don't set the alarm..
	if (appData.preferences['notify' + key] == 'none') {
		return;
	}
	
	// if the time has already passed for this prayer...
	// then don't set the alarm..
	if (d.getTime() < new Date().getTime())
		return;
	
	//make sure to use UTC time
	params['at'] = d.format("UTC:mm/dd/yyyy HH:MM:ss");
	
    //set the alarm
	new Mojo.Service.Request('palm://com.palm.power/timeout', { 
		method: "set",
		parameters: params,
		onSuccess:  this.handleAlarmSetResponse.bind(this),
		onFailure:  this.handleAlarmSetResponseError.bind(this)
	});

}

PrayerTimeManager.prototype.handleAlarmSetResponse = function (event)
{
	//this.view.get('logger').update(this.view.get('logger').innerHTML + "<BR>" + "event received" + event.returnValue);
}

PrayerTimeManager.prototype.handleAlarmSetResponseError = function (error)
{
	//this.view.get('logger').update("error received: " + error);
}


var prayerTimeManager = new PrayerTimeManager();
