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


        if (data.error) {

            alert(data.error);
            return;

        }


        showLoading("تم إنشاء الحساب...");


        setTimeout(() => {

            window.location.href = "login.html";

        }, 1000);



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



    showLoading("جاري تسجيل الدخول...");



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



        if (data.error) {

            hideLoading();

            alert(data.error);

            return;

        }




        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );



        setTimeout(() => {

            window.location.href = "index.html";

        }, 1200);




    } catch (error) {


        hideLoading();

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
// شاشة التحميل
// =======================

function showLoading(message) {


    let loader = document.getElementById("loadingScreen");


    if (loader) return;



    loader = document.createElement("div");

    loader.id = "loadingScreen";



    loader.innerHTML = `

    <div class="loader-box">

        <div class="spinner"></div>

        <h3>${message}</h3>

        <p>CyberScan AI</p>

    </div>

    `;



    document.body.appendChild(loader);


}





function hideLoading() {


    const loader = document.getElementById("loadingScreen");


    if (loader) {

        loader.remove();

    }


}





// =======================
// عند فتح الصفحة
// =======================

window.onload = function () {


    const logoutBtn = document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.onclick = logout;

    }


};