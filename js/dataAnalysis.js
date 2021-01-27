
let microAreaIds = [
    "04601",
    "04602",
    "04603",
    "04604",
    "04605",
    "04606",
    "04607",
    "04608",
    "04609",
    "04610",
    "04611",
    "04612",
    "04613",
    "04614",
    "04615",
    "04616",
    "04617",
    "04618",
    "04619",
];

let schoolIds = [
    "07710",
    "07830",
    "16110",
    "16530",
    "20250",
    "23640",
    "23910",
    "25740",
    "34320",
    "39990",
    "41100",
]

let IdStatsObj = {};
let IdStatsObjS = {};

var censusCodeArr = [
    {
        fullName: "Population",
        htmlID: "totalPop",
        APIcode: "B01003_001E",
    },
    
    {
        fullName: "Male Population",
        htmlID: "malePop",
        APIcode: "B01001_002E",
    },
    {
        fullName: "Female Population",
        htmlID: "femalePop",
        APIcode: "B01001_026E",
    },
    {
        fullName: "Median Age",
        htmlID: "mAge",
        APIcode: "B01002_001E",
    },

    {
        fullName: "Median Household Income",
        htmlID: "medianIncome",
        APIcode: "B19013_001E",
    },
    {
        fullName: "White",
        htmlID: "whitePop",
        APIcode: "B02001_002E",
    },
    {
        fullName: "Black/African American",
        htmlID: "blackPop",
        APIcode: "B02001_003E",
    },
    {
        fullName: "Asian",
        htmlID: "asianPop",
        APIcode: "B02001_005E",
    },
    {
        fullName: "American Indian",
        htmlID: "nativePop",
        APIcode: "B02001_004E",
    },
    {
        fullName: "Hawaiian/Pacific Islander",
        htmlID: "islanderPop",
        APIcode: "B02001_006E",
    },
    {
        fullName: "Other",
        htmlID: "otherPop",
        APIcode: "B02001_007E",
    },
    {
        fullName: "Below High School",
        htmlID: "belowHighschool",
        APIcode: "B07009_002E",
    },
    {
        fullName: "High School Equivalent",
        htmlID: "highshoolEquiv",
        APIcode: "B07009_003E",
    },
    {
        fullName: "Some College",
        htmlID: "someCollege",
        APIcode: "B07009_004E",
    },
    {
        fullName: "Bachelors Degree",
        htmlID: "bachelors",
        APIcode: "B07009_005E",
    },
    {
        fullName: "Graduate/Professional Level",
        htmlID: "graduateProf",
        APIcode: "B07009_006E",
    },
    {
        fullName: "Total Education Count",
        htmlID: "totalEdu",
        APIcode: "B07009_001E",
    },
];

let codesArr = censusCodeArr.map(
    (censusElementObj) => censusElementObj.APIcode
);
let codeArrStr = codesArr.join(",");

$.getJSON(
    `https://api.census.gov/data/2019/acs/acs5?get=NAME,${codeArrStr}&for=public%20use%20microdata%20area:*&in=state:48&key=edf70f15a37d771191e6f4d62aab1871d9182206`
).done((data) => {
    let harrisCountyAreasArr;
    // Filters all state areas down to just Houston areas
    harrisCountyAreasArr = data.filter((microDataArr) => {
        return microAreaIds.includes(microDataArr.slice(-1)[0]);
    });
    harrisCountyAreasArr.forEach((arr) => {
        let tempId = arr.slice(-1)[0];
        IdStatsObj[tempId] = arr.slice(1, -1);
    });
    console.log(harrisCountyAreasArr);
});

$.getJSON(
    `https://api.census.gov/data/2019/acs/acs5?get=NAME,${codeArrStr}&for=school%20district%20(unified):*&in=state:48&key=edf70f15a37d771191e6f4d62aab1871d9182206`
).done((data) => {
    let schoolDistArr;
    // Filters all state areas down to just Houston areas
    schoolDistArr = data.filter((microDataArr) => {
        return schoolIds.includes(microDataArr.slice(-1)[0]);
    });
    schoolDistArr.forEach((arr) => {
        let tempId = arr.slice(-1)[0];
        IdStatsObjS[tempId] = arr.slice(1, -1);
    });
    console.log(schoolDistArr);
});
