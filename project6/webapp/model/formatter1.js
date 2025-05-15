sap.ui.define([
],
    function () {
        "use strict";

        return {
            colorIcon: function (Status) {
                if (Status === "N") {
                    return "sys-enter-2";
                } else if (Status === "P") {
                    return "alert";
                } else if (Status === "B") {
                    return "error";
                }
            },
            colorID: function (Status) {
                if (Status === "N") {
                    return "Success";
                } else if (Status === "P") {
                    return "Warning";
                } else if (Status === "B") {
                    return "Error";
                }
            },
            dateToFormat: function (dateValue) {
                // if (dateValue !== null && dateValue !== "" && dateValue !== undefined) {
                //     var arrayForMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                //     var date = new Date(dateValue.getTime() + dateValue.getTimezoneOffset() * 60000);
                //     // console.log(date)
                //     // console.log(date.getMonth())
                //     var formattedDate = parseInt(date.getDate()) + " " + arrayForMonth[date.getMonth()] + ", " + date.getFullYear();
                //     return formattedDate;
                // } else {
                //     console.log("No data available")
                // }
                var obDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "EEE, MMM d, yyyy"
                },
                    sap.ui.getCore().getConfiguration().getLocale());
                return obDate.format(dateValue);
            }

        };

    });