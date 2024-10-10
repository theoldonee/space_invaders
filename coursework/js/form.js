if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    // localStorage.setItem("lastname", "Smith");
    // localStorage.getItem("lastname");
    // localStorage.removeItem("lastname");
    // localStorage.removeItem("registeredUsers");

} 
else {
    alert("Sorry! No Web Storage support..");
}

var registeredUsers;
var displayContent;
var displayErrorMsg;

// 
window.onload = function (){

    params = window.location.search.split("?")[1];
    displayContent = params.split("$")[0];
    displayErrorMsg = params.split("$")[1];
    // alert("hello");
    serveForm();
    // displays error message
    if (displayErrorMsg){
        document.getElementById("error_message").style.display = "inline";
    };

    // checks if registeredUsers exist as a property of local storage
    if (localStorage.registeredUsers){
        registeredUsers = JSON.parse(localStorage.registeredUsers);
    }else{
        registeredUsers = [];
    }
};

// redirects user to form page
function redirect(displayContent, message){
    // checks if error message should be displayed
    if (message){
        window.location.href = `form.html?${displayContent}$${message}`;
    }else{
        window.location.href = `form.html?${displayContent}`;
    }
    
}


var formSection = document.getElementById("section_1");
var gender;


var userName;
var email;
var password; 
var dob;

// checks if user and password filled isn't empty
function checkEmailAndPassword(){
    if (!email) {
        return false;
    }
    else if (!password) {
        return false;
    }
    else{
        return true;
    }
}

function checkValues(){
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    
    // checks if register page is being displayed
    if (displayContent == "register"){
        userName = document.getElementById("name").value;
        dob = document.getElementById("DOB").value;

        if (!checkEmailAndPassword()){
            alert("Username or password field not filled");
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
// creates a user
function createUser(){
    user = {
        username: userName,
        password: password,
        email: email,
        logged_in: true,
        rank: Math.floor(Math.random() * 10),
        highscore: Math.floor(Math.random() * 1000),
        enemiesKilled: Math.floor(Math.random() * 1000),
        playtime: Math.floor(Math.random() * 1000),
        bulletsfired: Math.floor(Math.random() * 2000),
    };

    registeredUsers.push(user);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
}

// returns true user exist
function isUser(){
    var isUser = false;
    for (index = 0; index < registeredUsers.length; index++){
        var user0bj = registeredUsers[index];
        // checks if user exist
        if (user0bj.email == email){
            user = user0bj;
            isUser = true;
        }
    }

    return isUser;
}

// registers a user
function register(){
    // checks if users exist
    if (registeredUsers.length != 0){
        // redirects to login page if user exist
        if (isUser()){
            redirect("login", true)
        }
        else{
            // creates user if user does not exist
            createUser();
            window.location.href = `game.html?${user.email}`;
        }
    }else{
        // creates user if no users exist
        createUser();
        window.location.href = `game.html?${user.email}`;
    }

    clear();  
}

// logs in a user
function login(){
    // checks if users exist
    if (registeredUsers.length != 0){
        // cheks if user exist
        if (isUser()){
            // checks if the password is correct
            if (password == user.password){
                window.location.href = `game.html?${user.email}`;
            }else{
                // displays error message if password is wrong
                document.getElementById("error_message").innerHTML = "Password incorrect";
                document.getElementById("error_message").style.display = "inline";
            }
        }
        else{
            // redirects to register page if user doesn't exist
            redirect("register", true);
        }
    }else{
        // redirects to register page if no user exist in local storage
        redirect("register", true);
    }

    clear();  
}

// A function that only makes the button clicked yellow.
function toggle(button_id){
    var genderDivChilderen = document.getElementById("gender_div").children;
    // makes button white if its not the right button
    for(let i = 0; i < genderDivChilderen.length; i++){
        if(genderDivChilderen[i].id != button_id){
            genderDivChilderen[i].style.backgroundColor = "white";
        }
        else{
            // makes button yellow if its the right button
            genderDivChilderen[i].style.backgroundColor = "yellow";
            gender = genderDivChilderen[i].id;
        }
    }

}

// clears variables
function clear(){

    // document.getElementById("name").value;
    // document.getElementById("email").value;
    // document.getElementById("password").value;
    // document.getElementById("DOB").value;

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
                                <button onclick="toggle('male')" id="male">Male</button>
                                <button onclick="toggle('female')" id="female">Female</button>
                                <button onclick="toggle('other')" id="other">Other</button>
                            </div>
                            
                        </div>
                        
                        <button onclick="checkValues()" id="register_button">Register</button>

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
                        
                        <button onclick="checkValues()" id="login_button">Login</button>
                    </div>
                </div>
            </div>
        `;  
    }
}

