var AU_KM_FACTOR = 149597871,
    convertAuToKm,
    convertKmToAu,
    increaseMin,
    decreaseMax;

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
    return (max - min) / 2;
}


function KmConverterView(AuTextBox, KmTextBox) {
    "use strict";
    return function() {
        AuTextBox.value = KmToAu(KmTextBox.value);
    };
}

function AuConverterView(AuTextBox, KmTextBox) {
    "use strict";
    return function() {
        KmTextBox.value = AuToKm(AuTextBox.value);
    };
}

function MinIncreaser(maxText, minText, testText) {
    "use strict";
    return function() {
        var max = parseFloat(maxText.value),
            min = parseFloat(minText.value),
            newMin;
        newMin = min + midpoint(max, min);
        minText.value = newMin;
        testText.innerHTML = Math.round(newMin + midpoint(max, newMin));
    };
}

function MaxDecreaser(maxText, minText, testText) {
    "use strict";
    return function() {
        var max = parseFloat(maxText.value),
            min = parseFloat(minText.value),
            newMax;

        newMax = min + midpoint(max, min);
        maxText.value = newMax;
        testText.innerHTML = Math.round(min + midpoint(newMax, min));
    };
}


function initialize() {
    "use strict";
    var kmTextBox = document.getElementById("km"),
        auTextBox = document.getElementById("au"),
        maxTextBox = document.getElementById("max"),
        minTextBox = document.getElementById("min"),
        testText = document.getElementById("test");


    convertAuToKm = AuConverterView(auTextBox, kmTextBox);
    convertKmToAu = KmConverterView(auTextBox, kmTextBox);

    increaseMin = MinIncreaser(maxTextBox, minTextBox, testText);
    decreaseMax = MaxDecreaser(maxTextBox, minTextBox, testText);

    testText.innerHTML = "test";
}
