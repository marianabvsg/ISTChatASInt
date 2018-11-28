module.exports = class userDB {

    constructor(db) {
        this.db = db
    }

    insert() {

    }

    listUsers() {
        
        //returns all users
    }

    listUsersByBuilding(building) {

        // get building coords

        // 
        
        //returns all users by building
    }

    listUsersInRange(user){
        // returns all users which are within the defined range for the input user
    }

    // checkUserIsClose(){
    //     //por esta funcao ou a de cima?
    // }

    listUsersNearby(user){
        //makes use of listUsersByBuilding and listUsersInRange? 
        //ou então checka-se se para todos os que estão no building, se estão dentro do range 
        // e nesse caso pode-se meter tipo uma função que checka se está dentro do range

        // returns all users which are within the defined range and in the same building
    }


    setRange(user, range) {
        //returns true if range set successfuly
    }

}