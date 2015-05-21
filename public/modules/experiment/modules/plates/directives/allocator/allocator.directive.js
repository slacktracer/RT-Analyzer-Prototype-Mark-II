(function () {
    'use strict';
    angular
        .module('plates')
        .directive('pcrAllocator', directive);
    function directive() {
        return {
            bindToController: true,
            controller: [
                'experiment.experiment',
                'experiment.variableTypes',
                controller
            ],
            controllerAs: 'allocator',
            scope: {
                type: '='
            },
            templateUrl: 'modules/experiment/modules/plates/directives/allocator/allocator.directive.html'
        };
        /*
         *
         */
        function controller(
            experiment,
            variableTypes
        ) {
            var
                vm;
            vm = this;
            vm.data = experiment.data;
            vm.metadata = experiment.metadata;
            vm.variableTypeAsPropertyName = variableTypes[vm.type].asPropertyName;
            vm.variableTypeAsSingularNoun = variableTypes[vm.type].asSingularNoun;
        }
    }
}());
