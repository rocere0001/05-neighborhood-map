var map,gMapsMarker,infowindow;
/**
 *
 * @type {string}
 */
var CLIENT_ID = 'PXBNYXLJJVY0QXCAS3CSIJRQH1CRVXMMTEK33CIZGFFOLE5Z';
var CLIENT_SECRET = '4DLXEKVBDQLSGJ45DY2XBSDX3OPDXVQSOAZQG2UKUPLIFQZN';
var LOC_ID = null;
var API_ENDPOINT = 'https://api.foursquare.com/v2/venues/' +
        'LOC_ID' +
    '?client_id=CLIENT_ID' +
    '&client_secret=CLIENT_SECRET' +
    '&v=20171226';
var AMOUNT_PHOTOS = 3;

/**
 * Source: https://developers.google.com/maps/documentation/javascript/adding-a-google-map?hl=de
 * https://developers.google.com/maps/documentation/javascript/examples/control-disableUI?hl=de
 * For selecting Markers from List:
 * https://stackoverflow.com/questions/18333679/google-maps-open-info-window-after-click-on-a-link
 * InfoWindow Customizations:
 * http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
 */
function createMap(){
    var uluru = {lat: -33.8900845, lng: 151.2743677};
    map = new google.maps.Map(document.getElementById('_map'), {
        zoom: 16,
        center: uluru,
        disableDefaultUI: true,
        //https://snazzymaps.com/
        styles:[
            {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#e0efef"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#1900ff"
                    },
                    {
                        "color": "#c0e8e8"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 700
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#7dcdcd"
                    }
                ]
            }
        ]
    });
    infowindow = new google.maps.InfoWindow({
        content:''
    });
    ko.applyBindings(new viewModel());
}

//TODO
/**
 * Create markers as knockout objects
 * Contains the information for each marker/place
 * Accessing map from outside the map context: https://stackoverflow.com/questions/44322954/how-to-call-google-map-addmarker-function-outside-initialize-function
 * * Click - Marker Function which is called when markers or menu is
 * Source(s):
 * https://stackoverflow.com/questions/21632094/google-maps-api-v3-opening-the-link-on-a-marker-in-a-new-window
 * https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
 */
function Marker(mapMarkerData){
    var _this = this;

    _this.name = mapMarkerData.name;
    _this.lat = mapMarkerData.lat;
    _this.lon = mapMarkerData.lon;
    _this.id = mapMarkerData.id;
    _this.visible = mapMarkerData.visible;

    this.mapsMarker = (function() {
        _this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(_this.lat, _this.lon),
            map: map,
            animation: google.maps.Animation.DROP
        });

        _this.marker.addListener('click', function () {
            _this.clickMarker();
        });
        _this.clickMarker = function () {
            console.log("click auf marker");
            map.panTo({lat: _this.lat, lng: _this.lon});
            if (_this.marker.getAnimation() !== null) {
                _this.marker.setAnimation(null);
            } else {
                _this.marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function(){ _this.marker.setAnimation(null); }, 760);
            }
            _this.windowContent();
        };
        _this.windowContent = function () {

            $.getJSON(API_ENDPOINT
                .replace('CLIENT_ID', CLIENT_ID)
                .replace('CLIENT_SECRET', CLIENT_SECRET)
                .replace('LOC_ID', _this.id), function (result, status) {
                if (status !== 'success') return alert('Request to Foursquare failed');
                var infoTitle = '<h3 class="marker-title" style="font-weight: 500; "><a target="_blank" href="'+result.response.venue.canonicalUrl+'">' + _this.name + '</a></h3>';
                var rating = '<div class="marker-rating" style="color: #'+result.response.venue.ratingColor+ '">Foursquare - Rating: '+result.response.venue.rating+'</div>';
                var likes = '<div class="marker-likes">Foursquare - Likes: '+result.response.venue.likes.count+'</div>';
                var pictures = result.response.venue.photos.groups[0].items;
                var markerPictures = null;

                for (var i = 0; i<AMOUNT_PHOTOS;i++){
                    if(markerPictures !== null) {
                        markerPictures += '<div class="marker-photo"><img src="' + pictures[i].prefix + '40x40' + pictures[i].suffix + '"></div>';
                    }else{
                        markerPictures = '<div class="marker-photo"><img src="' + pictures[i].prefix + '40x40' + pictures[i].suffix + '"></div>';
                    }
                }
                infowindow.setContent(infoTitle+rating+likes+markerPictures);
            });
            infowindow.open(map, _this.marker);
        };
    }());
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
        _this.marker.setAnimation(null);
    });

}

/**
 * Source: https://codepen.io/Anupchat/pen/izJEt
 * https://stackoverflow.com/questions/26015955/dynamically-creating-menu-structure-using-knockout
 * https://stackoverflow.com/questions/29551997/knockout-search-filter
 * https://stackoverflow.com/questions/45422066/set-marker-visible-with-knockout-js-ko-utils-arrayfilter
 */

function viewModel(){
    var _this = this;
    gMapsMarker = ko.observableArray([]);
    mapMarkers.forEach(function(data){
        gMapsMarker.push( new Marker(data) );
    });
    _this.filterInput = ko.observable('');
    _this.filterMarkers = ko.computed(function(){
        return gMapsMarker().filter(function(_loc){
            var showMarker = true;
            if(_this.filterInput()){
                var filterResult = _loc.name.toLowerCase().indexOf(_this.filterInput().toLowerCase());
                if(filterResult === -1){
                    showMarker = false;

                }else {
                    showMarker = true;
                }
            }
            _loc.marker.setVisible(showMarker);
            return showMarker;
        });
        });
}

function openNav() {
    document.getElementById("_menu").style.width = "30%";
}

function closeNav() {
    document.getElementById("_menu").style.width = "0%";
}

/**
 * hardCoded mapMarkers for POIs
 */

var mapMarkers = [
    {
        name: "Bondi Beach",
        lat: -33.8914755,
        lon: 151.2766845,
        id: "4b058763f964a520848f22e3",
        visible: true
    },
    {
        name: "Chapter One Coffee & Wine Room",
        lat: -33.8947857,
        lon: 151.2720886,
        id: "4e73e716b61c22c6377db894",
        visible: true
    },{
        name: "Bondi Trattoria",
        lat: -33.893754,
        lon: 151.272857,
        id: "4b066368f964a52068eb22e3",
        visible: true
    },{
        name: "Bondi to Bronte Coastal Walk",
        lat: -33.894965,
        lon: 151.274425,
        id: "4b058762f964a5205c8f22e3",
        visible: true
    },{
        name: "Lets Go Surfing",
        lat: -33.889347,
        lon: 151.282799,
        id: "4b058772f964a520a19322e3",
        visible: true
    }
];
