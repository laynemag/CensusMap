<div>
<img align="right" width="33%" src="https://user-images.githubusercontent.com/26754072/103553199-bc75b100-4e72-11eb-9e88-8ad324e6dfcc.gif" />

# CensusMap
## censusmap.netlify.app

Our project is a visual representation of US Census API data on a MapBox visual API.
The final product allows users to interactively hover/click on different areas of Houston and obtain certain Census data from those areas.
We wanted to offer the ability to easily derive characterizing information of micro-areas within the two loops of Houston.

We implemented code primarily with HTML, JavaScript, CSS, Bootstrap, Media Queries, and SASS (a CSS preprocessor).

Features incude: Navigation toggle, district toggle, zoom capability, hover/click information view.
</div>
<br><br><br><br><br>
<div>
<img align="center" width="100%" src="https://user-images.githubusercontent.com/67352060/103552560-b8955f00-4e71-11eb-9b2b-ce62425a4753.gif" />
 </div>

Code Snippet
```
// the following is fetching the selected census data using pre-selected area IDs correlated to the census data
// example IDs; 
let schoolIds = [
    "07710",
    "07830",
    ...
    
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

// the previously derived data is loaded into the MapBox API here with loadmap(...);
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


// loadMap is loaded and district-defining layers are added afterwards
const loadMap = (geojsonObject, propertyIDName, dataObject) => {
    mapboxgl.accessToken =
        "ACCESSTOKEN";
    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-95.36776743580762, 29.771805275841665],
        zoom: 10,
    });
    ... layers ...
    ... census box textContent ...
```    


API References:
* [MapBox Documentation](https://docs.mapbox.com/)
* [US Census available API](https://www.census.gov/data/developers/data-sets.html)

Credits:
* @JosephStocks: Leader of the group that converted most of our ideas into workable, understandable code, and handled the majority of the MapBox API implementation.
             Bug fixer.
* @laynemag: Handled the majority of the navigation toggle implementation, worked with Matthew to comb for the necessary Census information/implementation, and
             handled most styling.
* @matthewchun93: Worked on Census data implementation with Joe and Layne, aided Joe in creating an interactive Census table, and worked with Layne in
             adding toggle functionality between micro-data areas and school districts.
