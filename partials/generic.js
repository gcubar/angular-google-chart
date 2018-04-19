/* global angular */
angular.module("google-chart-sample").controller("GenericChartCtrl",
    ['$scope', '$routeParams', '$timeout', function ($scope, $routeParams, $timeout) {
        $scope.chartObject = {};

        $scope.locker = {
            lockDraw: function() {  },
            unLockDraw: function() {  },
            isDrawLocked: function() { return false; }
        };


        $scope.onions = [
            {v: "Onions"},
            {v: 3},
        ];

        $timeout(function() {

            // NOTE: at this level, $scope.locker are redefined with
            // correct control that come from angular-chart directive
            $scope.locker.lockDraw();

            // $routeParams.chartType == BarChart or PieChart or ColumnChart...
            $scope.chartObject.type = $routeParams.chartType;
            $scope.chartObject.options = {
                'title': 'How Much Pizza I Ate Last Night'
            };

            $scope.chartObject.data = {
                "cols": [
                    {id: "t", label: "Topping", type: "string"},
                    {id: "s", label: "Slices", type: "number"}
                ]
            };

            $scope.chartObject.data.rows = [
                {c: [
                        {v: "Mushrooms"},
                        {v: 3}
                    ]},
                {c: $scope.onions},
                {c: [
                        {v: "Olives"},
                        {v: 31}
                    ]},
                {c: [
                        {v: "Zucchini"},
                        {v: 1},
                    ]},
                {c: [
                        {v: "Pepperoni"},
                        {v: 2},
                    ]}
            ];

            $scope.locker.unLockDraw();

        }, 5000);

        $scope.chartReadyCounter = 0;

        $scope.chartReady = function() {
            $scope.chartReadyCounter++;
            console.log('GENERIC - chart ready counter = ' + $scope.chartReadyCounter);
        };

    }
]);
