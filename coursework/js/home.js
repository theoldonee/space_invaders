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


function redirect(display_content){
    window.location.href = `form.html?${display_content}`;
}

// var registeredUsers;
var highscore_data_div = document.getElementById("highcore_data");
highscore_data_div.style.width = "600";
highscore_data_div.style.height = "600";
highscore_data_div.style.border = "1px solid white";
// if registred users == 0, show, be the first to reach greateness
if (localStorage.registeredUsers){

    var registeredUsers;
    registeredUsers = JSON.parse(localStorage.registeredUsers);
    document.getElementById("highcore_data").innerHTML = `
        <div id="table_div">
            <table>
                <thead>
                    <tr>
                        <td>Rank</td>
                        <td>Player Name</td>
                        <td>Score</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="rank_img">
                            <div>
                                1
                            </div>
                            <div>
                                <img src="website_images/jet_stage4.png" alt="Jet image">
                            </div>
                        </td>
                        <td>#Name</td>
                        <td>#Score</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                </tbody>
            </table>
        </div>
        <div id="see_more_div">
            <button onclick="showHighscorePage()">See more</button>
        </div>
    `
}else{
    
    highscore_data_div.style.display = "flex";
    highscore_data_div.style.alignItems = "center";
    highscore_data_div.style.justifyContent = "center";
    
    // var inner_div = document.querySelector("#highcore_data div");
    // inner_div.style.display = "flex";
    // inner_div.style.flexDirection = "column";


    highscore_data_div.innerHTML = `
        <div>
            <span>Be the first to taste glory</span>
            <button onclick="redirect('register',false)">Register</button>
        </div>
    `
}

function showHighscorePage(){
    window.location.href = `highscore.html`;
}




