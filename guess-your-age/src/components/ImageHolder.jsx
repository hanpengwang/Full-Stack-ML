import "./ImageHolder.css";
import * as faceapi from "face-api.js";

import React from "react";

class ImageHolder extends React.Component {
  constructor() {
    super();
    this.reader = new FileReader();
    this.reader.onload = (e) => {
      document
        .getElementById("image-file")
        .setAttribute("src", e.target.result);
    };
    this.faceAPIoptions = new faceapi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.3,
    });
    this.apiLoaded = false;
    this.initMsg = "Drag or Click to Upload";
    this.state = { msg: this.initMsg };
    this.imgDim = { width: 220, height: 300 };

  }

  setMsg = (msg = this.initMsg) => {
    this.setState({ msg })
  }


  handleInput = async (e) => {
    this.clearCanvas()
    this.setMsg("Analyzing");
    const image = e.target.files[0];
    this.reader.readAsDataURL(image);
    if (!this.apiLoaded) {
      await this.initFaceAPI();
      this.apiLoaded = true;
    }

    const detections = await faceapi.detectAllFaces(document.getElementById("image-file"), this.faceAPIoptions).withAgeAndGender();



    detections.forEach(detec => {
      let r_x = this.imgDim.width / detec.detection.imageDims.width
      let r_y = this.imgDim.height / detec.detection.imageDims.height
      let b = detec.detection.box
      this.displayResult(b.x * r_x, b.y * r_y, detec.age)
    });


    this.setMsg("Done!")
    console.log(detections);
  };

  handleUrl = async () => {
    this.clearCanvas()
    this.setMsg("Analyzing");
    let ifError = false

    let userInputUrl = document.querySelector("#url-file-container input").value;
    let blob = await fetch(userInputUrl).then((r) => r.blob()).catch(() => { this.setMsg("Image Link Is Not Accessible"); ifError = true; });
    if (ifError) { return };
    this.reader.readAsDataURL(blob);
    if (!this.apiLoaded) {
      await this.initFaceAPI();
      this.apiLoaded = true;
    }
    const detections = await faceapi.detectAllFaces(document.getElementById("image-file"), this.faceAPIoptions)
      .withAgeAndGender();


    detections.forEach(detec => {
      let r_x = this.imgDim.width / detec.detection.imageDims.width
      let r_y = this.imgDim.height / detec.detection.imageDims.height
      let b = detec.detection.box
      this.displayResult(b.x * r_x, b.y * r_y, detec.age)
    });

    this.setMsg("Done!")
    console.log(detections);
  }

  async initFaceAPI() {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.ageGenderNet.loadFromUri("/models");
    console.log("init model")
  }

  displayResult = (x, y, age) => {
    var c = document.getElementById("overlay");
    var ctx = c.getContext("2d");


    ctx.fillStyle = "white";
    ctx.fillRect(x, y - 20, 20, 22);

    ctx.fillStyle = "blue";
    ctx.font = "20px Arial red";
    ctx.fillText(Math.round(age), x, y);
  }

  clearCanvas = () => {
    var c = document.getElementById("overlay");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, this.imgDim.width, this.imgDim.height);
  }
  render() {

    return (
      <div id="container">
        <div id="wrapper">
          <div id="url-file-container">
            <input
              type="text"
              placeholder="you can also put online image link here"
            />
            <button onClick={this.handleUrl}>Go!</button>
          </div>
          <form method="post" id="form-file" encType="multipart/form-data">
            <br />
            <input
              type="file"
              id="input-file"
              accept="image/*"
              onChange={this.handleInput}
            />
            <div id="image-container">
              <img crossOrigin="anonymous" src="/" alt="" id="image-file" />

              <canvas id="overlay"></canvas>


            </div>
          </form>

          <p id="size-warn">
            <strong>{this.state.msg}</strong>
          </p>
        </div>

      </div>
    );
  }
}




export default ImageHolder;
