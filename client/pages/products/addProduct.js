import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import Image from 'next/image';

const initialFormData = Object.freeze({
  title: "",
  price: 0.0,
  image: []
});

const addProduct = () => {

  const [formData, updateFormData] = useState(initialFormData);

  const { doRequest, errors } = useRequest({
    url: '/api/products',
    method: 'post',
    body: {
      ...formData
    },
    onSuccess: () => Router.push('/'),
  });

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.title]: e.target.value.trim()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData);
    
    await doRequest();
  };

  // const [title, setTitle] = useState('');
  // const [price, setPrice] = useState('');
  // const [image, setImage] = useState(null);
  // let formData = new FormData();
  // const { doRequest, errors } = useRequest({
  //   url: '/api/products',
  //   method: 'post',
  //   body: {
  //     formData
  //   },
  //   onSuccess: () => Router.push('/'),
  // });

  // const onSubmit = async (event) => {
  //   event.preventDefault();
    
  //   formData.append('title', title);
  //   formData.append('price', price);
  //   formData.append('image', image);

  //   await doRequest();
  // }

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  }

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  return (
    <div>
      <h1>Add a Product</h1>
      {/* <form onSubmit={onSubmit}>  */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input 
            value={formData.title} 
            // onChange={e => setTitle(e.target.value)} 
            onChange={handleChange}
            className="form-control" 
          />
        </div>
        <br/>
        <div className="form-group">
          <label>Price</label>
          <input 
            value={formData.price} 
            onBlur={onBlur}
            // onChange={e => setPrice(e.target.value)}
            onChange={handleChange}
            className="form-control" 
          />
        </div>
        <br/>
        <div className="form-group">
          <label>Upload Image</label>
           <input type="file"
                  // onChange={e => setImage(e.target.files[0])}
                  value={formData.image} 
                  onChange={handleChange}
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ display: 'none' }} />
          {/* <button onClick={handleClick} className="btn btn-primary">File Upload</button> */}
        </div>
        <br/>
        {errors}
        <button className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
};

export default addProduct;