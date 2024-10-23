// Redirects to form page
function redirect(display_content){
    window.location.href = `form.html?${display_content}`;
}


var registeredUsers;
registeredUsers = JSON.parse(localStorage.registeredUsers);


var list;
var tableList = [];
var sortedList = [];
var tableBody = document.getElementById("table_body");

function showHighscores(){
    sortTable();
}

// Sorts table
function sortTable(){
    var out = '';
    var tableRow = '';
    var sort_by = document.getElementById("sort_by").value;

    // Sorts table by highscore by default
    if(!sort_by){
        sort_by = "highscore";
    }

    sortedList = [];
    tableList = [];

    // Fills tablelist with values to be sorted    
    for(user of registeredUsers){
        tableList.push(user[sort_by]);
    };

    tableList.sort(function(a, b){return b-a}); // sorts list in decending order

    // Arranges user according to sorted values.
    for(score of tableList){
        for (user of registeredUsers){
            if(user[sort_by] == score){
                sortedList.push(user);
            }
        }
    }

    // Generates table rows
    for (i = 0; i < sortedList.length; i++){
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

        tableRow = `
            <tr>
                <td class="rank_img">
                    <div>
                        ${i + 1}
                    </div>
                    <div>
                        <img src="website_images/${image_to_display}.png" alt="Jet image">
                    </div>
                </td>
                <td>${sortedList[i].username}</td>
                <td>${sortedList[i].highscore}</td>
                <td>${sortedList[i].playTime}</td>
                <td>${sortedList[i].enemiesKilled}</td>
                <td>${sortedList[i].bulletsFired}</td>
            </tr>
        `;
        out += tableRow;
    }

    tableBody.innerHTML = out;
}

sortTable();