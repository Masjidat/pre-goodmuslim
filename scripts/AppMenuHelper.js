

function MenuHelper()
{
	
}

MenuHelper.prototype.setupMenu = function(controller, command)
{
	controller.setupWidget(Mojo.Menu.commandMenu,
        {

        },
        {
            visible: true,
            items: [{},{
				toggleCmd: "do-" + command,
				items: [{
					iconPath: "images/icons/clock.png",
					label: "Times",
					command: "do-PrayerTimes"
				}, {
					iconPath: "images/icons/moon.png",
					label: "Moon",
					command: "do-MoonPhase"
				}, {
					iconPath: "images/icons/rose.png",
					label: "Qibla",
					command: "do-QiblaDirection"
				}]
			},{}
            ]
        });
		
	controller.setupWidget(Mojo.Menu.appMenu,
        this.attributes = {
           omitDefaultItems: true
        },
        this.model = {
            visible: true,
            items: [ 
				{ label: "About this App", command: "do-About"},
				{ label: "Preferences", command: "do-Preferences"}
            ]
        });
}

MenuHelper.prototype.handleCommand = function(controller, event)
{
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case "do-PrayerTimes":
				controller.stageController.swapScene("main");
				break;
				
			case "do-MoonPhase":
				controller.stageController.swapScene("moon-phase");
				break;
				
			case "do-QiblaDirection":
				controller.stageController.swapScene("qibla-direction");
				break;
				
			case "do-About":
				controller.stageController.pushScene("about");
				break;
				
			case "do-Preferences":
				controller.stageController.pushScene("preferences");
				break;
		}
	}
}

var menuHelper = new MenuHelper();
