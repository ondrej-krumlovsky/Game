
$( document ).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {

        // Get the coordinates of the current position.
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        //console.log(lat + " " + lng);
        jQuery.ajax({
            type: 'GET',
            url: 'map',
            data: {lat, lng},
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        })
     });

});

