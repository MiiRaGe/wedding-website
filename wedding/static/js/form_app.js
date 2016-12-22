angular.module('app', []).run();

app = angular.module('app');

app.controller('FormsController', function ($scope) {
    $scope.world = 'world';
    $scope.forms = [];
    function addForm() {
        $scope.forms.push({
            'form': {},
            'is_valid': false
        })
    }

    addForm();

    function removeForm(index) {
        $scope.forms.splice(index, 1);
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
    ]

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