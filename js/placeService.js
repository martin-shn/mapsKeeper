'use strict';

//AIzaSyCjlsAsJI0Vd-wbFqIbs_zppWj9Txa2X2E
//https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=&v=weekly

let map, infoWindow, gLocations;
const EILAT = { lat: 29.55805, lng: 34.94821 };

function getNewLocation(ev) {
    let clickedLocation;
    clickedLocation = JSON.stringify(ev.latLng.toJSON(), null, 2);
    console.log('clickedLocation : ', clickedLocation);
    document.querySelector('.location-modal').innerText = `New location is: ${ev.latLng.lat()}, ${ev.latLng.lng()}`;
    document.querySelector('#loc-modal').addEventListener(
        'submit',
        function (event) {
            event.preventDefault();
            addNewLoc(document.querySelector('#location-name').value, ev);
            _saveLocs();
            document.querySelector('#location-name').value = '';
            myModal.toggle();
        },
        false
    );
    document.getElementById('add-new-location').addEventListener('shown.bs.modal', function () {
        document.getElementById('location-name').focus();
    });

    var myModal = new bootstrap.Modal(document.getElementById('add-new-location'), { backdrop: 'static' });
    myModal.toggle();
}

function addNewLoc(locationName, ev) {
    //ev.latLng.lat()
    gLocations.unshift({ id: getNewId(gLocations), lat: ev.latLng.lat(), lat: ev.latLng.lng(), name: locationName });
}

function getNewId(locations) {
    let existedLocs = locations.map(function (loc) {
        return loc.id;
    });
    existedLocs.sort();

    for (var i = 0; i <= existedLocs.length; i++) {
        if (existedLocs[i] === i + 100) continue;
        return i + 100;
    }
    //no more space
    return -1;
}

function _saveLocs() {
    saveToStorage('userLocs', JSON.stringify(gLocations));
}

function renderLocs() {
    var elList = document.querySelector('.map-list');
    var strHTML = gLocations
        .map(function (loc) {
            return `<div class="btn-group">
            <button type="button" class="btn btn-light ms-2 mb-2" data-lat="${loc.lat}" data-lng="${loc.lng}" data-id="${loc.id}" onclick="set">${loc.name}</button>
            <button type="button" class="btn btn-danger text-light mb-2 p-0 w-0" disabled><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
          </svg></button>
            </div>`;
        })
        .join('');
    elList.innerHTML = strHTML;
}

function initMap() {
    gLocations = JSON.parse(loadFromStorage('userLocs'));
    if (!gLocations) gLocations = [];
    renderLocs();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 29.55805, lng: 34.94821 },
        zoom: 10,
        disableDefaultUI: true,
        gestureHandling: 'cooperative',
    });
    const centerControlDiv = document.createElement('div');
    CenterControl(centerControlDiv, map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

    //listner to catch user clicks on the map
    map.addListener('click', (mapsMouseEvent) => {
        getNewLocation(mapsMouseEvent);
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : "Error: Your browser doesn't support geolocation.");
    infoWindow.open(map);
}

function CenterControl(controlDiv, map) {
    // Set CSS for the control border.
    const controlUI = document.createElement('img');
    // const controlUI = controlDiv;
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '50%';
    controlUI.style.height = '100%';
    controlUI.style.width = '100%';
    controlDiv.style.height = '40px';
    controlDiv.style.width = '40px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlDiv.style.marginRight = '10px';
    controlDiv.style.marginBottom = '22px';
    // controlUI.style.textAlign = 'center';
    // controlUI.title = 'Click to recenter the map';
    controlUI.src = 'https://icon-library.com/images/my-location-icon/my-location-icon-22.jpg';
    // controlUI.style.backgroundImage = 'url("../img/myloc.png")';
    controlUI.style.backgroundSize = 'cover';
    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior.
    // const controlText = document.createElement('div');
    // controlText.style.color = 'rgb(25,25,25)';
    // controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    // controlText.style.fontSize = '16px';
    // controlText.style.lineHeight = '38px';
    // controlText.style.paddingLeft = '5px';
    // controlText.style.paddingRight = '5px';
    // controlText.innerHTML = "Center Map";
    // controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', () => {
        // infoWindow = new google.maps.InfoWindow();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    // infoWindow.setPosition(pos);
                    // infoWindow.setContent('You are here');
                    // infoWindow.open(map);
                    const marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                    });
                    map.setCenter(pos);
                    map.setZoom(16);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

function showLoc(lat, lng) {}
