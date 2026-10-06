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
  if(path==="/api/admin/prescriptions" && !options.method){
    const {data,error}=await supabase.from("prescriptions").select("*,encounters(clinician_name,started_at,patients(full_name,medical_record_number))").eq("organization_id",organizationId).order("created_at",{ascending:false}); if(error)throw error;
    return {data:(data||[]).map(x=>({...x,patient_name:x.encounters?.patients?.full_name||"Pasien",medical_record_number:x.encounters?.patients?.medical_record_number||"",clinician_name:x.encounters?.clinician_name||"",encounter_started_at:x.encounters?.started_at||null}))};
  }
  if(path.startsWith("/api/admin/prescriptions/") && options.method==="PATCH"){
    const id=path.split("/").pop();
    const allowed=["draft","verified","rejected","dispensing","dispensed","cancelled"];
    if(!allowed.includes(body.status)) throw new Error("Status resep tidak valid.");
    const {data,error}=await supabase.from("prescriptions").update({status:body.status}).eq("id",id).eq("organization_id",organizationId).select().single(); if(error)throw error; return {data};
  }
  if(!options.method && simpleGets[path]){
    const [table,column]=simpleGets[path];
    const {data,error}=await supabase.from(table).select("*").eq("organization_id",organizationId).order(column,{ascending:false}); if(error)throw error; return {data};
  }
  if(path==="/api/admin/inventory-items" && !options.method){
    const {data,error}=await supabase.from("inventory_items").select("*").eq("organization_id",organizationId).order("name",{ascending:true}); if(error)throw error; return {data:data||[]};
  }
  if(path==="/api/admin/inventory-movements" && !options.method){
    const {data,error}=await supabase.from("inventory_movements").select("*,inventory_items(name,sku,unit)").eq("organization_id",organizationId).order("created_at",{ascending:false}); if(error)throw error; return {data:data||[]};
  }
  if(path==="/api/admin/inventory-items" && options.method==="POST"){
    const {data,error}=await supabase.from("inventory_items").insert({organization_id:organizationId,sku:body.sku,name:body.name,category:body.category||null,unit:body.unit||"unit",quantity:Number(body.quantity)||0,minimum_stock:Number(body.minimumStock)||0,unit_cost:Number(body.unitCost)||0,expiry_date:body.expiryDate||null,batch_number:body.batchNumber||null,location:body.location||null}).select().single(); if(error)throw error; return {data};
  }
  if(path.startsWith("/api/admin/inventory-items/") && options.method==="PATCH"){
    const id=path.split("/").pop();
    const patch={}; if(body.quantity!==undefined)patch.quantity=Number(body.quantity)||0; if(body.minimumStock!==undefined)patch.minimum_stock=Number(body.minimumStock)||0; if(body.location!==undefined)patch.location=body.location||null; if(body.expiryDate!==undefined)patch.expiry_date=body.expiryDate||null; if(body.batchNumber!==undefined)patch.batch_number=body.batchNumber||null;
    const {data,error}=await supabase.from("inventory_items").update(patch).eq("id",id).eq("organization_id",organizationId).select().single(); if(error)throw error; return {data};
  }
  if(path==="/api/admin/inventory-movements" && options.method==="POST"){
    const qty=Number(body.quantity); if(!Number.isFinite(qty)||qty===0)throw new Error("Jumlah mutasi tidak valid.");
    const {data:item,error:itemError}=await supabase.from("inventory_items").select("quantity").eq("id",body.inventoryItemId).eq("organization_id",organizationId).single(); if(itemError)throw itemError;
    const delta=body.movementType==="outbound"?-Math.abs(qty):Math.abs(qty);
    if(body.movementType==="adjustment"||body.movementType==="transfer") { }
    const next=Number(item.quantity)+delta; if(next<0)throw new Error("Stok tidak mencukupi.");
    const {data,error}=await supabase.from("inventory_movements").insert({organization_id:organizationId,inventory_item_id:body.inventoryItemId,movement_type:body.movementType||"adjustment",quantity:qty,reference:body.reference||null,notes:body.notes||null,created_by:(await supabase.auth.getUser()).data.user?.id||null}).select().single(); if(error)throw error;
    const {data:updated,error:updateError}=await supabase.from("inventory_items").update({quantity:next}).eq("id",body.inventoryItemId).eq("organization_id",organizationId).select().single(); if(updateError)throw updateError;
    return {data, item:updated};
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
  if(path.startsWith("/api/admin/work-items/") && !options.method){
    const moduleKey=decodeURIComponent(path.split("/").pop());
    const {data,error}=await supabase.from("module_work_items").select("*").eq("organization_id",organizationId).eq("module_key",moduleKey).order("updated_at",{ascending:false});
    if(error)throw error; return {data:data||[]};
  }
  if(path==="/api/admin/work-items" && options.method==="POST"){
    const {data,error}=await supabase.from("module_work_items").insert({organization_id:organizationId,module_key:body.moduleKey,title:body.title,reference:body.reference||null,status:body.status||"draft",amount:body.amount||null,due_date:body.dueDate||null,notes:body.notes||null,created_by:(await supabase.auth.getUser()).data.user?.id||null}).select().single();
    if(error)throw error; return {data};
  }
  if(path==="/api/admin/suppliers" && !options.method){
    const {data,error}=await supabase.from("suppliers").select("*").eq("organization_id",organizationId).order("name",{ascending:true});
    if(error) throw error; return {data:data||[]};
  }
  if(path==="/api/admin/suppliers" && options.method==="POST"){
    const {data,error}=await supabase.from("suppliers").insert({organization_id:organizationId,supplier_code:body.supplierCode,name:body.name,contact_name:body.contactName||null,phone:body.phone||null,email:body.email||null,address:body.address||null,tax_number:body.taxNumber||null,status:body.status||"active"}).select().single();
    if(error) throw error; return {data};
  }
  if(path.startsWith("/api/admin/suppliers/") && options.method==="PATCH"){
    const id=path.split("/").pop(); const patch={};
    if(body.name!==undefined) patch.name=body.name;
    if(body.contactName!==undefined) patch.contact_name=body.contactName||null;
    if(body.phone!==undefined) patch.phone=body.phone||null;
    if(body.email!==undefined) patch.email=body.email||null;
    if(body.address!==undefined) patch.address=body.address||null;
    if(body.taxNumber!==undefined) patch.tax_number=body.taxNumber||null;
    if(body.status!==undefined) patch.status=body.status;
    const {data,error}=await supabase.from("suppliers").update(patch).eq("id",id).eq("organization_id",organizationId).select().single();
    if(error) throw error; return {data};
  }
  if(path==="/api/admin/purchase-orders" && !options.method){
    const {data,error}=await supabase.from("purchase_orders").select("*,suppliers(name,supplier_code)").eq("organization_id",organizationId).order("updated_at",{ascending:false});
    if(error) throw error; return {data:(data||[]).map(x=>({...x,supplier_name:x.suppliers?.name||"—",supplier_code:x.suppliers?.supplier_code||"—"}))};
  }
  if(path==="/api/admin/purchase-orders" && options.method==="POST"){
    const {data,error}=await supabase.from("purchase_orders").insert({organization_id:organizationId,purchase_request_id:body.purchaseRequestId||null,supplier_id:body.supplierId||null,order_number:body.orderNumber,order_date:body.orderDate||new Date().toISOString().slice(0,10),expected_date:body.expectedDate||null,total_amount:Number(body.totalAmount)||0,notes:body.notes||null,created_by:(await supabase.auth.getUser()).data.user?.id||null}).select().single();
    if(error) throw error; return {data};
  }
  if(path.startsWith("/api/admin/purchase-orders/") && options.method==="PATCH"){
    const id=path.split("/").pop(); const patch={};
    if(body.status!==undefined) patch.status=body.status;
    if(body.supplierId!==undefined) patch.supplier_id=body.supplierId||null;
    if(body.expectedDate!==undefined) patch.expected_date=body.expectedDate||null;
    if(body.totalAmount!==undefined) patch.total_amount=Number(body.totalAmount)||0;
    if(body.notes!==undefined) patch.notes=body.notes||null;
    const {data,error}=await supabase.from("purchase_orders").update(patch).eq("id",id).eq("organization_id",organizationId).select().single();
    if(error) throw error; return {data};
  }
  if(path==="/api/admin/vendor-invoices" && !options.method){
    const {data,error}=await supabase.from("vendor_invoices").select("*,suppliers(name,supplier_code),purchase_orders(order_number),goods_receipts(receipt_number)").eq("organization_id",organizationId).order("updated_at",{ascending:false});
    if(error) throw error; return {data:(data||[]).map(x=>({...x,supplier_name:x.suppliers?.name||"—",supplier_code:x.suppliers?.supplier_code||"—",order_number:x.purchase_orders?.order_number||"—",receipt_number:x.goods_receipts?.receipt_number||"—"}))};
  }
  if(path==="/api/admin/vendor-invoices" && options.method==="POST"){
    const user=(await supabase.auth.getUser()).data.user;
    const {data,error}=await supabase.from("vendor_invoices").insert({organization_id:organizationId,supplier_id:body.supplierId||null,purchase_order_id:body.purchaseOrderId||null,goods_receipt_id:body.goodsReceiptId||null,invoice_number:body.invoiceNumber,invoice_date:body.invoiceDate||new Date().toISOString().slice(0,10),due_date:body.dueDate||null,status:body.status||"received",subtotal:Number(body.subtotal)||0,tax_amount:Number(body.taxAmount)||0,total_amount:Number(body.totalAmount)||0,notes:body.notes||null,created_by:user?.id||null}).select().single();
    if(error) throw error; return {data};
  }
  if(path.startsWith("/api/admin/vendor-invoices/") && options.method==="PATCH"){
    const id=path.split("/").pop(); const patch={};
    if(body.status!==undefined) patch.status=body.status;
    if(body.dueDate!==undefined) patch.due_date=body.dueDate||null;
    if(body.subtotal!==undefined) patch.subtotal=Number(body.subtotal)||0;
    if(body.taxAmount!==undefined) patch.tax_amount=Number(body.taxAmount)||0;
    if(body.totalAmount!==undefined) patch.total_amount=Number(body.totalAmount)||0;
    if(body.notes!==undefined) patch.notes=body.notes||null;
    const {data,error}=await supabase.from("vendor_invoices").update(patch).eq("id",id).eq("organization_id",organizationId).select().single();
    if(error) throw error; return {data};
  }
  if(path==="/api/admin/goods-receipts" && !options.method){
    const {data,error}=await supabase.from("goods_receipts").select("*,purchase_orders(order_number),suppliers(name)").eq("organization_id",organizationId).order("updated_at",{ascending:false});
    if(error) throw error; return {data:(data||[]).map(x=>({...x,order_number:x.purchase_orders?.order_number||"—",supplier_name:x.suppliers?.name||"—"}))};
  }
  if(path==="/api/admin/goods-receipts" && options.method==="POST"){
    const {data,error}=await supabase.from("goods_receipts").insert({organization_id:organizationId,purchase_order_id:body.purchaseOrderId||null,receipt_number:body.receiptNumber,supplier_id:body.supplierId||null,received_at:body.receivedAt||new Date().toISOString(),status:body.status||"received",total_amount:Number(body.totalAmount)||0,notes:body.notes||null,created_by:(await supabase.auth.getUser()).data.user?.id||null}).select().single();
    if(error) throw error; return {data};
  }
  if(path.startsWith("/api/admin/goods-receipts/") && options.method==="PATCH"){
    const id=path.split("/").pop(); const patch={};
    if(body.status!==undefined) patch.status=body.status;
    if(body.totalAmount!==undefined) patch.total_amount=Number(body.totalAmount)||0;
    if(body.notes!==undefined) patch.notes=body.notes||null;
    const {data,error}=await supabase.from("goods_receipts").update(patch).eq("id",id).eq("organization_id",organizationId).select().single();
    if(error) throw error; return {data};
  }
  if(path==="/api/admin/purchase-requests" && !options.method){
    const {data,error}=await supabase.from("purchase_requests").select("*").eq("organization_id",organizationId).order("updated_at",{ascending:false});
    if(error) throw error; return {data:data||[]};
  }
  if(path==="/api/admin/purchase-requests" && options.method==="POST"){
    const {data,error}=await supabase.from("purchase_requests").insert({organization_id:organizationId,request_number:body.requestNumber,title:body.title,description:body.description||null,supplier_name:body.supplierName||null,total_amount:Number(body.totalAmount)||0,branch_id:body.branchId||null,requested_by:body.requestedBy||null}).select().single();
    if(error) throw error; return {data};
  }
  if(path.startsWith("/api/admin/purchase-requests/") && options.method==="PATCH"){
    const id=path.split("/").pop(); const patch={};
    if(body.status!==undefined) patch.status=body.status;
    if(body.supplierName!==undefined) patch.supplier_name=body.supplierName||null;
    if(body.totalAmount!==undefined) patch.total_amount=Number(body.totalAmount)||0;
    if(body.description!==undefined) patch.description=body.description||null;
    if(body.status==="approved") patch.approved_at=new Date().toISOString();
    const {data,error}=await supabase.from("purchase_requests").update(patch).eq("id",id).eq("organization_id",organizationId).select().single();
    if(error) throw error; return {data};
  }
  if(path.startsWith("/api/admin/work-items/") && options.method==="PATCH"){
    const id=path.split("/").pop();
    const patch={}; if(body.status!==undefined) patch.status=body.status; if(body.title!==undefined) patch.title=body.title; if(body.reference!==undefined) patch.reference=body.reference||null; if(body.amount!==undefined) patch.amount=body.amount||null; if(body.dueDate!==undefined) patch.due_date=body.dueDate||null; if(body.notes!==undefined) patch.notes=body.notes||null; const {data,error}=await supabase.from("module_work_items").update(patch).eq("id",id).eq("organization_id",organizationId).select().single();
    if(error)throw error; return {data};
  }
  throw new Error("Endpoint Admin belum tersedia: "+path);
}
export const apiGet=path=>request(path);
export const apiPost=(path,body)=>request(path,{method:"POST",body:JSON.stringify(body)});
export const apiPatch=(path,body)=>request(path,{method:"PATCH",body:JSON.stringify(body)});