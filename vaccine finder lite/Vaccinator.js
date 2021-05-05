const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail", 
    secure: false, 
    auth: {
        user: "aniketchauhan7722@gmail.com", 
        pass: "5p4c3h3r0"
    }
});

class Vaccinator {
    constructor (pincode, phone) {
        this.phone = phone;
        this.pincode = pincode;
        this.browser;
        this.page;
        this.messenger;
    }

    async initBrowser () {
        this.browser = await puppeteer.launch({headless: true});
    }

    async initMessenger () {
        // this.messengerPage = await this.browser.newPage();

        // await this.messengerPage.goto("https://web.whatsapp.com", {waitUntil: "networkidle2"});

        // await this.messengerPage.waitFor(10000);

        // await this.messengerPage.waitForSelector("#side > div.SgIJV > div > label > div > div._2_1wd.copyable-text.selectable-text");

        // await this.messengerPage.type("#side > div.SgIJV > div > label > div > div._2_1wd.copyable-text.selectable-text", "karan", {delay: 20});
    }

    async initVaccinator () {
        this.page = await this.browser.newPage();

        await this.page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36 ");
          
        console.log("waiting for 5 seconds to load the entire page------------------------------------<<<<<");
        
        await this.page.goto("https://www.cowin.gov.in/home", {waitUntil: 'networkidle2'});
        
        await this.page.waitFor(5000);
        await this.page.waitForSelector("#mat-input-0");

        await this.page.type("#mat-input-0", this.pincode.toString(), {delay: 10});
        await this.page.waitFor(2000);

        await this.page.waitForSelector("body > app-root > div > app-home > div.maplocationblock.bs-section > div > appointment-table > div > div > div > div > div > div > div > div > div > div > div:nth-child(2) > form > div > div > div.col-padding.filerandsearchblock.margin0auto > div.agefilterblock > div:nth-child(3) > label");        

        await this.page.click("body > app-root > div > app-home > div.maplocationblock.bs-section > div > appointment-table > div > div > div > div > div > div > div > div > div > div > div:nth-child(2) > form > div > div > div.col-padding.filerandsearchblock.margin0auto > div.agefilterblock > div:nth-child(3) > label", {delay:0});
        
        // it's the first iteration
        console.log(`---------------------- Pincode : ${this.pincode} -----------------------------------\n`);
        let searchIteration = 1;
        console.log(searchIteration++, "th search iteration. ");

        await this.page.waitForSelector("body > app-root > div > app-home > div.maplocationblock.bs-section > div > appointment-table > div > div > div > div > div > div > div > div > div > div > div:nth-child(2) > form > div > div > div.col-padding.filerandsearchblock.margin0auto > div.pin-search > div > button");
        await this.page.click("body > app-root > div > app-home > div.maplocationblock.bs-section > div > appointment-table > div > div > div > div > div > div > div > div > div > div > div:nth-child(2) > form > div > div > div.col-padding.filerandsearchblock.margin0auto > div.pin-search > div > button", {delay: 0});
    
        await this.page.waitForSelector(".slot-available-wrap");
        await this.page.waitFor(2000);
        let totalSlots = await this.page.$$("body > app-root > div > app-home > div.maplocationblock.bs-section > div > appointment-table > div > div > div > div > div > div > div > div > div > div > div > form > div > div > div.col-padding.matlistingblock > div > div > div > div > div > div > div.slot-available-main.col-padding.col.col-lg-9.col-md-9.col-sm-9.col-xs-12 > ul > li > div > div > a");
        console.log("Total Slots --------------------->>>>>", totalSlots.length);

        console.log("vaccine array ----------------->>>>");


        let slots = await this.page.$$eval(`body > app-root > div > app-home > div.maplocationblock.bs-section > div > appointment-table > div > div > div > div > div > div > div > div > div > div > div > form > div > div > div.col-padding.matlistingblock > div > div > div > div > div > div > div.slot-available-main.col-padding.col.col-lg-9.col-md-9.col-sm-9.col-xs-12 > ul > li > div > div > a`, 
            slot => slot.map(slot => slot.textContent)  );
        
        console.log("slots Vaccine Count ------->>>>>", slots);
    
        let count = 0;
        let vaccines = [];

        slots.forEach(slot => {
            if ( !(slot.includes("Booked") || slot.includes("NA")) ) {
                console.log("Slot available with " + slot, "vaccines ");
                vaccines[count] = slot;
                count++;
            }
        });

        if (count > 0) {

            let mailOptions = {
                from: "aniketchauhan7722@gmail.com", 
                to: "thehex.sniffer@gmail.com", 
                subject: "Vaccines are Available Now Hurry Up!", 
                text: `${count} Slots available with ${vaccines} vaccines visit: https://www.cowin.gov.in/home, sent at : ${new Date().getHours() + new Date().getMinutes()}`
            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("\n\n\nError in sending message ------------->>>>>\n", error);
                } else {
                    console.log("\n\n\nEmail sent successfully: \n\n", info.response);
                }
            })

