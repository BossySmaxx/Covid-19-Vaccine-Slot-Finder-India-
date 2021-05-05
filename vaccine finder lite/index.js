const Vaccinator = require("./Vaccinator");

const vaccinator = new Vaccinator("110076", "8178546909");

(async function () {
    await vaccinator.initBrowser();
    // await vaccinator.initMessenger();
    await vaccinator.initVaccinator();
})();
