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

function MidpointCalculator(maxTextBox, minTextBox, testText) {
  return function() {
    var max = parseFloat(maxTextBox.value),
        min = parseFloat(minTextBox.value);

    testText.innerHTML = Math.round(midpoint(max, min));
  }
}

function onRangeChanged(maxTextBox, minTextBox, testText, spanText) {
  var updateMidpoint = MidpointCalculator(maxTextBox, minTextBox, testText);

  return function() {
    setTimeout(function() {
        updateMidpoint();

        var max = parseFloat(maxTextBox.value),
        min = parseFloat(minTextBox.value),
        range = max - min;

        spanText.innerHTML = Math.round(max-min) + " (" + KmToAu(range).toFixed(3) + " AU)";
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

function MinIncreaser(maxText, minText, testText) {
  "use strict";
  return function() {
    var max = parseFloat(maxText.value),
        min = parseFloat(minText.value),
        newMin;
    newMin = midpoint(max, min);
    minText.value = Math.round(newMin);
    testText.innerHTML = Math.round(midpoint(max, newMin));

    updateRanges();
  };
}

function MaxDecreaser(maxText, minText, testText) {
  "use strict";
  return function() {
    var max = parseFloat(maxText.value),
        min = parseFloat(minText.value),
        newMax;

    newMax = midpoint(max, min);
    maxText.value = Math.round(newMax);
    testText.innerHTML = Math.round(midpoint(newMax, min));

    updateRanges();
  };
}

var AU_KM_FACTOR = 149597871,
    convertAuToKm,
    convertKmToAu,
    increaseMin,
    decreaseMax,
    updateRanges;


function initialize() {
  "use strict";
  var kmTextBox = document.getElementById("km"),
      auTextBox = document.getElementById("au"),
      maxTextBox = document.getElementById("max"),
      minTextBox = document.getElementById("min"),
      testText = document.getElementById("test"),
      spanText = document.getElementById("span");


  convertAuToKm = AuConverterView(auTextBox, kmTextBox);
  convertKmToAu = KmConverterView(auTextBox, kmTextBox);

  increaseMin = MinIncreaser(maxTextBox, minTextBox, testText);
  decreaseMax = MaxDecreaser(maxTextBox, minTextBox, testText);

  updateRanges = onRangeChanged(maxTextBox, minTextBox, testText, spanText);
}
