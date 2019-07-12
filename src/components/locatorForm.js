import React, { useState } from 'react'

const LocatorForm = (props) => {
  const [locatorFormState, setLocatorFormState] = useState({
    locatorZip: '',
    locatorProduct: ''
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

  const renderProductOptions = (key) => {
    return <option key={key.upc_code} value={key.upc_code}>{key.upc_name}</option>
  };

  const submitForm = (event) => {
    event.preventDefault();

    fetch(`https://productlocator.iriworldwide.com/productlocator/servlet/ProductLocatorEngine?clientid=155&productfamilyid=LING&producttype=upc&productid=${locatorFormState.locatorProduct}&zip=${locatorFormState.locatorZip}&storesperpage=25&outputtype=json`, {
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
        if (response.RESULTS.SUCCESS_CODE === 0) {
          props.setLocatorFormResponse(locatorFormState, response);
        } else {
          alert(response.RESULTS.ERROR)
        }
      }
    )
  };

  return (
    <form className={'form'} onSubmit={(e) => { submitForm(e); }}>
      <label htmlFor={'zip'}>
        Product*
        <select name={'locatorProduct'} id={'product'} value={locatorFormState.locatorProduct} onChange={(e) => { handleChange(e); }}>
          <option value="">-- Please Select Option --</option>
          {props.products.map(renderProductOptions)}
        </select>
      </label>
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