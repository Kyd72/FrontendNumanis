var Serveur ="http://127.0.0.1:8000"
var apiCompressionImage="/Numanis/compression/imagel"
var apiCompressionImageURL="/Numanis/compression/image"
function uploadImage() {

  var form = document.getElementById("imageForm");
  var formData = new FormData(form);




  var imageContainer = document.getElementById('image-container');
  while (imageContainer.firstChild) {
    imageContainer.removeChild(imageContainer.firstChild);
  }

  fetch(Serveur + apiCompressionImage, {
    method: "POST",
    body: formData,
  })
    .then(response => response.blob())
    .then(blob => {
      // Créer une URL d'objet blob
      const imageUrl = URL.createObjectURL(blob);

      // Créer un élément image
      const imgElement = document.createElement("img");

      // Définir l'attribut src de l'image avec l'URL de l'image
      imgElement.src = imageUrl;

      // Ajouter l'élément image à votre page (par exemple, à un élément div avec l'id "image-container")
      document.getElementById("image-container").appendChild(imgElement);

      // Traitez la réponse du backend ici
      console.log("Image téléchargée avec succès!");
    })
    .catch(error => {
      console.error("Erreur lors de l'upload de l'image:", error);
      document.getElementById("result").innerText = "Erreur lors de l'upload de l'image.";
    });}

function uploadURL() {

  var imageContainer = document.getElementById('image-container');
  while (imageContainer.firstChild) {
    imageContainer.removeChild(imageContainer.firstChild);
  }

  // Récupérer l'URL de l'image depuis le champ de texte
  var imageUrlInput = document.querySelector('input[name="image_url"]');
  var imageWantedSize = document.querySelector('input[name="image_wanted_size"]');

  var imageUrl = imageUrlInput.value.trim();

  // Vérifier si l'URL est non vide
  if (imageUrl !== '') {
    // Configuration de la requête Fetch avec l'URL dans les options
    var requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Envoyer la requête GET au backend avec l'URL comme paramètre
    fetch(Serveur+apiCompressionImageURL+`?url=${encodeURIComponent(imageUrl)}`+`&target_size_kb=${encodeURIComponent(imageWantedSize.value)}`, requestOptions)
      .then(response => {
        // Vérifier si la réponse est réussie (status 200 OK)
        if (response.ok) {
          return response.json();  // Parse la réponse JSON
        } else {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
      })
      .then(data => {

        // Ajouter l'élément image à votre page (par exemple, à un élément div avec l'id "image-container")

        // Gérer la réponse du backend ici (par exemple, mettre à jour l'image)
        const imgElement = document.createElement("img");
        imgElement.src = data.compressed_url;
        document.getElementById("image-container").appendChild(imgElement);

        // Créer une nouvelle div pour afficher les informations
        const infoDiv = document.createElement("div");
        infoDiv.className = "info-container"; // Ajoutez une classe pour styliser la div si nécessaire

        // Ajouter les nouvelles informations à la div
        infoDiv.innerHTML = `
        <p>Taille entree: ${data.input_size} bytes</p>
        <p>Taille sortie: ${data.output_size} bytes</p>
        <p>Dimensions entree: ${data.input_dimensions.join(" x ")}</p>
        <p>Dimensions sortie: ${data.output_dimensions.join(" x ")}</p>
        <p>Format entree: ${data.input_format}</p>
        <p>Format sortie: ${data.output_format}</p>
    `;

        // Ajouter la nouvelle div à votre page (par exemple, à un élément div avec l'id "info-container")
        document.getElementById("info-container").innerHTML = ""; // Effacer le contenu existant
        document.getElementById("info-container").appendChild(infoDiv);


      })
      .catch(error => {
        console.error("Erreur lors de la requête GET :", error);
      });
  } else {
    console.warn("L'URL de l'image est vide.");
  }
}
