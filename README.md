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
    - Edit(Second tab at upper left) -> Current project's triggers
    - Select the following options: SchedulePointe2GCalender, Time-driven, Minutes Timer, 5 minutes
    - Click on the link "notifications" (it's under the trigger otpions)
    - Select a notification to be delivered to your email in case something goes wrong with the script,
      set it to be sent while you are still awake, so you won't miss any flight.
    - You'll need to run the script manually one time. That's because the first time it runs it will require you to authorize it.
    - Select Run -> SchedulePointe2GCalender
    - Authorize it, and run it again just to make sure.

## Additional Information

* This Script only search unread email to creates events, and then mark those email as read to avoid process them again. So, please keep schedule email unread, otherwise, you will need to create them on Calendar manually. However, you can still use filter to move these email to any other folders. Just leave schedule emails there, script will do everything for you like a secretary

## Next steps

* Use Gmail API feature to create webhook which can notify app when mailbox have new change to avoid polling every 5 mins.

* App can directly schedule new event for schedule pointe on Calendar.

* App can show whole time slot of schedule pointe to help pick a available time.



## CONTRIBUTORS

* Haoyu Chen - [Github](//github.com/haoyuc1)

## REFERENCE

* Following project give me ideas about how to build this program. However, all of code is done by myself.

[igorpeixoto/Schedule-Pointe-to-Google-Calendar](https://github.com/igorpeixoto/Schedule-Pointe-to-Google-Calendar/)

## LICENSE

[MIT](https://raw.githubusercontent.com/haoyuc1/Schedule-Pointe-to-Google-Calendar/master/LICENSE)