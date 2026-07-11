function scanServer(headers) {

    const findings = [];
    const recommendations = [];

    const server = headers["server"];

    if (server) {
        findings.push(`🖥️ Server: ${server}`);
        recommendations.push(
            "يفضل إخفاء إصدار الخادم لتقليل كشف المعلومات."
        );
    } else {
        findings.push("✅ معلومات الخادم مخفية");
    }

    const poweredBy = headers["x-powered-by"];

    if (poweredBy) {
        findings.push(`⚠️ X-Powered-By: ${poweredBy}`);
        recommendations.push(
            "قم بإزالة ترويسة X-Powered-By."
        );
    } else {
        findings.push("✅ X-Powered-By غير موجود");
    }

    return {
        findings,
        recommendations
    };

}

module.exports = scanServer;