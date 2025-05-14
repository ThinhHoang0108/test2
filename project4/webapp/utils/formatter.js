sap.ui.define([], function () {
    "use strict";
    return {
        dateToFormat: function (dateValue) {
            if (dateValue !== null && dateValue !== "" && dateValue !== undefined) {
                var arrayForMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                var date = new Date(dateValue.getTime() + dateValue.getTimezoneOffset() * 60000);
                // console.log(date)
                // console.log(date.getMonth())
                var formattedDate = parseInt(date.getDate()) + " " + arrayForMonth[date.getMonth()] + ", " + date.getFullYear();
                return formattedDate;
            } else {
                console.log("No data available")
            }
        }
    }
})

