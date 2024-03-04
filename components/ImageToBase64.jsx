import React, { useState } from 'react';

const ImageToBase64 = () => {
  const [base64Image, setBase64Image] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      setBase64Image(base64String);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
      {base64Image && (
        <div>
          <textarea rows={6} cols={50} value={base64Image.replace(/^data:.+base64,/, '')} readOnly />
        </div>
      )}
    </div>
  );
}

export default ImageToBase64;
