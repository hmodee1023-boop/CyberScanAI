function arrayBufferToBase64(buffer) {

    let binary = "";

    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < bytes.byteLength; i++) {

        binary += String.fromCharCode(bytes[i]);

    }

    return window.btoa(binary);

}


let lastScanData = null;


// =======================
// إنشاء حساب
// =======================

async function registerUser() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();


    if (!name||!email||!password) {

        alert("يرجى إدخال جميع البيانات");
        return;

    }


    try {

        const response = await fetch("/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })

        });


        const data = await response.json();

        lastScanData = data;

console.log(lastScanData);

        if (data.error) {

            alert(data.error);
            return;

        }


        alert(data.message);

        window.location.href = "login.html";


    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء إنشاء الحساب");

    }

}





// =======================
// تسجيل الدخول
// =======================

async function login() {


    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();


    if (!email || !password) {

        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;

    }


    try {


        const response = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email,
                password

            })

        });



        const data = await response.json();

document.getElementById("ipCard").innerText =
    data.ipAddress || "--";

document.getElementById("responseCard").innerText =
    data.responseTime || "--";

document.getElementById("sslCard").innerText =
    data.ssl ? "✅ صالح" : "❌ غير صالح";

document.getElementById("timeCard").innerText =
    data.scanTime || "--";

        if (data.error) {

            alert(data.error);
            return;

        }



        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );



        window.location.href = "index.html";



    } catch (error) {


        console.error(error);

        alert("حدث خطأ أثناء تسجيل الدخول");


    }

}





// =======================
// تسجيل الخروج
// =======================

function logout() {


    localStorage.removeItem("user");

    window.location.href = "login.html";


}
// =======================
// بدء الفحص
// =======================

async function startScan() {


    const targetInput = document.getElementById("target");


    if (!targetInput) {

        alert("لم يتم العثور على خانة الرابط");
        return;

    }


    const target = targetInput.value.trim();
showScanLoading();


    if (!target) {

        alert("يرجى إدخال رابط للفحص");
        return;

    }



    try {


        const response = await fetch("/scan", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },


            body: JSON.stringify({

                target: target

            })


        });



        const data = await response.json();

        lastScanData = data;

console.log("تم حفظ البيانات:", lastScanData);

const score = data.securityScore;

const risk = document.getElementById("riskLevel");
const scoreElement = document.getElementById("securityScore");
const circle = document.querySelector(".score-circle");


animateScore(scoreElement, score);


if (score >= 80) {

    circle.style.background =
    "linear-gradient(135deg,#00ff88,#00cc66)";

    risk.innerText = "LOW RISK";
}
else if (score >= 50) {

    circle.style.background =
    "linear-gradient(135deg,#ffd000,#ff9900)";

    risk.innerText = "MEDIUM RISK";
}
else {

    circle.style.background =
    "linear-gradient(135deg,#ff3333,#990000)";

    risk.innerText = "HIGH RISK";
}

        console.log(data);



        const report = document.getElementById("report");



        if (!report) {

            console.error("لم يتم العثور على عنصر report");
            return;

        }

hideScanLoading();

window.lastScanData = data;

let securityGrade = "";

