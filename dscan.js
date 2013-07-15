function AuToKm(Au) {
  "use strict";
  return Au * AU_KM_FACTOR;
}

function KmToAu(Km) {
  "use strict";
  return Km / AU_KM_FACTOR;
}

function midpoint(max, min) {
  "use strict";
  return min + (max - min) / 2;
}

function SearchResetter(max, min) {
  return function() {
    max.value = 2147483647;
    min.value = 1;

    updateRanges();
  }
}

function TestpointCalculator(maxTextBox, minTextBox, testText) {
  return function() {
    var max = parseFloat(maxTextBox.value),
        min = parseFloat(minTextBox.value);

    testText.value = Math.round(midpoint(max, min));
  }
}

function onRangeChanged(maxTextBox, minTextBox, testText, spanText, topView) {
  var updateTestpoint = TestpointCalculator(maxTextBox, minTextBox, testText);

  return function() {
    var max = parseFloat(maxTextBox.value),
        min = parseFloat(minTextBox.value),
        range = max - min;

    setTimeout(function() {
        updateTestpoint();

        spanText.innerHTML = Math.round(max-min) + " km (" + KmToAu(range).toFixed(3) + " AU)";

        var context = topView.getContext("2d");
        var centerX = topView.width / 2;
        var centerY = topView.height / 2;
        var radius = (max / 2147483647) * (topView.width / 2);

        context.clearRect(0, 0, topView.width, topView.height);

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        //context.fillStyle = "black";
        //context.fill();
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.stroke();
        //context.closePath();

        radius = (min / 2147483647) * (topView.width / 2);
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        //context.fillStyle = "black";
        //context.fill();
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.stroke();
        //context.closePath();

        radius = ((((max - min) / 2) + min) / 2147483647) * (topView.width / 2);
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        //context.fillStyle = "black";
        //context.fill();
        context.lineWidth = (range / 2147483647) * (topView.width / 2);
        context.strokeStyle = "red";
        context.stroke();
        //context.closePath();


        for(var i=5;i<20;i+=5)
        {
          radius = ((i * AU_KM_FACTOR) / 2147483647) * (topView.width / 2);
          context.beginPath();
          context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
          //context.fillStyle = "black";
          //context.fill();
          context.lineWidth = 1;
          context.strokeStyle = "white";
          context.stroke();
          //context.closePath();

        }

        }, 4);
  }
}


function KmConverterView(AuTextBox, KmTextBox) {
  "use strict";
  return function() {
    setTimeout(function(){
        AuTextBox.value = KmToAu(KmTextBox.value);
        }, 0);
  };
}

function AuConverterView(AuTextBox, KmTextBox) {
  "use strict";
  return function() {
    setTimeout(function(){
        KmTextBox.value = AuToKm(AuTextBox.value);
        }, 0);
  };
}

function MinIncreaser(maxText, minText, testText, history) {
  "use strict";
  return function() {
    var max = parseFloat(maxText.value),
        min = parseFloat(minText.value),
        newMin,
        state;

    newMin = midpoint(max, min);
    minText.value = Math.round(newMin);
    testText.value = Math.round(midpoint(max, newMin));
    testText.select();

    updateRanges();

    state = {};
    state.max = max;
    state.min = min;
    history.push(state);
  }
}

function MaxDecreaser(maxText, minText, testText, history) {
  "use strict";
  return function() {
    var max = parseFloat(maxText.value),
        min = parseFloat(minText.value),
        newMax,
        state;

    newMax = midpoint(max, min);
    maxText.value = Math.round(newMax);
    testText.value = Math.round(midpoint(newMax, min));
    testText.select();

    updateRanges();

    state = {};
    state.max = max;
    state.min = min;
    history.push(state);
  }
}

var AU_KM_FACTOR = 149597871,
    convertAuToKm,
    convertKmToAu,
    increaseMin,
    decreaseMax,
    updateRanges,
    resetSearch,
    undo,
    history;

function Undoer(history, maxTextBox, minTextBox) {
  return function() {
    var state = history.pop();

    maxTextBox.value = state.max;
    minTextBox.value = state.min;

    updateRanges();
  }
}

function initialize() {
  "use strict";
  var kmTextBox = document.getElementById("km"),
      auTextBox = document.getElementById("au"),
      maxTextBox = document.getElementById("max"),
      minTextBox = document.getElementById("min"),
      testText = document.getElementById("test"),
      spanText = document.getElementById("span"),
      topView = document.getElementById("topView");

  history = [];
  undo = Undoer(history, maxTextBox, minTextBox);

  convertAuToKm = AuConverterView(auTextBox, kmTextBox);
  convertKmToAu = KmConverterView(auTextBox, kmTextBox);

  increaseMin = MinIncreaser(maxTextBox, minTextBox, testText, history);
  decreaseMax = MaxDecreaser(maxTextBox, minTextBox, testText, history);

  updateRanges = onRangeChanged(maxTextBox, minTextBox, testText, spanText, topView);
  resetSearch = SearchResetter(maxTextBox, minTextBox);

  resetSearch();
}
