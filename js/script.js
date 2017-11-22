/**
 * Create Map
 * //TODO: Add Markers and Descriptions
 * Source: https://developers.google.com/maps/documentation/javascript/adding-a-google-map?hl=de
 * https://developers.google.com/maps/documentation/javascript/examples/control-disableUI?hl=de
 */
var map;
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
    var infowindow = new google.maps.InfoWindow();
    var marker, i;

    for (i = 0; i < mapMarkers.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(mapMarkers[i].lat, mapMarkers[i].lon),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent('<p style="font-weight: 500; ">'+mapMarkers[i].name+'</p>');
                infowindow.open(map, marker);
            }
        })(marker, i));
    }

    // Event that closes the Info Window with a click on the map
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });
}


/**
 * hardCoded mapMarkers for POIs
 * @type {[null,null]}
 */
/* var mapMarkers = {
        _markers:[
            new marker("Bondi Beach",
            -33.8914755,
            151.2766845,
            "Bondi Beach",
            "New South Wales 2026",
            "environment.gov.au",
            "m0"),
            new marker("Chapter One Coffee & Wine Room",
            -33.8947857,
            151.2720886,
            "3a/34 Campbell Parade",
            "Bondi Beach NSW 2021",
            "chapter-one.com.au",
            "m1"),
            new marker("Bondi Trattoria",
            -33.8914755,
            151.2766845,
            "34 Campbell Parade",
            "Bondi Beach NSW 2026",
            "bonditrattoria.com.au",
            "m2"),
        ]//,
        //query: ko.observable(''),
    }*/
/*var mapMarkers = [
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
        lat: -33.8914755,
        lon: 151.2766845,
        street: "34 Campbell Parade",
        city: "Bondi Beach NSW 2026",
        url:"bonditrattoria.com.au",
        id: "m2"
    }
    ];*/

/**
 * Create markers as knockout objects
 */
function marker(name,lat,lon,street,city,url,id){
    this.name = name;
    this.lat = lat;
    this.lon = lon;
    this.street = street;
    this.city = city;
    this.url = url;
    this.id = id;
};

/**
 * KnockoutJS Menu
 * Source: https://codepen.io/Anupchat/pen/izJEt
 * https://stackoverflow.com/questions/26015955/dynamically-creating-menu-structure-using-knockout
 */
function viewModel(){
    this.mapMarkers = [
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
            lat: -33.8914755,
            lon: 151.2766845,
            street: "34 Campbell Parade",
            city: "Bondi Beach NSW 2026",
            url:"bonditrattoria.com.au",
            id: "m2"
        }
    ];

};
ko.applyBindings(viewModel);

//viewModel.Query = ko.observable('');

/*viewModel.searchResults = ko.computed(function() {
    var q = viewModel.Query();
    return viewModel.items.filter(function(i) {
        return i.name.toLowerCase().indexOf(q) >= 0;
    });
});*/



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