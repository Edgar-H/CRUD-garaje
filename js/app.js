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
const db = firebase.firestore();
const stockForm = document.getElementById('stock-form');
const stockContainer = document.getElementById('stock-container');

let editStatus = false;
let id = '';

const saveCar = (model, brand, colour, year, price) =>
  db.collection('garaje').doc().set({
    model,
    brand,
    colour,
    year,
    price
  });

const getStock = () => db.collection('garaje').get();
const onGetStock = (callback) => db.collection('garaje').onSnapshot(callback);

const deleteStock = (id) => db.collection("garaje").doc(id).delete();
const getEdit = (id) => db.collection("garaje").doc(id).get();
const updateCar = (id, updatedCar) => db.collection('garaje').doc(id).update(updatedCar);

window.addEventListener('DOMContentLoaded', async (e) => {
  onGetStock((querySnapshot) => {
    stockContainer.innerHTML = ''
    querySnapshot.forEach(doc => {

    const shorck = doc.data();
    shorck.id = doc.id;

    stockContainer.innerHTML += `<div class="col-lg-3 col-md-5 col-s-12">
          <h3>${shorck.model} ${shorck.brand}</h3>
          <p>${shorck.year} ${shorck.colour}</p>
          <span>$ ${shorck.price}</span>
          <div>
            <button class="btn-delete" data-id="${shorck.id}">
              🗑 Delete
            </button>
            <button class="btn-edit" data-id="${shorck.id}">
              🖉 Edit
            </button>
          </div>
        </div>`;

        const btnsDelete = document.querySelectorAll('.btn-delete');
        btnsDelete.forEach(btn => {
          btn.addEventListener('click', async (e) => {
            await deleteStock(e.target.dataset.id)
          })
        });

        const btnsEdit = document.querySelectorAll('.btn-edit')
        btnsEdit.forEach((btn) => {
          btn.addEventListener("click", async (e) => {
            const doc = await getEdit(e.target.dataset.id);

            editStatus = true;
            id = doc.id;

            stockForm['stock-model'].value = doc.data().model;
            stockForm['stock-brand'].value = doc.data().brand;
            stockForm['stock-colour'].value = doc.data().colour;
            stockForm['stock-year'].value = doc.data().year;
            stockForm['stock-price'].value = doc.data().price;
            /* stockForm['btn-addstock-form'].innerText = 'Guardar cambios'; */  //Deshabilito esto porque no me funciona y ya le di varias vueltas
          });
      });
    });
  });
});


stockForm.addEventListener('submit', async e => {
  e.preventDefault();

  const model = stockForm['stock-model'];
  const brand = stockForm['stock-brand'];
  const colour = stockForm['stock-colour'];
  const year = stockForm['stock-year'];
  const price = stockForm['stock-price'];

  if (!editStatus) {
    await saveCar(model.value, brand.value, colour.value, year.value, price.value);
  } else {
    await updateCar(id, {
      model: model.value, 
      brand: brand.value, 
      colour: colour.value, 
      year: year.value, 
      price: price.value
    });
    editStatus = false;
    id = ''
  }
  stockForm.reset();
  getStock();
});
    // End CRUD //