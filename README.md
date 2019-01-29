Schedule Pointe to Google Calendar
==================================

A Google Apps Script that searches Gmail's Inbox for emails sent by Schedule Pointe Inc. and creates events on Google Calendar.

## Usage

  * Adding this script to your Google Drive:
    * Open Google Apps Script editor (http://script.google.com)
    * Close the dialogue
    * Copy contents of [Code.gs](https://raw.githubusercontent.com/haoyuc1/Schedule-Pointe-to-Google-Calendar/master/Code.gs) and overwrite all contents in code editor
    * IMPORTANT!!!  Change the timezone to your own (it's on line 2 - var TimeZone='PST';)  IMPORTANT !!!
    * (Optional) Enter an address for the events created (it's on line 3 - var Location = 'Your location';)
    * File -> Save
    
  * Running the script:
    - Resources -> Current project's triggers
    - Select the following options: SchedulePointe2GCalender, Time-driven, Minutes Timer, 5 minutes
    - Click on the link "notifications" (it's under the trigger otpions)
    - Select a notification to be delivered to your email in case something goes wrong with the script,
      set it to be sent while you are still awake, so you won't miss any flight.
    - You'll need to run the script manually one time. That's because the first time it runs it will require you to authorize it.
    - Select Run -> SchedulePointe2GCalender
    - Authorize it, and run it again just to make sure.


## CONTRIBUTORS

* Haoyu Chen - [Github](//github.com/haoyuc1)

## REFERENCE

[igorpeixoto/Schedule-Pointe-to-Google-Calendar](https://github.com/igorpeixoto/Schedule-Pointe-to-Google-Calendar/)

## LICENSE

[MIT]()