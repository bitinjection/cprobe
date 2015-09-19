var AU_KM_FACTOR = 149597871,
    MAX_DSCAN_KM = 2139249551, 
    convertAuToKm,
    convertKmToAu,
    increaseMin,
    decreaseMax,
    updateRanges,
    resetSearch,
		updateTestpoint,
		setMidpoint1d,
		setMidpoint2d,
		setMidpoint3d,
    undo;

function AuToKm(Au) {
  "use strict";
  return Au * AU_KM_FACTOR;
}

function KmToAu(Km) {
  "use strict";
  return Km / AU_KM_FACTOR;
}

function midpoint1d(max, min) {
  "use strict";
  return min + (max - min) / 2;
}

function midpoint2d(max, min) {
	"use strict";
	return min+(max-min) / Math.pow(2, 1/2);

}

function midpoint3d(max, min) {
	"use strict";
	return min+(max-min) / Math.pow(2, 1/3);
}

function SearchResetter(max, min) {
  return function() {
    max.value = MAX_DSCAN_KM;
    min.value = 1;

    updateRanges();
  }
}

function TestpointCalculator(maxTextBox, minTextBox, testText, midpoint) {
  return function() {
    var max = parseFloat(maxTextBox.value),
        min = parseFloat(minTextBox.value);

    testText.value = Math.round(midpoint(max, min));
  }
}

function onRangeChanged(maxTextBox, minTextBox, testText, spanText, topView, midpoint) {
	
  updateTestpoint = TestpointCalculator(maxTextBox, minTextBox, testText, midpoint);

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
        var radius = (max / MAX_DSCAN_KM) * (topView.width / 2);

        context.clearRect(0, 0, topView.width, topView.height);

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        //context.fillStyle = "black";
        //context.fill();
        context.lineWidth = 1;
        context.strokeStyle = "white";
        context.stroke();
        //context.closePath();

        radius = (min / MAX_DSCAN_KM) * (topView.width / 2);
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        //context.fillStyle = "black";
        //context.fill();
        context.lineWidth = 1;
        context.strokeStyle = "white";
        context.stroke();
        //context.closePath();

        radius = ((((max - min) / 2) + min) / MAX_DSCAN_KM) * (topView.width / 2);
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        //context.fillStyle = "black";
        //context.fill();
        context.lineWidth = (range / MAX_DSCAN_KM) * (topView.width / 2);
        context.strokeStyle = "#4EB1BA";
        context.stroke();
        //context.closePath();


        for(var i=5;i<20;i+=5)
        {
          context.font="12px Arial";
          context.fillStyle = "#E9E9E9";
          context.fillText(i,topView.width/2, topView.height / 2 - ((i-2)*AU_KM_FACTOR / MAX_DSCAN_KM) * (topView.width / 2));

          radius = ((i * AU_KM_FACTOR) / MAX_DSCAN_KM) * (topView.width / 2);
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

function MinIncreaser(maxText, minText, testText, history, midpoint) {
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

function MaxDecreaser(maxText, minText, testText, history, midpoint) {
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

function Undoer(history, maxTextBox, minTextBox) {
  return function() {
    var state = history.pop();

    maxTextBox.value = state.max;
    minTextBox.value = state.min;

    updateRanges();
  }
}

function MidpointSetter(maxTextBox, minTextBox, testText, history, midpoint) {
	"use strict";
	return function() {
		increaseMin = MinIncreaser(maxTextBox, minTextBox, testText, history, midpoint);
		decreaseMax = MaxDecreaser(maxTextBox, minTextBox, testText, history, midpoint);
    updateTestpoint = TestpointCalculator(maxTextBox, minTextBox, testText, midpoint);
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
			topView = document.getElementById("topView"),
			history = [];

	undo = Undoer(history, maxTextBox, minTextBox);

	convertAuToKm = AuConverterView(auTextBox, kmTextBox);
	convertKmToAu = KmConverterView(auTextBox, kmTextBox);

	setMidpoint1d = MidpointSetter(maxTextBox, minTextBox, testText, history, midpoint1d);
	setMidpoint2d = MidpointSetter(maxTextBox, minTextBox, testText, history, midpoint2d);
	setMidpoint3d = MidpointSetter(maxTextBox, minTextBox, testText, history, midpoint3d);

	setMidpoint3d();

	updateRanges = onRangeChanged(maxTextBox, minTextBox, testText, spanText, topView, midpoint3d);
	resetSearch = SearchResetter(maxTextBox, minTextBox);

	resetSearch();
}
