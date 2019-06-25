import React, { useEffect } from 'react';

const GoogleMap = (props) => {

  // create initial variables
  let map = null;
  let isDraggable = true;
  let gmarkers = [];
  let infowindow;
  let mapStyles = [
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
  ]

  // placeholder locations for map // TO BE REMOVED
  const greatPlaces = [
    {
      name: 'Orange',
      lat: 33.79609,
      lng: -118.086738
    },
    {
      name: 'Los Angeles',
      lat: 34.0204989,
      lng: -118.4117325
    },
    {
      name: 'El Centro',
      lat: 32.646719000000132,
      lng: -116.105698
    },
    {
      name: 'Bakersfield',
      lat: 35.483652,
      lng: -120.014602
    }
  ];

  const renderMarker= (key, index) => {

    // create the marker icon for each location
    const icon = {
      path: window.google.maps.SymbolPath.CIRCLE,
      strokeColor: '#000',
      fillColor: '#fff',
      fillOpacity: 1,
      scale: 6
    };

    // set the marker on the map
    const marker = new window.google.maps.Marker({
      position: { lat: key.lat, lng: key.lng },
      map: map,
      icon: icon,
      id: index
    });


    gmarkers[index] = marker;

    // create the marker content
    const markerHtml = `
      <div class="markerinfo" style="min-height:90px;">
        ${key.name}
      </div>
    `;

    // event listener for marker to show the contents for said marker
    window.google.maps.event.addListener(marker, 'click', function(){
      if ( infowindow ) {
          infowindow.close();
      }
      infowindow = new window.google.maps.InfoWindow({content: markerHtml});
      infowindow.open(map, marker);
    });
  }

  const onScriptLoad = () => {
    // Initial coordinates
    let latlng = new window.google.maps.LatLng(34.0504989,-118.25); //Los Angeles

    // create map options object
    const mapOptions = {
      zoom: 9,
      center: latlng,
      scrollwheel: false,
      draggable: isDraggable,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: mapStyles
    };

    // set the map
    map = new window.google.maps.Map(
      document.getElementById(props.id),
      mapOptions
    );

    // if their are locations
    if (props.locations.length > 0) {
      // reset the coordinates to the users input
      latlng = new window.google.maps.LatLng(34.0504989,-118.25); // USERS COORDINATES
      
      // create the users marker on the map
      new window.google.maps.Marker({
        position: latlng,
        map: map
      });
      
      // center the map to the users input coordinates
      map.setCenter(latlng);

      // loop through locations to mark on the map
      greatPlaces.map(renderMarker);
    }
  }

  useEffect(() => {
    if (!window.google) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://maps.google.com/maps/api/js?key=AIzaSyBoXr9CbzqRWvGPRgbX39vGzKUSMtzm_4Y`;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      // Below is important. 
      //We cannot access google.maps until it's finished loading
      s.addEventListener('load', e => {
        onScriptLoad()
      })
    } else {
      onScriptLoad()
    }
  }, [props.locations]);

  const locationClicked = (e) => {
    const i = e.target.dataset.index;
    window.google.maps.event.trigger(gmarkers[i], 'click');
  };

  return (
    <div>
    <div onClick={locationClicked} data-index={0}>click me</div>
    <div id={props.id} style={{ height: '500px', width: '100%' }} />
    </div>
  )
}

export default GoogleMap