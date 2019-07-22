import React, { useEffect, useState } from 'react'

const LocatorMap = (props) => {
  // create initial variables
  const [userMarkerState, setUserMarkerState] = useState(null);
  const [mapState, setMapState] = useState(null);
  let latlng = new window.google.maps.LatLng(39.8283,-98.5795); // Center of USA
  const isDraggable = true;
  let infowindow;
  const mapStyles = [
    {
      stylers: [
        {
          saturation: -100,
          lightness: 35
        }
      ]
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      stylers: [
        {
          lightness: 20
        }
      ]
    },
    {
      featureType: 'poi',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.local',
      stylers: [
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      stylers: [
        {
          lightness: -15
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry.stroke',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }
  ];
  const mapOptions = {
    zoom: 4,
    center: latlng,
    scrollwheel: false,
    draggable: isDraggable,
    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    styles: mapStyles
  };

  const clearMarkers = () => {
    if (userMarkerState)
      userMarkerState.setMap(null);

    for (var i = 0; i < props.markers.length; i++)
      props.markers[i].setMap(null);
  }

  const renderMarker = (key, index) => {

    // create the marker icon for each location
    const icon = {
      path: window.google.maps.SymbolPath.CIRCLE,
      strokeColor: '#000',
      fillColor: '#fff',
      fillOpacity: 1,
      scale: 7
    };

    // set the marker on the map
    const marker = new window.google.maps.Marker({
      position: { lat: Number(key.LATITUDE), lng: Number(key.LONGITUDE) },
      map: mapState,
      icon: icon,
      id: index
    });

    // set the gmarkers array to be used for location list clicks
    props.setGMarkers(index, marker);

    // create the marker content
    const markerHtml = `
      <div class="markerinfo" style="min-height:90px;min-width:150px;">
        ${key.NAME}<br /><br />
        <em>
          ${key.ADDRESS}<br />
          ${key.CITY}, ${key.STATE} ${key.ZIP}
        </em><br /><br />
        ${key.DISTANCE} Miles
      </div>
    `;

    // event listener for marker to show the contents for said marker
    window.google.maps.event.addListener(marker, 'click', function(){
      if ( infowindow ) {
          infowindow.close();
      }
      infowindow = new window.google.maps.InfoWindow({content: markerHtml});
      infowindow.open(mapState, marker);
    });
  }

  useEffect(() => {
    setMapState(new window.google.maps.Map(
      document.getElementById(props.id),
      mapOptions
    ));
  }, []);

  useEffect(() => {
    // console.log('map load')

    // if zip is entered
    if (props.usersZip) {
      clearMarkers();

      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({
        'address': props.usersZip
      }, (results, status) => {
        // console.log('results', results)
        // console.log('status', status)
        const usersLat = results[0].geometry.location.lat();
        const usersLng = results[0].geometry.location.lng();

        // reset the coordinates to the users input
        latlng = new window.google.maps.LatLng(usersLat,usersLng);
        
        // create the users marker on the map
        setUserMarkerState(new window.google.maps.Marker({
          position: latlng,
          map: mapState
        }));
        
        // center the map to the users input coordinates
        mapState.setCenter(latlng);
        mapState.setZoom(props.usersZip ? 11 : 4);
        if (props.locations.length > 0) {
          // loop through locations to mark on the map
          props.locations.map(renderMarker);
        }
      });

    }
  }, [props.locations]);

  return (
    <div>
      <div id={props.id} style={{ height: '500px', width: '100%' }} />
    </div>
  )
}

export default LocatorMap