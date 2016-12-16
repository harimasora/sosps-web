/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.charts.amCharts')
      .controller('ClickChartCtrl', ClickChartCtrl);

    /** @ngInject */
    function ClickChartCtrl($scope, baConfig, $element, layoutPaths, $firebaseArray) {
        var hospitalsRef = firebase.database().ref().child('hospitals');
        $scope.hospitals = $firebaseArray(hospitalsRef);

        $scope.hospitals.$loaded(function(event) {
            var layoutColors = baConfig.colors;
            var id = $element[0].getAttribute('id');
            var dataProvider = [];

            for(var i=0; i< $scope.hospitals.length; i++) {
                var hospital = $scope.hospitals[i];
                var obj = {};
                obj.color = layoutColors.primary;
                obj.hospital = hospital.name;
                obj.clicks = hospital.clickLinkCount;
                dataProvider.push(obj);
            }

            var clickChart = AmCharts.makeChart(id, {
                type: 'serial',
                theme: 'blur',
                color: layoutColors.defaultText,
                dataProvider: dataProvider,
                valueAxes: [
                    {
                        axisAlpha: 0,
                        position: 'left',
                        title: 'Número de vizualizações',
                        gridAlpha: 0.5,
                        gridColor: layoutColors.border,
                    }
                ],
                startDuration: 1,
                graphs: [
                    {
                        balloonText: '<b>[[category]]: [[value]]</b>',
                        fillColorsField: 'color',
                        fillAlphas: 0.7,
                        lineAlpha: 0.2,
                        type: 'column',
                        valueField: 'clicks'
                    }
                ],
                chartCursor: {
                    categoryBalloonEnabled: false,
                    cursorAlpha: 0,
                    zoomable: false
                },
                categoryField: 'hospital',
                categoryAxis: {
                    gridPosition: 'start',
                    labelRotation: 45,
                    gridAlpha: 0.5,
                    gridColor: layoutColors.border,
                },
                export: {
                    enabled: true
                },
                creditsPosition: 'top-right',
                pathToImages: layoutPaths.images.amChart
            });
        });
    }
})();
