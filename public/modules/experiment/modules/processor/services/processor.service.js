(function () {
    'use strict';
    angular
        .module('processor')
        .service('processor.processor', processor);
    processor.$inject = [
        'experiment.experiment'
    ];
    function processor(
        experiment
    ) {
        var
            service;
        service = {
            processData: processData
        };
        return service;
        /*
         * function
         */
        function formatStep2() {
            var
                formatted;
            formatted = {};
            formatted.headers = [];
            formatted.rows = [];
            experiment.data.probes.forEach(function forEach(probeName) {
                if (probeName !== experiment.data.controlProbe) {
                    formatted.headers.push(probeName);
                }
            });
            experiment.data.samples.forEach(function forEach(sampleName) {
                var
                    row;
                row = [];
                row.sampleName = sampleName;
                formatted.headers.forEach(function forEach(probeName) {
                    row.push(experiment.data.analysis['step 2'][sampleName][probeName].relativeExpressionValue);
                });
                formatted.rows.push(row);
            });
            experiment.metadata.analysis['step 2'].formatted = formatted;
        }
        function processData() {
            if (!experiment.data.controlProbe) {
                // alert('NO_CONTROL_PROBE');
                throw 'NO_CONTROL_PROBE';
            }
            processStep1();
            processStep2();
        }
        function processStep1() {
            experiment.data.samples.forEach(function forEach(sample) {
                experiment.data.analysis['step 1'][sample] = {};
                experiment.data.plates.forEach(function forEach(plate) {
                    plate.positions.forEach(function forEach(position) {
                        if (plate[position].sample === sample) {
                            if (experiment.data.analysis['step 1'][sample][plate[position].probe] === undefined) {
                                experiment.data.analysis['step 1'][sample][plate[position].probe] = {};
                                if (experiment.data.analysis['step 1'][sample][plate[position].probe].cycles === undefined) {
                                    experiment.data.analysis['step 1'][sample][plate[position].probe].cycles = [];
                                }
                            }
                            experiment.data.analysis['step 1'][sample][plate[position].probe].cycles.push(plate[position].cycle);
                        }
                    });
                });
            });
            experiment.data.samples.forEach(function forEach(sample) {
                var
                    cycles,
                    probes,
                    total;
                probes = Object.keys(experiment.data.analysis['step 1'][sample]);
                probes.forEach(function forEach(probe) {
                    cycles = 0;
                    total = 0;
                    experiment.data.analysis['step 1'][sample][probe].cycles.forEach(function forEach(cycle) {
                        cycles += 1;
                        total += +cycle;
                    });
                    experiment.data.analysis['step 1'][sample][probe].average = total / cycles;
                });
            });
            experiment.metadata.analysis['step 1'].done = true;
        }
        function processStep2() {
            var
                controlProbeAverage,
                probeAverage;
            Object.keys(experiment.data.analysis['step 1']).forEach(function forEach(sampleName) {
                experiment.data.analysis['step 2'][sampleName] = {};
                Object.keys(experiment.data.analysis['step 1'][sampleName]).forEach(function forEach(probeName) {
                    if (probeName !== experiment.data.controlProbe) {
                        if (experiment.data.analysis['step 2'][sampleName][probeName] === undefined) {
                            experiment.data.analysis['step 2'][sampleName][probeName] = {};
                        }
                        controlProbeAverage = experiment.data.analysis['step 1'][sampleName][experiment.data.controlProbe].average;
                        probeAverage = experiment.data.analysis['step 1'][sampleName][probeName].average;
                        experiment.data.analysis['step 2'][sampleName][probeName].relativeExpressionValue = Math.pow(2, (controlProbeAverage - probeAverage));
                    }
                });
            });
            formatStep2();
            experiment.metadata.analysis['step 2'].done = true;
        }
    }
}());
