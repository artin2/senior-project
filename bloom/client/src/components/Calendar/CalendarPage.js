import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './CalendarPage.css';
import { Scheduler, DateNavigator,TodayButton, DayView, WeekView, MonthView, Appointments, ViewSwitcher, Toolbar, EditingState, DragDropProvider} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState,  } from '@devexpress/dx-react-scheduler';
import 'react-calendar/dist/Calendar.css';
import Paper from '@material-ui/core/Paper';
const today = new Date();


const isWeekEnd = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

const Root = ({
  children, style, ...restProps
}) => (
  <div
    {...restProps}
    style={{
      ...style,
      width: '1000px',
    }}
  >
    {children}
  </div>
);

const DayScaleCell = ({
  startDate, classes, ...restProps
}: DayScaleCellProps) => (
  <MonthView.DayScaleCell
    // className={classNames({
    //   [classes.weekEndDayScaleCell]: isWeekEnd(startDate),
    // })}
    className={isWeekEnd(startDate) ? 'weekend' : null}

    // style={isWeekEnd(startDate) ? 'background-color: grey' : 'background-color: white'}
    startDate={startDate}
    {...restProps}
  />
);

const TimeTableCell = (
  { startDate, classes, ...restProps }: TimeTableCellProps,
) => (
  <MonthView.TimeTableCell
    className={isWeekEnd(startDate) ? 'weekend' : null}

    startDate={startDate}
    {...restProps}
  />
);

const Appointment = ({
  children, style, ...restProps
}) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: '#597096',
      borderRadius: '25px',
    }}
  >
    {children}
  </Appointments.Appointment>
);

class Calendar extends React.Component {
  constructor(props) {
    super(props);
       this.state = {
         currentDate: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
       }
  }




  render() {
    console.log(this.state.currentDate);
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col>
            <p className="title">~ Manage Your Appointments ~</p>
           <Paper className="react-calendar">
          <Scheduler
            data={[
              { startDate: '2020-03-13 10:00', endDate: '2020-03-13 11:00', title: 'Manicure' },
              { startDate: '2020-03-13 09:00', endDate: '2020-03-13 11:00', title: 'Hair Blowout' },
            ]}

          >
          <ViewState
            defaultCurrentDate={this.state.currentDate}

          />

            <WeekView
             startDayHour={8}
             endDayHour={24}
             cellDuration={60}
           />
           <MonthView
             dayScaleCellComponent={DayScaleCell}
             timeTableCellComponent={TimeTableCell}
          />
          <DayView
            startDayHour={8}
            endDayHour={24}
            cellDuration={60}
          />
            <Toolbar />
            <ViewSwitcher />
            <DateNavigator/>
            <TodayButton />
            <Appointments
            appointmentComponent={Appointment}/>
          </Scheduler>
          </Paper>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Calendar;
