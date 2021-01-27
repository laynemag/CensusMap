const pullSchoolAndLoad = () => {
    $.getJSON(
        "https://raw.githubusercontent.com/uscensusbureau/citysdk/master/v2/GeoJSON/500k/2019/48/school-district-_unified_.json"
    ).done((data) => {
        console.log(data);
        let schoolAreasArr = data.features;
        console.log(schoolAreasArr);
        schoolAreasArr = addIDtoEachSchoolDistrict(schoolAreasArr);

        schoolAreasArr = schoolAreasArr.filter((microDataObj) => {
            return schoolIds.includes(microDataObj.properties.UNSDLEA);
        });

        loadMap(schoolAreasArr, "NAME", IdStatsObjS);
    });
};

const pullMicroAndLoad = () => {
    $.getJSON(
        "https://raw.githubusercontent.com/uscensusbureau/citysdk/master/v2/GeoJSON/500k/2019/48/public-use-microdata-area.json"
    ).done((data) => {
        console.log(data);
        let microdataAreasArr = data.features;
        console.log(microdataAreasArr);
        microdataAreasArr = addIDtoEachMicroArea(microdataAreasArr);

        harrisCountyAreasArr = microdataAreasArr.filter((microDataObj) => {
            return microAreaIds.includes(microDataObj.properties.PUMACE10);
        });

        loadMap(harrisCountyAreasArr, "NAME10", IdStatsObj);
    });
};

const loadMap = (geojsonObject, propertyIDName, dataObject) => {
    mapboxgl.accessToken =
        "pk.eyJ1IjoianBzdG9ja3M2MyIsImEiOiJja2l5d2NhMWcxMWg0MnFteWEzeTJuamEyIn0.PdNZpYTkVaLLuCScXpjxiw";
    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-95.36776743580762, 29.771805275841665],
        zoom: 10,
    });

    var hoveredStateId = null;
    map.on("load", function () {
        map.addSource("neighborhood-outline-data", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: geojsonObject,
            },
        });

        map.addLayer({
            id: "neighborhood-fills",
            type: "fill",
            source: "neighborhood-outline-data",
            layout: {},
            paint: {
                "fill-color": "#627BC1",
                "fill-opacity": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    0.8,
                    0.5,
                ],
            },
        });

        map.addLayer({
            id: "neighborhood-borders",
            type: "line",
            source: "neighborhood-outline-data",
            layout: {},
            paint: {
                "line-color": "#627BC1",
                "line-width": 2,
            },
        });

        // When the user moves their mouse over the state-fill layer, we'll update the
        // feature state for the feature under the mouse.
        map.on("mousemove", "neighborhood-fills", function (e) {
            if (e.features.length > 0) {
                if (hoveredStateId) {
                    map.setFeatureState(
                        {
                            source: "neighborhood-outline-data",
                            id: hoveredStateId,
                        },
                        { hover: false }
                    );
                }
                let targetObj = e.features[0];
                console.log(targetObj);

                hoveredStateId = e.features[0].id;
                let dataKey = hoveredStateId.toString().padStart(5, "0");
                console.log(dataObject[dataKey]);

                let areaName = targetObj.properties[propertyIDName];
                let convertedData = dataObject[dataKey].map((element) =>
                    Number(element)
                );

                console.log(`converted Data: ${convertedData}`);

                let [
                    totalPop,
                    malePop,
                    femalePop,
                    medianAge,
                    medianIncome,
                    whitePop,
                    blackPop,
                    asianPop,
                    nativePop,
                    islanderPop,
                    otherPop,
                    belowHighschool,
                    highSchoolEquiv,
                    someCollege,
                    bachelors,
                    graduateProf,
                    totalEdu,
                ] = convertedData;

                console.log(`AreaName: ${areaName}`);
                document.getElementById("areaName").textContent = areaName;
                document.getElementById(
                    "totalPop"
                ).textContent = totalPop.toLocaleString();
                document.getElementById("medianAge").textContent = medianAge;
                document.getElementById(
                    "medianIncome"
                ).textContent = medianIncome.toLocaleString();

                document.getElementById(
                    "totalRace"
                ).textContent = `${totalPop.toLocaleString()}`;
                document.getElementById("whitePop").textContent = `${(
                    (whitePop / totalPop) *
                    100
                ).toFixed(2)}% (${whitePop.toLocaleString()})`;
                document.getElementById("blackPop").textContent = `${(
                    (blackPop / totalPop) *
                    100
                ).toFixed(2)}% (${blackPop.toLocaleString()})`;
                document.getElementById("asianPop").textContent = `${(
                    (asianPop / totalPop) *
                    100
                ).toFixed(2)}% (${asianPop.toLocaleString()})`;
                document.getElementById("nativePop").textContent = `${(
                    (nativePop / totalPop) *
                    100
                ).toFixed(2)}% (${nativePop.toLocaleString()})`;
                document.getElementById("islanderPop").textContent = `${(
                    (islanderPop / totalPop) *
                    100
                ).toFixed(2)}% (${islanderPop.toLocaleString()})`;
                document.getElementById("otherPop").textContent = `${(
                    (otherPop / totalPop) *
                    100
                ).toFixed(2)}% (${otherPop.toLocaleString()})`;

                document.getElementById(
                    "totalEdu"
                ).textContent = `${totalEdu.toLocaleString()}`;
                document.getElementById("belowHighschool").textContent = `${(
                    (belowHighschool / totalEdu) *
                    100
                ).toFixed(2)}% (${belowHighschool.toLocaleString()})`;
                document.getElementById("highSchoolEquiv").textContent = `${(
                    (highSchoolEquiv / totalEdu) *
                    100
                ).toFixed(2)}% (${highSchoolEquiv.toLocaleString()})`;
                document.getElementById("someCollege").textContent = `${(
                    (someCollege / totalEdu) *
                    100
                ).toFixed(2)}% (${someCollege.toLocaleString()})`;
                document.getElementById("bachelors").textContent = `${(
                    (bachelors / totalEdu) *
                    100
                ).toFixed(2)}% (${bachelors.toLocaleString()})`;
                document.getElementById("graduateProf").textContent = `${(
                    (graduateProf / totalEdu) *
                    100
                ).toFixed(2)}% (${graduateProf.toLocaleString()})`;

                map.setFeatureState(
                    { source: "neighborhood-outline-data", id: hoveredStateId },
                    { hover: true }
                );

                document
                    .getElementsByClassName("censusInfo")[0]
                    .classList.remove("invisible");
            }
        });

        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        map.on("mouseleave", "neighborhood-fills", function () {
            if (hoveredStateId) {
                map.setFeatureState(
                    { source: "neighborhood-outline-data", id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = null;
        });
    });
};

