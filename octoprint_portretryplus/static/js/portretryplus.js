$(function () {
    function PortRetryPlusViewModel(parameters) {
        var self = this;

        self.connection = parameters[0];
        self.settingsViewModel = parameters[1];

        self.onDataUpdaterPluginMessage = function(plugin, message) {
            if (plugin == "PortRetryPlus") {
                self.connection.requestData();
            }
        }

        self.onBeforeBinding = function() {
            self.settings = self.settingsViewModel.settings;
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: PortRetryPlusViewModel,
        dependencies: ["connectionViewModel", "settingsViewModel"],
        elements: ["#settings_plugin_portretryplus"]
    });
});
