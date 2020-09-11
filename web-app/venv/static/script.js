let image_info = {};

const uploader = document.getElementById("form-file");

const input = document.getElementById("input-file");

const inputLabel = document.getElementById("label-file");

const uploadImage = document.getElementById("image-file");

const imgSizeWarn = document.getElementById("size-warn");

const submitFile = document.getElementById("submit-file");

const predResult = document.getElementById("pred-result");

const loadingSpinner = document.getElementById("loading-spinner");

const imageContainer = document.getElementById("image-container");

const urlSearchButton = document.querySelector("#url-file-container button");

const predApiFromFile = `${location.protocol}//${window.location.host}/pred/fromFile`;
const predApiFromUrl = `${location.protocol}//${window.location.host}/pred/fromUrl`;

const imagePosition = imageContainer.getBoundingClientRect();

input.onchange = (e) => {
  const image = e.target.files[0];

  //Check image size
  if (!image.type.includes("image")) {
    console.log("please input image");
    return 0;
  }
  if (image.size / 10 ** 6 > 5) {
    imgSizeWarn.style.animationName = "large-size-warn";
    imgSizeWarn.style.animationDuration = "1s";
    setTimeout(() => {
      imgSizeWarn.style.removeProperty("animation-name");
      imgSizeWarn.style.removeProperty("animation-duration");
    }, 1100);
    return 0;
  }

  //read image if ok
  const reader = new FileReader();
  reader.onload = function (e) {
    uploadImage.setAttribute("src", e.target.result);
  };
  inputLabel.style.display = "None";
  reader.readAsDataURL(image);

  const formData = new FormData();
  formData.append("file", image);

  input.setAttribute("disabled", true);
  loadingSpinner.style.opacity = 1;

  fetch(predApiFromFile, { method: "POST", body: formData })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      predResult.innerHTML = "";
      if (data.success === false) {
        predResult.innerHTML = "looks like I couldn't determine your age";
      } else {
        let result = data.prediction;
        let hRatio = 300 / data["original_img_size"][0];
        let wRatio = 220 / data["original_img_size"][1];
        let ageBoxH = 20;
        let ageBoxW = 40;

        result.forEach((age, i) => {
          let predAge = document.createElement("span");
          let faceBox = data["annotation_position"][i];
          let xStart = faceBox[0] * wRatio;
          let yStart = faceBox[1] * hRatio;
          let yPos = imagePosition["y"] + yStart;
          let xPos = imagePosition["x"] + xStart - 20;
          predAge.style.top = `${yPos}px`;
          predAge.style.left = `${xPos}px`;
          predAge.innerHTML = age;
          predResult.appendChild(predAge);
        });

        //predResult.innerHTML = `are you around ${data.prediction} year old?`;
      }
    })
    .then(() => {
      input.removeAttribute("disabled");
      loadingSpinner.style.opacity = 0;
    });
};

(function imageDragBehav() {
  input.ondragenter = (e) => {
    e.preventDefault();
    imageContainer.style.border = "3px dashed blue";
  };

  input.ondragleave = (e) => {
    e.preventDefault();
    imageContainer.style.border = "3px dashed white";
  };

  input.ondrop = (e) => {
    imageContainer.style.border = "3px dashed white";
  };
})();

urlSearchButton.onclick = (e) => {
  let userInputUrl = document.querySelector("#url-file-container input").value;

  try {
    new URL(userInputUrl);
  } catch (_) {
    return 0;
  }

  uploadImage.setAttribute("src", userInputUrl);

  var img = new Image();
  img.onload = sendImage;
  img.onerror = function () {
    console.log("not image");
  };
  img.onabort = function () {
    /* connection or source was reset */
  };
  img.src = userInputUrl;

  function sendImage() {
    inputLabel.style.display = "None";
    input.setAttribute("disabled", true);
    loadingSpinner.style.opacity = 1;
    let payload = JSON.stringify({ url_image: userInputUrl });
    fetch(predApiFromUrl, { method: "POST", body: payload })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        predResult.innerHTML = "";
        if (data.success === false) {
          predResult.innerHTML = "looks like I couldn't determine your age";
        } else {
          let result = data.prediction;
          let hRatio = 300 / data["original_img_size"][0];
          let wRatio = 220 / data["original_img_size"][1];
          let ageBoxH = 20;
          let ageBoxW = 40;

          result.forEach((age, i) => {
            let predAge = document.createElement("span");
            let faceBox = data["annotation_position"][i];
            let xStart = faceBox[0] * wRatio;
            let yStart = faceBox[1] * hRatio;
            let yPos = imagePosition["y"] + yStart;
            let xPos = imagePosition["x"] + xStart - 20;
            predAge.style.top = `${yPos}px`;
            predAge.style.left = `${xPos}px`;
            predAge.innerHTML = age;
            predResult.appendChild(predAge);
          });
        }
      })
      .then(() => {
        input.removeAttribute("disabled");
        loadingSpinner.style.opacity = 0;
      });
  }
};
