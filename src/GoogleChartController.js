/* global angular, google */

(function() {

    angular.module('googlechart')
        .controller('GoogleChartController', GoogleChartController);

    GoogleChartController.$inject = ['$scope', '$element', '$attrs', '$injector', '$timeout', '$window', '$rootScope', 'GoogleChartService'];

    function GoogleChartController($scope, $element, $attrs, $injector, $timeout, $window, $rootScope, GoogleChartService) {
        var self = this;
        var resizeHandler;
        var googleChartService;

        init();

        function cleanup() {
            resizeHandler();
        }

        function draw() {
            if (!draw.triggered && (self.chart !== undefined)) {
                draw.triggered = true;
                $timeout(setupAndDraw, 0, true);
            }
            else if (self.chart !== undefined) {
                $timeout.cancel(draw.recallTimeout);
                draw.recallTimeout = $timeout(draw, 10);
            }
        }

        // Watch function calls this.
        function drawAsync() {
            googleChartService.getReadyPromise()
                .then(draw);
        }

        //setupAndDraw() calls this.
        function drawChartWrapper() {
            googleChartService.draw();
            draw.triggered = false;
        }

        function init() {
            // Instantiate service
            googleChartService = new GoogleChartService();
            
            self.registerChartListener = googleChartService.registerChartListener;
            self.registerWrapperListener = googleChartService.registerWrapperListener;
            self.registerServiceListener = googleChartService.registerServiceListener;

            // locker functionality
            self.lockDraw = googleChartService.lockDraw;
            self.unLockDraw = googleChartService.unLockDraw;
            self.isDrawLocked = googleChartService.isDrawLocked;

            /* Watches, to refresh the chart when its data, formatters, options, view,
            or type change. All other values intentionally disregarded to avoid double
            calls to the draw function. Please avoid making changes to these objects
            directly from this directive.*/
            $scope.$watch(watchValue, watchHandler, true); // true is for deep object equality checking

            // Redraw the chart if the window is resized
            resizeHandler = $rootScope.$on('resizeMsg', resizeMsgHandler);

            //Cleanup resize handler.
            $scope.$on('$destroy', cleanup);
        }

        function setupAndDraw() {
            self.chart.data = self.chart.data || {};
            googleChartService.setup($element,
                self.chart.type,
                JSON.parse(JSON.stringify(self.chart.data)), // clone object instead of pass by ref
                self.chart.view,
                self.chart.options,
                self.chart.formatters,
                self.chart.customFormatters);

            $timeout(drawChartWrapper);
        }

        function watchHandler() {
            console.log('[GoogleChartController] watchHandler called...');
            self.chart = $scope.$eval($attrs.chart);
            console.log(JSON.stringify(self.chart));
            drawAsync();
        }

        function resizeMsgHandler() {
            console.log('[GoogleChartController] resizeMsgHandler called...');
            drawAsync();
        }

        function watchValue() {
            var chartObject = $scope.$eval($attrs.chart);
            if (angular.isDefined(chartObject) && angular.isObject(chartObject)) {
                chartObject.data = chartObject.data || {};
                return {
                    customFormatters: chartObject.customFormatters,
                    data: JSON.parse(JSON.stringify(chartObject.data)), // clone object instead of pass by ref
                    formatters: chartObject.formatters,
                    options: chartObject.options,
                    type: chartObject.type,
                    view: chartObject.view
                };
            }
        }
    }
})();