
function redirect(display_content){
    window.location.href = `form.html?${display_content}`;
}



// if registred users == 0, show, be the first to reach greateness
if (localStorage.registeredUsers){
    var registeredUsers;
    registeredUsers = JSON.parse(localStorage.registeredUsers);
    document.getElementById("highcore_data").innerHTML = `
        <div>
            <span>Be the first to taste glory</span>
            <button onclick="redirect('register',false)">Register</button>
        </div>
    `
}else{
    document.getElementById("highcore_data").innerHTML = `
        <div>
            <span>Be the first to taste glory</span>
            <button onclick="redirect('register',false)">Register</button>
        </div>
    `
}

function showHighscore(){
    window.location.href = `highscore.html`;
}

