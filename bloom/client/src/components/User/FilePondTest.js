import React from 'react';
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
// import { useGoogleLogin } from 'react-google-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;


class FilePondTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: [{
        source: "https://picsum.photos/200/300",
        options: { type: "local" }
      }],
      loading: true
    };
  }

  async componentDidMount () {
    let blob = await fetch("https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/New_Logo_Gmail.svg/185px-New_Logo_Gmail.svg.png").then(r => r.blob());
    this.setState({
      file: blob,
      loading: false
    });
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  render() {
    return ( 
      <div className="App">
        {/* Pass FilePond properties as attributes */}
        {!this.loading ? (<FilePond
          ref={ref => (this.pond = ref)}
          files={this.state.files}
          instantUpload={false}
          allowMultiple={true}
          maxFiles={3}
          server={{
            load: (source, load, error, progress, abort, headers) => {
              var myRequest = new Request(source);
              fetch(myRequest).then(function(response) {
                response.blob().then(function(myBlob) {
                  load(myBlob);
                });
              });
            }
          }}
          oninit={() => this.handleInit()}
          onupdatefiles={fileItems => {
            // Set currently active file objects to this.state
            this.setState({
              files: fileItems.map(fileItem => fileItem.file)
            });
          }}
        />) : null}
        
      </div>
    );
  }
}

export default FilePondTest;
