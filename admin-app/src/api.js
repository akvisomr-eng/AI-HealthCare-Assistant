const TOKEN_KEY="sehatkita_admin_api_token";
export function isApiConfigured(){ return Boolean(process.env.REACT_APP_API_URL); }
export function getApiToken(){ return sessionStorage.getItem(TOKEN_KEY)||""; }
export function setApiToken(token){ if(token) sessionStorage.setItem(TOKEN_KEY,token.trim()); else sessionStorage.removeItem(TOKEN_KEY); }
async function request(path,options={}){
  const base=process.env.REACT_APP_API_URL;
  if(!base) throw new Error("API URL belum dikonfigurasi");
  const headers={"content-type":"application/json",...(options.headers||{})};
  const token=getApiToken();
  if(token) headers.authorization="Bearer "+token;
  const res=await fetch(base.replace(/\/$/,"")+path,{...options,headers});
  const data=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.message||"Permintaan API gagal");
  return data;
}
export const apiGet=path=>request(path);
export const apiPost=(path,body)=>request(path,{method:"POST",body:JSON.stringify(body)});
