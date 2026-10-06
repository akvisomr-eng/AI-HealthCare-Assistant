import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL="https://xzhbmytrrftjhpteotoj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_MVXFp9iOvgHHU-OvlHo3Kg_XeWNrZYt";
export const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
export async function getMyOrganization(){
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) return null;
 const {data,error}=await supabase.from("organization_members").select("organization_id,role,organizations(id,name,code)").eq("user_id",user.id).maybeSingle();
 if(error) throw error;
 return data;
}
