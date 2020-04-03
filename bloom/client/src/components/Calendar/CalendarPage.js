import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './CalendarPage.css';
import {  Resources, ConfirmationDialog, Scheduler, AppointmentForm, AppointmentTooltip, DateNavigator,TodayButton, DayView, WeekView, MonthView, Appointments, ViewSwitcher, Toolbar,  DragDropProvider} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import 'react-calendar/dist/Calendar.css';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
const recurringIcon = () => <div />

const BasicLayout = ({ appointmentData,
   ...restProps }) => {

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      {...restProps}
    >

    </AppointmentForm.BasicLayout>
  );
};

const messages = {
  allDayLabel : '',
  repeatLabel : ''
}

const BooleanEditor = ({
...restProps }) => {
  // eslint-disable-next-line react/destructuring-assignment
  // console.log(restProps);

return null;
  // if (restProps.type === 'endRepeat') {
  //   console.log("BO");
  //   return null;
  //
  // } else {console.log("HELO"); return <AppointmentForm.WeeklyRecurrenceSelectorComponent readOnly={true} {...restProps} />};
};

const ResourceSwitcher = ({ styles,
    mainResourceName, onChange, classes, resources,
  }) => (
    <div >
      <Row className="justify-content-center text-xs-center text-sm-left pl-2">
      <p style={{fontSize: 20, marginRight:10, marginTop:2}}>
        Filter By:
      </p>
      <Select
        value={mainResourceName}
        onChange={e => onChange(e.target.value)}
        style={{paddingLeft: 60, height: 35}}
      >
        {resources.map(resource => (
          <MenuItem key={resource.fieldName} value={resource.fieldName}>
            {resource.title}
          </MenuItem>
        ))}
      </Select>
      </Row>
    </div>

  );


const RecurrenceLayout = ({
  appointmentData,
  visible,
  ...restProps }) => {

  return  (
    <AppointmentForm.RecurrenceLayout
      appointmentData={appointmentData}
      visible={false}
      {...restProps}
    >

    </AppointmentForm.RecurrenceLayout>
  );

};

const Appointment = ({
  children, style,
  ...restProps
}) => {
  // console.log(restProps);
  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: '#597096',
        borderRadius: '5px',

      }}

    >
      {children}
    </Appointments.Appointment>
  );
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
       this.state = {
         appointments: [
           { id: '0', startDate: '2020-04-13 10:00', endDate: '2020-04-13 11:00', title: 'Manicure', members: [2],
           service: 'Manicure'},
           { id: '1', startDate: '2020-04-3 09:00', endDate: '2020-04-3 11:00', title: 'Hair Blowout', members: [0, 1],
           service: 'Haircut' },
         ],
         mainResourceName: 'workers',
          resources: [
            {
              fieldName: 'service',
              title: 'Services',
              allowMultiple: true,
              instances: [
                { id: '1', text: 'Haircut' },
                { id: '2', text: 'Manicure' },

              ],
            },
            {
              fieldName: 'members',
              title: 'Members',
              // allowMultiple: true,
              instances: [
                { id: 0, text: 'Artin Kasumyan' },
                { id: 1, text: 'Arthur Kasumyan' },
                { id: 2, text: 'Roula Sharqawe' },
              ],
            },
          ],
         currentDate: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
       }
       this.commitChanges = this.commitChanges.bind(this);
       this.changeMainResource = this.changeMainResource.bind(this);
  }

  changeMainResource(mainResourceName) {
    this.setState({ mainResourceName });
  }


  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { appointments } = state;
      if (added) {
        const startingAddedId = appointments.length > 0 ? appointments[appointments.length - 1].id + 1 : 0;
        appointments = [...appointments, { id: startingAddedId, ...added }];
      }
      if (changed) {
        appointments = appointments.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        appointments = appointments.filter(appointment => appointment.id !== deleted);
      }
      return { appointments };
    });
  }



  render() {
    console.log(this.state.currentDate);
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col>
            <p className="title"> Manage Your Appointments </p>
            <ResourceSwitcher
             resources={this.state.resources}
             mainResourceName={this.state.mainResourceName}
             onChange={this.changeMainResource}
           />
           <Paper className="react-calendar">
          <Scheduler
            data={this.state.appointments}

          >
          <ViewState
            defaultCurrentDate={this.state.currentDate}

          />
          <EditingState
           onCommitChanges={this.commitChanges}
         />
         <IntegratedEditing />

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
            <ConfirmationDialog />
            <Appointments
            appointmentComponent={Appointment}/>
            <AppointmentTooltip
            showCloseButton
            showOpenButton/>
            <AppointmentForm
            isRecurrence={false}
            basicLayoutComponent={BasicLayout}
            recurrenceLayoutComponent={RecurrenceLayout}
            // textEditorComponent={TextEditor}
            messages={messages}
            booleanEditorComponent={BooleanEditor}
            />
            <Resources
              data={this.state.resources}
              mainResourceName={this.state.mainResourceName}
              />
            <DragDropProvider/>
          </Scheduler>
          </Paper>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Calendar;
