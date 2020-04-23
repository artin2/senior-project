import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './DateSelection.css';
import { Form, Button } from 'react-bootstrap';


class DateSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      selectedTime: 540,
      storeHours: [{ day: 1, start_time: 540, end_time: 960 }, { day: 2, start_time: 540, end_time: 660 },
      { day: 3, start_time: 540, end_time: 1020 }, { day: 4, start_time: 540, end_time: 1020 }, { day: 5, start_time: 540, end_time: 1020 },
      { day: 6, start_time: 540, end_time: 1020 }, { day: 7, start_time: 540, end_time: 960 }, { day: 8, start_time: 540, end_time: 960 },
      { day: 9, start_time: 540, end_time: 1020 }, { day: 10, start_time: 540, end_time: 1020 }, { day: 11, start_time: 540, end_time: 1020 },
      { day: 12, start_time: 540, end_time: 1020 }, { day: 13, start_time: 540, end_time: 1020 }, { day: 14, start_time: 540, end_time: 960 },
      { day: 15, start_time: 540, end_time: 960 }, { day: 16, start_time: 540, end_time: 1020 }, { day: 17, start_time: 540, end_time: 1020 },
      { day: 18, start_time: 540, end_time: 1020 }, { day: 19, start_time: 540, end_time: 1020 }, { day: 20, start_time: 540, end_time: 1020 }, { day: 21, start_time: 540, end_time: 960 },
      { day: 22, start_time: 540, end_time: 960 }, { day: 23, start_time: 540, end_time: 1020 }, { day: 24, start_time: 540, end_time: 1020 },
      { day: 25, start_time: 540, end_time: 1020 }, { day: 26, start_time: 540, end_time: 1020 }, { day: 27, start_time: 540, end_time: 1020 },
      { day: 28, start_time: 540, end_time: 960 }, { day: 29, start_time: 540, end_time: 960 }, { day: 30, start_time: 540, end_time: 1020 }, { day: 31, start_time: 540, end_time: 1020 }
      ],
      workersSchedules: [{ worker_id: 1, schedule: [{ day: 19, booked_slots: [{ start_time: 0, end_time: 120 }], hours: { start_time: 540, end_time: 1020 } }] },
      {
        worker_id: 2, schedule: [{ day: 19, booked_slots: [{ start_time: 120, end_time: 240 }], hours: { start_time: 540, end_time: 1020 } },
        { day: 20, booked_slots: [{ start_time: 240, end_time: 360 }], hours: { start_time: 540, end_time: 1020 } }
        ]
      },
      ],
    };
  }

  handleDateChange = date => {
    this.setState({
      startDate: date
    });
  };

  handleSelectChange = (event) => {
    this.setState({
      selectedTime: parseInt(event.target.value)
    });
  };

  convertMinsToHrsMins(mins) {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    let am = false
    if (h == 24) {
      am = true
      h -= 12
    }
    else if (h < 12) {
      am = true
    } else if (h != 12) {
      h -= 12
    }
    h = h < 10 ? '0' + h : h;
    if(h == 0) {
      h = '12'
    }
    m = m < 10 ? '0' + m : m;
    if (am) {
      return `${h}:${m}am`;
    } else {
      return `${h}:${m}pm`;
    }

  }

  render() {
    const CreateTimeSelects = (props) => {
      let items = [];
      for (let i = this.state.storeHours[this.state.startDate.getDate() - 1].start_time; i + this.props.time <= this.state.storeHours[this.state.startDate.getDate() - 1].end_time; i += 60) {
        items.push(<option key={i} value={i}>{this.convertMinsToHrsMins(i)}</option>);
      }
      return items;
    }

    const SlotsAtSelectedTime = () => {
      // console.log('here')
      // console.log(this.state.selectedTime)
      let slots = []
      let schedules = []
      for(let i = this.state.selectedTime; (i < this.state.selectedTime + 120 && i + this.props.time <= this.state.storeHours[this.state.startDate.getDate()-1].end_time); i += 15) {
        let currTime = i
        let foundSchedule = false
        let currSchedule = []
        // console.log(this.props.selectedServices)
        for(let j = 0; j < this.props.selectedServices.length; j++) {
          let currService = this.props.selectedServices[j]
          let foundSlot = false
          // console.log('schedules look like')
          // console.log(this.state.workersSchedules)
          for(let k = 0; k < this.state.workersSchedules.length; k++) {
            let available = false
            let currWorker = this.state.workersSchedules[k].worker_id
            for(let l = 0; l < this.state.workersSchedules[k].schedule.length; l++) {
              let currDaySchedule = this.state.workersSchedules[k].schedule[l]
              // console.log('currDaySchedule is: ', currDaySchedule.day)
              // console.log('startDate is: ', this.state.startDate.getDate())
              if(currDaySchedule.day == this.state.startDate.getDate()) {
                for(let m = 0; m < currDaySchedule.booked_slots.length; m++) {
                  let currBookedSlotStartTime = currDaySchedule.booked_slots[m].start_time + currDaySchedule.hours.start_time
                  let currBookedSlotEndTime = currDaySchedule.booked_slots[m].end_time + currDaySchedule.hours.start_time
                  // console.log('CurrWorker', currWorker)
                  // console.log('CurrTime', currTime)
                  // console.log('currBookedSlotStartTime', currBookedSlotStartTime)
                  // console.log('currBookedSlotEndTime', currBookedSlotEndTime)
                  // console.log('CurrDaySchedule booked from: ', currBookedSlotStartTime, ' to: ', currBookedSlotEndTime)
                  if((currTime >= currBookedSlotStartTime && currTime <= currBookedSlotEndTime) || (currTime + currService.duration >= currBookedSlotStartTime && currTime + currService.duration <= currBookedSlotEndTime)) {
                    // console.log('Unavailable')
                    break
                  } else {
                    available = true
                  }
                }
                // console.log('out innest loop')
                if(available) {
                  // console.log("&&&&&&&&&&&&&&&&&")
                  currSchedule.push({worker_id: currWorker, service_id: currService.service_id, start_time: currTime, end_time: currTime+currService.duration, price: currService.cost, date: this.state.startDate})
                  currTime += currService.duration
                }
                break
                
              }
            }
            if(available) {
              foundSlot = true
              break
            }
          }
          if(foundSlot) {
            foundSchedule = true
            break
          }
        }
        if(foundSchedule) {
          // console.log('pushing schedule: ', currSchedule)
          schedules.push(currSchedule)
          slots.push(<Button className="mt-3 mx-2" key={i}>{this.convertMinsToHrsMins(i)}</Button>)
        }
      }
      if(slots.length == 0) {
        return <h1>No available appointments</h1>
      }
      // console.log('returning slots')
      // console.log('                 ')
      // console.log('                 ')
      // console.log('                 ')
      // console.log('                 ')
      // console.log('                 ')
      return slots
    }

    return (
      <Card
        text='dark'
        className='mt-0 py-3'
      >
        <h3>Select Appointment Time</h3>
        <Card.Body className='pt-0'>
          <Row className='justify-content-center'>
          <Col xs="11" md="6" className="mt-3">
              <div className="customDatePickerWidth">
              <DatePicker
                className="form-control"
                selected={this.state.startDate}
                onChange={this.handleDateChange}
                minDate={new Date()}
              />
              </div>
            </Col>
            <Col xs="11" md="6" className="mt-3">
              <Form>
                  <Form.Control as="select" value={this.state.selectedTime} onChange={this.handleSelectChange.bind(this)}>
                    <CreateTimeSelects date={this.state.startDate} />
                  </Form.Control>
              </Form>
            </Col>
          </Row>
          <Row className="justify-content-center text-xs-center text-sm-left pl-2">
            <Col xs="12" md="11" className="px-1">
              {/* Maybe want to have this with multiple rows, each row belongs to technician. One last row is technician mix to make the appointment work out */}
              <SlotsAtSelectedTime />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default DateSelection;