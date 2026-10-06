const json = (data, status = 200, origin = "*") => new Response(JSON.stringify(data), {
  status, headers: { "content-type":"application/json; charset=utf-8", "access-control-allow-origin":origin,
    "access-control-allow-headers":"Authorization, Content-Type, X-Actor-Id",
    "access-control-allow-methods":"GET, POST, OPTIONS", "cache-control":"no-store" }
});
const now = () => new Date().toISOString();
const makeId = prefix => prefix + "_" + crypto.randomUUID();
async function sha256(value) { const bytes=new TextEncoder().encode(value); const digest=await crypto.subtle.digest("SHA-256",bytes); return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join(""); }
function originFor(env){ return env.ALLOWED_ORIGIN || "*"; }
function bearer(request){ const v=request.headers.get("authorization") || ""; return v.startsWith("Bearer ") ? v.slice(7) : ""; }
async function requireAdmin(request,env){ return !!env.ADMIN_API_TOKEN && bearer(request) === env.ADMIN_API_TOKEN; }
async function audit(env,request,action,entityType,entityId,payload){
  const previous=await env.DB.prepare("SELECT event_hash FROM audit_events ORDER BY created_at DESC LIMIT 1").first();
  const previousHash=previous?.event_hash || "GENESIS"; const createdAt=now();
  const actorId=request.headers.get("x-actor-id") || "admin"; const payloadJson=JSON.stringify(payload);
  const eventHash=await sha256([previousHash,actorId,action,entityType,entityId||"",payloadJson,createdAt].join("|"));
  await env.DB.prepare("INSERT INTO audit_events (id,actor_id,action,entity_type,entity_id,payload_json,previous_hash,event_hash,created_at) VALUES (?,?,?,?,?,?,?,?,?)")
    .bind(makeId("audit"),actorId,action,entityType,entityId||null,payloadJson,previousHash,eventHash,createdAt).run();
}
async function handle(request,env){
  const origin=originFor(env); if(request.method==="OPTIONS") return json({},204,origin);
  const url=new URL(request.url); const path=url.pathname.replace(/\/+$/,"") || "/";
  if(path==="/api/health" && request.method==="GET") return json({ok:true,service:"sehatkita-clinic-api",version:"0.1.0",time:now()},200,origin);
  if(!(await requireAdmin(request,env))) return json({error:"UNAUTHORIZED",message:"Autentikasi admin diperlukan."},401,origin);
  if(path==="/api/admin/patients" && request.method==="GET"){
    const q=(url.searchParams.get("q")||"").trim();
    const r=q ? await env.DB.prepare("SELECT id,medical_record_number,full_name,gender,birth_date,phone,status,created_at,updated_at FROM patients WHERE full_name LIKE ? OR medical_record_number LIKE ? ORDER BY updated_at DESC LIMIT 100").bind("%"+q+"%","%"+q+"%").all()
      : await env.DB.prepare("SELECT id,medical_record_number,full_name,gender,birth_date,phone,status,created_at,updated_at FROM patients ORDER BY updated_at DESC LIMIT 100").all();
    return json({data:r.results||[]},200,origin);
  }
  if(path==="/api/admin/patients" && request.method==="POST"){
    const b=await request.json(); if(!b.fullName||!b.medicalRecordNumber) return json({error:"VALIDATION_ERROR",message:"Nama dan nomor rekam medis wajib diisi."},400,origin);
    const patientId=makeId("pat"), t=now();
    await env.DB.prepare("INSERT INTO patients (id,medical_record_number,full_name,gender,birth_date,phone,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?, ?,?)")
      .bind(patientId,b.medicalRecordNumber,b.fullName,b.gender||"X",b.birthDate||null,b.phone||null,"ACTIVE",t,t).run();
    await audit(env,request,"CREATE","patient",patientId,{medicalRecordNumber:b.medicalRecordNumber});
    return json({data:{id:patientId}},201,origin);
  }
  if(path==="/api/admin/appointments" && request.method==="GET"){
    const date=url.searchParams.get("date");
    const sql=date ? "SELECT a.*,p.medical_record_number,p.full_name AS patient_name FROM appointments a JOIN patients p ON p.id=a.patient_id WHERE a.appointment_date=? ORDER BY a.appointment_time ASC" : "SELECT a.*,p.medical_record_number,p.full_name AS patient_name FROM appointments a JOIN patients p ON p.id=a.patient_id ORDER BY a.appointment_date DESC,a.appointment_time ASC LIMIT 100";
    const r=date ? await env.DB.prepare(sql).bind(date).all() : await env.DB.prepare(sql).all(); return json({data:r.results||[]},200,origin);
  }
  if(path==="/api/admin/appointments" && request.method==="POST"){
    const b=await request.json(); const required=["patientId","doctorName","service","appointmentDate","appointmentTime"];
    if(required.some(k=>!b[k])) return json({error:"VALIDATION_ERROR",message:"Data janji temu belum lengkap."},400,origin);
    const appointmentId=makeId("apt"),t=now();
    await env.DB.prepare("INSERT INTO appointments (id,patient_id,doctor_name,service,appointment_date,appointment_time,status,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?, ?,?,?)")
      .bind(appointmentId,b.patientId,b.doctorName,b.service,b.appointmentDate,b.appointmentTime,"SCHEDULED",b.notes||null,t,t).run();
    await audit(env,request,"CREATE","appointment",appointmentId,{patientId:b.patientId,appointmentDate:b.appointmentDate});
    return json({data:{id:appointmentId}},201,origin);
  }
  if(path==="/api/admin/audit" && request.method==="GET"){ const r=await env.DB.prepare("SELECT id,actor_id,action,entity_type,entity_id,previous_hash,event_hash,created_at FROM audit_events ORDER BY created_at DESC LIMIT 100").all(); return json({data:r.results||[]},200,origin); }
  return json({error:"NOT_FOUND",message:"Endpoint tidak ditemukan."},404,origin);
}
export default { async fetch(request,env){ try{return await handle(request,env);}catch(error){console.error(error);return json({error:"INTERNAL_ERROR",message:"Terjadi kesalahan layanan."},500,originFor(env));} } };
export { handle, sha256 };