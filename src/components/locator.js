import React, { useState, useEffect } from 'react'

// import GoogleMap from './googlemap'

import LocatorMap from './locatorMap'
import LocatorForm from './locatorForm'
import LocatorLocationList from './locatorLocationList'

const Locator = () => {

  const [locatorState, setLocatorState] = useState({
    googleScriptLoaded: false,
    gmarkers: [],
    locatorForm: {},
    locatorResponse: '',
    locations: []
  });

  useEffect(() => {
    console.log('loaded');
    if (!window.google) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://maps.google.com/maps/api/js?key=${process.env.GATSBY_GOOGLE_API_KEY}`;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      // Below is important. 
      //We cannot access google.maps until it's finished loading
      s.addEventListener('load', e => {
        setLocatorState((prevState) => {
          return { 
            ...prevState,
            googleScriptLoaded: true
          };
        });
      })
    } else {
      setLocatorState((prevState) => {
        return { 
          ...prevState,
          googleScriptLoaded: true
        };
      });
    }
  }, [locatorState.locations]);

  const setLocatorFormResponse = (form, response) => {
    setLocatorState((prevState) => {
      return { 
        ...prevState,
        locatorForm: form,
        locatorResponse: response,
        locations: response.RESULTS.STORES.STORE
      };
    });
  };

  const setGMarkers = (index, marker) => {
    const newgmarkers = locatorState.gmarkers;
    newgmarkers[index] = marker
    setLocatorState((prevState) => {
      return { 
        ...prevState,
        gmarkers: newgmarkers
      };
    });
  }

  console.log(locatorState)

  const locationClicked = (e) => {
    const i = e.currentTarget.dataset.index;
    console.log(i);
    window.google.maps.event.trigger(locatorState.gmarkers[i], 'click');
  };

      // <GoogleMap id={'myMap'} locations={locatorState.locations} />
  return (
    <div>
      <LocatorForm setLocatorFormResponse={setLocatorFormResponse}/>
      {
        locatorState.googleScriptLoaded &&
        <LocatorMap 
          id={'map-canvas'}
          locations={locatorState.locations}
          setGMarkers={setGMarkers}
        />
      }
      <LocatorLocationList
        zip={locatorState.locatorForm.locatorZip}
        locations={locatorState.locations}
        locationClicked={locationClicked}
      />
    </div>
  )

}

export default Locator