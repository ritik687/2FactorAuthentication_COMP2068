# Two Factor Authentication 

First, start with the basic code that is in the directory basicCode at the link: https://github.com/ritik687/2FactorAuthentication_COMP2068.git. 
Final application that is completely set-up is the demoFinalCode directory in the same link. In the demoFinalCode, 2FA is implemented that is basically time based OTP(one time password) using google authenticator app with qr codes.



## finalCode: 
This is final code that is working and implementing the 2FA. 
You can view the complete video at this link (https://www.youtube.com/playlist?list=PLlcX_CytElF8Cj8oqN8BazHKLI9jam9Sb) in order to test 2FA on your own. Hopefully, this will help you out.

## basicCode: 
The initial structure includes a foundational Express project integrated with Handlebars templating and featuring a straightforward login function. The primary authentication aspect begins with a basic login mechanism. 
Additionally, if you wish to create an Express project with Handlebars templating entirely from the beginning, you can follow the subsequent steps:

### Setup Project:
Set up a fresh directory for your project.
Access this project directory using VS Code.
Launch the terminal and navigate to your project's location.

### Install Dependencies:
Run npm init to set up your project (if you haven't already).
Install required packages:
npm i -g express
npm install mongoose passport passport-local passport-local-mongoose express-session

### Generate Express App:
Run: npx express-generator --view=hbs
Confirm with 'y' to continue.


### File Structure:
Establish a 'config' directory at the project's core and introduce a 'globals.js' file within it.
Generate a 'models' directory at the project's main level and include a 'user.js' file inside it.
Remove the 'users.js' file located in the 'routes' directory.
Within the 'views' directory, append 'login.hbs', 'loggedIn.hbs', 'registered.hbs', and 'register.hbs' files.



### Update app.js:  
At the beginning, bring in the necessary modules.
Set up the MongoDB connection by importing and utilizing the connection string from `config/globals.js`.
Commence Passport initialization and configure the session cookie.
Establish the Passport Strategy and Serialization for the User.


### User Model:
Within models/user.js, import both mongoose and passport-local-mongoose libraries.
Create a user schema that encompasses fields such as username, password, and created.
Integrate passport-local-mongoose as a plugin, then export the schema as the User model.


### Views:
Within views/login.hbs, craft a login form featuring inputs for username and password, along with a dedicated login button.
In views/register.hbs, construct a registration form comprising inputs for username, password, and confirm password, accompanied by a designated register button.
Feel free to apply your preferred styling to enhance the visual appeal of the views.


### Routes:
#### In routes/index.js:
Develop a middleware function named IsLoggedIn to verify user authentication.

Incorporate routes to manage the following tasks:

Managing both GET and POST requests for /login.
Handling both GET and POST requests for /register.
Addressing GET requests for /loggedIn.
Handling GET requests for /logout.
Responding to GET requests for /registered.








