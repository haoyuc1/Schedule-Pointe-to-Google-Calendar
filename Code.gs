var FromMatch = "postmaster@mail.schedulepointe.com";
var TimeZone='PST';
var Location = 'Your location';
var calender = CalendarApp.getDefaultCalendar(); //Change this if you have specific calendar to save your schedule

function sched(start, end, instructor, resource, createdate, id) {
  this.start = start;
  this.end = end;
  this.instructor = instructor;
  this.resource = resource;
  this.createdate = createdate;
  this.id = id;
}

function MessageClean(message) {  //Check if message format valid for schedule, then clean data for processing.
  var From = message.getFrom();
  var ReceivingDate = message.getDate();
  var HtmlBody = message.getBody();
  var StartMatch = /Start Date: ((?:0|1)\d\/[0-3]\d\/(?:1|2)\d{3}) at ((?:0|1)\d:[0-5]\d (?:A|P)M)/;
  var Start = HtmlBody.match(StartMatch);
  var EndMatch = /End Date: ((?:0|1)\d\/[0-3]\d\/(?:1|2)\d{3}) at ((?:0|1)\d:[0-5]\d (?:A|P)M)/;
  var End = HtmlBody.match(EndMatch);
  var InstructorMatch = /Instructor: ((?:\w+|,| )*)/;
  var Instructor = HtmlBody.match(InstructorMatch);
  var ResourceMatch = /Resource: ((?:\w+| )*)/;
  var Resource = HtmlBody.match(ResourceMatch);
  try{
    if (From === FromMatch && Start != null && End != null && Instructor != null && Resource != null){
      Start = Start[1]+" "+Start[2]+" "+TimeZone;
      Start = new Date(Start);
      End = End[1]+" "+End[2]+" "+TimeZone;
      End = new Date(End);
      Instructor = Instructor[1];
      Resource = Resource[1];
      return new sched(Start,End,Instructor,Resource, ReceivingDate, message.getId());
    } else {
      throw "Messages Not Valid for Schedule";
    }
  } catch(e) {
    Logger.log(e);
    return null;
  }
}

function IfEventScheduled(schedule) {
  var events = calender.getEvents(schedule.start, schedule.end,
                                  {search: 'FLIGHT '+schedule.id});
  if (events != null && events.length != 0){
    if (events.length > 1){
      throw "There are some duplicated schedules, Plesae check and fix it at Start time: "+schedule.start+" to End time: "+schedule.end+".";
    } else {
      return events[0];
    }
  } else {
    events = calender.getEvents(schedule.start, schedule.end,
                                  {search: 'FLIGHT '});
    if (events != null && events.length != 0){
      if (events.length > 1){
        throw "There are some duplicated schedules, Plesae check and fix it at Start time: "+schedule.start+" to End time: "+schedule.end+".";
      } else {
        var event = events[0];
        if (event.getStartTime().toString() === new Date(schedule.start).toString() && event.getEndTime().toString() === new Date(schedule.end).toString()){
          return event;
        } else {
          throw "Here maybe something wrong. App got some duplicate events. Please Check it at Start time: "+schedule.start+" to End time: "+schedule.end+".";
        }
      }
    }
  }
  return false;
}

function IfNewer(schedule) {
  var event = IfEventScheduled(schedule);
  if(event != false && event != null){
    var MsgIdRe = /^FLIGHT (\w+)$/;
    var EMsgId = event.getTitle().match(MsgIdRe);
    if (EMsgId[1] != null){
      var eventmessage = GmailApp.getMessageById(EMsgId[1]);
      var currentmessage = GmailApp.getMessageById(schedule.id);
      if(currentmessage.getDate().getTime() > eventmessage.getDate().getTime()){
        return event;
      }
    } else {
      throw "Cannot get message id from event";
    }
  }
  return false;
}

function AddToCalender(message) {
  var schedule = null;
  try{
    schedule = MessageClean(message);
  }catch(e){
    Logger.log(e);
  }
  try{
    if (!IfEventScheduled(schedule) && schedule != null){
      //Add Event to Calender
      var event = CalendarApp.getDefaultCalendar().createEvent('FLIGHT '+ schedule.id, new Date(schedule.start), new Date(schedule.end));
      event.setLocation(Location);
      event.setDescription("Instructor: " + schedule.instructor + "\nResource: " + schedule.resource);
      event.removeAllReminders();
      event.addPopupReminder(180);// 3 hours reminder
      event.addSmsReminder(180); // 3 hours reminder
      message.markRead();
      Logger.log("Schedule Event: " + event.getId() + "\nStart: "+event.getStartTime().toString()+"\nEnd: "+event.getEndTime().toString()+"\nDescription: "+event.getDescription());
      return event.getId();
    } else {
      message.markRead();
      throw new Error("Event have been scheduled or No Schedule Information.");
    }
  }catch(e){
    Logger.log(e);
    return null;
  }
}

function DeleteMessageFromCalender(message) {
  var schedule = MessageClean(message);
  var event = IfNewer(schedule);
  if(event) {
    Logger.log("Cancel Event: " + event.getId() + "\nStart: "+event.getStartTime().toString()+"\nEnd: "+event.getEndTime().toString()+"\nDescription: "+event.getDescription());
    Logger.log("According to message: "+message.getId()+"\nSubject: "+message.getSubject()+"\nBody: \n"+message.getPlainBody());
    event.deleteEvent(); //Delete the schedule from this message
    message.markRead();
    return;
  }
  message.markRead();
  Logger.log("Message is old or broken, don't need to execute");
  return;
}

//Add Schedule to Calender
function ScheduleAppointment(thread) {
  var messages = thread.getMessages(); // Get all message in thread
  if (messages.length != 1) {//If length != 1 
    messages.sort(function(a,b){return a.getDate().getTime() - b.getDate().getTime()}); //Sort message in order of getting date
    for (var j=0; j< messages.length-1; j++){
      DeleteMessageFromCalender(messages[j]);  //Deleted all schedule from message in thread except last message
    }
  }
  try{
    AddToCalender(messages[messages.length-1]);  //Schedule last message in thread if not scheduled.
  } catch(e){
    Logger.log(e);
  }
  return;
}

function ScheduleListOfAppointment(threads) {
  threads.sort(function(a,b){return a.getLastMessageDate().getTime() - b.getLastMessageDate().getTime()});
  for (var i = 0 ; i < threads.length; i++) {
    ScheduleAppointment(threads[i]);
  }
  return;
}

function CancelAppointment(thread) {
  //Delete the schedule from this thread, I don't know if cancel a schedule will have multiple-messages inside. So, I just leave it here.
  return;
}

function CancelListOfAppointment(threads) {
  threads.sort(function(a,b){return a.getLastMessageDate().getTime() - b.getLastMessageDate().getTime()});
  for (var i = 0 ; i < threads.length; i++) {
    DeleteMessageFromCalender(threads[i].getMessages()[0]);
  }
  return;
}

function SchedulePointe2GCalender() {
  var schdulthreads = GmailApp.search('from:postmaster@mail.schedulepointe.com subject:scheduled label:unread');
  ScheduleListOfAppointment(schdulthreads);
  var cnclthreads = GmailApp.search('from:postmaster@mail.schedulepointe.com subject:canceled label:unread');
  CancelListOfAppointment(cnclthreads);
  return;
}

