function scanCookies(headers) {

    const findings = [];
    const recommendations = [];

    const cookies = headers["set-cookie"];

    if (!cookies) {
        findings.push("⚠️ لم يتم العثور على Cookies");
        return { findings, recommendations };
    }

    cookies.forEach(cookie => {

        if (cookie.includes("HttpOnly")) {
            findings.push("✅ Cookie تستخدم HttpOnly");
        } else {
            findings.push("❌ Cookie لا تستخدم HttpOnly");
            recommendations.push("إضافة HttpOnly للـ Cookies");
        }

        if (cookie.includes("Secure")) {
            findings.push("✅ Cookie تستخدم Secure");
        } else {
            findings.push("❌ Cookie لا تستخدم Secure");
            recommendations.push("إضافة Secure للـ Cookies");
        }

        if (cookie.includes("SameSite")) {
            findings.push("✅ Cookie تستخدم SameSite");
        } else {
            findings.push("⚠️ Cookie لا تستخدم SameSite");
            recommendations.push("إضافة SameSite للـ Cookies");
        }

    });

    return {
        findings,
        recommendations
    };

}

module.exports = scanCookies;