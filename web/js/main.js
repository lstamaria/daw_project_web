$(document).ready(function(){

  loadFeaturesOne();
  loadFeaturesTwoA();
  loadFeaturesTwoB();

  loadEngineItera();
  loadEngineSize();
  loadEngineNorm();
  loadEngineRandom();
  loadEngineParamC();
  
  plotFeaturesOne();
  plotFeaturesTwo();
  plotTarget();
  plotEngineAccuracy();
  plotEnginePredictors();
})

//Pass featuresOne data
function loadFeaturesOne(){
  const features_one_dropdown = document.querySelector("#features_one_dropdown");
  fetch("/features", {method: "GET"}).then(
      function (response){
        console.log(response)
        return response.json();
      }
  ).then(function(result){
      for (index in result){
          let option = document.createElement("option");
          option.value = index;
          option.textContent = index;
          features_one_dropdown.append(option);
      }
  })
}

// Pass featuresTwoA data
function loadFeaturesTwoA(){
  const features_two_a_dropdown = document.querySelector("#features_two_a_dropdown");
  fetch("/features", {method: "GET"}).then(
      function (response){
          console.log(response);
          return response.json();
      }
  ).then(function(result){
      for (index in result){
          let option = document.createElement("option");
          option.value = index;
          option.textContent = index;
          features_two_a_dropdown.append(option);
      }
  })
}

// Pass featuresTwoB data
function loadFeaturesTwoB(){
  const features_two_b_dropdown = document.querySelector("#features_two_b_dropdown");
  fetch("/features", {method: "GET"}).then(
      function (response){
          console.log(response);
          return response.json();
      }
  ).then(function(result){
      for (index in result){
          let option = document.createElement("option");
          option.value = index;
          option.textContent = index;
          features_two_b_dropdown.append(option);
      }
  })
}


// Pass engine iteration
function loadEngineItera(){
  const engine_itera_dropdown = document.querySelector("#engine_itera_dropdown");

  result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (index in result){
    let option = document.createElement("option");
    option.value = result[index];
    option.textContent = result[index];
    engine_itera_dropdown.append(option);
    }
}

// Pass engine size
function loadEngineSize(){
  const engine_size_dropdown = document.querySelector("#engine_size_dropdown");

  result = [0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95]

  for (index in result){
    let option = document.createElement("option");
    option.value = result[index];
    option.textContent = result[index];
    engine_size_dropdown.append(option);
    }
}

// Pass engine norm
function loadEngineNorm(){
  const engine_norm_dropdown = document.querySelector("#engine_norm_dropdown");

  result = ["l1","l2"];

  for (index in result){
    let option = document.createElement("option");
    option.value = result[index];
    option.textContent = result[index];
    engine_norm_dropdown.append(option);
    }
}


// Pass engine random
function loadEngineRandom(){
  const engine_random_dropdown = document.querySelector("#engine_random_dropdown");

  result = ["Yes","No"]

  for (index in result){
    let option = document.createElement("option");
    option.value = result[index];
    option.textContent = result[index];
    engine_random_dropdown.append(option);
    }
}

// Pass engine param_c
function loadEngineParamC(){
  const engine_paramc_dropdown = document.querySelector("#engine_paramc_dropdown");

  result = [0.1, 0.2, 0.4, 0.75, 1, 1.5, 3, 5, 10, 15,  20, 100, 300, 1000, 5000]

  for (index in result){
    let option = document.createElement("option");
    option.value = result[index];
    option.textContent = result[index];
    engine_paramc_dropdown.append(option);
    }
}


// Plot featuresOne data
function plotFeaturesOne(){
  const features_one_dropdown = document.querySelector("#features_one_dropdown");
  const features_one_plot_holder = document.querySelector("#features_one_plot");  

  console.log("in plotFeaturesOne:" + features_one_dropdown);
  //fetch("/features/" + features_one_dropdown.value, {method: "GET"}
  fetch("/features", {method: "GET"}
    ).then(function (response){
        console.log(response)
        return response.json();
      }
  ).then(function(result){
      console.log(result)
      var values = Object.keys(result[features_one_dropdown.value])
                         .map(function (key) {
                           return result[features_one_dropdown.value][key];
                          });      
      var data = [
        {
          y: values,
          type: "box",
        }
      ]

      var layout = {
        title:"Box plot of <br>" + features_one_dropdown.value,
        yaxis: {
          title: "Values"
          }
      }

      Plotly.newPlot(features_one_plot_holder, data, layout);

  })
}

