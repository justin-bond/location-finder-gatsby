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
    locations: [],
    products: []
  });

  const grabProductList = (scriptLoaded) => {
    fetch(`https://productlocator.iriworldwide.com/productlocator/products?client_id=155&brand_id=LING&output=json `, {
      method: 'GET'
    }).then(
      (res) => { return res.json(); }
    ).catch(
      (error) => {
        console.error('Error:', error); // eslint-disable-line no-console
      }
    ).then(
      (response) => {
        // console.log('response:', response);
        setLocatorState((prevState) => {
          return { 
            ...prevState,
            googleScriptLoaded: scriptLoaded,
            products: response.products.product
          };
        });
      }
    )
  };

  useEffect(() => {
    const scriptLoaded = true;
    if (!window.google) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://maps.google.com/maps/api/js?key=${process.env.GATSBY_GOOGLE_API_KEY}`;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      // Below is important. 
      //We cannot access google.maps until it's finished loading
      s.addEventListener('load', e => {
        grabProductList(scriptLoaded);
      })
    } else {
      grabProductList(scriptLoaded);
    }
  }, []);

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

  const locationClicked = (e) => {
    const i = e.currentTarget.dataset.index;
    window.google.maps.event.trigger(locatorState.gmarkers[i], 'click');
  };

      // <GoogleMap id={'myMap'} locations={locatorState.locations} />
  return (
    <div>
      <LocatorForm products={locatorState.products} setLocatorFormResponse={setLocatorFormResponse}/>
      <div style={{
        display: `grid`,
        gridTemplateColumns: `repeat(2, 1fr)`,
      }}>
        <LocatorLocationList
          zip={locatorState.locatorForm.locatorZip}
          locations={locatorState.locations}
          locationClicked={locationClicked}
        />
        {
          locatorState.googleScriptLoaded &&
          <LocatorMap 
            id={'map-canvas'}
            usersZip={locatorState.locatorForm.locatorZip}
            locations={locatorState.locations}
            setGMarkers={setGMarkers}
            markers={locatorState.gmarkers}
          />
        }
      </div>
    </div>
  )

}

export default Locator