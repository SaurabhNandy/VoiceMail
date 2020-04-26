<div align="center">
    <img src="src/assets/icon/favicon.png" width=200px height=200px/>
<br>
<br>

[![](https://img.shields.io/badge/Made_with-Ionic-blue?style=for-the-badge&logo=ionic&logoColor=white&)](https://ionicframework.com)
</div>

# VoiceMail
Voicemail is a mobile application, that serves as a voice based email client for the visually impaired and helps them in sending and receiving mails by the use of just voice and touch commands.


# Features
- Uses IVR(Interactive voice response) to communicate with the user.
- Sign-in to your email account.
- Send mails comprising of both html and text contents.
- Read inbox and display mails in a list.


# Working
- Uses client-server architecture to send and receive mails.
- The [mail-server](https://github.com/SaurabhNandy/Email-API) is a Flask application hosted on [Pythonanywhere](https://www.pythonanywhere.com) that uses python to access smtp and imap servers.
- Mobile app communucates with the server using http requests.


# Screenshots
<div align="center">
    <br> 
        <img src ="src/assets/screenshots/login.png" width=300px height=500px alt="login-ss">
    <br>
    <br> 
        <img src ="src/assets/screenshots/send.png" width=300px height=500px alt="send-ss">
    <br>
    <br> 
        <img src ="src/assets/screenshots/receive.png" width=300px height=500px alt="receive-ss">
    <br>
    <br> 
        <img src ="src/assets/screenshots/details.png" width=300px height=500px alt="details-ss">
    <br>
</div>


# TODOs
- [ ] Integrate Gmail api with the application
- [ ] Create different folders for received mails like sent, trash, etc.
- [ ] Add attachment support for mails.

<br>

---
[Downlad APK](https://drive.google.com/file/d/1r6QzpQO9srxdJ7rvyfD2IxwZNZbLZd0P/view?usp=sharing)

This project was developed as a part of our college course MCAN mini-project.
