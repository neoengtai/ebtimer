var sampleMapData = [
    {
        "name": "Silent Swamp",
        "channels": [
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0},
            {"state": "Grim", "lastUpdate": 0}
        ]
    }
];

angular.module('ebtimerApp', []).controller('EbtimerController', function($scope, $timeout) {
    var SPAWN_CD = 120; // in seconds

    $scope.maps = [];

    $scope.load = function (mapList) {
        for (var i = 0; i < mapList.length; i++) {
            var map = mapList[i];

            $scope.maps.push({
                "name": map.name,
                "channels": []
            });

            var currentTime = Date.now();
            for (var j = 0; j < map.channels.length; j++) {
                var channel = map.channels[j];

                var state = channel.state;
                var lastUpdate = channel.lastUpdate;
                $scope.maps[i].channels.push({
                    "state": state,
                    "timer": null
                });

                if (state == "Grim") {
                    if (currentTime < lastUpdate + 4 * SPAWN_CD * 1000) {
                        addTimer(i, j, (lastUpdate + 4 * SPAWN_CD * 1000) - currentTime);
                    }
                } else if (state == "Dark") { // dark
                    if (currentTime < lastUpdate + SPAWN_CD * 1000) {
                        addTimer(i, j, (lastUpdate + SPAWN_CD * 1000) - currentTime);
                    }
                } else {
                    console.log("Error");
                }
            }
        }
    };

    $scope.grim = function (mapIndex, channel) {
        $scope.maps[mapIndex].channels[channel].state = "Grim";
        removeTimer(mapIndex, channel);
        addTimer(mapIndex, channel, 4 * SPAWN_CD * 1000);
    };

    $scope.dark = function (mapIndex, channel) {
        $scope.maps[mapIndex].channels[channel].state = "Dark";
        removeTimer(mapIndex, channel);
        addTimer(mapIndex, channel, SPAWN_CD * 1000);
    };

    $scope.killed = function (mapIndex, channel) {
        $scope.maps[mapIndex].channels[channel].state = "Grim";
        removeTimer(mapIndex, channel);
        addTimer(mapIndex, channel, 19 * SPAWN_CD * 1000);
    };

    function removeTimer (mapIndex, channel) {
        var timerId = $scope.maps[mapIndex].channels[channel].timer;

        if (timerId != null){
            $timeout.cancel(timerId);
        }

        $scope.maps[mapIndex].channels[channel].timer = null;
    }

    function addTimer (mapIndex, channel, ms) {
        $scope.maps[mapIndex].channels[channel].timer = $timeout(removeTimer, ms, true, mapIndex, channel);
    }

    // Run the initialization function
    $scope.load(sampleMapData);
});