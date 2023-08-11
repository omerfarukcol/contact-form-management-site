function UploadPhoto({ imageBase64, setImageBase64 }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageBase64(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imageBase64 && (
        <img
          src={imageBase64}
          alt="Uploaded"
          style={{ maxWidth: "50px", marginTop: "10px" }}
        />
      )}
    </div>
  );
}

export default UploadPhoto;
