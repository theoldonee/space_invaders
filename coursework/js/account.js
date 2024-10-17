export {
    UserManager
};

// localStorage.removeItem("registeredUsers");
class UserManager{

    static userEmail;
    // static registeredUsers = this.getAllUsers();

    static setUser(email){
        this.userEmail = email;
    }

    static getAllUsers(){
        if (localStorage.registeredUsers){
            return JSON.parse(localStorage.registeredUsers);
        }
        return []
    }

    static updateRegisteredUsers(userList){
        alert("Updating users");
        localStorage.setItem("registeredUsers", JSON.stringify(userList));
    }

    // static createRegisteredUsers(){
    //     localStorage.setItem("registeredUsers", JSON.stringify([]));
    // }

    // returns true user exist
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

    static isEmail(email){
        var length = email.split("@").length;

        if (length == 2){
            return true;
        }
        return false;
    }

}