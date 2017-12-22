var map,gMapsMarker,infowindow,curMarker;
/**
 * Create Map
 * //TODO: Add Markers and Descriptions
 * Source: https://developers.google.com/maps/documentation/javascript/adding-a-google-map?hl=de
 * https://developers.google.com/maps/documentation/javascript/examples/control-disableUI?hl=de
 * For selecting Markers from List:
 * https://stackoverflow.com/questions/18333679/google-maps-open-info-window-after-click-on-a-link
 */
function createMap(){
    var uluru = {lat: -33.8900845, lng: 151.2743677};
    map = new google.maps.Map(document.getElementById('_map'), {
        zoom: 16,
        center: uluru,
        disableDefaultUI: true
    });

    /**
     * Adds the markers to the map
     * Source: https://stackoverflow.com/questions/3059044/google-maps-js-api-v3-simple-multiple-marker-example
     * @type {google.maps.InfoWindow}
     */
    infowindow = new google.maps.InfoWindow({
        content:''
    });


    ko.applyBindings(new viewModel());
};

//TODO
/**
 * Create markers as knockout objects
 * Contains the information for each marker/place
 * Accessing map from outside the map context: https://stackoverflow.com/questions/44322954/how-to-call-google-map-addmarker-function-outside-initialize-function
 */
function Marker(mapMarkerData){
    var _this = this;

    this.name = mapMarkerData.name;
    this.lat = mapMarkerData.lat;
    this.lon = mapMarkerData.lon;
    this.street = mapMarkerData.street;
    this.city = mapMarkerData.city;
    this.url = mapMarkerData.url;
    this.id = mapMarkerData.id;

    this.mapsMarker = (function(){
        _this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(_this.lat, _this.lon),
            map: map
        });

        _this.marker.addListener('click',function(){
            console.log("click auf marker");
            map.setCenter({lat:_this.lat,lng:_this.lon});
            infowindow.setContent('<p style="font-weight: 500; ">'+_this.name+'</p>');
            infowindow.open(map, _this.marker);
        });

        /*on marker click functionality*/
       /* _this.marker.addListener('click', function(){
            map.center(_this.lat,_this.lon);
            infowindow.setContent('<p style="font-weight: 500; ">'+mapMarkers[i].name+'</p>');
            infowindow.open(map, gMapsMarker);
            //TODO: add extra API
        });*/
    })();
    // Event that closes the Info Window with a click on the map
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });
};

/**
 * Source: https://codepen.io/Anupchat/pen/izJEt
 * https://stackoverflow.com/questions/26015955/dynamically-creating-menu-structure-using-knockout
 */

function viewModel(){
    var _this = this;

    /*Create and fill observable array of markers*/
    gMapsMarker = ko.observableArray([]);
    mapMarkers.forEach(function(data){
        gMapsMarker.push( new Marker(data) );
    });
};

function setMarkers(){};
function markerImages(){};
function menuList(){
    this.menu = []
}
function openNav() {
    document.getElementById("_menu").style.width = "40%";

}

function closeNav() {
    document.getElementById("_menu").style.width = "0%";
}

/**
 * hardCoded mapMarkers for POIs
 * @type {[null,null]}
 */
var mapMarkers = [
    {
        name: "Bondi Beach",
        lat: -33.8914755,
        lon: 151.2766845,
        street: "Bondi Beach",
        city: "New South Wales 2026",
        url:"environment.gov.au",
        id: "m0"
    },
    {
        name: "Chapter One Coffee & Wine Room",
        lat: -33.8947857,
        lon: 151.2720886,
        street: "3a/34 Campbell Parade",
        city: "Bondi Beach NSW 2021",
        url:"chapter-one.com.au",
        id: "m1"
    },{
        name: "Bondi Trattoria",
        lat: -33.893754,
        lon: 151.272857,
        street: "34 Campbell Parade",
        city: "Bondi Beach NSW 2026",
        url:"bonditrattoria.com.au",
        id: "m2"
    }
];

