function buildMetadata(sample) {
  // url for metadata
  var metaURL = `/metadata/${sample}`;

  // loop through metadata sample and append keys and values from results
  d3.json(metaURL).then(data => {

    var metaData = d3.select("#sample-metadata");
    
    metaData.html("");

    Object.entries(data).forEach(([key,value]) => {
      console.log (key,value)
      var row = metaData.append("p")
      row.text(`${key}: ${value}`);
    });
  }
  )};

function buildCharts(sample) {
  console.log("Initializing buildCharts");
  // Build pie chart
  var sampleURL = `/samples/${sample}`;
  var pieChart = d3.select("#pie");

  pieChart.html("");
  d3.json(sampleURL).then(function(data) {
    console.log("Building pie charts");
    console.log(data);
    var pieValues = data.sample_values.slice(0,10);
    var pieLabels = data.otu_ids.slice(0,10);
    var pieHover = data.otu_labels.slice(0,10);
  
      // create trace for pie chart
    var tracePie = [{
      type: "pie",
      values: pieValues,
      labels: pieLabels,
      hovertext: pieHover,
      hoverinfo: pieHover,
    }
    ];

//  layout for pie chart
    var pieLayout = {
      title: "Pie Chart Sample #" + sample,
      margin: { t: 30, l: 10, r: 10, b: 10 }
    };

// plot pie chart
  console.log("Ready to plot PieChart");
  Plotly.newPlot('pie', tracePie, pieLayout);

  // Build bubble chart
  var bubbleChart = d3.select("#bubble");
  bubbleChart.html("");

  // define variables, use slice to get top 10 results
  console.log("ready to plot bubblechart");

  var xValues = data.otu_ids;
  var yValues = data.sample_values;
  var textValues = data.otu_labels;   
    
      // create trace for bubble chart
  var traceBubble = [
    {
    x: xValues,
    y: yValues,
    text: textValues,
    mode: "markers",
    marker: {
      color: xValues,
      size: yValues,
      colorscale: "Portland"
    }
  }
  ];

  // create layout for bubble chart
  var bubbleLayout = {
    title: "Bubble Chart Sample #" + sample,
    xaxis: {
      title: "OTU ID Number"
    }
    
  };

  // plot bubble chart
  Plotly.newPlot("bubble", traceBubble, bubbleLayout);

  });
  }

function buildGauge(sample) {

    // url for gauge chart
  var metaURL = `/metadata/${sample}`;

  // loop through metadata sample and append keys and values from results
  d3.json(metaURL).then(function(data) {
    var metaData = d3.select("#gauge");
    
    metaData.html("");
    var wFreq = data.WFREQ;
    var level = wFreq;
    console.log('WFREQ here');
    console.log(wFreq + "look at me");


    // Trig to calc meter point
    var degrees = 180 - level * 180/ 9,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
      x: [0], y:[0],
      marker: {size: 12, color:'850000'},
      showlegend: false,
      name: 'washes',
      text: level,
      hoverinfo: 'text+name'},
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6',
              '4-5', '3-4', '2-3', '1-2', '0-1'],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                            'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                            'rgba(14, 127, 0, .5)', 'rgba(202, 209, 95, .5)', 
                            'rgba(232, 226, 202, .5)', 'rgba(255, 255, 255, 0)']},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];

    var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: sample + ' # of Washes per Week',
    xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout);
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    console.log(sampleNames);
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(newSample);
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
console.log("PRINT SOMETHING");