/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.charts.amCharts')
      .controller('PSPediatriaLineChartCtrl', PSPediatriaLineChartCtrl);

    /** @ngInject */
    function PSPediatriaLineChartCtrl($scope, baConfig, layoutPaths, $firebaseArray) {

        $scope.selected = {
            hospitalId: null
        };

        var hospitalsRef = firebase.database().ref().child('hospitals');
        $scope.hospitals = $firebaseArray(hospitalsRef);

        var watingTimeHistoryRef = firebase.database().ref().child('watingTimeHistory');
        $scope.watingTimeHistory = $firebaseArray(watingTimeHistoryRef);

        var layoutColors = baConfig.colors;
        var lineChart = AmCharts.makeChart('PSPediatriaLineChart', {
            type: 'serial',
            theme: 'blur',
            color: layoutColors.defaultText,
            marginTop: 0,
            marginRight: 15,
            dataProvider: [],
            valueAxes: [
                {
                    axisAlpha: 0,
                    position: 'left',
                    gridAlpha: 0.5,
                    gridColor: layoutColors.border,
                }
            ],
            graphs: [
                {
                    id: 'g1',
                    balloonText: '[[value]]',
                    bullet: 'round',
                    bulletSize: 8,
                    lineColor: layoutColors.danger,
                    lineThickness: 1,
                    negativeLineColor: layoutColors.warning,
                    type: 'smoothedLine',
                    valueField: 'value'
                }
            ],
            chartScrollbar: {
                graph: 'g1',
                gridAlpha: 0,
                color: layoutColors.defaultText,
                scrollbarHeight: 55,
                backgroundAlpha: 0,
                selectedBackgroundAlpha: 0.05,
                selectedBackgroundColor: layoutColors.defaultText,
                graphFillAlpha: 0,
                autoGridCount: true,
                selectedGraphFillAlpha: 0,
                graphLineAlpha: 0.2,
                selectedGraphLineColor: layoutColors.defaultText,
                selectedGraphLineAlpha: 1
            },
            chartCursor: {
                categoryBalloonDateFormat: 'DD/MM/YYYY JJh',
                cursorAlpha: 0,
                valueLineEnabled: true,
                valueLineBalloonEnabled: true,
                valueLineAlpha: 0.5,
                fullWidth: true
            },
            dataDateFormat: 'DD/MM/YYYY JJh',
            categoryField: 'time',
            categoryAxis: {
                minPeriod: 'hh',
                parseDates: true,
                minorGridAlpha: 0.1,
                minorGridEnabled: true,
                gridAlpha: 0.5,
                gridColor: layoutColors.border,
            },
            export: {
                enabled: true
            },
            creditsPosition: 'bottom-right',
            pathToImages: layoutPaths.images.amChart
        });

        lineChart.addListener('rendered', zoomChart);
        if (lineChart.zoomChart) {
            lineChart.zoomChart();
        }

        function zoomChart() {
            lineChart.zoomToIndexes(Math.round(lineChart.dataProvider.length * 0.4), Math.round(lineChart.dataProvider.length * 0.55));
        }

        $scope.render = function() {
            //New data array
            var newChartData = [];

            //Getting hospital history
            var currentObj = $scope.watingTimeHistory.$getRecord($scope.selected.hospitalId).PSPediatria;
            var times = Object.keys(currentObj);

            //Adding new data to array
            for(var i=0; i< times.length; i++) {
                var obj = {};
                obj.time = new Date(parseFloat(times[i]));
                obj.value = currentObj[times[i]];
                newChartData.push(obj);
            }

            //Setting the new data to the graph
            console.log(lineChart.dataProvider);
            lineChart.dataProvider = newChartData;
            console.log(lineChart);

            //Updating the graph to show the new data
            lineChart.validateData();
        }
    }

})();
