# Adverse Event Timelines 

## Overview
![alt tag](https://user-images.githubusercontent.com/31038805/31092946-129c8044-a77e-11e7-9f2f-4ba855684cdf.gif)


ae-timelines is a JavaScript library built using Webcharts ([1](https://github.com/RhoInc/Webcharts), [2](https://github.com/RhoInc/webcharts-wrapper-boilerplate)) that creates an adverse event timeline for each participant in a clinical trial. A typical chart created with ae-timelines looks like this:

Clicking on the y-axis tick labels opens an adverse event-level participant view like this: 



Users can filter and sort the timelines and drill down to each participant; the full functionality is described [here](https://github.com/RhoInc/ae-timelines/wiki/User-Requirements).
The library expects an [ADaM data structure](https://www.cdisc.org/system/files/members/standard/foundational/adam/ADaM_OCCDS_v1.0.pdf) by default but can be customized to use any dataset that is one record per adverse event.
Full details about chart configuration are [here](Configuration).

## Typical Usage

Provided the input data matches the ADaM standard, the code to initialize the chart looks like this: 

```javascript

    d3.csv('ADAE.csv', function(data) {
        aeTimelines('body', {}).init(data);
    });

```

The chart can be configured to facilitate non-standard data formats and to alter the chart itself. Overwrite the defaults with a custom settings object like so:

```javascript

    let settings = {
        stdy_col: 'AESTDY',
        endy_col: 'AEENDY',
        color: {
           value_col: 'AEREL',
           label: 'Relationship'},
        filters: [
           {value_col: 'SEX', label: 'Sex'},
           {value_col: 'RACE', label: 'Race'},
           {value_col: 'ARM', label: 'Description of Planned Arm'}],
        details: [
           {value_col: 'INVID', label: 'Investigator Identifier'},
           {value_col: 'AGE', label: 'Age'},
           {value_col: 'AEDECOD', label: 'Dictionary-Derived Term'},
           {value_col: 'AEBODSYS', label: 'Body System or Organ Class'}],
        };

    d3.csv('AE.csv', function(data) {
        aeTimelines('body', settings).init(data);
    });

```

Click [here](https://rhoinc.github.io/viz-library/examples/0008-safetyExplorer-default/ae-timelines/) to open an interactive example of the AE Timelines.

# Examples

- [ae-timelines using default settings](https://rhoinc.github.io/viz-library/examples/0008-safetyExplorer-default/ae-timelines/)
