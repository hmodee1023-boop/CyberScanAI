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


scoreElement.innerText = score;


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

        report.innerHTML = `

        <div class="report-box">

    <h2>📊 CyberScan AI Report</h2>

    <hr>

    <p><strong>🌐 الموقع:</strong> ${data.target}</p>

    <p><strong>🕒 وقت الفحص:</strong> ${data.scanTime}</p>

    <p><strong>🔒 درجة الأمان:</strong> ${data.securityScore}/100</p>

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
function showScanLoading() {

    const button = document.querySelector(".scan-btn");

    if (button) {

        button.disabled = true;
        button.innerHTML = "⏳ جاري الفحص...";

    }

}



function hideScanLoading() {

    const button = document.querySelector(".scan-btn");

    if (button) {

        button.disabled = false;
        button.innerHTML = "🔍 بدء الفحص";

    }

}
function hideScanLoading() {

    const button = document.querySelector(".scan-btn");

    if (button) {

        button.disabled = false;
        button.innerHTML = "🔍 بدء الفحص";

    }

}

// الصق هنا الكود الجديد بالكامل
document.getElementById("downloadPdfBtn").addEventListener("click", () => {

    if (!lastScanData) {
        alert("Run a scan first");
        return;
    }

    const { jsPDF } = window.jspdf;

const pdf = new jsPDF();


// العنوان الرئيسي
pdf.setFontSize(22);
pdf.text("🛡️ الحصن الرقمي", 20, 20);

pdf.setFontSize(14);
pdf.text("CyberScan AI Security Report", 20, 32);


// خط فاصل
pdf.line(20, 38, 190, 38);


// معلومات التقرير
pdf.setFontSize(12);

pdf.text(`🌐 Target: ${lastScanData.target}`, 20, 55);

const scanDate = new Date().toLocaleString("en-US");

pdf.text(`🕒 Scan Time: ${scanDate}`, 20, 65);

pdf.text(
`🔒 Security Score: ${lastScanData.securityScore}/100`,
20,
75
);

pdf.text(
`⚠️ Risk Level: ${lastScanData.riskLevel}`,
20,
85
);

pdf.text(
`📡 Website Status: ${lastScanData.websiteStatus}`,
20,
95
);

pdf.text(
`⚡ Response Time: ${lastScanData.responseTime}`,
20,
105
);

pdf.text(
`🌍 IP Address: ${lastScanData.ipAddress}`,
20,
115
);


// قسم إضافي
pdf.line(20, 125, 190, 125);

pdf.setFontSize(14);
pdf.text("Security Analysis", 20, 140);


pdf.setFontSize(12);

pdf.text(
"CyberScan AI provides an initial security assessment",
20,
155
);

pdf.text(
"to help improve website protection.",
20,
165
);


// التذييل
pdf.line(20, 180, 190, 180);

pdf.setFontSize(10);

pdf.text(
"CyberScan AI v1.0 | الحصن الرقمي",
20,
195
);


pdf.save("CyberScan_AI_Report.pdf");

});