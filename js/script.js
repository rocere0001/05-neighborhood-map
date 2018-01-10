var map,gMapsMarker,infowindow,curMarker;
/**
 * Creating Request for Foursquare:
 * https://gist.github.com/wboykinm/8787137
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
 * Create Map
 * //TODO: Add Markers and Descriptions
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

    _this.name = mapMarkerData.name;
    _this.lat = mapMarkerData.lat;
    _this.lon = mapMarkerData.lon;
    _this.id = mapMarkerData.id;
    _this.content = null;

    this.mapsMarker = (function() {
        _this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(_this.lat, _this.lon),
            map: map
        });

        _this.marker.addListener('click', function () {
            _this.clickMarker();

        });
        /**
         * Click - Marker Function which is called when markers or menu is
         * Source(s):
         * https://stackoverflow.com/questions/21632094/google-maps-api-v3-opening-the-link-on-a-marker-in-a-new-window
         */
        _this.clickMarker = function () {
            console.log("click auf marker");
            map.panTo({lat: _this.lat, lng: _this.lon});
            //_this.setAnimation(google.maps.Animation.BOUNCE);
            _this.windowContent();
        };
        _this.windowContent = function () {

            $.getJSON(API_ENDPOINT
                .replace('CLIENT_ID', CLIENT_ID)
                .replace('CLIENT_SECRET', CLIENT_SECRET)
                .replace('LOC_ID', _this.id), function (result, status) {
                if (status !== 'success') return alert('Request to Foursquare failed');
                var infoTitle = '<h1 class="marker-title" style="font-weight: 500; "><a target="_blank" href="'+result.response.venue.canonicalUrl+'">' + _this.name + '</a></h1>';
                var rating = '<div class="marker-rating" style="color: #'+result.response.venue.ratingColor+ '">Rating: '+result.response.venue.rating+'</div>';
                var likes = '<div class="marker-likes">Likes: '+result.response.venue.likes.count+'</div>';
                var pictures = result.response.venue.photos.groups[0].items;
                var markerPictures = null;

                for (var i = 0; i<AMOUNT_PHOTOS;i++){
                    if(markerPictures != null) {
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
    _this.filerMarkers = ko.computed(function(){

    })

    /*_this.filterMarkers = ko.computed(function () {
        var filteredMarkers = [];
        /*Build search query*/
        /*var searchQuery = new RegExp(self.searchFilter(), 'i');
        /*Loop through all the trails and if there is a match with search query store it in matchedTrails*/
        /*for (var i = 0; i < self.trails().length; i++) {
            if(self.trails()[i].title.search(searchQuery) !== -1) {
                matchedTrails.push(self.trails()[i]);
                self.trails()[i].trailMarker.setVisible(true);
                self.trails()[i].panToLoc();
            } else {
                self.trails()[i].trailMarker.setVisible(false);
                infoWindow.close();
            }
        }
        return matchedTrails;
    });*/
};

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
        id: "4b058763f964a520848f22e3"
    },
    {
        name: "Chapter One Coffee & Wine Room",
        lat: -33.8947857,
        lon: 151.2720886,
        id: "4e73e716b61c22c6377db894"
    },{
        name: "Bondi Trattoria",
        lat: -33.893754,
        lon: 151.272857,
        id: "4b066368f964a52068eb22e3"
    }
];

