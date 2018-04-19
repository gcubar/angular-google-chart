/* global angular */
(function(){
    angular.module('googlechart')
        .directive('agcLocker', lockerDirective);

    function lockerDirective(){
        return {
            restrict: 'A',
            scope: false,
            require: 'googleChart',
            link: function(scope, element, attrs, googleChartController){
                locker = scope[attrs.agcLocker] || {};
                locker.lockDraw = googleChartController.lockDraw;
                locker.unLockDraw = googleChartController.unLockDraw;
                locker.isDrawLocked = googleChartController.isDrawLocked;
            }
        };
    }
})();
