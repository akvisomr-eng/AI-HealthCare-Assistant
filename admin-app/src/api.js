import { supabase, getMyOrganization } from "./supabase";

export function isApiConfigured(){ return true; }

async function orgId(){
  const membership=await getMyOrganization();
  if(!membership?.organization_id) throw new Error("Akun belum memiliki organisasi klinik.");
  return membership.organization_id;
}

async function request(path,options={}){
  const organizationId=await orgId();
  if(path==="/api/admin/patients" && !options.method){
    const {data,error}=await supabase.from("patients").select("*").eq("organization_id",organizationId).order("updated_at",{ascending:false});
    if(error) throw error;
    return {data};
  }
  if(path==="/api/admin/appointments" && !options.method){
    const {data,error}=await supabase.from("appointments").select("*,patients(full_name)").eq("organization_id",organizationId).order("appointment_date",{ascending:true}).order("appointment_time",{ascending:true});
    if(error) throw error;
    return {data:(data||[]).map(x=>({...x,patient_name:x.patients?.full_name||"Pasien"}))};
  }
  const body=options.body?JSON.parse(options.body):{};
  if(path==="/api/admin/patients" && options.method==="POST"){
    const {data,error}=await supabase.from("patients").insert({
      organization_id:organizationId,
      medical_record_number:body.medicalRecordNumber,
      full_name:body.fullName,
      gender:body.gender,
      birth_date:body.birthDate||null,
      phone:body.phone||null
    }).select().single();
    if(error) throw error;
    return {data};
  }
  if(path==="/api/admin/appointments" && options.method==="POST"){
    const {data,error}=await supabase.from("appointments").insert({
      organization_id:organizationId,
      patient_id:body.patientId,
      doctor_name:body.doctorName,
      service:body.service,
      appointment_date:body.appointmentDate,
      appointment_time:body.appointmentTime,
      status:"scheduled"
    }).select().single();
    if(error) throw error;
    return {data};
  }
  throw new Error("Endpoint Admin belum tersedia: "+path);
}

export const apiGet=path=>request(path);
export const apiPost=(path,body)=>request(path,{method:"POST",body:JSON.stringify(body)});
