import './util/object-assign';

import defaultSettings, { syncSettings, controlInputs, syncControlInputs, syncSecondSettings }
    from './defaultSettings'

import { createChart, createControls, createTable }
    from 'webcharts';

import onInit from './onInit';
import onLayout from './onLayout';
import onDataTransform from './onDataTransform';
import onDraw from './onDraw';
import onResize from './onResize';

export default function aeTimelines(element, settings) {
  //Merge default settings with custom settings.
    const mergedSettings = Object.assign({}, defaultSettings, settings);

  //Sync properties within settings object.
    const syncedSettings = syncSettings(mergedSettings);

  //Sync control inputs with settings object.
    const syncedControlInputs = syncControlInputs(controlInputs, syncedSettings);

  //Sync properties within secondary settings object.
    const syncedSecondSettings = syncSecondSettings(syncedSettings);

  //Create controls.
    const controls = createControls(element, {location: 'top', inputs: syncedControlInputs});

  //Create chart.
    const chart = createChart(element, syncedSettings, controls);
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

  //Create participant-level chart.
    const chart2 = createChart(element, syncedSecondSettings).init([]);
    chart2.wrap.style('display', 'none');
    chart.chart2 = chart2;

  //Create participant-level listing.
    const table = createTable(element, {}).init([]);
    chart.table = table;

    return chart;
}