            console.log(`Sending message>>> ${count} Slots available with ${vaccines} vaccines visit: https://www.cowin.gov.in/home`);
        }

        // looper starts here ---------------------------------------
        // start searching and sending email if vaccine is available every 1 minute --------------

        setInterval(async () => {

            console.log(`---------------------- Pincode : ${this.pincode} -----------------------------------\n`);
            console.log(searchIteration++, "th search iteration. ");

            await this.page.waitForSelector("body > app-root > div > app-home > div.maplocationblock.bs-section > div > appointment-table > div > div > div > div > div > div > div > div > div > div > div:nth-child(2) > form > div > div > div.col-padding.filerandsearchblock.margin0auto > div.pin-search > div > button");
            await this.page.click("body > app-root > div > app-home > div.maplocationblock.bs-section > div > appointment-table > div > div > div > div > div > div > div > div > div > div > div:nth-child(2) > form > div > div > div.col-padding.filerandsearchblock.margin0auto > div.pin-search > div > button", {delay: 0});
        
            await this.page.waitForSelector(".slot-available-wrap");
            await this.page.waitFor(2000);
            let totalSlots = await this.page.$$("body > app-root > div > app-home > div.maplocationblock.bs-section > div > appointment-table > div > div > div > div > div > div > div > div > div > div > div > form > div > div > div.col-padding.matlistingblock > div > div > div > div > div > div > div.slot-available-main.col-padding.col.col-lg-9.col-md-9.col-sm-9.col-xs-12 > ul > li > div > div > a");
            console.log("Total Slots --------------------->>>>>", totalSlots.length);

            console.log("vaccine array ----------------->>>>");


            let slots = await this.page.$$eval(`body > app-root > div > app-home > div.maplocationblock.bs-section > div > appointment-table > div > div > div > div > div > div > div > div > div > div > div > form > div > div > div.col-padding.matlistingblock > div > div > div > div > div > div > div.slot-available-main.col-padding.col.col-lg-9.col-md-9.col-sm-9.col-xs-12 > ul > li > div > div > a`, 
                slot => slot.map(slot => slot.textContent)  );
            
            console.log("slots Vaccine Count ------->>>>>", slots);
        
            let count = 0;
            let vaccines = [];

            slots.forEach(slot => {
                if ( !(slot.includes("Booked") || slot.includes("NA")) ) {
                    console.log("Slot available with " + slot, "vaccines ");
                    vaccines[count] = slot;
                    count++;
                }
            });

            if (count > 0) {

                // sending message for available vaccines
                let mailOptions = {
                    from: "aniketchauhan7722@gmail.com", 
                    to: "thehex.sniffer@gmail.com", 
                    subject: "Vaccines are Available Now Hurry Up!", 
                    text: `${count} Slots available with ${vaccines} vaccines visit: https://www.cowin.gov.in/home`
                }

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log("\n\n\nError in sending message ------------->>>>>\n", error);
                    } else {
                        console.log("\n\n\nEmail sent successfully: \n\n", info.response);
                    }
                })

                console.log(`Sending message>>> ${count} Slots available with [${vaccines}] vaccines visit: https://www.cowin.gov.in/home`);
            }
            
        }, 30*1000);

    }
}

module.exports = Vaccinator;