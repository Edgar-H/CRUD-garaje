function uploadImage(){
  const ref = firebase.storage().ref();
  const file =document.getElementById('img_uploader').files[0];
  const name = new Date() + '-' + file.name;

  const metadata = {
    contentType: file.type
  }
  const task = ref.child(name).put(file, metadata);
  task
  .then(snapshot => snapshot.ref.getDownloadURL())
  .then(url => {
    console.log(url);
    alert('Foto cargada correctamente');
    const imageElement = document.getElementById('img_preview');
    imageElement.src = url;
  })
  console.log(ref);
}
//////////////////////

const db = firebase.firestore();

const stockForm = document.getElementById("stock-form");
const stockContainer = document.getElementById("stock-container");

let editStatus = false;
let id = '';

/**
 * Save a New Stock in Firestore
 * @param {string} imagePreview
 * @param {string} model
 * @param {string} brand
 * @param {string} colour
 * @param {string} year
 * @param {string} price
 */
const saveStock = (imagePreview, model, brand, colour, year, price,) =>
  db.collection("stock").doc().set({
    imagePreview,
    model,
    brand,
    colour,
    year,
    price,
  });

const getStock = () => db.collection("stock").get();

const onGetStock= (callback) => db.collection("stock").onSnapshot(callback);

const deleteStock = (id) => db.collection("stock").doc(id).delete();

const getStock = (id) => db.collection("stock").doc(id).get();

const updateStock = (id, updatedStock) => db.collection('stock').doc(id).update(updatedStock);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetStock((querySnapshot) => {
    stockContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const stock = doc.data();

      stockContainer.innerHTML += 
    `<div class="card card-body mt-2 border-primary">
    <h3 class="h5">${stock.model}</h3>
    <p>${stock.brand}</p>
    <div>
      <button class="btn btn-primary btn-delete" data-id="${doc.id}">
        🗑 Delete
      </button>
      <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
        🖉 Edit
      </button>
    </div>
  </div>`;
    });

    const btnsDelete = stockContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteStock(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = stockContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getStock(e.target.dataset.id);
          const stock = doc.data();
          stockForm["stock-imagePreview"].value = stock.imagePreview;
          stockForm["stock-model"].value = stock.model;
          stockForm["stock-brand"].value = stock.brand;
          stockForm["stock-colour"].value = stock.colour;
          stockForm["stock-year"].value = stock.year;
          stockForm["stock-price"].value = stock.price;

          editStatus = true;
          id = doc.id;
          stockForm["btn-addstock-form"].innerText = "Update";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

stockForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const imagePreview = stockForm["stock-imagePreview"];
  const model = stockForm["stock-model"];
  const brand = stockForm["stock-brand"];
  const colour = stockForm["stock-colour"];
  const year = stockForm["stock-year"];
  const price = stockForm["stock-price"];

  try {
    if (!editStatus) {
      await saveStock(
        imagePreview.value, 
        model.value, 
        brand.value, 
        colour.value,
        year.value,
        price.value
        );
    } else {
      await updateStock(id, {
        imagePreview: imagePreview.value,
        model: model.value,
        brand: brand.value,
        colour: colour.value,
        year: year.value,
        price: price.value,
      })

      editStatus = false;
      id = '';
      stockForm['btn-addstock-form'].innerText = 'Save';
    }

    stockForm.reset();
    model.focus();
  } catch (error) {
    console.log(error);
  }
});