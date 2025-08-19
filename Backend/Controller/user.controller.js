exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.DoctorBoard = (req, res) => {
    res.status(200).send("Doctor Content.");
};



exports.PatientBoard = (req, res) => {
    res.status(200).send("Patient Content.");
};
exports.PharmacistBoard = (req, res) => {
    res.status(200).send("Pharmacist Content.");
};