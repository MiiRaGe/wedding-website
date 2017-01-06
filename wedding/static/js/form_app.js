angular.module('app', ['ngMaterial', 'pascalprecht.translate', 'ngCookies'])
    .config(function ($httpProvider, $translateProvider) {

        $httpProvider.defaults.headers.common["X-CSRFToken"] = CSRF_TOKEN;
        $translateProvider.translations('en', {
            'HELLO': 'Hello',
            'FOO': 'This is a paragraph'
        });

        $translateProvider.translations('fr', {
            'HELLO': 'Hallo',
            'FOO': 'Dies ist ein Absatz'
        });
        $translateProvider.registerAvailableLanguageKeys(['en', 'fr'], {
            'en_*': 'en',
            'fr_*': 'fr'
          });
        $translateProvider.determinePreferredLanguage();
    })
    .run(function ($cookies, $translate) {
        var language_set = $cookies.get('django_language');
        if (!language_set) {
            $translate.preferredLanguage(language_set);
        } else {
        }
    });

app = angular.module('app');

app.controller('FormsController', function ($scope, $http, formId) {
    $scope.forms = [];
    $scope.addForm = function () {
        $scope.forms.push({
            'form': {
                // 'is_coming_to_wedding': false,
                'dietetary_restriction': 'normal',
                // 'is_coming_to_brunch': false,
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

app.controller('FormController', function ($scope) {
    $scope.food_options = [
        {'value': 'normal', 'label': 'Normal'},
        {'value': 'vegetarian', 'label': 'Végétarien'},
        {'value': 'halal', 'label': 'Halal'},
        {'value': 'child', 'label': 'Enfant'},
        {'value': 'baby', 'label': 'Bébé (pas de repas)'},
        {'value': 'allergies', 'label': 'Allergies'},
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