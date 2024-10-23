export {
    UserManager
};

// Redirects to form page
function redirect(display_content){
    window.location.href = `form.html?${display_content}`;
}

// localStorage.removeItem("registeredUsers");
class UserManager{

    // Returns empty list 
    static getAllUsers(){
        if (localStorage.registeredUsers){
            return JSON.parse(localStorage.registeredUsers);
        }
        return []
    }

    // Updates local storage registered users
    static updateRegisteredUsers(userList){
        localStorage.setItem("registeredUsers", JSON.stringify(userList));
    }

    // static createRegisteredUsers(){
    //     localStorage.setItem("registeredUsers", JSON.stringify([]));
    // }

    // Returns true user exist
    static isUser(email){
        var registeredUsers = this.getAllUsers();
        for (var index = 0; index < registeredUsers.length; index++){
            var user0bj = registeredUsers[index];
            // checks if user exist
            if (user0bj.email == email){
                return true;
            }
        }
        return false;
    }

    // Returns a user
    static getUser(email){
        var registeredUsers = this.getAllUsers();
        for (var index = 0; index < registeredUsers.length; index++){
            var user0bj = registeredUsers[index];

            // checks if user exist
            if (user0bj.email == email){
                return user0bj;
            }
        }
    }

    // Checks if the email entry is valid
    static isEmail(email){
        var length = email.split("@").length;

        if (length == 2){
            return true;
        }
        return false;
    }

    // Returns User Rank
    static getRank(email){
        var sortedList = [];
        var highscoreList = [];

        var registeredUsers = this.getAllUsers();

        // Gets fills highscore list with highscore values
        for(var userobj of registeredUsers){
            highscoreList.push(userobj["highscore"]);
        };

        highscoreList.sort(function(a, b){return b-a}); // storts list in decending order

        // Fills sorted list according to player highscores
        for(var score of highscoreList){
            for (var userobj of registeredUsers){
                if(userobj["highscore"] == score){
                    sortedList.push(userobj);
                }
            }
        }

        // Returns player rank
        for (var i = 0; i < sortedList.length; i++){
            if (sortedList[i].email == email){
                return i + 1;
            }
        }
    }

    // Updates user info
    static updateUserInfo(email, score, playTime, bulletsFired, enemiesKilled){
        var registeredUsers = this.getAllUsers();

        for(var user of registeredUsers){
            if (user.email == email){
                if(user.highscore < score){
                    user.highscore = score;
                }
                user.playTime += playTime;
                user.bulletsFired += bulletsFired;
                user.enemiesKilled += enemiesKilled;
            }
        }

        this.updateRegisteredUsers(registeredUsers);
    }

}

