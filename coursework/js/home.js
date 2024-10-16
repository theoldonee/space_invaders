// redirects to form page
function redirect(display_content){
    window.location.href = `form.html?${display_content}`;
}


var highscore_data_div = document.getElementById("highcore_data");
highscore_data_div.style.width = "600";
highscore_data_div.style.height = "600";
highscore_data_div.style.border = "1px solid white";

// Checks if registred users == 0
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
                    ${showTopFive()}
                </tbody>
            </table>
        </div>
        <div id="see_more_div">
            <button onclick="showHighscorePage()">See more</button>
        </div>
    `;
}else{
    
    highscore_data_div.style.display = "flex";
    highscore_data_div.style.alignItems = "center";
    highscore_data_div.style.justifyContent = "center";

    highscore_data_div.innerHTML = `
        <div>
            <span>Be the first to taste glory</span>
            <button onclick="redirect('register',false)">Register</button>
        </div>
    `;
}

// Function to redirect to highscore page
function showHighscorePage(){
    window.location.href = `highscore.html`;
}

// Get's and sort's top 5 scores.
function showTopFive(){
    var out = ``;
    
    sortedList = [];
    tableList = [];

    // adds user highscores to tablelist
    for(user of registeredUsers){
        tableList.push(user["highscore"]);
    };
    tableList.sort(function(a, b){return b-a});

    // adds user to sortedList based on highscore
    for(score of tableList){
        for (user of registeredUsers){
            if(user["highscore"] == score){
                sortedList.push(user);
            }
        }
    }

    // checks if registered users are more than 5 and gets first 5
    if (registeredUsers.lenght > 5){
        for(i = 0; i < 5; i++){
            out += userInfoRow(sortedList[i], i); 
        }
    }
    else{
        var emptyRowCount;
        emptyRowCount = 5 - sortedList.lenght;

        // checks if users exist in the sorted list
        if(sortedList.lengh != 0){
            for(i = 0; i < 5; i++){
                out += userInfoRow(sortedList[i], i);
        
            }
        }

        // generates empty rows
        for (i = 0; i < emptyRowCount; i++){
            out += emptyRow();
        }
    }

    return out;
}

// Returns a row with user data
function userInfoRow(user, i){
    var number = i+1;
    var image_to_display;

        if (i == 0){
            image_to_display = "jet_stage4";
        }else if (i == 1){
            image_to_display = "jet_stage3";
        }else if (i == 2){
            image_to_display = "jet_stage2";
        }else{
            image_to_display = "jet_stage1";
        }
    var row = `
        <tr>
            <td class="rank_img">
                <div>
                    ${number}
                </div>
                <div>
                    <img src="website_images/${image_to_display}.png" alt="Jet image">
                </div>
            </td>
            <td>${user.username}</td>
            <td>${user.highscore}</td>
        </tr>
    `
    return row;
}

// Returns an empty row
function emptyRow(){
    var row = `
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    `
    return row;
}