angular.module('app', []).run();

app = angular.module('app');

app.controller('FormsController', function ($scope, $http) {
    $scope.world = 'world';
    $scope.forms = [];
    $scope.addForm = function () {
        $scope.forms.push({
            'form': {
                'is_coming_to_wedding': false,
            },
            'is_valid': false
        })
    };

    $scope.addForm();

    $scope.removeForm = function (index) {
        $scope.forms.splice(index, 1);
    }
    $scope.submitForm = function () {
        $http.post('')
    }
});

app.controller('FormController', function ($scope) {
    $scope.food_options = [
        {'value': 'normal', 'label': 'Normal'},
        {'value': 'vegetarian', 'label': 'Végétarien'},
        {'value': 'halal', 'label': 'Halal'},
        {'value': 'child', 'label': 'Enfant'},
        {'value': 'baby', 'label': 'Bébé (pas de repas'},
        {'value': 'allergies', 'label': 'Allergies'},
    ];
});

app.directive('weddingForm', function () {
    return {
        restrict: 'E',
        controller: 'FormController',
        scope: {
            'form': '=form'
        },
        templateUrl: '/static/html/form.html'
    };

});