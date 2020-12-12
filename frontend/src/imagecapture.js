class PhotoCapture extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, this.handleVideo, this.videoError);
    }
  }
  handleVideo (stream) {
    // Update the state, triggering the component to re-render with the correct stream
    this.setState({ videoSrc: window.URL.createObjectURL(stream) });
    this.videoElement.play();
  }
  videoError() {
  }
  render() {
    const video = (<video id="video" width="640" height="480" className="cameraFrame" src={this.state.videoSrc} autoPlay="true"
        ref={(input) => { this.videoElement = input; }}></video>);
    return (
      <div>
        {video}
      </div>
    );
  }
}

class Photo extends Component{
    render(){
        setTimeout(() => {
            if (!this.props.isOpen) {
                return;
            }
            const context = this.canvasElement.getContext('2d');
            context.drawImage(this.props.video, 0, 0, 640, 480);
        });
        const canvasEl = (<canvas id="canvas" width="640" height="480" className="photoCard" ref={(input) => this.canvasElement = canvas} />)
        return (
            <div className="content">
                {canvasEl}
            </div>);
    }
}