import { UserManager } from "./userManager.js";

window.onload = function (){
    const email = window.location.search.split("?")[1];
    if (!email){
        alert("Only users can view accounts");
    }
    else{
        if (UserManager.isUser(email)){
            var user = UserManager.getUser(email);
            displayAccountInfo(user);
        }else{
            alert("Only registered users can view account");
        }
       
    }
};


function displayAccountInfo(user){
    var userRank = UserManager.getRank(user.email);
    var image_to_display;

    if (userRank == 1){
        image_to_display = "jet_stage4";
    }else if (userRank == 2){
        image_to_display = "jet_stage3";
    }else if (userRank == 3){
        image_to_display = "jet_stage2";
    }else{
        image_to_display = "jet_stage1";
    }

    document.getElementById("rank_img").innerHTML = `
         <img src="website_images/${image_to_display}.png" alt="Jet Image">
    `;

    document.getElementById("rank_position").innerHTML = userRank;

    document.querySelector("#user_info > div").innerHTML = `
        <p><b><u>Name</u></b>: ${user.username}</p>
        <p><b><u>DOB</u></b>: ${user.DOB }</p>
        <p><b><u>Gender</u></b>: ${user.gender}</p>
    `
    
    document.getElementById("highscore").innerHTML = user.highscore;
    document.getElementById("playtime").innerHTML = user.playTime;
    document.getElementById("bulletsfired").innerHTML = user.bulletsFired;
    document.getElementById("enemieskilled").innerHTML = user.enemiesKilled;


}