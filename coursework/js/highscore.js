
function redirect(display_content){
    window.location.href = `form.html?${display_content}`;
}


var registeredUsers;
registeredUsers = JSON.parse(localStorage.registeredUsers);

var out;
var tableRow;

var list;
var tableList = [];
var sortedList = [];
var tableBody = document.getElementById("table_body");
// var topPos = myElement.offsetTop;
// document.getElementById('table_body').scrollTop = topPos;
function showHighscores(){
    sort();
}


function sort(){
    var sort_by = document.getElementById("sort_by").value;
    if(!sort_by){
        sort_by = "highscore";
    }
    sortedList = [];
    tableList = [];
    out = '';

    for(user of registeredUsers){
        tableList.push(user[sort_by]);
    };
    tableList.sort(function(a, b){return b-a});

    for(score of tableList){
        for (user of registeredUsers){
            if(user[sort_by] == score){
                sortedList.push(user);
            }
        }
    }

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
                <td>${sortedList[i].playtime}</td>
                <td>${sortedList[i].enemiesKilled}</td>
                <td>${sortedList[i].bulletsfired}</td>
            </tr>
        `;
        out += tableRow;
    }

    tableBody.innerHTML = out;
}

sort();