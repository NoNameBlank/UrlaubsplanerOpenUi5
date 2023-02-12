

export function readDataLogin(userName, passwort) {
    return new Promise((resolve, reject) => {
        jQuery.ajax({
            type: "GET",
            contentType: "application/xml",
            url: "http://localhost:3000/api/login",
            dataType: "json",
            data: { userName: userName, passwort: passwort },
            success: function (data) {
                resolve(data);
            },
            error: function (oResponse) {
                reject(oResponse);
            }
        });
    });
}

export function readUserDetails(userId) {
    return new Promise((resolve, reject) => {
        jQuery.ajax({
            type: "GET",
            contentType: "application/xml",
            url: "http://localhost:3000/api/userdetails",
            dataType: "json",
            data: { userId: userId },
            success: function (oResponse) {
                oResponse.data.appointments.forEach(appointment => {
                    appointment.type = "Type05";
                    var dateParts = appointment.startDatum.split(".");
                    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                    appointment.startDatum = dateObject;
                    dateParts = appointment.endDatum.split(".");
                    dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                    appointment.endDatum = dateObject;
                });
                resolve({
                    user: oResponse.data,
                    appointments: oResponse.data.appointments
                });
            },
            error: function (oResponse) {
                reject(oResponse);
            }
        });
    });
}