(function () {
    'use strict';
    angular
        .module('experiment')
        .service('experiment.experiment', experiment);
    experiment.$inject = [
        'experiment.please'
    ];
    function experiment(
        Please
    ) {
        var
            service;
        service = {
            data: {
                analysis: {
                    'step 1': {},
                    'step 2': {},
                    'step 3': {},
                    'step 4': {}
                },
                biologicalReplicatesGroups: {},
                controlProbe: '',
                controlSample: '',
                plates: [],
                probes: [],
                samples: []
            },
            metadata: {
                biologicalReplicatesGroups: {
                    add: addBiologicalReplicatesGroup,
                    samples: {},
                    remove: removeBiologicalReplicatesGroup
                },
                probes: {
                    add: makeAddVariableFunction('probes'),
                    colours: [],
                    change: makeChangeVariableColourFunction('probes'),
                    controlVariablePropertyName: 'controlProbe',
                    remove: makeRemoveVariableFunction('probes')
                },
                samples: {
                    add: makeAddVariableFunction('samples'),
                    change: makeChangeVariableColourFunction('samples'),
                    colours: [],
                    controlVariablePropertyName: 'controlSample',
                    remove: makeRemoveVariableFunction('samples')
                }
            }
        };
        return service;
        /*
         * functions
         */
        function addBiologicalReplicatesGroup(name) {
            var
                samples;
            if (
                name &&
                !(name in service.data.biologicalReplicatesGroups)
            ) {
                samples = [];
                Object.keys(service.metadata.biologicalReplicatesGroups.samples).forEach(function forEach(sampleName) {
                    if (
                        service.metadata.biologicalReplicatesGroups.samples[sampleName].selected === true &&
                        service.metadata.biologicalReplicatesGroups.samples[sampleName].used !== true
                    ) {
                        samples.push(sampleName);
                    }
                });
                samples.forEach(function forEach(sampleName) {
                    if (samples.length > 1) {
                        service.metadata.biologicalReplicatesGroups.samples[sampleName].used = true;
                        service.data.biologicalReplicatesGroups[name] = samples;
                    }
                });
            }
        }
        function makeAddVariableFunction(variableType) {
            return function add(name) {
                if (
                    name &&
                    service.data[variableType].indexOf(name) === -1
                ) {
                    service.data[variableType].push(name);
                    service.metadata[variableType].colours.push(Please.make_color()[0]);
                    if (variableType === 'samples') {
                        service.metadata.biologicalReplicatesGroups.samples[name] = {};
                    }
                    return true;
                }
                return false;
            };
        }
        function makeChangeVariableColourFunction(variableType) {
            return function change(index) {
                var
                    colour;
                colour = Please.make_color()[0];
                service.metadata[variableType].colours[index] = colour;
                return colour;
            };
        }
        function makeRemoveVariableFunction(variableType) {
            return function remove(index) {
                var
                    variableName;
                variableName = service.data[variableType].splice(index, 1).toString();
                service.metadata[variableType].colours.splice(index, 1);
                if (variableType === 'samples') {
                    prepareForSampleRemoval(variableName);
                    delete service.metadata.biologicalReplicatesGroups.samples[variableName];
                }
            };
        }
        function prepareForSampleRemoval(sampleName) {
            prepareControlSampleForSampleRemoval(sampleName);
            prepareBiologicalReplicatesGroupsForSampleRemoval(sampleName);
        }
        function removeBiologicalReplicatesGroup(name) {
            service.data.biologicalReplicatesGroups[name].forEach(function forEach(sampleName) {
                service.metadata.biologicalReplicatesGroups.samples[sampleName].selected = false;
                service.metadata.biologicalReplicatesGroups.samples[sampleName].used = false;
            });
            delete service.data.biologicalReplicatesGroups[name];
        }
        function prepareBiologicalReplicatesGroupsForSampleRemoval(sampleName) {
            var
                biologicalReplicatesGroupToRemoveName;
            Object.keys(service.data.biologicalReplicatesGroups).forEach(function forEach(biologicalReplicatesGroupName) {
                service.data.biologicalReplicatesGroups[biologicalReplicatesGroupName].forEach(function forEach(sample) {
                    if (sample === sampleName) {
                        biologicalReplicatesGroupToRemoveName = biologicalReplicatesGroupName;
                    }
                });
            });
            if (biologicalReplicatesGroupToRemoveName) {
                removeBiologicalReplicatesGroup(biologicalReplicatesGroupToRemoveName);
            }
        }
        function prepareControlSampleForSampleRemoval(sampleName) {
            if (service.data.controlSample === sampleName) {
                service.data.controlSample = '';
            }
        }
    }
}());