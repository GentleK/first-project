const apiKey = "756d4b58466b6b683636464676526f";

let goBackButton = document.getElementById("go-back");
goBackButton.addEventListener("click", ()=>{
    document.location.href = "../index.html";
});

async function getData(){
    let url = `http://openapi.seoul.go.kr:8088/${apiKey}/json/bikeList/1160/1180/`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("data", data);
    const locations = data.rentBikeStatus.row.map(spot=>[
        spot.stationName, 
        spot.stationLatitude, 
        spot.stationLongitude,
        spot.parkingBikeTotCnt
    ]);
    console.log("locations", locations);
    drawMap(locations);
}

function initMap() {
    var seoul = { lat: 37.5642135 ,lng: 127.0016985 };
    var map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 12,
        center: seoul
      });
    
}

function drawMap(locations){
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom:13,
        center:new google.maps.LatLng(locations[0][1], locations[0][2]),
        mapTypeId:google.maps.MapTypeId.ROADMAP,
    });

    const infowindow = new google.maps.InfoWindow();
    let marker, inx;

    for( inx=0; inx < locations.length; inx++ ){
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[inx][1], locations[inx][2]),
            map: map,
        })

        google.maps.event.addListener(
            marker,
            "click",
            (function (marker, inx){
                return function () {
                    let content = locations[inx][0] + "- 자전거주차총건수 : " + locations[inx][3]
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                };
            })(marker, inx)
        );
    }

}

getData();