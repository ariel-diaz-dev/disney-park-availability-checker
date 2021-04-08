var request = require('request');
var nodemailer = require('nodemailer');

//CONFIGS
const FROM_DATE = "2021-05-19";
const TO_DATE = "2021-05-21";
const NOTIFY_AVAILABILITY = false;
const TO_EMAILS = "";
const EMAIL_USERNAME = "";
const EMAIL_PASSWORD = "";

//Parks
const MAGIC_KINGDOM = "80007944";
const EPCOT = "80007838";
const ANIMAL_KINGDOM = "80007823";
const HOLLYWOOD_STUDIOS = "80007998";

//Availability
const PARTIAL = "partial";
const NONE = "none";
const FULL = "full";

var notifyAvailability = function(calendar){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USERNAME,
            pass: EMAIL_PASSWORD
        }
    });
    var mailOptions = {
      from: EMAIL_USERNAME,
      to: TO_EMAILS,
      subject: 'A Disney park has become available!',
      text: JSON.stringify(calendar)
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

var options = {
    port: 443,
    uri: 'https://disneyworld.disney.go.com/availability-calendar/api/calendar?segment=tickets&startDate=' + FROM_DATE + '&endDate=' + TO_DATE,
    method: 'GET',
    json: true
}

request(options, function (error, response, body) {
    if (error) {
        console.log(error);
    }
    else {
        var calendarDate = body;
        calendarDate.forEach((date) => {
            if (date.availability !== NONE) {
                var parks = date.parks.map(parkId => getParkNameById(parkId));
                date.parks = parks;
                console.log("AVAILABLE DATE:", date);
                if(NOTIFY_AVAILABILITY){
                    notifyAvailability(date);
                }
            }
        });
    }
});

var getParkNameById = function (parkId) {
    var parkName = parkId;
    switch (parkId) {
        case MAGIC_KINGDOM:
            parkName = "Magic Kingdom";
            break;
        case EPCOT:
            parkName = "Epcot";
            break;
        case ANIMAL_KINGDOM:
            parkName = "Animal Kingdom";
            break;
        case HOLLYWOOD_STUDIOS:
            parkName = "Hollywood Studios";
            break;
        default:
            break;
    }
    return parkName;
}

