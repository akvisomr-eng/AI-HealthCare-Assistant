import { supabase, getMyOrganization } from "./supabase";

export function isApiConfigured(){ return true; }

async function orgId(){
  const membership=await getMyOrganization();
  if(!membership?.organization_id) throw new Error("Akun belum memiliki organisasi klinik.");
  return membership.organization_id;
}

async function request(path,options={}){
  const organizationId=await orgId();
  const body=options.body?JSON.parse(options.body):{};
  if(path==="/api/admin/patients" && !options.method){
    const {data,error}=await supabase.from("patients").select("*").eq("organization_id",organizationId).order("updated_at",{ascending:false}); if(error)throw error; return {data};
  }
  if(path==="/api/admin/appointments" && !options.method){
    const {data,error}=await supabase.from("appointments").select("*,patients(full_name)").eq("organization_id",organizationId).order("appointment_date",{ascending:true}).order("appointment_time",{ascending:true}); if(error)throw error;
    return {data:(data||[]).map(x=>({...x,patient_name:x.patients?.full_name||"Pasien"}))};
  }
  if(path==="/api/admin/encounters" && !options.method){
    const {data,error}=await supabase.from("encounters").select("*,patients(full_name,medical_record_number)").eq("organization_id",organizationId).order("started_at",{ascending:false}); if(error)throw error;
    return {data:(data||[]).map(x=>({...x,patient_name:x.patients?.full_name||"Pasien",medical_record_number:x.patients?.medical_record_number||""}))};
  }
  const simpleGets={
    "/api/admin/diagnoses":["diagnoses","created_at"],
    "/api/admin/procedures":["procedures","created_at"],
    "/api/admin/prescriptions":["prescriptions","created_at"],
    "/api/admin/referrals":["referrals","created_at"]
  };
  if(!options.method && simpleGets[path]){
    const [table,column]=simpleGets[path];
    const {data,error}=await supabase.from(table).select("*").eq("organization_id",organizationId).order(column,{ascending:false}); if(error)throw error; return {data};
  }
  if(path==="/api/admin/rme-history" && !options.method){
    const {data,error}=await supabase.from("encounters").select("id,patient_id,clinician_name,started_at,status,subjective,objective,assessment,plan,patients(full_name,medical_record_number)").eq("organization_id",organizationId).order("started_at",{ascending:false}); if(error)throw error;
    return {data:(data||[]).map(x=>({...x,patient_name:x.patients?.full_name||"Pasien",medical_record_number:x.patients?.medical_record_number||""}))};
  }
  if(path.startsWith("/api/admin/encounters/") && options.method==="PATCH"){
    const id=path.split("/").pop(); const {data,error}=await supabase.from("encounters").update({subjective:body.subjective||null,objective:body.objective||null,assessment:body.assessment||null,plan:body.plan||null}).eq("id",id).eq("organization_id",organizationId).select().single(); if(error)throw error; return {data};
  }
  const insertMap={
    "/api/admin/diagnoses":["diagnoses",{encounter_id:body.encounterId,code:body.code,name:body.name,type:body.type||"secondary",notes:body.notes||null}],
    "/api/admin/procedures":["procedures",{encounter_id:body.encounterId,code:body.code,name:body.name,quantity:body.quantity||1,notes:body.notes||null}],
    "/api/admin/prescriptions":["prescriptions",{encounter_id:body.encounterId,medication_id:body.medicationId||null,medication_name:body.medicationName,dosage:body.dosage||null,frequency:body.frequency||null,duration:body.duration||null,quantity:body.quantity||null,instructions:body.instructions||null,status:"draft"}],
    "/api/admin/referrals":["referrals",{encounter_id:body.encounterId,destination:body.destination,specialty:body.specialty||null,reason:body.reason,urgency:body.urgency||"routine",notes:body.notes||null,status:"draft"}]
  };
  if(options.method==="POST" && insertMap[path]){
    const [table,payload]=insertMap[path]; const {data,error}=await supabase.from(table).insert({organization_id:organizationId,...payload}).select().single(); if(error)throw error; return {data};
  }
  if(path==="/api/admin/patients" && options.method==="POST"){
    const {data,error}=await supabase.from("patients").insert({organization_id:organizationId,medical_record_number:body.medicalRecordNumber,full_name:body.fullName,gender:body.gender,birth_date:body.birthDate||null,phone:body.phone||null}).select().single(); if(error)throw error; return {data};
  }
  if(path==="/api/admin/encounters" && options.method==="POST"){
    const {data,error}=await supabase.from("encounters").insert({organization_id:organizationId,patient_id:body.patientId,appointment_id:body.appointmentId||null,clinician_name:body.clinicianName,started_at:body.startedAt||new Date().toISOString(),status:body.status||"in_progress",subjective:body.subjective||null,objective:body.objective||null,assessment:body.assessment||null,plan:body.plan||null}).select().single(); if(error)throw error; return {data};
  }
  if(path==="/api/admin/appointments" && options.method==="POST"){
    const {data,error}=await supabase.from("appointments").insert({organization_id:organizationId,patient_id:body.patientId,doctor_name:body.doctorName,service:body.service,appointment_date:body.appointmentDate,appointment_time:body.appointmentTime,status:"scheduled"}).select().single(); if(error)throw error; return {data};
  }
  throw new Error("Endpoint Admin belum tersedia: "+path);
}
export const apiGet=path=>request(path);
export const apiPost=(path,body)=>request(path,{method:"POST",body:JSON.stringify(body)});
export const apiPatch=(path,body)=>request(path,{method:"PATCH",body:JSON.stringify(body)});