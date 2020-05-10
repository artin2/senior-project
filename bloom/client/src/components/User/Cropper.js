import React from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./Cropper.css"
import { Modal, Button } from "react-bootstrap";
class CropperEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  setCroppedData (pond) {
    let absLeft = pond.current.getCropBoxData().left - pond.current.getCanvasData().left
    let absTop = pond.current.getCropBoxData().top - pond.current.getCanvasData().top
    let naturalWidth = pond.current.getImageData().width
    let naturalHeight = pond.current.getImageData().height
  
    /* Center point of crop area in percent. */
    console.log("abs left is: ", absLeft)
    console.log("cropped width is: ", pond.current.getCropBoxData().width)
    console.log("natural width is: ", naturalWidth)
    const percentX = (absLeft + pond.current.getCropBoxData().width / 2) / naturalWidth
    const percentY = (absTop + pond.current.getCropBoxData().height / 2) / naturalHeight
  
    /* Calculate available space round image center position. */
    const cx = percentX > 0.5 ? 1 - percentX : percentX
    const cy = percentY > 0.5 ? 1 - percentY : percentY
  
    /* Calculate image rectangle respecting space round image from crop area. */
    let width = naturalWidth
    let height = width
    if (height > naturalHeight) {
      height = naturalHeight
      width = height
    }
    const rectWidth = cx * 2 * width
    const rectHeight = cy * 2 * height
  
    const zoom = Math.max(rectWidth / pond.current.getCropBoxData().width, rectHeight / pond.current.getCropBoxData().height)
    console.log("zoom is: ", zoom)
    /* Callback filepond. */
    let data = { crop: {
          center: {
            x: percentX,
            y: percentY
          },
          flip: {
            horizontal: false,
            vertical: false
          },
          zoom: zoom,
          rotation: 0,
          aspectRatio: 1
        }
    }
    console.log("data in modal is: ", data)
    this.props.onCrop(data)
    this.props.onHide()
  }

  render() {
    return (
      <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={this.props.show}
    >
      <Modal.Body>
        {this.props.image !== null && (
          <Cropper
          ref={this.props.pond}
          src={this.props.image !== {} ? this.props.image : ""}
          style={{ height: 400, width: "100%" }}
          aspectRatio={1}
          zoomable={true}
          modal={true}
          // Cropper.js options
          guides={true}
        />
        )}
      </Modal.Body>
      <Modal.Footer>
      <Button onClick={() => this.setCroppedData(this.props.pond)}>Crop</Button> <Button onClick={() => this.props.onHide()}>Close</Button>
      </Modal.Footer>
    </Modal>
    );
  }
}


export default CropperEditor;
