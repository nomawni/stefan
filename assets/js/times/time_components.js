export default class TimeComponent {

    constructor(){

    }

   static extractTime(timeStamp){

        let dateTime = new Date(timeStamp * 1000);
        let parsedDate = dateTime.getDate() + '-' + dateTime.getMonth() + '-' + dateTime.getFullYear();

        return parsedDate;
           
    }
}