if (data.securityScore >= 90) {

    securityGrade = "A+ 🏆";

}
else if (data.securityScore >= 80) {

    securityGrade = "A 🟢";

}
else if (data.securityScore >= 70) {

    securityGrade = "B 🔵";

}
else if (data.securityScore >= 50) {

    securityGrade = "C 🟡";

}
else {

    securityGrade = "D 🔴";

}

        report.innerHTML = `

        <div class="report-box">

    <h2>📊 CyberScan AI Report</h2>

    <hr>

    <p><strong>🌐 الموقع:</strong> ${data.target}</p>

    <p><strong>🕒 وقت الفحص:</strong> ${data.scanTime}</p>

    <p><strong>🔒 درجة الأمان:</strong> ${data.securityScore}/100</p>
<div class="security-bar">

    <div class="security-fill"
         style="width:${data.securityScore}%;
                background:${
                    data.securityScore >= 80 ? "#22c55e" :
                    data.securityScore >= 50 ? "#facc15" :
                    "#ef4444"
                };">

    </div>

</div>
    <p><strong>⚠️ مستوى الخطورة:</strong> ${data.riskLevel}</p>

    <p><strong>📡 حالة الموقع:</strong> ${data.websiteStatus}</p>

    <p><strong>⚡ زمن الاستجابة:</strong> ${data.responseTime}</p>

    <p><strong>🌍 IP:</strong> ${data.ipAddress}</p>

    <p><strong>🖥️ Hostname:</strong> ${data.hostname}</p>

    <p><strong>🔐 SSL:</strong> ${data.ssl ? "✅ صالح" : "❌ غير صالح"}</p>

    <hr>

    <h3>✅ نتائج الفحص</h3>

    <ul>
        ${data.findings.map(item => `<li>${item}</li>`).join("")}
    </ul>

    <hr>

    <h3>💡 التوصيات</h3>

    <ul>
        ${data.recommendations.map(item => `<li>${item}</li>`).join("")}
    </ul>



</div>

`;

// حفظ الفحص في السجل
let scanHistory = JSON.parse(localStorage.getItem("scanHistory")) || [];

scanHistory.push({
    target: data.target,
    scanTime: data.scanTime,
    securityScore: data.securityScore,
    riskLevel: data.riskLevel,
    websiteStatus: data.websiteStatus
});

localStorage.setItem("scanHistory", JSON.stringify(scanHistory));

const pdfBtn = document.getElementById("downloadPdfBtn");

if (pdfBtn) {
    pdfBtn.style.display = "inline-block";
}

const shareBtn = document.getElementById("shareReportBtn");

if (shareBtn) {
    shareBtn.style.display = "inline-block";
}


} catch (error) {

    console.error(error);

    alert("حدث خطأ أثناء الفحص");

}

}






// =======================
// تشغيل عند تحميل الصفحة
// =======================

window.onload = function () {


    const logoutBtn = document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.onclick = logout;

    }


};
function showScanLoading(){

    const box = document.getElementById("scanLoading");

    if(box){

        box.style.display="block";

    }


    const step = document.getElementById("scanStep");


    let steps=[
        "🌐 تحليل DNS...",
        "🔒 فحص شهادة SSL...",
        "📡 تحليل Headers...",
        "🍪 فحص Cookies...",
        "🛡️ حساب مستوى الأمان..."
    ];


    let i=0;


    window.scanTimer=setInterval(()=>{

        if(step){

            step.innerText=steps[i];

        }


        i++;

        if(i>=steps.length){

            i=0;

        }

    },800);

}



function hideScanLoading(){

    const box = document.getElementById("scanLoading");

    if(box){

        box.style.display="none";

    }

}


// =======================
// تحميل تقرير PDF
// =======================

pdfMake.fonts = {
    Amiri: {
        normal: "Amiri-Regular.ttf",
        bold: "Amiri-Regular.ttf",
        italics: "Amiri-Regular.ttf",
        bolditalics: "Amiri-Regular.ttf"
    }
};


function rtl(text){

    return {
        text: text,
        alignment: "right",
        rtl: true
    };

}



const pdfBtn = document.getElementById("downloadPdfBtn");


