import React, { Component } from 'react';
import { useState } from 'react';
// import axios from 'axios';
import './index.css';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

// import React, { Fragment } from 'react';

import ReactDOM from 'react-dom';
import axios from 'axios';
import { CameraFeed } from './components/camera-feed';

// React Speech: https://www.npmjs.com/package/react-speech
import Speech from 'react-speech';
/* eslint no-undef: 0 */ // --> OFF
class App extends Component {
    /**
     * Processes available devices and identifies one by the label
     * @memberof CameraFeed
     * @instance
     */
    processDevices(devices) {
        devices.forEach(device => {
            console.log(device.label);
            this.setDevice(device);
        });
    }

    /**
     * Sets the active device and starts playing the feed
     * @memberof CameraFeed
     * @instance
     */
    async setDevice(device) {
        const { deviceId } = device;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } });
        this.videoPlayer.srcObject = stream;
        this.videoPlayer.play();
    }

    /**
     * On mount, grab the users connected devices and process them
     * @memberof CameraFeed
     * @instance
     * @override
     */
    async componentDidMount() {
        const cameras = await navigator.mediaDevices.enumerateDevices();
        this.processDevices(cameras);
    }

    /**
     * Handles taking a still image from the video feed on the camera
     * @memberof CameraFeed
     * @instance
     */

    // takePhoto = () => {
    //     // const { sendFile } = this.props;
    //     const context = this.canvas.getContext('2d');
    //     context.drawImage(this.videoPlayer, 0, 0, 680, 360);
    //     // this.canvas.toBlob(sendFile);

    //     console.log(this.canvas.toDataURL());
    // };
    
    // ==========================================================================

  state = {
    image: '',
    image_url:null,
    data_img: [],
    imgText: "",
    imgfromcanvas:""
  };

  takePhoto = () => {
        // const { sendFile } = this.props;
        const context = this.canvas.getContext('2d');
        context.drawImage(this.videoPlayer, 0, 0, 680, 360);
        // this.canvas.toBlob(sendFile);
        this.setState({image:this.canvas.toDataURL()});
        // alert(this.state.image);
        console.log(this.canvas.toDataURL());
        this.setState({imgfromcanvas:this.canvas.toDataURL()});
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
        id_dateMess.textContent="---Date From Data----"
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
        <Container id="image_in"fixed>
          <h1>Optical Character Recognization</h1>
          <h2>======================</h2>
          <div id="Upload_o=image">
           <p>Select an Image to Upload</p>
           <p>
              <input accept="image/*"  id="contained-button-file" style={{ display: "none" }}  type="file" onChange={(event)=>this.handleImageChange(event)} required/>
              <label htmlFor="contained-button-file">
               <Button variant="contained" color="primary" component="span" >
                   Upload Image
               </Button>
               <p id="u_image_name"></p>
              </label>
          </p>
          <Button  variant="contained" color="primary" onClick={(event) => this.handleSubmit(event)}>Sumbit</Button>
          </div>
          <p></p>
          <div id='postMessage'></div>
          <p></p>
         <div id="uploadedImage"></div>
          <h2>======================</h2> 
        </Container>
       <Container id="image_out" fixed>
        <div id="processMessage"></div>
        <p></p>

        {/* value={value} onChange={(event) => setValue(event.target.value)}  */}
        <Speech text={this.state.imgText} />
        <div id="dataFromImage"></div>
        {/* <button onClick={() => Speech(id="dataFromImage"={value})}>Speak</button> */}
        {/* <Speech text==id="dataFromImage" /> */}

        <div id="dateMessage"></div>
        <div id="dateInfo"></div>
  
       </Container>

       <div className="c-camera-feed">
          <div className="c-camera-feed__viewer">
              <video ref={ref => (this.videoPlayer = ref)} width="680" heigh="360" />
          </div>
          <button onClick={this.takePhoto}>Take photo!</button>
          <div className="c-camera-feed__stage">
              <canvas width="680" height="360" ref={ref => (this.canvas = ref)} />
          </div>
          <img src={this.state.imgfromcanvas} alt="asd" />
      </div>
      </div>
      
    );
    // function Feed() {
    // return (
    //     <div className="Feed">
    //         <h1>Image capture test</h1>
    //         <p>Capture image from USB webcamera and upload to form</p>
    //         <CameraFeed/>
    //     </div>
    // );
    // }
  }
}


const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
export default App;