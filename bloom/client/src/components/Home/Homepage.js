import React from 'react';
// import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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

// const animation = () => {
//
//     const [props, set] = useSpring(() => (
//       { xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 }
//      }))
//
//     const [flipped, setFlipped] = useState(false)
//     const [key, setKey] = useState(0)
//
//
//     const [width, setWidth] = useState(window.innerWidth)
//       useEffect(() => {
//         const handleResize = () => {
//           setWidth(window.innerWidth)
//         }
//         window.addEventListener('resize', handleResize)
//         return () => { window.removeEventListener('resize', handleResize) }
//       })
//
//
//     const { transform, opacity, display } = useSpring({
//       opacity: flipped ? 1 : 0,
//       display: flipped ? '' : 'none',
//       transform: `perspective(500px) rotateX(${flipped ? 180 : 0}deg)`,
//       config: { mass: 5, tension: 400, friction: 80 }})
//
// }




function useScreenWidth(): number {

  const [position, setPosition] = useState({ xys: [0, 0, 1]});


  // const [props, set] = useSpring(() => (
  //       { xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 }
  // }))

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
      window.removeEventListener("mousemove", setLeaveEvent);
    };
  }, []);
  // return position;


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


  return position;
}

// function useMousePosition(listen=true) {
//   let [ pos, setPos ] = useState({ x: 0, y: 0 })
//   useEffect(() => {
//     if (listen) {
//       let handler = event => {
//         setPos({ x: event.clientX, y: event.clientY })
//       }
//       window.addEventListener('mousemove', handler)
//       return () => {
//         window.removeEventListener('mousemove', handler)
//       }
//     }
//   }, [listen])
//   return pos
// }

// function MousePosition({ listen, children }) {
//   let pos = useMousePosition(listen)
//   return children(pos)
// }

function ScreenWidth ({ listen, children }) {
  const screenWidth: number = useScreenWidth();
  // console.log(screenWidth);
  return children(screenWidth);

};

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

function ScreenScroll ({ listen, children }) {
  const scroll: number = useScroll();
  console.log(scroll);
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

  render() {

    // console.log(this.state.Visible)
    return (
      <div className="container">
        <div>
          <ScreenWidth>
            {(position) =>
            <img src={paint} alt="paint" style={{top: 0, left: 0, position: 'absolute', height: '700px', width:'100%', transform: `perspective(600px) rotateX(${position.xys[0]/10}deg) rotateY(${position.xys[1]/10}deg) scale(${position.xys[2]})` }}
              // onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
              // onMouseLeave={() => set({ xys: [0, 0, 1] })}
            />
            }
          </ScreenWidth>
        </div>
        <div className="search">
            <Row>
            <AdvancedSearch/>

            <Col>

            <Row>
            <p className="welcome"> Welcome to </p>

            <p className="bloom"> Bloom </p>

            </Row>
            <p className="subtitle"> A platform that helps you find
            salons, beauty experts and stylists that are located near your house
            and will soon become your favorite salons. ETC ETC We can change that later. </p>

          </Col>
          </Row>

        </div>
        <div style={{position: 'absolute', height: '1000px', marginTop: '80px', alignItem: 'center'}}>

          <div className="type_container">
            <VizSensor
             onChange={(isVisible) => {
               this.setState({Visible: isVisible})
             }}
             active={!this.state.Visible}>

           <p style={{fontSize: 25, fontFamily: 'Bellota, cursive', fontWeight: 'bold'}}> At Bloom </p>
           </VizSensor>

           <div>
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
          </div>
        </div>

            <div className="cards">
              <Col>
                <Row>
                <Category style={{ marginLeft: -105}} img={hair} text={"Hair Salons"}/>
                <Category img={lipstics} text={"Makeup Artists"}/>
                <Category img={barber} text={"Barber Shops"}/>
                </Row>
                <Row>
                <Category style={{ marginLeft: -105}} img={nails} text={"Nail Salons"}/>
                <Category img={facials} text={"Facials"}/>
                <Category img={massage} text={"Spa"}/>
                </Row>
              </Col>
            </div>
          </div>

          <div className="salon_container" style={{width:'1500px', height: '800px', marginLeft: -200, marginTop: '1400px', backgroundColor: '#bdcddb'}}>
          <Row>
          <img src={paint_line} className="paint_line" alt="paint"/>
          <Col className="salon_text">
          <p className="header"> Are you a salon owner? </p>
          <p style={{fontSize: 20}}> Join our community by signing up your salon today! Join our community by signing up your salon today. Join our community by signing up your salon today.
          Join our community by signing up your salon today. Join our community by signing up your salon today. </p>
          </Col>
          <img src={salon} className="salon" alt="paint"/>
          </Row>
          </div>
      </div>
    );
  }
}

export default Homepage;
//
