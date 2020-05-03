import React from 'react';
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col'
import SearchCard from './SearchCard'
import './SearchDisplay.css'
import MapContainer from '../Map/MapContainer'
import SearchDisplayLoader from './SearchDisplayLoader'
import SearchDisplayLoaderMobile from './SearchDisplayLoaderMobile'
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;


class SearchDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      // center: {
      //   lat: 0.0,
      //   lng: 0.0
      // },
      zoom: 11,
      mapStyles: {
        width: '100%',
        height: '100%'
      },
      center: {
        lat: '',
        lng: ''
      },

      loading: true,
      query: this.props.location.search,
      ownUpdate: false
    }
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.stores && this.props.location.state.center) {
      this.setState({
        stores: this.props.location.state.stores,
        center: this.props.location.state.center,
        loading: false
      })
    }
    else {
      let link = window.location.href.split("search")
      let query = ""

      if (link.length > 1) {
        query = link[1]
      }

      this.getResults(false, query);
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (preState.ownUpdate) {
      return null
    }
    else {
      if(nextProps.location.search !== preState.query) {
        return {
          loading: true
        }
      } else {
        return null
      }
    }


  }

  componentDidUpdate(prevProps) {
    if (this.props.location) {
      if (this.props.location.search !== prevProps.location.search) {
        this.getResults(true, this.props.location.search);
      }
    }
  }

  getResults(update, query) {
    fetch(fetchDomain + '/stores' + query, {
      method: "GET",
      headers: {
        'Content-type': 'application/json'
      },
      credentials: 'include'
    })
      .then(function (response) {
        if (response.status !== 200) {
          // should throw an error here
          console.log("ERROR!")
        }
        else {
          return response.json();
        }
      })
      .then(data => {
        if (data) {
          this.setState({
            stores: data,
            center: {
              lat: data[0].lat,
              lng: data[0].lng,
            },
            loading: false,
            ownUpdate: update
          })
        }
      });
  }

  render() {
    const RenderStoreCards = (props) => {
      return this.state.stores.map(store => (
          <SearchCard key={"store-" + store.id} store={store}
            onClickFunctionBook={() => window.location.href = '/book/' + store.id}
            onClickFunctionStore={() => window.location.href = '/stores/' + store.id}
          />
      ))
    }
    const DisplayWithLoading = (props) => {
      if (this.state.loading) {
        return <Row>
            <Col xs="12">
              <SearchDisplayLoader className={'d-none d-xl-block'}/>
              <SearchDisplayLoaderMobile className={'d-block d-xl-none'}/>
            </Col>
          </Row>
      } else if(this.state.stores.length > 0) {
        return(<div>
          <h3 className="text-left"> {this.state.stores.length} results </h3>
          <Row className="mx-0 justify-content-center search-cards-row">
            <RenderStoreCards/>
          </Row>
        </div>
        )
      } else {
        return <Row>
            <Col xs="12">
              <h5>No results!</h5>
            </Col>
          </Row>
      }
    }

    const DisplayMapDynamic = (props) => {
        return <MapContainer google={window.google}
        stores={this.state.stores}
        center={this.state.center}
        zoom={this.state.zoom}
        mapStyles={this.state.mapStyles} />
    }

    return (
      <div>
        <Row className="restrict-viewport mx-0">
          <Col xs={12} xl={6} className="px-5 my-3 h-100">
            <DisplayWithLoading/>
          </Col>
          <Col id="map" xs={12} xl={6}>
            <div className="position-fixed h-100 w-50 d-none d-xl-block">
              <DisplayMapDynamic/>
            </div>
          </Col>
        </Row>
      </div>

    );
  }
}

export default SearchDisplay;
