import React, { useState } from 'react'

const LocatorForm = (props) => {
  const [locatorFormState, setLocatorFormState] = useState({
    locatorZip: '',
  });

  const handleChange = (e) => {
   const target = e.target;
   const value = target.value;
   const name = target.name;

   setLocatorFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const submitForm = (event) => {
    event.preventDefault();

    fetch(`https://productlocator.iriworldwide.com/productlocator/servlet/ProductLocatorEngine?clientid=155&productfamilyid=LING&producttype=upc&productid=1087801002&zip=${locatorFormState.locatorZip}&outputtype=json`, {
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
        props.setLocatorFormResponse(locatorFormState, response);
      }
    )
  };

  return (
    <form className={'form'} onSubmit={(e) => { submitForm(e); }}>
      <label htmlFor={'zip'}>
        Zip*
        <input type={'text'} name={'locatorZip'} id={'zip'} value={locatorFormState.locatorZip} onChange={(e) => { handleChange(e); }} required />
      </label>
      <button type={'submit'}>
        Search
      </button>
    </form>
  )

}

export default LocatorForm