pullMicroAndLoad();

function handler1() {
    pullMicroAndLoad();
    $(this).one("click", handler2);
}
function handler2() {
    pullSchoolAndLoad();
    $(this).one("click", handler1);
}
$(".toggle-map").one("click", handler2);

const addIDtoEachMicroArea = (districtsArr) => {
    for (const districtJSON of districtsArr) {
        districtJSON.id = districtJSON.properties.PUMACE10;
    }
    return districtsArr;
};

const addIDtoEachSchoolDistrict = (districtsArr) => {
    for (const districtJSON of districtsArr) {
        districtJSON.id = districtJSON.properties.UNSDLEA;
    }
    return districtsArr;
};

let widthMatch = window.matchMedia("(max-width: 900px)");

if (widthMatch.matches) {
    $(".censusInfo").off("click");
    $(".expandDataMSG").show();
    $(".hideDataMSG").hide();
    $(".data-wrapper").hide();

    $(".censusInfo").click((element) => {
        $(".expandDataMSG").slideToggle(275);
        $(".hideDataMSG").toggle();
        $(".data-wrapper").slideToggle(275);
    });

    //navbars
    $(".sidenav").hide();
    $("#hamburger-button").hide();
    $(".bottomnav").show();
    $(".bottomnav a").hide();
    $(".bottomnav .bottomNavWrapper").hide();
    $(".bottomnav .closeBottomBar").hide();

    $(".bottomnav").click((element) => {
        $(".bottomNavWrapper").slideToggle(275);
        $(".closeBottomBar").toggle();
        $(".openBottomBar").slideToggle(275);
    });
} else {
    $(".data-wrapper").show();
    $(".expandDataMSG").hide();
    $(".hideDataMSG").hide();
    $(".censusInfo").off("click");
    $(".bottomnav").off("click");

    $(".sidenav").click((element) => {
        var toggleWidth = $(".sidenav").width() == 0 ? "250px" : "0px";
        $(".sidenav").animate({ width: toggleWidth }, 400, () => {
            $("#hamburger-button").toggle();
        });
    });
    $("#hamburger-button").click((element) => {
        var toggleWidth = $(".sidenav").width() == 0 ? "250px" : "0px";
        $(".sidenav").animate({ width: toggleWidth }, 400, () => {
            $("#hamburger-button").toggle();
        });
    });

    $(".sidenav").show();
    $("#hamburger-button").show();
    $(".bottomnav").hide();
}

widthMatch.addEventListener("change", function (mm) {
    if (mm.matches) {
        $(".censusInfo").off("click");
        $(".expandDataMSG").show();
        $(".hideDataMSG").hide();
        $(".data-wrapper").hide();

        $(".censusInfo").click((element) => {
            $(".expandDataMSG").slideToggle(275);
            $(".hideDataMSG").toggle();
            $(".data-wrapper").slideToggle(275);
        });

        //navbars
        $(".sidenav").hide();
        $("#hamburger-button").hide();
        $(".bottomnav").show();
        $(".bottomnav a").hide();
        $(".bottomnav .bottomNavWrapper").hide();
        $(".bottomnav .closeBottomBar").hide();

        $(".bottomnav").click((element) => {
            $(".bottomNavWrapper").slideToggle(275);
            $(".closeBottomBar").toggle();
            $(".openBottomBar").slideToggle(275);
        });
    } else {
        $(".data-wrapper").show();
        $(".expandDataMSG").hide();
        $(".hideDataMSG").hide();
        $(".censusInfo").off("click");
        $(".bottomnav").off("click");

        $(".sidenav").click((element) => {
            var toggleWidth = $(".sidenav").width() == 0 ? "250px" : "0px";
            $(".sidenav").animate({ width: toggleWidth }, 400, () => {
                $("#hamburger-button").toggle();
            });
        });
        $("#hamburger-button").click((element) => {
            var toggleWidth = $(".sidenav").width() == 0 ? "250px" : "0px";
            $(".sidenav").animate({ width: toggleWidth }, 400, () => {
                $("#hamburger-button").toggle();
            });
        });

        $(".sidenav").show();
        $("#hamburger-button").show();
        $(".bottomnav").hide();
    }
});
