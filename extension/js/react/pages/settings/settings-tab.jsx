class SettingsTab extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isPremium: false,
			pills: {}
		};

		let settingsTab = this;
		RPlus.premium.isPremium(Roblox.users.authenticatedUserId).then(function (isPremium) {
			settingsTab.setState({
				isPremium: isPremium
			});
		}).catch(function (e) {
			console.error("Failed to load premium status", e);
		});
	}

	getPillValue(settingName, callBack) {
		let notificationSettings = this;

		let embeddedSetting = settingName.split(".");
		if (embeddedSetting.length === 2) {
			storage.get(embeddedSetting[0], function (embeddedObject) {
				embeddedObject = embeddedObject || {};

				var value = embeddedObject[embeddedSetting[1]] || false;
				var pillOverride = {};
				pillOverride[settingName] = value;

				notificationSettings.setState({
					pills: Object.assign({}, notificationSettings.state.pills, pillOverride)
				});

				callBack(value);
			});
			return;
		}

		switch (settingName) {
			case "groupShoutNotifier_mode":
				storage.get(settingName, function (value) {
					let enabled = value === "whitelist";

					var pillOverride = {};
					pillOverride.groupShoutWhitelistEnabled = enabled;

					notificationSettings.setState({
						pills: Object.assign({}, notificationSettings.state.pills, pillOverride)
					});

					callBack(enabled);
				});
				break;
			default:
				storage.get(settingName, function (value) {
					var pillOverride = {};
					pillOverride[settingName] = !!value;

					notificationSettings.setState({
						pills: Object.assign({}, notificationSettings.state.pills, pillOverride)
					});

					callBack(!!value);
				});
		}
	}

	setPillValue(settingName, value) {
		let notificationSettings = this;

		let embeddedSetting = settingName.split(".");
		if (embeddedSetting.length === 2) {
			storage.get(embeddedSetting[0], function (embeddedObject) {
				embeddedObject = embeddedObject || {};
				embeddedObject[embeddedSetting[1]] = value;

				var pillOverride = {};
				pillOverride[settingName] = value;

				notificationSettings.setState({
					pills: Object.assign({}, notificationSettings.state.pills, pillOverride)
				});

				storage.set(embeddedSetting[0], embeddedObject);
			});
			return;
		}

		switch (settingName) {
			case "groupShoutNotifier_mode":
				storage.set(settingName, value ? "whitelist" : "all");

				var pillOverride = {};
				pillOverride.groupShoutWhitelistEnabled = value;

				notificationSettings.setState({
					pills: Object.assign({}, notificationSettings.state.pills, pillOverride)
				});

				break;
			default:
				storage.set(settingName, value, function () {
					var pillOverride = {};
					pillOverride[settingName] = value;

					notificationSettings.setState({
						pills: Object.assign({}, notificationSettings.state.pills, pillOverride)
					});
				});
		}
	}
}