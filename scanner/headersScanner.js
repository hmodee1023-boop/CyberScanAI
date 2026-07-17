function scanHeaders(headers) {

    let result = {

        score: 0,

        total: 5,

        findings: [],

        recommendations: []

    };


    // HSTS
    if (headers["strict-transport-security"]) {

        result.score++;

        result.findings.push(
            "✅ HSTS مفعل"
        );

    } else {

        result.recommendations.push(
            "إضافة Strict-Transport-Security"
        );

    }


    // CSP
    if (headers["content-security-policy"]) {

        result.score++;

        result.findings.push(
            "✅ Content-Security-Policy موجود"
        );

    } else {

        result.recommendations.push(
            "إضافة Content-Security-Policy"
        );

    }


    // X Frame
    if (headers["x-frame-options"]) {

        result.score++;

        result.findings.push(
            "✅ X-Frame-Options موجود"
        );

    } else {

        result.recommendations.push(
            "إضافة X-Frame-Options لمنع Clickjacking"
        );

    }


    // Content Type
    if (headers["x-content-type-options"]) {

        result.score++;

        result.findings.push(
            "✅ X-Content-Type-Options موجود"
        );

    } else {

        result.recommendations.push(
            "إضافة X-Content-Type-Options"
        );

    }


    // Referrer Policy
    if (headers["referrer-policy"]) {

        result.score++;

        result.findings.push(
            "✅ Referrer-Policy موجود"
        );

    } else {

        result.recommendations.push(
            "إضافة Referrer-Policy"
        );

    }


    return result;

}


module.exports = scanHeaders;