if (pdfBtn) {


    pdfBtn.addEventListener("click", function () {


        if (!window.lastScanData) {

            alert("لا يوجد تقرير");

            return;

        }


        const data = window.lastScanData;



        const docDefinition = {


            pageSize: "A4",

            pageOrientation: "portrait",

            pageMargins: [40,40,40,40],


            defaultStyle: {

                font: "Amiri",

                alignment: "right",

                fontSize: 14

            },


            content: [


                {

                    ...rtl("🛡️ الحصن الرقمي | CyberScan AI"),

                    fontSize:22,

                    bold:true,

                    margin:[0,0,0,15]

                },


                {

                    ...rtl("تقرير فحص الأمان"),

                    fontSize:18,

                    bold:true,

                    margin:[0,10,0,20]

                },


                {

                    ...rtl(`الموقع: ${data.target || "-"}`),

                    margin:[0,5]

                },


                {

                    ...rtl(`وقت الفحص: ${data.scanTime || "-"}`),

                    margin:[0,5]

                },


                {

                    ...rtl(`درجة الأمان: ${data.securityScore || 0}/100`),

                    margin:[0,5]

                },


                {

                    ...rtl(`عنوان IP: ${data.ip || "-"}`),

                    margin:[0,5]

                },


                {

                    ...rtl(`SSL: ${data.ssl || "-"}`),

                    margin:[0,5]

                },


                {

                    ...rtl(`زمن الاستجابة: ${data.responseTime || "-"}`),

                    margin:[0,5]

                }


            ]

        };



        pdfMake.createPdf(docDefinition)

        .download("CyberScan-AI-Report.pdf");

});

}

// =======================
// إعادة الفحص
// =======================

const rescanBtn = document.getElementById("rescanBtn");

if (rescanBtn) {

    rescanBtn.onclick = function () {

        const target = document.getElementById("target");

        if (!target.value.trim()) {

            alert("أدخل رابط الموقع أولاً");

            return;

        }

        startScan();

    };

}


const securityBtn = document.getElementById("securityDetailsBtn");
const modal = document.getElementById("securityModal");
const details = document.getElementById("securityDetails");
const close = document.querySelector(".close-modal");

if (securityBtn && modal && details && close) {

    securityBtn.onclick = function () {

        if (!window.lastScanData) {
            alert("قم بإجراء فحص أولاً");
            return;
        }

        const data = window.lastScanData;

        details.innerHTML = `
            <p>🔒 SSL : ${data.ssl || "-"}</p>
            <p>🌐 Headers : ${data.headers || "غير متوفر"}</p>
            <p>🍪 Cookies : ${data.cookies || "غير متوفر"}</p>
            <p>🖥️ Server : ${data.server || "-"}</p>
            <p>🛡️ درجة الحماية : ${data.securityScore || 0}/100</p>
        `;

        modal.style.display = "flex";
    };

    close.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };
}
// =======================
// مشاركة التقرير
// =======================

const shareBtn = document.getElementById("shareReportBtn");

if (shareBtn) {

    shareBtn.onclick = async function () {

alert("تم الضغط على زر المشاركة");

alert(window.lastScanData ? "البيانات موجودة" : "البيانات غير موجودة");

        if (!window.lastScanData) {
            alert("لا يوجد تقرير للمشاركة");
            return;
        }

        const data = window.lastScanData;

        const reportText = `
🛡️ تقرير الحصن الرقمي | CyberScan AI

🌐 الموقع: ${data.target}
🔒 درجة الأمان: ${data.securityScore}/100
<p>
<strong>⚠️ مستوى الخطورة:</strong>

<span class="risk-badge ${
data.riskLevel === "LOW RISK" ? "risk-low" :
data.riskLevel === "MEDIUM RISK" ? "risk-medium" :
"risk-high"
}">
${data.riskLevel}
</span>

</p>
🌍 عنوان IP: ${data.ipAddress}
⚡ زمن الاستجابة: ${data.responseTime}
🕒 وقت الفحص: ${data.scanTime}
`;

alert("navigator.share = " + (typeof navigator.share));

       if (navigator.share) {

   try {

    alert("قبل المشاركة");

    await navigator.share({
        title: "تقرير الحصن الرقمي",
        text: reportText
    });

    alert("تمت المشاركة");

} catch (err) {

    alert("الخطأ: " + err.name + "\n" + err.message);
    console.error(err);

}

} else {

    navigator.clipboard.writeText(reportText);

    alert("تم نسخ التقرير إلى الحافظة.");

}

    };

}
function animateScore(element, target){

    if(!element) return;

    let current = 0;

    let timer = setInterval(function(){

        current++;

        element.innerText = current;

        if(current >= target){

            clearInterval(timer);

        }

    },15);

}