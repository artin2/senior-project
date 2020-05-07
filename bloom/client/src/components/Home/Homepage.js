import React from 'react';
// import Container from 'react-bootstrap/Container'
import {Row, Col, Container, Button} from 'react-bootstrap'
import AdvancedSearch from '../Search/AdvancedSearch';
import './Homepage.css';
import paint from '../../assets/abstract-painting.jpg';
import barber from '../../assets/barber.jpg';
// import bride_hair from '../../assets/bride_hair.jpg';
import facials from '../../assets/facials.jpg';
import hair from '../../assets/hair.jpg';
import lipstics from '../../assets/lipstics2.jpg';
import massage from '../../assets/massage3.jpg';
import nails from '../../assets/nails3.jpg';
import salon from '../../assets/salon.jpg';
import paint_line from '../../assets/paint_line.png';
import Typist from 'react-typist';
import { useState, useEffect } from 'react'
// import { useSpring, animated as a } from 'react-spring'
// import TrackVisibility from 'react-on-screen';
import VizSensor from 'react-visibility-sensor';
// import Typing from 'react-typing-animation';
import Category from './Category.js';

const calc = (x, y) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 80, 1.04]
const trans = (x, y, s) => `perspective(600px) scale(${s})`


function useScreenWidth(): number {

  const [position, setPosition] = useState({ xys: [0, 0, 1]});

  useEffect(() => {
    let mounted = true
    let setFromEvent;
    let setLeaveEvent;

    if(mounted){
      setFromEvent = e => setPosition({  xys: calc(e.clientX, e.clientY) });
      setLeaveEvent = e => setPosition({ xys : [0, 0, 1]})
      window.addEventListener("mousemove", setFromEvent);
    }

    return () => {
      mounted = false;
      window.removeEventListener("mousemove", setFromEvent);
    };
  });

  return position;
}

function useScroll() : number {
  const [scrollPosition, setSrollPosition] = useState(0);
  const handleScroll = () => {
      const position = window.pageYOffset;
      setSrollPosition(position);
  };

  useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);

return scrollPosition;
}

function useResizeWidth(): number {

  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    let mounted = true
    let handleResize;

    if(mounted){
      handleResize = () => {
        setWidth(window.innerWidth)
      }
      window.addEventListener('resize', handleResize)
    }
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize)
    }

  })

  return width;
}

function ScreenWidth ({ listen, children }) {
  const screenWidth: number = useScreenWidth();
  // console.log(screenWidth);
  return children(screenWidth);

};

function ScreenResize ({listen, children }) {
  const resize: number = useResizeWidth();
  // console.log(screenWidth);
  return children(resize);
};

function ScreenScroll ({ listen, children }) {
  const scroll: number = useScroll();
  // console.log(scroll);
  return children(scroll);

};


class Homepage extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        Visible: false
      }

      // this.handleMouseEnter = this.handleMouseEnter.bind(this, this.props.handleMouseEnter)
      // this.handleMouseMove = this.handleMouseMove.bind(this, this.props.handleMouseMove)
      // this.handleMouseLeave = this.handleMouseLeave.bind(this, this.props.handleMouseLeave)

  }

  goToStore() {
    this.props.history.push({
      pathname: '/store/signup'
    });
  }

  render() {

    // console.log(this.state.Visible)
    return (
      <Container fluid style={{backgroundColor: '#c0cbcf'}}>
        <div>
          <ScreenWidth>
            {(position) =>
            <img src={paint} alt="paint" style={{top: 80, left: 0, position: 'absolute', height: '700px', width:'100%', transform: `perspective(600px) rotateX(${position.xys[0]/10}deg) rotateY(${position.xys[1]/10}deg) scale(${position.xys[2]})` }}
              // onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
              // onMouseLeave={() => set({ xys: [0, 0, 1] })}
            />
            }
          </ScreenWidth>
        </div>
            <Row style={{marginTop: 120, height: 500, marginLeft: '10%'}}>
            <ScreenResize>
            {(width) => {
              if(width > 1000) {
                return (
                <AdvancedSearch/>)
              }
              else {
                return null;
              }
            }}
            </ScreenResize>
            <Col style={{margin:'10%', marginTop: '0%'}}>
              <Row style={{marginLeft:'10%', marginTop: '2%'}}>
                <p className="welcome"> Welcome to </p>
                <p className="bloom"> Bloom </p>
              </Row>
              <p className="subtitle"> A platform that helps you find
              salons, beauty experts and stylists that are located near your house.
              Search today to find the salons that will soon become your favorite. </p>

            </Col>
          </Row>

          <Col className="type_container">
            <VizSensor
             onChange={(isVisible) => {
               this.setState({Visible: isVisible})
             }}
             active={!this.state.Visible}>

           <p style={{fontSize: 25, fontFamily: 'Bellota, cursive', fontWeight: 'bold'}}> At Bloom </p>
           </VizSensor>

           <Col>
            {(this.state.Visible) ?
              <Typist
                className="typist"
                avgTypingDelay={100}
                startDelay={10}
                cursor={{
                  show: true,
                  blink: true,
                  element: '|',
                }}
              >
                You can find hair salons.

                <Typist.Backspace count={12} delay={200} />
                  <span> nail salons.</span>
                <Typist.Backspace count={12} delay={200} />
                  <span> beauty salons and more.</span>


            </Typist>
           : null}
          </Col>
        </Col>

          <Col style={{marginLeft: '2%', marginTop: '3%'}}>
            <Row>
            <Category history={this.props.history} id={"hair"}  img={hair} text={"Hair Salons"}/>
            <Category history={this.props.history} id={"makeup"} img={lipstics} text={"Makeup Artists"}/>
            <Category history={this.props.history} id={"barber"} img={barber} text={"Barber Shops"}/>
            </Row>
            <Row>
            <Category history={this.props.history} id={"nails"} img={nails} text={"Nail Salons"}/>
            <Category history={this.props.history} id={"facials"} img={facials} text={"Facials"}/>
            <Category history={this.props.history} id={"spa"} img={massage} text={"Spa"}/>
            </Row>
          </Col>

          <Col style={{ marginTop: '8%', backgroundColor: '#e8e3d8'}}>
          <Row>
          <Col style={{margin: '5%', marginTop: '10%'}}>
          <p className="header"> Are you a salon owner? </p>
          <p style={{fontSize: 20}}> Join our community by signing up your salon today! Join our community by signing up your salon today. Join our community by signing up your salon today.
          Join our community by signing up your salon today. Join our community by signing up your salon today. </p>
          <Button onClick={() =>  this.goToStore()} style={{marginTop: '5%', backgroundColor: '#354B74', border: 0}}> Learn More </Button>
          </Col>
          <img src={salon} className="salon" alt="paint"/>
          </Row>
          </Col>

      </Container>
    );
  }
}

export default Homepage;
