angular.module('app', ['ngMaterial', 'pascalprecht.translate', 'ngCookies'])
    .config(function ($httpProvider, $translateProvider) {

        $httpProvider.defaults.headers.common["X-CSRFToken"] = CSRF_TOKEN;
        $translateProvider.translations('en', {
            'DELETE_ACTION': 'Delete',
            'FIRST_NAME': 'First Name',
            'LAST_NAME': 'Last Name',
            'COMING_QUESTION': 'Is coming to the wedding?',
            'YES': 'Yes',
            'NO': 'No',
            'FOOD': 'Dietetary Restrictions',
            'COMING_BRUNCH': 'Is coming to the brunch on sunday?',
            'NORMAL': 'Normal',
            'VEGETARIAN': 'Veggie',
            'HALAL': 'Halal',
            'ENFANT': 'Child',
            'BABY': 'Baby (no food)',
            'ALLERGIES': 'Allergies'
        });
        $translateProvider.translations('fr', {
            'DELETE_ACTION': 'Supprimer',
            'FIRST_NAME': 'Prénom',
            'LAST_NAME': 'Nom',
            'COMING_QUESTION': 'Vient au mariage?',
            'YES': 'Oui',
            'NO': 'Non',
            'FOOD': 'Préférences pour le repas',
            'COMING_BRUNCH': 'Vient au brunch le dimanche?',
            'NORMAL': 'Normal',
            'VEGETARIAN': 'Végétarien',
            'HALAL': 'Halal',
            'ENFANT': 'Enfant',
            'BABY': 'Bébé (pas de repas)',
            'ALLERGIES': 'Allergies',
        });
        $translateProvider.registerAvailableLanguageKeys(['en', 'fr'], {
            'en_*': 'en',
            'fr_*': 'fr'
          });
        $translateProvider.determinePreferredLanguage();
    })
    .run(function ($cookies, $translate) {
        var language_set = $cookies.get('django_language');
        if (language_set) {
            console.log(language_set);
            $translate.use(language_set);
        }
    });

app = angular.module('app');

app.controller('FormsController', function ($scope, $http, formId) {
    $scope.forms = [];
    $scope.addForm = function () {
        $scope.forms.push({
            'form': {
                'dietetary_restriction': 'normal'
            },
            'is_valid': false
        })
    };
    if (formId) {
        $scope.update = true;
        $http.get('/responses/' + formId + '/').then(
            function (response) {
                $scope.forms = response.data.response.form;
            }
        )
    } else {
        $scope.addForm();
    }

    $scope.removeForm = function (index) {
        $scope.forms.splice(index, 1);
    };

    $scope.submitForm = function () {
        if ($scope.attendanceForm.$valid) {
            var httpConfig = {
                url: '/',
                data: {'form': $scope.forms},
                method: 'POST'
            };
            $http(httpConfig).then(function (response) {
                console.log(response)
                formId = response.data;
                $scope.update = true;
                $scope.success = true;
            }, function () {
                $scope.success = false;
            })
        }
    }
});

app.controller('AdminController', function ($scope, $http) {
    $scope.forms = [];
    (function initialize() {
        var httpConfig = {
            url: '/management/responses/',
            method: 'GET'
        };
        $http(httpConfig).then(function (response) {
            $scope.forms = response.data.responses;
        }, function () {
        })
    })()
});

app.controller('FormController', function ($scope, $filter) {
    $scope.food_options = [$filter('translate')(),
        {'value': 'normal', 'label': $filter('translate')('NORMAL')},
        {'value': 'vegetarian', 'label': $filter('translate')('VEGETARIAN')},
        {'value': 'halal', 'label': $filter('translate')('HALAL')},
        {'value': 'child', 'label': $filter('translate')('ENFANT')},
        {'value': 'baby', 'label': $filter('translate')('BABY')},
        {'value': 'allergies', 'label': $filter('translate')('ALLERGIES')},
    ];
    $scope.resetForm = function () {
        $scope.attendanceForm.$submitted = false;
    }
});

app.directive('weddingForm', function () {
    return {
        restrict: 'A',
        controller: 'FormController',
        scope: {
            'form': '=form',
            'removeForm': '=removeForm',
            'index': '=index',
            'attendanceForm': '=attendanceForm'
        },
        templateUrl: '/static/html/form.html'
    };

});

app.directive('messages', function () {
    return {
        scope: {
            'success': '=success'
        },
        template: `<div id="success-message" class="alert alert-success alert-dismissible" role="alert" ng-if="success">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <strong>Formulaire correctement sauvegardé, Merci.</strong>
        </div>`
    }
});