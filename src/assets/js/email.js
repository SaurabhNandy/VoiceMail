import {email} from emailjs;

var authenticateMail = function(host, domain, username, password){
    //var email 	= require("emailjs/email");
    var server 	= email.server.connect({
    user:    username, 
    password: password, 
    host:    "smtp."+host+"."+domain, 
    ssl:     true
    });
}


var sendMail = function(){
    console.log('sending');
    //var email 	= require("emailjs/email");
    var server 	= email.server.connect({
    user: "saurabhnandy038@gmail.com", 
    password: "", 
    host:    "smtp.gmail.com", 
    ssl:     true
    });
    server.send({
        text:    "i hope this works", 
        from:    "saurabhnandy038@gmail.com", 
        to:      "saurabhnandy038@gmail.com",
        subject: "testing emailjs"
     }, function(err, message) { console.log(err || message); });
}

// export { authenticateMail, sendMail };
