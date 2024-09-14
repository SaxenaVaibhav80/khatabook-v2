document.getElementById('whatsapp-share').addEventListener('click', function() {
    const title = this.getAttribute('data-title');
    const date = this.getAttribute('data-date');
    const data = this.getAttribute('data-data');
    const message = `Check out my khata:\nTitle: ${title}\nDate: ${date}\nData: ${data}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
});


// this refers to the element that triggered the event (the button in this case).
// getAttribute('data-title') retrieves the value of the data-title attribute from the button. Similarly, data-date and data-data are retrieved in the next lines.

document.getElementById('sms-share').addEventListener('click', function() {
    const title = this.getAttribute('data-title');
    const date = this.getAttribute('data-date');
    const data = this.getAttribute('data-data');
    const message = `Check out my khata:\nTitle: ${title}\nDate: ${date}\nData: ${data}`;
    const smsURL = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsURL, '_blank');
});

// sms: Scheme: This URL scheme is used to trigger the default SMS application on a device.
// ?body= Parameter: Specifically, body is a query parameter that pre-fills the message body in the SMS application.

// encodeURIComponent(message) ensures that any special characters in the message (such as spaces, question marks, and ampersands) are properly encoded so that the URL remains valid.
// like that--->

// sms:?body=Check%20out%20my%20khata%3A%0ATitle%3A%20My%20Title%0ADate%3A%202024-09-14%0AData%3A%20My%20data


// ------------------------------------- important question-------------------------------------->

// --------------------------------------------------ques1------------------------------>

// ques1->
// const whatsappURL = https://wa.me/?text=${encodeURIComponent(message)};
// we use this for whatsapp and use

// const smsURL = sms:?body=${encodeURIComponent(message)};
// for sms why?

// answer-->
// The URLs for WhatsApp and SMS use different formats and schemes because each platform has its own way of handling URLs and query parameters. Here's why the formats differ:

// WhatsApp URL->
// Format: https://wa.me/?text=${encodeURIComponent(message)}
// Scheme: https
// Domain: wa.me
// Path: /
// Query Parameter: text=${encodeURIComponent(message)}
// Why This Format?
// WhatsApp Web: The wa.me domain is a service provided by WhatsApp for linking directly to their web-based messaging interface.
// Query Parameter: text is used to pre-fill the message body in WhatsApp. encodeURIComponent(message) ensures that the message is properly encoded for URL use, handling special characters and spaces.


// SMS URL->
// Format: sms:?body=${encodeURIComponent(message)}
// Scheme: sms
// Domain: (Not used, as sms is a URL scheme rather than a web address)
// Query Parameter: body=${encodeURIComponent(message)}
// Why This Format?
// SMS Applications: The sms URL scheme is used to trigger the default SMS application on a device.
// Query Parameter: body is used to pre-fill the content of the SMS message. Again, encodeURIComponent(message) ensures that special characters in the message are properly encoded.

// Key Differences
// Platform Integration: wa.me is designed specifically for WhatsApp's web and mobile platforms, while sms is a more generic scheme used by SMS applications on various devices.
// URL Scheme vs. Web Address: sms is not a web address but a URL scheme that interfaces directly with SMS apps. wa.me is a web address that integrates with WhatsApp's web service.

// ----------------------------------ques 2--------------------------------->>


// ques2--> what is url schemes?
// answer-->
// URL schemes are a way of specifying the protocol used to access a particular resource or service. They determine how an application should interpret the URL and what action to take. URL schemes are a crucial part of both web and native app development.