import React, { useState } from "react"

import GoogleMap from './googlemap'

const Locator = () => {

  const [locatorState, setLocatorState] = useState({
    locatorZip: '',
    locatorResponse: '',
    locations: []
  });

  const handleChange = (e) => {
   const target = e.target;
   const value = target.value;
   const name = target.name;

   setLocatorState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const submitForm = (event) => {
    event.preventDefault();

    fetch(`http://productlocator.iriworldwide.com/productlocator/servlet/ProductLocatorEngine?clientid=155&productfamilyid=LING&producttype=upc&productid=1087801002&zip=${locatorState.locatorZip}&outputtype=json`, {
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
          return { ...prevState, locations: response.RESULTS.STORES.STORE };
        });
      }
    )
  };

  const renderLocationDirections = (location) => {
    let url = `https://www.google.com/maps/dir/`; // Google Map url for directions
    url += `+${locatorState.locatorZip}`; // adds start location
    url += `/${location.NAME}`; // add locations name
    url += `,+${location.ADDRESS}`; // add locations address
    url += `,+${location.CITY}`; // add locations city
    url += `,+${location.STATE}`; // add locations state
    url += `+${location.ZIP}`; // add locations zip
    return url;
  };

  const renderLocations = (key, index) => {
    const location = key;

    return (
      <div key={location.NAME + index} data-index={index}>
        <div>
          { location.NAME }
        </div>
        <div>
          { location.ADDRESS }<br />
          { location.CITY }, { location.STATE } { location.ZIP }<br />
          { location.DISTANCE } Miles | <a href={renderLocationDirections(location)} target={'_blank'}>Directions >></a>
        </div>
        <br />
      </div>
    );
  };

  // console.log(locatorState);

  return (
    <div>
      <form className={'form'} onSubmit={(e) => { submitForm(e); }}>
        <label htmlFor={'zip'}>
          Zip*
          <input type={'text'} name={'locatorZip'} id={'zip'} value={locatorState.locatorZip} onChange={(e) => { handleChange(e); }} required />
        </label>
        <button type={'submit'}>
          Search
        </button>
      </form>
      <GoogleMap
        id={'myMap'}
        locations={locatorState.locations}
      />
      <div>
        Locations: 
        {
          locatorState.locations.length > 0 ?
          <div>
            {locatorState.locations.map(renderLocations)}
          </div>
          :
          <div>
            no locations :(
          </div>
        }
      </div>
    </div>
  )

}

export default Locator