import React from 'react'

const LocatorLocationList = (props) => {

  const renderLocationDirections = (location) => {
    let url = `https://www.google.com/maps/dir/`; // Google Map url for directions
    url += `+${props.zip}`; // adds start location
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
      <div key={location.NAME + index} onClick={props.locationClicked} data-index={index}>
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

  return (
    <div>
        Locations: 
        {
          props.locations.length > 0 ?
          <div>
            {props.locations.map(renderLocations)}
          </div>
          :
          <div>
            no locations :(
          </div>
        }
      </div>
  )
}

export default LocatorLocationList