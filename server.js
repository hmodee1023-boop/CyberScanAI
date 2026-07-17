const express = require("express");
const path = require("path");
const axios = require("axios");
const scanHeaders = require("./scanner/headersScanner");

const scanDNS = require("./scanner/dnsScanner");
const scanSSL = require("./scanner/sslScanner");
const scanCookies = require("./scanner/cookieScanner");
const scanServer = require("./scanner/serverScanner");

const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// =========================
// إنشاء حساب
// =========================

app.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    if (!name||!email||!password) {

        return res.json({
            error: "يرجى إدخال جميع البيانات"
        });

    }

    db.run(

        `INSERT INTO users (name, email, password)
         VALUES (?, ?, ?)`,

        [name, email, password],

        function(err) {

            if (err) {

                return res.json({
                    error: "البريد الإلكتروني مستخدم مسبقًا"
                });

            }

            res.json({
                message: "تم إنشاء الحساب بنجاح ✅"
            });

        }

    );

});
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "login.html")
    );
});


app.post("/scan", async (req, res) => {

    try {

        let { target } = req.body;

        if (!target) {

            return res.status(400).json({

                error: "يرجى إدخال رابط الموقع"

            });

        }


        if (
            !target.startsWith("http://") &&
            !target.startsWith("https://")
        ) {

            target = "https://" + target;

        }


        const start = Date.now();


        const response = await axios.get(target, {

            timeout: 10000,

            validateStatus: () => true

        });


        const responseTime = Date.now() - start;


        // DNS
        const dnsInfo = await scanDNS(target);


        // SSL
        const sslInfo = await scanSSL(target);



const headers = response.headers;
const headerScan = scanHeaders(headers);
const cookieScan = scanCookies(headers);
const serverScan = scanServer(headers);

let score = 100;
let scoreDetails = [];

let findings = [
    ...headerScan.findings,
    ...cookieScan.findings,
    ...serverScan.findings
];

let recommendations = [
    ...headerScan.recommendations,
    ...cookieScan.recommendations,
    ...serverScan.recommendations
];



// خصم بسيط لمشاكل Cookies
score -= Math.min(cookieScan.recommendations.length * 2, 6);

// خصم بسيط لمعلومات الخادم
score -= Math.min(serverScan.recommendations.length, 2);

// HTTPS
if (target.startsWith("https://")) {

    findings.push("✅ HTTPS مفعل");
scoreDetails.push("✅ HTTPS: +25 نقطة");

} else {

    score -= 25;

    findings.push("❌ HTTPS غير مفعل");

    recommendations.push("استخدم HTTPS");

scoreDetails.push("❌ HTTPS: -25 نقطة");

}

// HSTS
if (headers["strict-transport-security"]) {
    score += 5;
    scoreDetails.push("✅ HSTS موجود: +5 نقاط");
} else {
    score -= 5;
    scoreDetails.push("❌ HSTS مفقود: -5 نقاط");
} 
 




    score -= 5;

    recommendations.push("إضافة HSTS");



// CSP
// CSP
if (headers["content-security-policy"]) {

    score += 8;
    scoreDetails.push("✅ CSP: +8 نقاط");
    findings.push("✅ Content Security Policy موجود");

} else {

    score -= 8;
    scoreDetails.push("❌ CSP مفقود: -8 نقاط");
    recommendations.push("إضافة CSP");

}
;
// SSL
// SSL
if (sslInfo.ssl) {

    score += 25;
    findings.push("✅ شهادة SSL صالحة");
    scoreDetails.push("✅ SSL: +25 نقطة");

} else {

    score -= 25;
    findings.push("❌ مشكلة في شهادة SSL");
    recommendations.push("تثبيت شهادة SSL");
    scoreDetails.push("❌ SSL: -25 نقطة");

}

// منع خروج الدرجة عن النطاق
if (score < 0) score = 0;
if (score > 100) score = 100;


        let riskLevel = "Low";


        if (score < 80)
            riskLevel = "Medium";


        if (score < 60)
            riskLevel = "High";


        if (score < 40)
            riskLevel = "Critical";



        


            


            res.json({

            target,

            securityScore: score,

scanTime: new Date().toLocaleString(),

            websiteStatus:
                response.status < 500
                    ? "Online"
                    : "Offline",


            responseTime:
                responseTime + " ms",

ipAddress:
    dnsInfo.ip || "Unknown",

hostname:
    dnsInfo.hostname || "Unknown",

            ipVersion: dnsInfo.family || "",



            ssl: sslInfo.ssl,


            sslIssuer:
                sslInfo.issuer || "Unknown",


            sslValidFrom:
                sslInfo.validFrom || "",


            sslValidTo:
                sslInfo.validTo || "",


            sslDaysLeft:
                sslInfo.daysLeft || 0,



            riskLevel,


            findings,


            recommendations


        });



    } catch (error) {

console.log(error);

        res.json({

            target: req.body.target,

            securityScore: 0,

            websiteStatus: "Offline",

            responseTime: "--",

            ipAddress: "Unknown",

            hostname: "Unknown",

            ssl: false,

            riskLevel: "Critical",


            findings: [

                "❌ تعذر الوصول إلى الموقع"

            ],


            recommendations: [

                "تأكد من صحة الرابط"

            ]

        });


    }

});


app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        res.json({
            success: true,
            message: "Login successful"
        });
    } else {
        res.json({
            success: false,
            message: "Wrong username or password"
        });
    }
});
app.listen(PORT, "0.0.0.0", () => {

    console.log(
       ` CyberScan AI running on http://localhost:${PORT}`
    );

});