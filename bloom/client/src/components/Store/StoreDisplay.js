import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LargeCarousel from '../LargeCarousel';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { withRouter } from "react-router-dom";
import {
  addAlert
} from '../../reduxFolder/actions/alert'
import store from '../../reduxFolder/store';
import './StoreDisplay.css'
import { getPictures } from '../s3'
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

class StoreDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      store: {
        id: "",
        name: "",
        address: "",
        created_at: "",
        category: [],
        services: [],
        workers: [],
        owners: [],
        phone: "",
        clients: [],
        pictures: [],
        description: "",
        lat: "",
        lng: ""
      },
      pictures: []
    }
  }

  triggerStoreEdit() {
    this.props.history.push({
      pathname: '/stores/edit/' + this.props.match.params.store_id,
      state: this.state
    })
  }

  triggerBook() {
    this.props.history.push({
      pathname: '/book/' + this.props.match.params.store_id,
      state: this.state
    })
  }

  async componentDidMount() {
    // if we were passed the store data from calling component
    let pictures = await getPictures('stores/' + this.props.match.params.store_id + '/images/')
    if(pictures.length == 0){
      pictures = [
        {
          url: "/hair.jpg",
          key: "/hair.jpg"
        },
        {
          url: "/nails.jpg",
          key: "/nails.jpg"
        },
        {
          url: "/salon.jpg",
          key: "/salon.jpg"
        }
      ]
    }

    if(this.props.location.state && this.props.location.state.store){
      let convertedCategory = this.props.location.state.store.category.map((str) => ({ value: str.toLowerCase(), label: str }));
      let appendedStore = this.props.location.state.store
      appendedStore.pictures = pictures

      this.setState({
        store: appendedStore,
        selectedOption: convertedCategory
      })
    }
    else{
      // retrieve the store data from the database
      fetch(fetchDomain + '/stores/' + this.props.match.params.store_id , {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
      })
      .then(function(response){
        if(response.status!==200){
          // throw an error alert
          store.dispatch(addAlert(response))
        }
        else{
          return response.json();
        }
      })
      .then(data => {
        if(data){
          let convertedCategory = data.category.map((str) => ({ value: str.toLowerCase(), label: str }));
          data.pictures = pictures

          this.setState({
            store: data,
            selectedOption: convertedCategory
          })
        }
      });
    }
  }

  render() {
    let editButton;
    if(Cookies.get('user') && this.state.store.owners.indexOf(JSON.parse(Cookies.get('user').substring(2)).id) > -1){
      editButton = <Button className="float-left" onClick={() =>  this.triggerStoreEdit()}>Edit Store</Button>
    }

    return (
      <Container fluid>
        <Row className="justify-content-md-center" style={{ marginTop: '15px', marginBottom: '15px'}}>
          <Col lg={3}>
            <h1>{this.state.store.name}</h1>
            <h5 style={{color: "gray"}}>{this.state.store.address}</h5>
            <hr/>
            <p style={{fontSize: "25px"}}>{this.state.store.description}</p>
            <ul>
              {this.state.store.category.map((cat, index) => (
                <li key={"cat-" + index}>{cat}</li>
              ))}
            </ul>
            <div id="buttonGroup">
              {editButton}
              <Button className="float-left" onClick={() =>  this.triggerBook()}>Book Now</Button>
            </div>
          </Col>
          <Col xs={10} sm={9} md={8} lg={7}>
            <LargeCarousel className="carousel" pictures={this.state.store.pictures}/>
          </Col>
        </Row>
        <Row>
          {/* <WorkerDisplay/> */}
        </Row>
        <Row>
          {/* <ServiceDisplay/> */}
        </Row>
      </Container>
    );
  }
}

export default withRouter(StoreDisplay);