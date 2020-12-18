import React, { Component } from 'react';
import { useState } from 'react';
// import axios from 'axios';
import './index.css';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

// import React, { Fragment } from 'react';

import ReactDOM from 'react-dom';
import axios from 'axios';

// React Speech: https://www.npmjs.com/package/react-speech
import Speech from 'react-speech';

/* eslint no-undef: 0 */ // --> OFF
class App extends Component {

  state = {
    image: '',
    image_url:null,
    data_img: [],
    imgText: "",
    imgfromcanvas:""
  };


  requestDataOfImage() {
    var id_m=document.getElementById("processMessage");
    var id_processm=document.getElementById("dataFromImage");
    var id_dateMess=document.getElementById("dateMessage");
    var id_dateInfo=document.getElementById("dateInfo");
    id_m.textContent="..... Wait .... Getting the text from Image";


    axios.get(`http://127.0.0.1:8000/Date_From_Image/`)
      .then(res => {
        console.log(res.data.imageText);
        this.setState({imgText:res.data.imageText});

    
        const data_img = res.data;
        this.setState({ data_img });
        id_processm.setAttribute('style',"border:2px; border-style:solid; border-color:#FF0000; padding: 1em;")
        id_m.textContent="----Here is the Text From Image----";
        id_processm.textContent=this.state.data_img.imageText;
        id_dateInfo.setAttribute('style',"border:2px; border-style:solid; border-color:#FF0000; padding: 1em;")
        id_dateInfo.textContent=this.state.data_img.dateInfo;

      })

  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  };
  showImageName(){

    var p_im_name=document.getElementById("u_image_name");
    p_im_name.textContent=this.state.image.name;

  };

 
  handleImageChange = (e) => {
    this.setState({
      image: e.target.files[0],
      image_url:URL.createObjectURL(e.target.files[0])
    },() => {
    this.showImageName()
   });
  };

  handlesubmitfromcanvas = (e) => {
    e.preventDefault();
    let form_data = new FormData();
    form_data.append('image', this.state.imgfromcanvas,"imgfromcanvas");
    let url = 'http://127.0.0.1:8000/Date_From_Image/';


  }
  handleSubmit = (e) => {
    e.preventDefault();
    var id_m=document.getElementById("postMessage");
    var id_uploaded=document.getElementById("uploadedImage");
  
    
    id_m.textContent="/-/- Uploading";

    let form_data = new FormData();
    form_data.append('image', this.state.image, this.state.image.name);
    let url = 'http://127.0.0.1:8000/Date_From_Image/';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
        .then(res => {
          console.log(res.data);  

        id_m.textContent="Image Uploaded Successfully.";
        
        var img_ele=document.createElement("img");
        img_ele.src=this.state.image_url;
        img_ele.setAttribute("width","400");
        img_ele.setAttribute('height',"500")
        var existingImage=id_uploaded.getElementsByTagName("img")
        if(existingImage.length){
         existingImage[0].parentNode.replaceChild(img_ele,existingImage[0]);
        }
        else{
          
          id_uploaded.appendChild(img_ele);
        }
        var id_processm=document.getElementById("dataFromImage");
        id_processm.textContent=" ";

        var id_dateInfo=document.getElementById("dateInfo");
        id_dateInfo.textContent=" ";

        this.requestDataOfImage();
        })
        .catch(err => console.log(err));
     }
  
  render() {

    return (
      <div className="App">
        <div class="login-block id= image_in">
          <div class="container Upload_o=image conta">
            <div class="row">
              <div class="col-md-4 login-sec">
                <h2 class="text-center">Third Eye</h2>
                <div class="login-form">
                  <div class="form-group">
                    <p id="u_image_name"></p>
                    <textarea
                      type="text"
                      class="form-control"
                      placeholder="Upload Image To See Text"
                      rows="5"
                      id="dataFromImage"
                    ></textarea>
                  </div>
                  <label class="form-label" for="customFile">
                    <input
                      style={{ overflow: "hidden" }}
                      accept="image/*"
                      id="contained-button-file"
                      type="file"
                      class="form-control"
                      id="customFile"
                      onChange={(event) => this.handleImageChange(event)}
                    />
                  </label>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => this.handleSubmit(event)}
                  >
                    Sumbit
                  </Button>
                  <br></br>
                  <Speech text={this.state.imgText} />
                </div>
                <div class="copy-text" id="processMessage">
                  <i class="fa fa-heart"></i>
                </div>
                <div id="postMessage"></div>
              </div>
              <div id="dataFromImage"></div>
              <div class="col-md-8 banner-sec" id="uploadedImage">
                <div class="carousel-inner" role="listbox">
                  <div id="processMessage"></div>
                  <div id="dateInfo" hidden></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
export default App;