// Plot featuresTwo data
function plotFeaturesTwo(){
  const features_two_a_dropdown = document.querySelector("#features_two_a_dropdown");
  const features_two_b_dropdown = document.querySelector("#features_two_b_dropdown");
  const features_two_plot_holder = document.querySelector("#features_two_plot");

  console.log("in plotFeaturesTwo:" + features_two_a_dropdown + ", " + features_two_b_dropdown);
  //fetch("/features/" + features_two_a_dropdown.value + "/" + features_two_b_dropdown.value, {method: "GET"}
  fetch("/features", {method: "GET"}
    ).then(function (response){
          console.log(response);
          return response.json();
      }
  ).then(function(result){
      console.log(result);
      console.log(result[features_two_a_dropdown.value]);
      console.log(result[features_two_b_dropdown.value]);
      var values1 = Object.keys(result[features_two_a_dropdown.value])
                         .map(function (key) {
                           return result[features_two_a_dropdown.value][key];
                          });
      var values2 = Object.keys(result[features_two_b_dropdown.value])
                         .map(function (key) {
                           return result[features_two_b_dropdown.value][key];
                          });                   


      var data = [
        {
          x: values1,
          y: values2,
          type: "line",
          mode: "markers"
        }
      ]

      var layout = {
        title:"Scatter plot of" + "<br>" + features_two_a_dropdown.value + 
        " and " + features_two_b_dropdown.value,
        xaxis: {
          title: features_two_a_dropdown.value
          },
        yaxis: {
          title:  features_two_b_dropdown.value
        }
      }

      Plotly.newPlot(features_two_plot_holder, data, layout);

  })
}

// Plot target as PCC
function plotTarget(){
  const target_plot_holder = document.querySelector("#target_plot");
  fetch("/target/pcc", {method: "GET"}
    ).then(function (response){
          console.log(response);
          return response.json();
      }
  ).then(function(result){
      console.log(result) 
      var data = [
        {
          x: result["value1"],
          y: result["value2"],
          type: "bar"
        }
      ]

      var layout = {
        title:"Bar graph of Category"
      }

      Plotly.newPlot(target_plot_holder, data, layout);

      target_plot_holder.on('plotly_click', function(data){detectTarget(data['points'][0]['x'])})
  })
}


// Detect pointer
function detectTarget(location) {
  const target_cat0_holder = document.querySelector("#target_cat0");
  const target_cat1_holder = document.querySelector("#target_cat1");
  const target_cat2_holder = document.querySelector("#target_cat2");
  const target_cat3_holder = document.querySelector("#target_cat3");
  const target_cat4_holder = document.querySelector("#target_cat4");
  const target_cat5_holder = document.querySelector("#target_cat5");
  const target_cat6_holder = document.querySelector("#target_cat6");
  const target_cat7_holder = document.querySelector("#target_cat7");
  const target_cat8_holder = document.querySelector("#target_cat8");

  console.log('in detectTarget:' + location)

  //target_count = [15, 27, 42, 27, 95,  7,  6, 28, 13]

  if (location == "Beef & Pork") {
    target_cat0_holder.value = 15
  }

  if (location == "Beverages") {
    target_cat1_holder.value = 27
  }

  if (location == "Breakfast") {
    target_cat2_holder.value = 28
  }

  if (location == "Chicken & Fish") {
    target_cat3_holder.value = 27
  }

  if (location == "Coffee & Tea") {
    target_cat4_holder.value = 95
  }

  if (location == "Desserts") {
    target_cat5_holder.value = 7
  }

  if (location == "Salads") {
    target_cat6_holder.value = 6
  }

  if (location == "Smoothies & Shakes") {
    target_cat7_holder.value = 28
  }

  if (location == "Snacks & Sides") {
    target_cat8_holder.value = 13
  }
}

// Compute PCC
function computePCC() {
  const target_pcc_text_holder = document.querySelector("#target_pcc_text");

  const target_cat0_holder = document.querySelector("#target_cat0");
  const target_cat1_holder = document.querySelector("#target_cat1");
  const target_cat2_holder = document.querySelector("#target_cat2");
  const target_cat3_holder = document.querySelector("#target_cat3");
  const target_cat4_holder = document.querySelector("#target_cat4");
  const target_cat5_holder = document.querySelector("#target_cat5");
  const target_cat6_holder = document.querySelector("#target_cat6");
  const target_cat7_holder = document.querySelector("#target_cat7");
  const target_cat8_holder = document.querySelector("#target_cat8");

  cat0 = parseFloat(target_cat0_holder.value)
  cat1 = parseFloat(target_cat1_holder.value)
  cat2 = parseFloat(target_cat2_holder.value)
  cat3 = parseFloat(target_cat3_holder.value)
  cat4 = parseFloat(target_cat4_holder.value)
  cat5 = parseFloat(target_cat5_holder.value)
  cat6 = parseFloat(target_cat6_holder.value)
  cat7 = parseFloat(target_cat7_holder.value)
  cat8 = parseFloat(target_cat8_holder.value)

  sum = cat0 + cat1 + cat2 + cat3 + cat4 + cat5 + cat6 + cat7 + cat8 

  pcc = Math.pow((cat0 / sum), 2)  +
  Math.pow((cat1 / sum), 2)  +
  Math.pow((cat2 / sum), 2)  +
  Math.pow((cat3 / sum), 2)  +
  Math.pow((cat4 / sum), 2)  +
  Math.pow((cat5 / sum), 2)  +
  Math.pow((cat6 / sum), 2)  +
  Math.pow((cat7 / sum), 2)  +
  Math.pow((cat8 / sum), 2);

  res = 1.25 * 100 * pcc;

  result = parseFloat(Math.round(res).toFixed(4));

  if (isNaN(res)) {
    target_pcc_text_holder.textContent = "Click the bar graph";
  } else {
    target_pcc_text_holder.textContent = result + "%";
  }

}


