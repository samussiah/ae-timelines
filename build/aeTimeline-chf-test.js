var aeTimelines = (function (React,d3,webcharts) {
   'use strict';

   React = 'default' in React ? React['default'] : React;

   function stringAccessor(o, s, v) {
   	//adapted from http://jsfiddle.net/alnitak/hEsys/
       s = s.replace(/\[(\w+)\]/g, '.$1');
       s = s.replace(/^\./, '');           
       var a = s.split('.');
       for (var i = 0, n = a.length; i < n; ++i) {
           var k = a[i];
           if (k in o) {
               if(i == n-1 && v !== undefined)
                   o[k] = v;
               o = o[k];
           } else {
               return;
           }
       }
       return o;
   }

   var binding = {
   	dataMappings : [
   		{
   			source: "id_col",
   			target: "id_col"
   		},
   		{
   			source: "seq_col",
   			target: "seq_col"
   		},
   		{
   			source: "soc_col",
   			target: "soc_col"
   		},
   		{
   			source: "term_col",
   			target: "term_col"
   		},
   		{
   			source: "stdy_col",
   			target: "stdy_col"
   		},
   		{
   			source: "endy_col",
   			target: "endy_col"
   		},
   		{
   			source: "sev_col",
   			target: "sev_col"
   		},
   		{
   			source: "rel_col",
   			target: "rel_col"
   		},
   		{
   			source:"x",
   			target:"x.column"
   		},
   		{
   			source:"x_order",
   			target:"x.order"
   		},
   		{
   			source:"x_domain",
   			target:"x.domain"
   		},
   		{
   			source:"y",
   			target:"y.column"
   		},
   		{
   			source:"y_order",
   			target:"y.order"
   		},
   		{
   			source:"y_domain",
   			target:"y.domain"
   		},
   		{
   			source:"group",
   			target:"marks.0.per"
   		},
   		{
   			source:"subgroup",
   			target:"marks.0.split"
   		},
   		{
   			source:"subset",
   			target:"marks.0.values"
   		},
   		{
   			source:"color_by",
   			target:"color_by"
   		},
   		{
   			source:"legend_order",
   			target:"legend.order"
   		},
   		{
   			source:"tooltip",
   			target:"marks.0.tooltip"
   		}
   	],
   	chartProperties: [
   		{
   			source:"date_format",
   			target:"date_format"
   		},
   		{
   			source:"x_label",
   			target:"x.label"
   		},

   		{
   			source:"x_type",
   			target:"x.type"
   		},
   		{
   			source:"x_format",
   			target:"x.format"
   		},
   		{
   			source:"x_sort",
   			target:"x.sort"
   		},
   		{
   			source:"x_bin",
   			target:"x.bin"
   		},
   		{
   			source:"x_behavior",
   			target:"x.behavior"
   		},
   		{
   			source:"y_label",
   			target:"y.label"
   		},
   		{
   			source:"y_type",
   			target:"y.type"
   		},
   		{
   			source:"y_format",
   			target:"y.format"
   		},
   		{
   			source:"y_sort",
   			target:"y.sort"
   		},
   		{
   			source:"y_behavior",
   			target:"y.behavior"
   		},
   		{
   			source:"marks_type",
   			target:"marks.0.type"
   		},
   		{
   			source:"marks_summarizeX",
   			target:"marks.0.summarizeX"
   		},
   		{
   			source:"marks_summarizeY",
   			target:"marks.0.summarizeY"
   		},
   		{
   			source:"marks_arrange",
   			target:"marks.0.arrange"
   		},
   		{
   			source:"marks_fill_opacity",
   			target:"marks.0.attributes.fill-opacity"
   		},
   		{
   			source:"aspect_ratio",
   			target:"aspect"
   		},
   		{
   			source:"range_band",
   			target:"range_band"
   		},
   		{
   			source:"colors",
   			target:"colors"
   		},
   		{
   			source:"gridlines",
   			target:"gridlines"
   		},
   		{
   			source:"max_width",
   			target:"max_width"
   		},
   		{
   			source:"resizable",
   			target:"resizable"
   		},
   		{
   			source:"scale_text",
   			target:"scale_text"
   		},
   		{
   			source: "legend_mark",
   			target: "legend.mark"
   		},
   		{
   			source: "legend_label",
   			target: "legend.label"
   		}
   	]
   }

   const settings = {
       //Addition settings for this template
       id_col: 'USUBJID',
       seq_col: 'AESEQ',
       soc_col: 'AEBODSYS',
       term_col: 'AETERM',
       stdy_col: 'ASTDY',
       endy_col: 'AENDY',
       sev_col: 'AESEV',
       rel_col: 'AEREL',

       //Standard webcharts settings
       x:{
           "label":null,
           "type":"linear",
           "column":'wc_value'
       },
       y:{
           "column":null, //set in syncSettings()
           "label": '', 
           "sort":"earliest",
           "type":"ordinal",
           "behavior": 'flex'
       },
      "margin": {"top": 50, bottom: null, left: null, right: null},
       "legend":{
           "mark":"circle", 
           "label": 'Severity'
       },
       "marks":[
           {
               "per":null, //set in syncSettings()
               "tooltip":null, //set in syncSettings()
               "type":"line",
               "attributes":{'stroke-width': 5, 'stroke-opacity': .8 },
           },
           {
               "per":null, //set in syncSettings()
               "tooltip":null, //set in syncSettings()
               "type":"circle",
           }
       ],
       "colors": ['#66bd63', '#fdae61', '#d73027', '#6e016b'],
       "date_format":"%m/%d/%y",
       "resizable":true,
       "max_width":1000,
       "y_behavior": 'flex',
       "gridlines":"y",
       "no_text_size":false,
       "range_band":15,
       "color_by":null //set in syncSettings()
   };

   function syncSettings(settings){
       settings.y.column = settings.id_col;
       settings.marks[0].per = [settings.id_col, settings.seq_col];
       settings.marks[0].tooltip = `System Organ Class: [${settings.soc_col}]\nPreferred Term: [${settings.term_col}]\nStart Day: [${settings.stdy_col}]\nStop Day: [${settings.endy_col}]`;
       settings.marks[1].per = [settings.id_col, settings.seq_col, 'wc_value'];
       settings.marks[1].tooltip = `System Organ Class: [${settings.soc_col}]\nPreferred Term: [${settings.term_col}]\nStart Day: [${settings.stdy_col}]\nStop Day: [${settings.endy_col}]`;
       settings.color_by = settings.sev_col;

       return settings;
   }

   const controlInputs = [ 
       {label: "Severity", type: "subsetter", value_col: "AESEV", multiple: true},
       {label: "System Organ Class", type: "subsetter", value_col: "AEBODSYS"},
       {label: "Subject ID", type: "subsetter", value_col: "USUBJID"},
       {label: "Related to Treatment", type: "subsetter", value_col: "AEREL"},
       {label: "Sort Ptcpts", type: "dropdown", option: "y.sort", values: ["earliest", "alphabetical-descending"], require: true}
   ];

   function syncControlInputs(controlInputs, settings){
       var severityControl = controlInputs.filter(function(d){return d.label=="Severity"})[0] 
       severityControl.value_col = settings.sev_col;

       var SOCControl = controlInputs.filter(function(d){return d.label=="System Organ Class"})[0] 
       SOCControl.value_col = settings.soc_col;

       var subjectControl = controlInputs.filter(function(d){return d.label=="Subject ID"})[0] 
       subjectControl.value_col = settings.id_col;

       var relatedControl = controlInputs.filter(function(d){return d.label=="Related to Treatment"})[0] 
       relatedControl.value_col = settings.rel_col;

       return controlInputs
   }

   //Setting for custom details view
   const secondSettings = {
       "x":{label:'', "type":"linear","column":"wc_value"},
       "y":{label: '', "sort":"alphabetical-descending","type":"ordinal","column":"AESEQ"},
       "marks":[
           {"type":"line","per":["AESEQ"], attributes:{'stroke-width': 5, 'stroke-opacity': .8 }},
           {"type":"circle","per":[ "AESEQ", "wc_value"]}
        ],
       color_by: "AESEV",
       colors: ['#66bd63', '#fdae61', '#d73027', '#6e016b'],
       "legend":{
           "mark":"circle", 
           "label": 'Severity'
       },
       "date_format":"%d%b%Y:%X",
       // "resizable":false,
       transitions: false,
       "max_width":1000,
       // point_size: 3,
       "gridlines":"y",
       "no_text_size":false,
       "range_band":28
   };

   function syncSecondSettings(secondSettings, settings){
       secondSettings.y.column = settings.seq_col;
       secondSettings.marks[0].per[0] = settings.seq_col;
       secondSettings.marks[1].per[0] = settings.seq_col;
       secondSettings.color_by = settings.sev_col;
       secondSettings.color_dom = settings.legend ? secondSettings.legend.order : null;

       return secondSettings
   }

   function lengthenRaw(data, columns){
     let my_data = [];

     data.forEach(e => {
       columns.forEach(g => {
         let obj = Object.assign({}, e);
         obj.wc_category = g;
         obj.wc_value = e[g];
         my_data.push(obj);
       });

     });

     return my_data;
   }

   function onInit(){
       this.superRaw = this.raw_data;
       this.raw_data = lengthenRaw(this.raw_data, [this.config.stdy_col, this.config.endy_col])  
       this.raw_data.forEach(function(d){
           d.wc_value = d.wc_value == "" ? NaN : +d.wc_value;
       });
       //create back button
       var myChart = this;
       this.chart2.wrap.insert('button', 'svg').html('&#8592; Back').style('cursor', 'pointer')
       .on('click', () =>{
           this.wrap.style('display', 'block');
           this.table.draw([]);
           this.chart2.wrap.style('display', 'none');
           this.chart2.wrap.select('.id-title').remove();
           this.controls.wrap.style('display', 'block');
       });

   };

   function onLayout(){

     var x2 = this.svg.append("g").attr("class", "x2 axis linear");
     x2.append("text").attr("class","axis-title top")
       .attr("dy","2em")
       .attr("text-anchor","middle")
       .text(this.config.x_label);

   }

   function onDataTransform(){

   }

   function onDraw(){

   }

   function onResize(){
       var chart = this;
       this.chart2.on('datatransform', function(){
           //make sure color scales stay consistent
           this.config.color_dom = chart.colorScale.domain();
       });
       this.chart2.x_dom = this.x_dom;
       this.svg.select('.y.axis').selectAll('.tick')
       .style('cursor', 'pointer')
       .on('click', d => {
           var csv2 = this.raw_data.filter(f => f[this.config.id_col] === d);
           this.chart2.wrap.style('display', 'block');
           this.chart2.draw(csv2);
           this.chart2.wrap.insert('h4', 'svg').attr('class', 'id-title').text(d);
           //force legend to be drawn
           this.chart2.makeLegend(this.colorScale);

           var tableData = this.superRaw.filter(f => f[this.config.id_col] === d);
           //set cols for table, otherwise can get mismatched
           this.table.config.cols = Object.keys(tableData[0]);
           this.table.draw(tableData)
           this.wrap.style('display', 'none');
           this.controls.wrap.style('display', 'none');
       });

       var x2Axis = d3.svg.axis()
           .scale(this.x)
           .orient('top')
           .tickFormat(this.xAxis.tickFormat())
           .innerTickSize(this.xAxis.innerTickSize())
           .outerTickSize(this.xAxis.outerTickSize())
           .ticks(this.xAxis.ticks()[0]);

       var g_x2_axis = this.svg.select("g.x2.axis").attr("class", "x2 axis linear");

       g_x2_axis.call(x2Axis);

       g_x2_axis.select("text.axis-title.top").attr("transform","translate("+(this.raw_width/2)+",-"+this.config.margin.top+")");

       g_x2_axis.select('.domain').attr({
           'fill': 'none',
           'stroke': '#ccc',
           'shape-rendering': 'crispEdges'
       });
       g_x2_axis.selectAll('.tick line').attr('stroke', '#eee');
   }

   if (typeof Object.assign != 'function') {
     (function () {
       Object.assign = function (target) {
         'use strict';
         if (target === undefined || target === null) {
           throw new TypeError('Cannot convert undefined or null to object');
         }

         var output = Object(target);
         for (var index = 1; index < arguments.length; index++) {
           var source = arguments[index];
           if (source !== undefined && source !== null) {
             for (var nextKey in source) {
               if (source.hasOwnProperty(nextKey)) {
                 output[nextKey] = source[nextKey];
               }
             }
           }
         }
         return output;
       };
     })();
   }

   function aeTimeline(element, settings$$){
   	//merge user's settings with defaults
   	let mergedSettings = Object.assign({}, settings, settings$$);
   	
   	//keep settings in sync with the data mappings
   	mergedSettings = syncSettings(mergedSettings)
   	
   	//keep settings for secondary chart in sync
   	let mergedSecondSettings = Object.assign({}, secondSettings, settings$$);
   	mergedSecondSettings = syncSecondSettings(mergedSecondSettings, mergedSettings)

   	//keep control inputs settings in sync
   	let syncedControlInputs = syncControlInputs(controlInputs, mergedSettings)

   	//create controls now
   	let controls = webcharts.createControls(element, {location: 'top', inputs: syncedControlInputs});
   	
   	//create chart
   	let chart = webcharts.createChart(element, mergedSettings, controls);
   	chart.on('init', onInit);
   	chart.on('layout', onLayout);
   	chart.on('datatransform', onDataTransform);
   	chart.on('draw', onDraw);
   	chart.on('resize', onResize);

   	//set up secondary chart and table
   	let chart2 = webcharts.createChart(element, mergedSecondSettings).init([]);
   	chart2.wrap.style('display', 'none');
   	chart.chart2 = chart2;
   	let table = webcharts.createTable(element, {}).init([]);
   	chart.table = table;

   	return chart;
   }

   class ReactAETimelines extends React.Component {
   	constructor(props) {
   		super(props);
   		this.state = {};
   	}
   	componentDidMount(prevProps, prevState){
   		if(this.props.data.length){
   			//manually clear div and redraw
   			d3.select(`.chart-div.id-${this.props.id}`).selectAll('*').remove();
   			let chart = aeTimeline(`.chart-div.id-${this.props.id}`, this.props.settings).init(this.props.data);
   		}
   	}
   	componentDidUpdate(prevProps, prevState){
   		if(this.props.data.length){
   			//manually clear div and redraw
   			d3.select(`.chart-div.id-${this.props.id}`).selectAll('*').remove();
   			let chart = aeTimeline(`.chart-div.id-${this.props.id}`, this.props.settings).init(this.props.data);
   		}
   	}
   	render(){
   		return (
   			React.createElement('div', {
   				key: this.props.id,
   				className: `chart-div id-${this.props.id} ${!(this.props.data.length) ? 'loading' : ''}`,
   				style: { minHeight: '1px', minWidth: '1px' }
   			})
   		);
   	}
   }

   ReactAETimelines.defaultProps = {data: [], controlInputs: [], id: 'id'}

   function describeCode(props){
     var settings = this.createSettings(props);
     const code = `//uses d3 v.${d3.version}
//uses webcharts v.${webcharts.version}

var settings = ${JSON.stringify(settings, null, 2)};

var myChart = aeTimelines(dataElement, settings);

d3.csv(dataPath, function(error, csv) {
  myChart.init(csv);
});
  `;
     return code;
   }


   class Renderer extends React.Component {
     constructor(props) {
       super(props);
       this.binding = binding;
       this.describeCode = describeCode.bind(this);
       this.state = {data: [], settings: {}, template: {}, loadMsg: 'Loading...'};
     }
     createSettings(props) {
       const shell = {
         //Addition settings for this template
         // id_col: 'USUBJID',
         // seq_col: 'AESEQ',
         // soc_col: 'AEBODSYS',
         // term_col: 'AETERM',
         stdy_col: 'ASTDY',
         endy_col: 'AENDY',
         // sev_col: 'AESEV',
         // rel_col: 'AEREL',

         //Standard webcharts settings
         date_format: null,
         legend: {
           mark: 'circle',
           order: null,
           label: null
         },
         colors: ['#66bd63', '#fdae61', '#d73027', '#6e016b'],
         color_by: 'AESEV'
       };

       binding.dataMappings.forEach(e => {
         let chartVal = stringAccessor(props.dataMappings, e.source);
         if(chartVal ){
           stringAccessor(shell, e.target, chartVal);
         }
         else{
           let defaultVal = stringAccessor(props.template.dataMappings, e.source+'.default');
           if(defaultVal && typeof defaultVal === 'string' && defaultVal.slice(0,3) === 'dm$'){
             var pointerVal = stringAccessor(props.dataMappings, defaultVal.slice(3)) || null;
             stringAccessor(shell, e.target, pointerVal);
           }
           else if(defaultVal){
             stringAccessor(shell, e.target, defaultVal);
           }
           else{
             stringAccessor(shell, e.target, null);
           }
         }
       });
       binding.chartProperties.forEach(e => {
         let chartVal = stringAccessor(props.chartProperties, e.source);
         if(chartVal !== undefined){
           stringAccessor(shell, e.target, chartVal);
         }
         else{
           let defaultVal = stringAccessor(props.template.chartProperties, e.source+'.default');
           stringAccessor(shell, e.target, defaultVal);
         }
       });
       return shell;
     }
     componentWillMount() {
       var settings = this.createSettings(this.props);
       this.setState({settings: settings});
     }
     componentWillReceiveProps(nextProps){
       var settings = this.createSettings(nextProps);
       this.setState({settings: settings});
     }
     render() {
       return (
         React.createElement(ReactAETimelines, {
           id: this.props.id,
           settings: this.state.settings,
           controlInputs: this.props.template.controls,
           data: this.props.data
         })
       );
     }
   }

   return Renderer;

}(React,d3,webCharts));