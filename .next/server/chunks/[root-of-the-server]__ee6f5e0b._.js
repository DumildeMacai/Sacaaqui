module.exports = {

"[project]/.next-internal/server/app/api/atms/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/firebase-admin [external] (firebase-admin, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("firebase-admin", () => require("firebase-admin"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/src/lib/firebase-admin.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/firebase-admin.ts
__turbopack_context__.s({
    "addAtm": (()=>addAtm),
    "getAtmById": (()=>getAtmById),
    "getAtms": (()=>getAtms),
    "updateAtm": (()=>updateAtm)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/lib/main.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2d$expand$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv-expand/lib/main.js [app-route] (ecmascript)");
;
;
;
// Carrega e expande as variáveis de ambiente do ficheiro .env
const env = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].config();
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2d$expand$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].expand(env);
// Constrói o objeto de credenciais da conta de serviço a partir das variáveis de ambiente
// Esta abordagem é mais robusta do que fazer o parse de uma string JSON
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};
// Garante que o Firebase Admin SDK seja inicializado apenas uma vez
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["apps"].length) {
    try {
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["initializeApp"])({
            credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["credential"].cert(serviceAccount)
        });
        console.log('Firebase Admin SDK inicializado com sucesso.');
    } catch (error) {
        console.error('FALHA CRÍTICA: Erro ao inicializar o Firebase Admin SDK.', error);
        // Lança um erro para impedir que a aplicação continue a ser executada com uma configuração inválida do Firebase
        throw new Error('A inicialização do Firebase Admin falhou. Verifique as credenciais da conta de serviço.');
    }
}
const db = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["firestore"])();
// Função auxiliar para converter Timestamps do Firestore para strings ISO de forma segura
const convertTimestampToString = (timestamp)=>{
    if (timestamp instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["firestore"].Timestamp) {
        return timestamp.toDate().toISOString();
    }
    // Se já for uma string (de dados de mock ou já convertidos), retorna diretamente
    if (typeof timestamp === 'string') {
        return timestamp;
    }
    // Retorna a data atual como um fallback seguro, embora isto deva ser raro com os dados do Firestore
    return new Date().toISOString();
};
async function getAtms() {
    try {
        const atmsSnapshot = await db.collection('atms').get();
        if (atmsSnapshot.empty) {
            return [];
        }
        const atms = atmsSnapshot.docs.map((doc)=>{
            const data = doc.data();
            // Garante que 'reports' seja sempre um array e que os seus timestamps sejam convertidos
            const reports = (data.reports || []).map((report)=>({
                    ...report,
                    timestamp: convertTimestampToString(report.timestamp)
                }));
            return {
                id: doc.id,
                name: data.name || '',
                address: data.address || '',
                location: data.location || {
                    lat: 0,
                    lng: 0
                },
                status: data.status || 'desconhecido',
                details: data.details || '',
                lastUpdate: convertTimestampToString(data.lastUpdate),
                reports: reports
            };
        });
        return atms;
    } catch (error) {
        console.error("Erro ao buscar ATMs do Firestore:", error);
        // Lança um erro para que a API possa retornar uma resposta 500 informativa
        throw new Error('Falha ao buscar ATMs do Firestore.');
    }
}
async function getAtmById(id) {
    try {
        const atmDoc = await db.collection('atms').doc(id).get();
        if (!atmDoc.exists) {
            return null;
        }
        const data = atmDoc.data();
        const reports = (data.reports || []).map((report)=>({
                ...report,
                timestamp: convertTimestampToString(report.timestamp)
            }));
        return {
            id: atmDoc.id,
            name: data.name || '',
            address: data.address || '',
            location: data.location || {
                lat: 0,
                lng: 0
            },
            status: data.status || 'desconhecido',
            details: data.details || '',
            lastUpdate: convertTimestampToString(data.lastUpdate),
            reports: reports
        };
    } catch (error) {
        console.error(`Erro ao buscar ATM com ID ${id}:`, error);
        throw new Error(`Falha ao buscar ATM ${id} do Firestore.`);
    }
}
async function addAtm(atmData) {
    const newAtmRef = db.collection('atms').doc();
    const newAtm = {
        ...atmData,
        status: 'desconhecido',
        lastUpdate: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["firestore"].FieldValue.serverTimestamp(),
        reports: [],
        details: atmData.details || ''
    };
    await newAtmRef.set(newAtm);
    return newAtmRef.id;
}
async function updateAtm(id, atmData) {
    const atmRef = db.collection('atms').doc(id);
    // Garante que a atualização inclua o serverTimestamp
    const updateData = {
        ...atmData,
        lastUpdate: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["firestore"].FieldValue.serverTimestamp()
    };
    await atmRef.update(updateData);
} // Remove a função de criação de utilizador admin, pois não é a abordagem correta para este problema
 // A autenticação do painel de admin será tratada de outra forma
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/atms/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase-admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const atms = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAtms"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(atms);
    } catch (error) {
        console.error('Error fetching ATMs:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        // Validação básica para garantir que os campos essenciais existem
        if (!body.name || !body.address || !body.location || typeof body.location.lat !== 'number' || typeof body.location.lng !== 'number') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing or invalid required ATM fields: name, address, location (lat, lng).'
            }, {
                status: 400
            });
        }
        // A função addAtm já define os valores padrão (status, lastUpdate, reports)
        const newAtmId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addAtm"])(body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            id: newAtmId,
            message: 'ATM added successfully'
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error adding ATM:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal Server Error',
            details: errorMessage
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__ee6f5e0b._.js.map