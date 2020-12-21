  // Firebase
// Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyD5tlyQP-Ea_GR0r0HbXMfQPswD8Fu10vY",
      authDomain: "crud-coches.firebaseapp.com",
      projectId: "crud-coches",
      storageBucket: "crud-coches.appspot.com",
      messagingSenderId: "194057359056",
      appId: "1:194057359056:web:26671bbf7f1b0ed0bd58d5"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // Firebase



    // Start Add Image Garaje // 
const imagePreview = document.getElementById('img-preview');
const imageUploader = document.getElementById('img-uploader');
const imgUploaderProgress = document.getElementById('img-progress');

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dyykacsdw/image/upload`
const CLOUDINARY_UPLOAD_PRESET = 'bzcgvodf';

imageUploader.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Send to cloudianry
    const res = await axios.post(
        CLOUDINARY_URL,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }
    );
    /* console.log(res); */
    imagePreview.src = res.data.secure_url;
});
    // End Add Image Garaje //







    // Start CRUD //

    // End CRUD //