// Reset fields
function resetPCC() {
  const target_pcc_text_holder = document.querySelector("#target_pcc_text");

  const target_cat0_holder = document.querySelector("#target_cat0");
  const target_cat1_holder = document.querySelector("#target_cat1");
  const target_cat2_holder = document.querySelector("#target_cat2");
  const target_cat3_holder = document.querySelector("#target_cat3");
  const target_cat4_holder = document.querySelector("#target_cat4");
  const target_cat5_holder = document.querySelector("#target_cat5");
  const target_cat6_holder = document.querySelector("#target_cat6");
  const target_cat7_holder = document.querySelector("#target_cat7");
  const target_cat8_holder = document.querySelector("#target_cat8");

  target_cat0_holder.value = ""
  target_cat1_holder.value = ""
  target_cat2_holder.value = ""
  target_cat3_holder.value = ""
  target_cat4_holder.value = ""
  target_cat5_holder.value = ""
  target_cat6_holder.value = ""
  target_cat7_holder.value = ""
  target_cat8_holder.value = ""
  
  target_pcc_text_holder.textContent = "";
}

// Plot engine accuracy
function plotEngineAccuracy(){
  const engine_itera_dropdown = document.querySelector("#engine_itera_dropdown");
  const engine_size_dropdown = document.querySelector("#engine_size_dropdown");
  const engine_norm_dropdown = document.querySelector("#engine_norm_dropdown");
  const engine_random_dropdown = document.querySelector("#engine_random_dropdown");
  const engine_paramc_dropdown = document.querySelector("#engine_paramc_dropdown");
  // const engine_run_button = document.querySelector("#engine_run_button");

  const engine_accuracy_plot_holder = document.querySelector("#engine_accuracy_plot");
  const engine_accuracy_desc0_holder = document.querySelector("#engine_accuracy_desc0");
  const engine_accuracy_desc1_holder = document.querySelector("#engine_accuracy_desc1");
  const engine_accuracy_desc2_holder = document.querySelector("#engine_accuracy_desc2");
  const engine_accuracy_desc3_holder = document.querySelector("#engine_accuracy_desc3");
  const engine_accuracy_desc4_holder = document.querySelector("#engine_accuracy_desc4");
  const engine_accuracy_desc5_holder = document.querySelector("#engine_accuracy_desc5");

  fetch("/enginemodel/" + engine_itera_dropdown.value + "/" + 
    engine_size_dropdown.value + "/" + 
    engine_norm_dropdown.value + "/" + 
    engine_random_dropdown.value + "/" + 
    engine_paramc_dropdown.value, {method: "GET"}
    ).then(function (response){
          console.log(response);
          return response.json();
      }
  ).then(function(result){
      console.log(result) 
      var data = [
        {
          x: result["scoret_x"],
          y: result["scoret_y"],
          type: "line",
          name: "train"
        },
        {
          x: result["score_x"],
          y: result["score_y"],
          type: "line",
          name: "test"
        }
      ]

      var layout = {
        title: "Line graph of training versus testing accuracy",
        xaxis: {
          title: "Runs"
          },
        yaxis: {
          title:  "Accuracy"
        }
      }

      Plotly.newPlot(engine_accuracy_plot_holder, data, layout);

      engine_accuracy_desc0_holder.textContent = result["description"][0];
      engine_accuracy_desc1_holder.textContent = result["description"][1];
      engine_accuracy_desc2_holder.textContent = result["description"][2];
      engine_accuracy_desc3_holder.textContent = result["description"][3];
      engine_accuracy_desc4_holder.textContent = result["description"][4];
      engine_accuracy_desc5_holder.textContent = result["description"][5];

      plotEnginePredictors(result);
  })
}


// Plot engine predictors
function plotEnginePredictors(resultIn){
  const engine_predictors_plot_holder = document.querySelector("#engine_predictors_plot");
  const result = resultIn;

  var data = [
  {
    x: result["coefs_x"],
    y: result["coefs_y"],
    type: "bar",
  }
  ]

  var layout = {
    title: "Bar graph of top predictors",
        xaxis: {
          title: ""
          },
        yaxis: {
          title:  "Value importance"
        }
  }

  Plotly.newPlot(engine_predictors_plot_holder, data, layout);

}

  // fetch("/engine", {method: "GET"}
  //   ).then(function (response){
  //         console.log(response);
  //         return response.json();
  //     }
  // ).then(function(result){
  //     console.log(result) 
  //     var data = [
  //       {
  //         x: result["coefs_x"],
  //         y: result["coefs_y"],
  //         type: "bar",
  //       }
  //     ]

  //     var layout = {
  //       title: "Bar graph of top predictors"
  //     }

  //     Plotly.newPlot(engine_predictors_plot_holder, data, layout);
//   })
// }
  

  
  

