// OUTLINE
// 1.  Webpage will have the following:
//     *  Dropdown that will allow selection of a name/id
//     *  Horizontal bar chart that shows data related to only the id
//     *  Bubble chart shows data related only to id
//     *  Summary section that only shows data related to id
// 2.  So every graphic needs the id and the only part that is independent is the dropdown
// 3.  The dropdown has many options so it needs created dynamically based on what is in the data file
// 4.  The page will load with a default selected id but needs to update based on the dropdown selection
//     *  This tells me that I need to run code once and then same code again with only an id change.
//     *  This sounds like a good time to use a function like  `createPlot(id)`
// 5.  Note:  The html already has several things built-in:
//     a.  you are given empty divs with ids called:
//         *  `selDataset` ==> used for the dropdown
//         *  `sample-metadata` ==> used for the summary data section
//         *  `bar` ==> used for the horizontal bar chrt
//         *  `gauge` ==> (optional) used for gauge chart
//         *  `bubble` ==> used for bubble chart
//     b.  There is an inline event handler in the html.  It looks like this:
//         `<select id="selDataset" onchange="optionChanged(this.value)"></select>`
//         This line of code is part of the dropdown, aka in html terms a `select`
//         If you look up the code for a select it is made up of options (dropdown entries)
//         and values associated with each option.  The value for the select is based on what option is selected.
//         i.e.  Dropdown has selected 'Subject 940' and maybe the value associated with this is `940`.
//               The '940' is captured by using 'this.value'... So 'this.value' captures the current selection value.
//               The 'optionChanged()' is a function that you need to make in your app.js that updates
//               some type of data filter that filters the data only related to '940' and then that 
//               data is used in all the charts.
//     c.  On Day 3 we will cover event handlers from the js file but we do not cover inline event handlers in the html.  
//         The only differene is where we call them but otherwise they work the same.
//     d.  You already have the data connected - notice the names list matches the id's used in the 
//         other data structures below.  Inspect the data - there are several sections - which one would 
//         be used for each chart?  Look at the images in the readme and matchup the data.  There is not
//         much that needs done except filtering and ordering of the existing data.



// SAMPLE STRUCTURE
// 1.  Check inspector console to see if each function is running on page load


// function that contains instructions at page load/refresh
// function does not run until called

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
   
data = d3.json(url);


function init(){
    // code that runs once (only on page load or refresh)
    
   
    // this checks that our initial function runs.
    console.log("The Init() function ran")

    // create dropdown/select
    var optionMenu = d3.select("#selDataset")
    data.then(data => {data.names
        for (let i = 0; i < data.names.length; i++) { 
            option = document.createElement('option');
            option.text = data.names[i];
            optionMenu.append("option")
            .attr('value', option.text)
            .text(option.text);
            
        }
    })
        
 
    // run functions to generate plots
    // createScatter('940')
    // createBar('940')
    createSummary('940')
    createChart('940')
 }


// function that runs whenever the dropdown is changed
// this function is in the HTML and is called with an input called 'this.value'
// that comes from the select element (dropdown)
function optionChanged(newID){
    console.log(newID);
    // code that updates graphics
    // one way is to recall each function
    createSummary(newID)
    createChart(newID)

}

// code that makes list, paragraph, text/linebreaks at id='sample-meta'



function createSummary(id){
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {  
       
        console.log(`This function generates summary info of ${id} `)
        
        let metadata = data.metadata;
        console.log("metadata")

        console.log(metadata)
        let resultArray = metadata.filter(sampleObj => sampleObj.id == id);
        let result = resultArray[0];

        let box = d3.select("#sample-metadata");

        box.html("");

        Object.entries(result).forEach(([key, value]) => {
            box.append("h6").text(`${key.toUpperCase()}: ${value}`);
          });

    })    
    
}

function createChart(id){
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {  

        let samples = data.samples;

    // code that makes bar chart at id='bar'

        console.log(`This function generates bar chart of ${id} `)
        
        let resultArray = samples.filter(sampleObj => sampleObj.id == id);
        let result = resultArray[0];
   
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        let barData = [
        {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }
        ];

        let barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);

     // code that makes scatter plot at id='bubble' 
     
        console.log(`This function generates scatter plot of ${id} `)
        
        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30}
          };
          let bubbleData = [
            {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
              }
            }
          ];
      
          Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}



// bubble 
    
//     let otu_ids = []
//     let sample_values = []
//     //let names = []
//     data.then(data => {data.samples
//     for (let i = 0; i < data.samples.length; i++) {
//         row = data.samples[i];
//         // names.push(row.pair);
//         otu_ids.push(row.otu_ids);
//         sample_values.push(row.sample_values);
        
//     }})
      
    
    
//       let trace1 = {
//             x: otu_ids,
//             y: sample_values,
//           type: 'bubble'
//         };
        
//         let data_scatter = [trace1];
        
        
        
//         Plotly.newPlot('bubble', data_scatter);
    
    
    
    
    
//     // var optionMenu = d3.select("#bubble")
//     // data.then(data => {data.samples
//     //     for (let i = 0; i < data.samples.length; i++) { 
//     //         option = document.createElement('option');
//     //         option.text = data.samples[id];
//     //         optionMenu.append("option")
//     //         .attr('value', option.text)
//     //         .text(option.text);
//     //     }}) 

   

// // function called, runs init instructions
// // runs only on load and refresh of browser page
init()





// STRATEGIES
// 1.  Inside-Out:  Generate each chart by assuming an ID/name then refactor the code to 
//                  work for any ID/name coming from the function.  I typically do this practice.
// 2.  Outside-In:  Generate the control (dropdown) and how the control interacts with the other parts.
//                  I gave you the basics of how it interacts above.  You could generate the dropdown
//                  and then see in the console the ID/names update as you make a change.  Then you could
//                  make your chart code.

// Overall, the above are the two steps you need to do (1.  Make plots with data, 2. make dropdown that passes id to functions)
// You could do it in either order