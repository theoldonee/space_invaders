import { UserManager } from "./userManager.js";

if (typeof(Storage) == "undefined") {
    alert("Sorry! No Web Storage support..");
} 

var registeredUsers;
var displayContent;
var displayErrorMsg;

window.onload = function (){

    var params = window.location.search.split("?")[1];
    displayContent = params.split("$")[0];
    displayErrorMsg = params.split("$")[1];
    serveForm();

    // Displays error message
    if (displayErrorMsg){
        document.getElementById("error_message").style.display = "inline";
    };

    // Checks if registeredUsers exist as a property of local storage
    if (localStorage.registeredUsers){
        // RegisteredUsers = JSON.parse(localStorage.registeredUsers);
        registeredUsers = UserManager.getAllUsers();
    }else{
        registeredUsers = [];
    }
    document.getElementById("register").addEventListener("click", ()=> {
        redirect('register',false);
    });

    document.getElementById("login").addEventListener("click", ()=> {
        redirect('login',false);
    });

    document.getElementById("submit").addEventListener("click", () => {
        checkValues();
    });

    if (displayContent == "register"){
        document.getElementById("male").addEventListener("click", () => {
            toggle("male");
        });
    
        document.getElementById("female").addEventListener("click", () => {
            toggle("female");
        });
    
        document.getElementById("other").addEventListener("click", () => {
            toggle("other");
        });
    }
    
};

// Redirects user to form page
function redirect(displayContent, message){
    // Checks if error message should be displayed
    if (message){
        window.location.href = `form.html?${displayContent}$${message}`;
    }else{
        window.location.href = `form.html?${displayContent}`;
    }
    
}


var formSection = document.getElementById("section_1");
var gender, userName, email, password, dob;

// Checks if user and password filled isn't empty
function checkEmailAndPassword(){
    if (!UserManager.isEmail(email)) {
        
        alert("Email not valid");
        return false;
         
    }else if (!password) {
        return false;
    }
    else{
        return true;
    }
}

// Checks if all feilds are filled
function checkValues(){
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    
    // Checks if register page is being displayed
    if (displayContent == "register"){
        userName = document.getElementById("name").value;
        dob = document.getElementById("DOB").value;

        if (!checkEmailAndPassword()){
            alert("Username or password field not filled with valid data");
        }else if(!userName){
            alert("Name is required");
        }
        else if (!dob) {
            alert("Date of Birth is required");
        }
        else if (!gender) {
            alert("Gender is required");
        }
        else{
            register();
        };

    }else{

        if (!checkEmailAndPassword()){
            alert("Username or password field not filled");
        }
        else{
            login();
        };
        
    }   
}

var user;
// Creates a user
function createUser(){
    user = {
        username: userName,
        password: password,
        email: email,
        DOB: dob,
        gender: gender,
        highscore: 0,
        enemiesKilled: 0,
        playTime: 0,
        bulletsFired: 0,
    };

    registeredUsers.push(user);
    UserManager.updateRegisteredUsers(registeredUsers);
}

// Registers a user
function register(){
    // Checks if users exist
    if (registeredUsers.length != 0){
        // Redirects to login page if user exist
        if (UserManager.isUser(email)){
            redirect("login", true)
        }
        else{
            // Creates user if user does not exist
            createUser();
            window.location.href = `game.html?${user.email}`;
        }
    }else{
        // Creates user if no users exist
        createUser();
        window.location.href = `game.html?${user.email}`;
    }

    clear();  
}

// Logs in a user
function login(){
    // Checks if users exist
    if (registeredUsers.length != 0){
        // Cheks if user exist
        if (UserManager.isUser(email)){
            // Checks if the password is correct
            var user = UserManager.getUser(email);
            if (password == user.password){
                window.location.href = `game.html?${user.email}`;
            }else{
                // Displays error message if password is wrong
                document.getElementById("error_message").innerHTML = "Password incorrect";
                document.getElementById("error_message").style.display = "inline";
            }
        }
        else{
            // Redirects to register page if user doesn't exist
            redirect("register", true);
        }
    }else{
        // Redirects to register page if no user exist in local storage
        redirect("register", true);
    }

    clear();  
}

// A function that only makes the button clicked yellow.
function toggle(button_id){
    var genderDivChilderen = document.getElementById("gender_div").children;
    // Makes button white if its not the right button
    for(let i = 0; i < genderDivChilderen.length; i++){
        if(genderDivChilderen[i].id != button_id){
            genderDivChilderen[i].style.backgroundColor = "white";
        }
        else{
            // Makes button yellow if its the right button
            genderDivChilderen[i].style.backgroundColor = "yellow";
            gender = genderDivChilderen[i].id;
        }
    }

}

// Clears variables
function clear(){
    userName = null;
    email = null;
    password = null; 
    dob = null;
    gender = null;
}

// A function to display form on webpage
function serveForm(){

    if (displayContent == "register"){
        formSection.innerHTML = `
            <div class="section_div">
                <h2>SPACE INVADERS</h2>
                <h3 style="color: red; display: none;" id="error_message">Your account does not exist, please register</h3>
                <div class="form_div">
                    
                    <div class="form">
                        <p>REGISTER</p>
                        <div class="input_div">
                            <i class="fa-solid fa-user"></i>
                            <input type="text" placeholder="Name" id="name">
                        </div>
                        <div class="input_div">
                            <i class="fa-solid fa-envelope"></i>
                            <input type="email" placeholder="Email" id="email">
                        </div>
                        <div class="input_div">
                            <i class="fa-solid fa-lock"></i>
                            <input type="text" placeholder="Password" id="password">
                        </div>

                        <div class="input_div">
                            <i class="fa-solid fa-calendar-days"></i>
                            <input type="date" placeholder="Date Of Birth" id="DOB">
                        </div>
                        
                        
                        <div class="input_div">
                            <i class="fa-solid fa-venus-mars"></i>
                            <div id="gender_div">
                                <button id="male">Male</button>
                                <button id="female">Female</button>
                                <button id="other">Other</button>
                            </div>
                            
                        </div>
                        
                        <button  id="submit">Register</button>

                    </div>
                </div>
            </div>
        `;
    }

    if (displayContent == "login"){
        formSection.innerHTML = `
            <div class="section_div">
                <h2>SPACE INVADERS</h2>
                <h3 style="color: red; display: none;" id="error_message">Your account already exist, please login</h3>
                <div class="form_div">
                    
                    <div class="form">
                        <p>LOGIN</p>
                        <div class="input_div">
                            <i class="fa-solid fa-envelope"></i>
                            <input type="email" placeholder="Email" id="email">
                        </div>
                        <div class="input_div">
                            <i class="fa-solid fa-lock"></i>
                            <input type="text" placeholder="Password" id="password">
                        </div>
                        
                        <button id="submit">Login</button>
                    </div>
                </div>
            </div>
        `;  
    }
}

