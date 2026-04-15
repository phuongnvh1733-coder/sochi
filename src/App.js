import { useState, useMemo, useCallback, memo } from "react";

// ─── Constants outside components (no re-creation on render) ─────
const BG      = "#FAF7F2";
const BG2     = "#F0E9DF";
const BG3     = "#E4D9CC";
const SURFACE = "#FFFFFF";
const BROWN_D = "#3D2B1F";
const BROWN_M = "#6B4C3B";
const BROWN_L = "#9C7B6B";
const BROWN_XL= "#C4A99A";
const ACCENT  = "#8B4513";
const ACCENT_L= "#B5622A";
const GREEN   = "#3A7D44";
const GREEN_BG= "#EAF3EC";
const RED     = "#B03A2E";
const RED_BG  = "#FAEDEC";
const GOLD    = "#8A6914";
const GOLD_BG = "#FBF5E6";
const WHITE   = "#FFFFFF";

const CHI_CATS = {
  "Thuê Nhà & Tiện Ích": {
    icon:"🏠", color:"#5C4033",
    items:[
      {key:"rent",    label:"Tiền thuê nhà",    icon:"🏠", hint:"VD: 8,500,000"},
      {key:"elec",    label:"Điện",              icon:"⚡", hint:"VD: 450,000"},
      {key:"water",   label:"Nước",              icon:"💧", hint:"VD: 120,000"},
      {key:"net",     label:"Internet / Mạng",   icon:"📶", hint:"VD: 270,000"},
      {key:"gas",     label:"Gas",               icon:"🔥", hint:"VD: 80,000"},
    ]
  },
  "Ăn Uống": {
    icon:"🍜", color:"#8B4513",
    items:[
      {key:"market",  label:"Chợ / Siêu thị",   icon:"🛒", hint:"VD: 500,000"},
      {key:"bfast",   label:"Bữa sáng",          icon:"🥐", hint:"VD: 50,000"},
      {key:"lunch",   label:"Bữa trưa",          icon:"🍱", hint:"VD: 60,000"},
      {key:"dinner",  label:"Bữa tối",           icon:"🍽️", hint:"VD: 80,000"},
      {key:"outside", label:"Ăn ngoài",          icon:"🍜", hint:"VD: 200,000"},
      {key:"cafe",    label:"Cafe / Trà sữa",    icon:"☕", hint:"VD: 60,000"},
    ]
  },
  "Em Bé": {
    icon:"👶", color:"#9B4A6A",
    items:[
      {key:"milk",    label:"Sữa / Ăn dặm",     icon:"🍼", hint:"VD: 620,000"},
      {key:"diaper",  label:"Tã bỉm",            icon:"🧷", hint:"VD: 350,000"},
      {key:"clothes", label:"Quần áo bé",        icon:"👕", hint:"VD: 200,000"},
      {key:"school",  label:"Học phí / Nhà trẻ", icon:"🎒", hint:"VD: 2,500,000"},
      {key:"toys",    label:"Đồ chơi",           icon:"🧸", hint:"VD: 150,000"},
      {key:"doctor",  label:"Khám bệnh bé",      icon:"🏥", hint:"VD: 200,000"},
    ]
  },
  "Chi Cá Nhân Ba": {
    icon:"👨", color:"#2E6B8A",
    items:[
      {key:"fuel_h",  label:"Xăng xe",           icon:"⛽", hint:"VD: 120,000"},
      {key:"food_h",  label:"Ăn uống riêng",     icon:"🍱", hint:"VD: 50,000"},
      {key:"cloth_h", label:"Quần áo",           icon:"👔", hint:"VD: 300,000"},
      {key:"hair_h",  label:"Cắt tóc",           icon:"✂️", hint:"VD: 80,000"},
      {key:"health_h",label:"Sức khỏe",          icon:"💊", hint:"VD: 100,000"},
    ]
  },
  "Chi Cá Nhân Mẹ": {
    icon:"👩", color:"#7A4A8A",
    items:[
      {key:"fuel_w",  label:"Xăng xe",           icon:"⛽", hint:"VD: 120,000"},
      {key:"food_w",  label:"Ăn uống riêng",     icon:"🍱", hint:"VD: 50,000"},
      {key:"beauty",  label:"Quần áo / Mỹ phẩm", icon:"💄", hint:"VD: 400,000"},
      {key:"salon",   label:"Làm tóc / Nail",    icon:"💅", hint:"VD: 250,000"},
      {key:"health_w",label:"Sức khỏe",          icon:"💊", hint:"VD: 100,000"},
    ]
  },
  "Giải Trí & Du Lịch": {
    icon:"🎉", color:"#8A6914",
    items:[
      {key:"entertain",label:"Xem phim / Giải trí",icon:"🎬",hint:"VD: 150,000"},
      {key:"travel",   label:"Du lịch",            icon:"✈️",hint:"VD: 2,000,000"},
      {key:"gift",     label:"Quà tặng",           icon:"🎁",hint:"VD: 300,000"},
      {key:"party",    label:"Tiệc / Đám tiệc",    icon:"🎊",hint:"VD: 500,000"},
    ]
  },
  "Tiết Kiệm & Đầu Tư": {
    icon:"🏦", color:"#3A7D44",
    items:[
      {key:"emergency",label:"Quỹ khẩn cấp",       icon:"🚨",hint:"VD: 2,000,000"},
      {key:"saving",   label:"Tiết kiệm định kỳ",  icon:"🏦",hint:"VD: 2,000,000"},
      {key:"invest",   label:"Đầu tư",             icon:"📈",hint:"VD: 1,000,000"},
      {key:"baby_fund",label:"Quỹ cho bé",         icon:"🎓",hint:"VD: 500,000"},
    ]
  },
};

const THU_CATS = {
  "Lương Chồng":    { icon:"👨‍💼", color:"#2E6B8A", subs:["Lương tháng","Thưởng","Phụ cấp","Overtime"] },
  "Lương Vợ":       { icon:"👩‍💼", color:"#7A4A8A", subs:["Lương tháng","Thưởng","Phụ cấp","Overtime"] },
  "Thu Nhập Chung": { icon:"💼",   color:"#3A7D44", subs:["Đầu tư / Lãi","Cho thuê","Bán đồ","Tiền mừng","Khác"] },
};

const PAYMENT = ["Tiền mặt","Chuyển khoản","Thẻ tín dụng","Ví MoMo"];
const MS  = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
const MVN = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
             "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
const NOW = new Date();
const Y   = NOW.getFullYear();
const mkD = (m,d) => `${Y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

const SEED = [
  {id:1, date:mkD(4,1), type:"Thu",cat:"Lương Chồng",        sub:"Lương tháng",    desc:"Lương T4",          amount:18000000,pay:"Chuyển khoản"},
  {id:2, date:mkD(4,1), type:"Thu",cat:"Lương Vợ",           sub:"Lương tháng",    desc:"Lương T4",          amount:14000000,pay:"Chuyển khoản"},
  {id:3, date:mkD(4,2), type:"Chi",cat:"Thuê Nhà & Tiện Ích",sub:"Tiền thuê nhà",  desc:"Thuê nhà T4",       amount:8500000, pay:"Chuyển khoản"},
  {id:4, date:mkD(4,3), type:"Chi",cat:"Thuê Nhà & Tiện Ích",sub:"Điện",           desc:"Tiền điện T4",      amount:450000,  pay:"Chuyển khoản"},
  {id:5, date:mkD(4,5), type:"Chi",cat:"Ăn Uống",            sub:"Chợ / Siêu thị", desc:"Chợ đầu tuần",     amount:380000,  pay:"Tiền mặt"},
  {id:6, date:mkD(4,6), type:"Chi",cat:"Ăn Uống",            sub:"Bữa sáng",       desc:"Bánh mì + cà phê", amount:65000,   pay:"Tiền mặt"},
  {id:7, date:mkD(4,7), type:"Chi",cat:"Em Bé",              sub:"Sữa / Ăn dặm",   desc:"Sữa Nan tháng",    amount:620000,  pay:"Thẻ tín dụng"},
  {id:8, date:mkD(4,8), type:"Chi",cat:"Em Bé",              sub:"Tã bỉm",          desc:"Tã Pampers",       amount:350000,  pay:"Thẻ tín dụng"},
  {id:9, date:mkD(4,9), type:"Chi",cat:"Chi Cá Nhân Ba",     sub:"Xăng xe",         desc:"Xăng xe máy",     amount:120000,  pay:"Tiền mặt"},
  {id:10,date:mkD(4,10),type:"Chi",cat:"Chi Cá Nhân Mẹ",    sub:"Ăn uống riêng",   desc:"Cơm trưa VP",     amount:45000,   pay:"Tiền mặt"},
  {id:11,date:mkD(4,11),type:"Chi",cat:"Ăn Uống",            sub:"Ăn ngoài",        desc:"Bữa tối gia đình",amount:320000,  pay:"Tiền mặt"},
  {id:12,date:mkD(4,12),type:"Chi",cat:"Em Bé",              sub:"Học phí / Nhà trẻ",desc:"Nhà trẻ T4",     amount:2500000, pay:"Chuyển khoản"},
  {id:13,date:mkD(4,13),type:"Chi",cat:"Tiết Kiệm & Đầu Tư",sub:"Quỹ khẩn cấp",   desc:"Tiết kiệm T4",    amount:3000000, pay:"Chuyển khoản"},
  {id:14,date:mkD(3,1), type:"Thu",cat:"Lương Chồng",        sub:"Lương tháng",     desc:"Lương T3",        amount:18000000,pay:"Chuyển khoản"},
  {id:15,date:mkD(3,1), type:"Thu",cat:"Lương Vợ",           sub:"Lương tháng",     desc:"Lương T3",        amount:14000000,pay:"Chuyển khoản"},
  {id:16,date:mkD(3,5), type:"Chi",cat:"Thuê Nhà & Tiện Ích",sub:"Tiền thuê nhà",   desc:"Thuê nhà T3",    amount:8500000, pay:"Chuyển khoản"},
  {id:17,date:mkD(2,1), type:"Thu",cat:"Lương Chồng",        sub:"Lương tháng",     desc:"Lương T2",        amount:18000000,pay:"Chuyển khoản"},
  {id:18,date:mkD(2,1), type:"Thu",cat:"Lương Vợ",           sub:"Thưởng",          desc:"Thưởng Tết",      amount:5000000, pay:"Chuyển khoản"},
];

const GOALS_DATA = [
  {id:1,name:"Quỹ Khẩn Cấp",   icon:"🚨",color:ACCENT,   deadline:"12/2026",target:90000000, saved:30000000},
  {id:2,name:"Mua Nhà",         icon:"🏠",color:"#5C4033", deadline:"12/2028",target:500000000,saved:55000000},
  {id:3,name:"Học Phí Đại Học", icon:"🎓",color:GREEN,     deadline:"09/2030",target:200000000,saved:10000000},
  {id:4,name:"Du Lịch Nhật",    icon:"✈️",color:"#7A4A8A", deadline:"06/2027",target:30000000, saved:5000000},
];

const fmtM    = n => n>=1000000?(n/1000000).toFixed(1).replace(/\.0$/,"")+"M":n>=1000?Math.round(n/1000)+"K":n.toString();
const fmtDate = s => { const d=new Date(s); return `${d.getDate()}/${d.getMonth()+1}`; };
const getM    = s => new Date(s).getMonth();

// ─── Static styles ────────────────────────────────────────────────
const S = {
  app:  { maxWidth:390, margin:"0 auto", minHeight:"100vh", background:BG,
          color:BROWN_D, fontFamily:"'Georgia','Palatino',serif", overflowX:"hidden" },
  scr:  { paddingBottom:90 },
  hdr:  { background:`linear-gradient(160deg,${BROWN_D},${BROWN_M})`, padding:"52px 20px 22px" },
  hdrRow:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" },
  mstrip:{ display:"flex", gap:6, padding:"12px 16px", overflowX:"auto", scrollbarWidth:"none",
           background:SURFACE, borderBottom:`1px solid ${BG3}` },
  sec:  { padding:"0 16px", marginBottom:20 },
  stl:  { fontSize:10, fontWeight:700, color:BROWN_XL, letterSpacing:"1.5px",
          textTransform:"uppercase", marginBottom:10 },
  txR:  { display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
          borderRadius:14, marginBottom:8, background:SURFACE,
          border:`1px solid ${BG3}`, boxShadow:`0 1px 3px rgba(61,43,31,.05)` },
  bnav: { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:390, background:SURFACE, borderTop:`1.5px solid ${BG3}`,
          display:"flex", padding:"10px 0 24px", zIndex:40,
          boxShadow:"0 -4px 20px rgba(61,43,31,.08)" },
  overlay:{ position:"fixed", inset:0, background:"rgba(61,43,31,.55)",
            backdropFilter:"blur(4px)", zIndex:99, display:"flex", alignItems:"flex-end" },
  sheet:{ background:SURFACE, borderRadius:"24px 24px 0 0", padding:"16px 20px 48px",
          width:"100%", maxWidth:390, margin:"0 auto", border:`1px solid ${BG3}`,
          maxHeight:"88vh", overflowY:"auto" },
  handle:{ width:36, height:4, borderRadius:99, background:BG3, margin:"0 auto 20px" },
  lbl:  { fontSize:10, color:BROWN_L, marginBottom:6, textTransform:"uppercase",
          letterSpacing:".8px", fontWeight:700, display:"block" },
  inp:  { width:"100%", padding:"13px 14px", borderRadius:14, boxSizing:"border-box",
          background:BG, border:`1.5px solid ${BG3}`, color:BROWN_D, fontSize:16,
          outline:"none", fontFamily:"inherit", WebkitAppearance:"none" },
  saveBtn:{ width:"100%", padding:"16px", borderRadius:16, border:"none", cursor:"pointer",
            background:BROWN_D, color:WHITE, fontSize:15, fontWeight:700,
            fontFamily:"'Georgia',serif", boxShadow:`0 4px 0 ${BROWN_M},0 6px 16px rgba(61,43,31,.25)`,
            marginTop:8, WebkitTapHighlightColor:"transparent" },
  progTrack:{ height:7, borderRadius:99, background:BG3, overflow:"hidden", maxWidth:"100%" },
  fab:  { width:46, height:46, borderRadius:14, border:"none", cursor:"pointer",
          background:WHITE, color:BROWN_D, fontSize:24,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 2px 12px rgba(0,0,0,.2)", WebkitTapHighlightColor:"transparent" },
};

const card3dStyle = color => ({
  borderRadius:18, padding:"16px", cursor:"pointer", background:SURFACE,
  border:`1px solid ${color}30`, width:"100%", textAlign:"left",
  boxShadow:`0 4px 0 ${color}40, 0 6px 16px rgba(0,0,0,.08)`,
  WebkitTapHighlightColor:"transparent", display:"block",
  overflow:"hidden", boxSizing:"border-box",
});

const mpillStyle = active => ({
  padding:"5px 13px", borderRadius:99, border:"none", cursor:"pointer",
  fontSize:11, fontWeight:700, whiteSpace:"nowrap",
  background: active ? ACCENT : BG2,
  color: active ? WHITE : BROWN_L,
  boxShadow: active ? "0 2px 8px rgba(139,69,19,.3)" : "none",
  WebkitTapHighlightColor:"transparent",
});

// ─── Memoized sub-components ─────────────────────────────────────
const ProgBar = memo(({pct, color}) => (
  <div style={S.progTrack}>
    <div style={{height:"100%",width:`${Math.min(pct,100)}%`,borderRadius:99,
      background:color,transition:"width .5s"}}/>
  </div>
));

const TxRow = memo(({tx}) => {
  const cfg = (CHI_CATS[tx.cat]||THU_CATS[tx.cat]) || {icon:"📦",color:BROWN_L};
  return (
    <div style={S.txR}>
      <div style={{width:42,height:42,borderRadius:12,background:cfg.color+"15",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:20,flexShrink:0,border:`1px solid ${cfg.color}20`}}>
        {cfg.icon}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600,color:BROWN_D,whiteSpace:"nowrap",
          overflow:"hidden",textOverflow:"ellipsis"}}>{tx.desc}</div>
        <div style={{fontSize:11,color:BROWN_L,marginTop:2}}>{tx.sub} · {fmtDate(tx.date)}</div>
      </div>
      <div style={{fontSize:14,fontWeight:700,flexShrink:0,color:tx.type==="Thu"?GREEN:RED}}>
        {tx.type==="Thu"?"+":"-"}{fmtM(tx.amount)} ₫
      </div>
    </div>
  );
});

// ─── App ──────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]       = useState("home");
  const [txs,setTxs]       = useState(SEED);
  const [selM,setSelM]     = useState(NOW.getMonth());
  const [nid,setNid]       = useState(300);
  const [showAdd,setShowAdd] = useState(false);
  const [drillItem,setDrillItem] = useState(null);
  const [form,setForm] = useState({
    date:NOW.toISOString().split("T")[0],
    type:"Chi",cat:"Ăn Uống",sub:"",desc:"",amount:"",pay:"Tiền mặt",
  });

  // Computed
  const mTxs = useMemo(()=>txs.filter(t=>getM(t.date)===selM),[txs,selM]);
  const ST = useMemo(()=>{
    const inc  = mTxs.filter(t=>t.type==="Thu").reduce((s,t)=>s+t.amount,0);
    const exp  = mTxs.filter(t=>t.type==="Chi").reduce((s,t)=>s+t.amount,0);
    const sav  = inc-exp;
    const rate = inc>0?Math.round(sav/inc*100):0;
    const husb = mTxs.filter(t=>t.cat==="Lương Chồng").reduce((s,t)=>s+t.amount,0);
    const wife = mTxs.filter(t=>t.cat==="Lương Vợ").reduce((s,t)=>s+t.amount,0);
    const shared=mTxs.filter(t=>t.cat==="Thu Nhập Chung").reduce((s,t)=>s+t.amount,0);
    const bycat={};
    Object.keys(CHI_CATS).forEach(c=>{
      bycat[c]=mTxs.filter(t=>t.type==="Chi"&&t.cat===c).reduce((s,t)=>s+t.amount,0);
    });
    return {inc,exp,sav,rate,husb,wife,shared,bycat};
  },[mTxs]);
  const trend = useMemo(()=>MS.map((_,mi)=>({
    exp:txs.filter(t=>t.type==="Chi"&&getM(t.date)===mi).reduce((s,t)=>s+t.amount,0),
  })),[txs]);

  const rC = ST.rate>=20?GREEN:ST.rate>=10?GOLD:RED;

  // Handlers
  const addTx = useCallback(()=>{
    if(!form.amount||!form.desc) return;
    const amt=parseInt(form.amount.toString().replace(/\D/g,""),10);
    if(!amt) return;
    setTxs(p=>[...p,{...form,id:nid,amount:amt}]);
    setNid(n=>n+1); setShowAdd(false); setDrillItem(null);
    setForm({date:NOW.toISOString().split("T")[0],type:"Chi",cat:"Ăn Uống",sub:"",desc:"",amount:"",pay:"Tiền mặt"});
  },[form,nid]);

  const openItem = useCallback((cat,item)=>{
    setDrillItem(item);
    setForm(p=>({...p,type:"Chi",cat,sub:item.label,desc:item.label,amount:"",pay:"Tiền mặt"}));
    setShowAdd(true);
  },[]);

  const closeModal = useCallback(()=>{
    setShowAdd(false); setDrillItem(null);
  },[]);

  const setField = useCallback((k,v)=>setForm(p=>({...p,[k]:v})),[]);

  // ── HOME ────────────────────────────────────────────────────
  const Home = () => {
    const maxE = Math.max(...trend.map(t=>t.exp),1);
    return <div style={S.scr}>
      <div style={S.hdr}>
        <div style={S.hdrRow}>
          <div>
            <div style={{fontSize:11,color:BROWN_XL,marginBottom:4,letterSpacing:"1px",textTransform:"uppercase"}}>
              {MVN[selM]} · {Y}
            </div>
            <div style={{fontSize:26,fontWeight:700,color:WHITE,letterSpacing:"-0.5px",lineHeight:1.1}}>
              Sổ Chi Tiêu
              <div style={{fontSize:13,fontWeight:400,color:BROWN_XL}}>Gia Đình</div>
            </div>
          </div>
          <button style={S.fab} onClick={()=>setShowAdd(true)}>＋</button>
        </div>
        <div style={{marginTop:14,display:"inline-flex",gap:8,alignItems:"center",
          background:rC+"18",border:`1px solid ${rC}44`,borderRadius:24,padding:"7px 16px"}}>
          <span style={{fontSize:13,fontWeight:700,color:rC}}>
            {ST.rate>=20?"✅":ST.rate>=10?"⚠️":"❌"} Tiết kiệm {ST.rate}%
          </span>
          <span style={{fontSize:11,color:BROWN_XL}}>
            {ST.rate>=20?"· Đạt!":ST.rate>=10?"· Cần cố":"· Vượt NS"}
          </span>
        </div>
      </div>

      <div style={S.mstrip}>
        {MS.map((m,i)=><button key={i} onClick={()=>setSelM(i)} style={mpillStyle(selM===i)}>{m}</button>)}
      </div>

      {/* KPI 2×2 */}
      <div style={{padding:"16px 16px 0",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {[
          {lb:"Tổng Thu", v:ST.inc,  c:GREEN,bg:"#0D2A1E",ico:"📥"},
          {lb:"Tổng Chi", v:ST.exp,  c:RED,  bg:"#2A0D0D",ico:"📤"},
          {lb:"Tiết Kiệm",v:Math.abs(ST.sav),c:rC,bg:"#1A1030",ico:"🏦"},
          {lb:"Tỷ Lệ TK", pct:ST.rate,c:rC,bg:"#1A1030",ico:"📊"},
        ].map((k,i)=>(
          <div key={i} style={{borderRadius:16,padding:"14px",background:k.bg,
            border:`1px solid ${k.c}22`,boxShadow:"0 4px 0 rgba(0,0,0,.3)"}}>
            <div style={{fontSize:18,marginBottom:6}}>{k.ico}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:3,
              textTransform:"uppercase",letterSpacing:".5px"}}>{k.lb}</div>
            <div style={{fontSize:19,fontWeight:900,color:k.c}}>
              {k.pct!==undefined?`${k.pct}%`:`${fmtM(k.v)} ₫`}
            </div>
          </div>
        ))}
      </div>

      {/* Income */}
      <div style={S.sec}>
        <div style={S.stl}>Thu Nhập</div>
        <div style={{background:SURFACE,borderRadius:16,padding:"4px 14px",
          border:`1px solid ${BG3}`,boxShadow:`0 2px 8px rgba(61,43,31,.06)`}}>
          {[
            {lb:"👨‍💼 Chồng",v:ST.husb,  c:"#2E6B8A"},
            {lb:"👩‍💼 Vợ",   v:ST.wife,  c:"#7A4A8A"},
            {lb:"💼 Chung", v:ST.shared,c:GREEN},
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",
              alignItems:"center",padding:"12px 0",
              borderTop:i>0?`1px solid ${BG3}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:10,height:10,borderRadius:3,background:s.c+"40",
                  border:`2px solid ${s.c}`,flexShrink:0}}/>
                <span style={{fontSize:13,color:BROWN_M}}>{s.lb}</span>
              </div>
              <div style={{fontSize:15,fontWeight:700,color:s.v>0?GREEN:BROWN_XL}}>
                {s.v>0?`+${fmtM(s.v)} ₫`:"—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chi groups - 3D cards */}
      <div style={S.sec}>
        <div style={S.stl}>Chi Tiêu Theo Nhóm</div>
        {Object.entries(CHI_CATS).map(([cat,cfg])=>{
          const amt=ST.bycat[cat]||0; if(!amt) return null;
          const pct=ST.exp>0?Math.round(amt/ST.exp*100):0;
          return <div key={cat} style={{...card3dStyle(cfg.color),marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",
              alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:40,height:40,borderRadius:11,background:cfg.color+"12",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:20,border:`1px solid ${cfg.color}20`}}>{cfg.icon}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:BROWN_D}}>{cat}</div>
                  <div style={{fontSize:10,color:BROWN_L,marginTop:1}}>{pct}% tổng chi</div>
                </div>
              </div>
              <div style={{fontSize:15,fontWeight:700,color:cfg.color}}>{fmtM(amt)} ₫</div>
            </div>
            <ProgBar pct={pct} color={cfg.color}/>
          </div>;
        })}
      </div>

      {/* Trend */}
      <div style={S.sec}>
        <div style={S.stl}>Chi Tiêu 12 Tháng</div>
        <div style={{background:SURFACE,borderRadius:16,padding:"16px 12px",
          border:`1px solid ${BG3}`,boxShadow:`0 2px 8px rgba(61,43,31,.06)`}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:3,height:72}}>
            {trend.map((t,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:"100%",borderRadius:"4px 4px 0 0",
                  height:t.exp>0?Math.max((t.exp/maxE)*62,4):2,
                  background:i===selM?ACCENT:BG3,transition:"height .3s",
                  border:i===selM?`1px solid ${ACCENT_L}`:"none"}}/>
                <span style={{fontSize:8,fontWeight:700,color:i===selM?ACCENT:BROWN_XL}}>
                  {MS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent */}
      <div style={S.sec}>
        <div style={S.stl}>Gần Đây</div>
        {[...mTxs].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5).map(tx=>(
          <TxRow key={tx.id} tx={tx}/>
        ))}
      </div>
    </div>;
  };

  // ── CHI SCREEN ──────────────────────────────────────────────
  const ChiScreen = () => {
    const [selCat,setSelCat] = useState(null);

    if(selCat) {
      const cfg = CHI_CATS[selCat];
      return <div style={S.scr}>
        <div style={{...S.hdr,paddingBottom:20}}>
          <button onClick={()=>setSelCat(null)} style={{background:"none",border:"none",
            color:WHITE,fontSize:14,cursor:"pointer",marginBottom:12,padding:0,
            display:"flex",alignItems:"center",gap:6,opacity:.8,
            WebkitTapHighlightColor:"transparent"}}>
            ← Quay lại
          </button>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:32}}>{cfg.icon}</span>
            <div style={{fontSize:20,fontWeight:700,color:WHITE}}>{selCat}</div>
          </div>
        </div>
        <div style={{padding:"16px"}}>
          <div style={S.stl}>Chọn khoản để nhập</div>
          {cfg.items.map(item=>(
            <button key={item.key} onClick={()=>openItem(selCat,item)}
              style={{...card3dStyle(cfg.color),marginBottom:10,
                display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:46,height:46,borderRadius:12,background:cfg.color+"15",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:22,flexShrink:0,border:`1px solid ${cfg.color}25`,
                boxShadow:`0 2px 6px ${cfg.color}20`}}>{item.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:BROWN_D}}>{item.label}</div>
                <div style={{fontSize:11,color:BROWN_L,marginTop:2}}>{item.hint}</div>
              </div>
              <div style={{fontSize:22,color:cfg.color,fontWeight:700,marginLeft:"auto"}}>›</div>
            </button>
          ))}
        </div>
      </div>;
    }

    return <div style={S.scr}>
      <div style={{...S.hdr,paddingBottom:20}}>
        <div style={{fontSize:22,fontWeight:700,color:WHITE,letterSpacing:"-0.5px"}}>Các Khoản Chi</div>
        <div style={{fontSize:12,color:BROWN_XL,marginTop:4,fontStyle:"italic"}}>
          Chọn nhóm để nhập chi tiêu
        </div>
      </div>
      <div style={{padding:"16px"}}>
        {Object.entries(CHI_CATS).map(([cat,cfg])=>{
          const amt=ST.bycat[cat]||0;
          return <button key={cat} onClick={()=>setSelCat(cat)}
            style={{...card3dStyle(cfg.color),marginBottom:12,
              display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:52,borderRadius:14,background:cfg.color+"15",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:26,flexShrink:0,border:`1px solid ${cfg.color}25`,
              boxShadow:`0 2px 8px ${cfg.color}20`}}>{cfg.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:700,color:BROWN_D}}>{cat}</div>
              <div style={{fontSize:11,color:BROWN_L,marginTop:2}}>
                {cfg.items.length} khoản · {amt>0?`${fmtM(amt)} ₫ tháng này`:"Chưa có giao dịch"}
              </div>
            </div>
            <div style={{fontSize:22,color:cfg.color,fontWeight:700}}>›</div>
          </button>;
        })}
      </div>
    </div>;
  };

  // ── TXS SCREEN ──────────────────────────────────────────────
  const TxsScreen = () => {
    const [ft,setFt]=useState("all");
    const shown=useMemo(()=>
      [...mTxs].filter(t=>ft==="all"||t.type===ft)
               .sort((a,b)=>new Date(b.date)-new Date(a.date))
    ,[ft]);
    return <div style={S.scr}>
      <div style={{...S.hdr,paddingBottom:16}}>
        <div style={{fontSize:22,fontWeight:700,color:WHITE,letterSpacing:"-0.5px",marginBottom:12}}>
          Giao Dịch
        </div>
        <div style={{display:"flex",gap:8}}>
          {[["all","Tất cả"],["Thu","Thu nhập"],["Chi","Chi tiêu"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFt(v)} style={{
              padding:"6px 14px",borderRadius:99,border:"none",cursor:"pointer",
              fontSize:11,fontWeight:700,
              background:ft===v?WHITE:"rgba(255,255,255,.12)",
              color:ft===v?BROWN_D:"rgba(255,255,255,.7)",
              WebkitTapHighlightColor:"transparent"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={S.mstrip}>
        {MS.map((m,i)=><button key={i} onClick={()=>setSelM(i)} style={mpillStyle(selM===i)}>{m}</button>)}
      </div>
      <div style={{padding:"14px 16px 24px"}}>
        {shown.length===0&&<div style={{textAlign:"center",padding:"48px 0",
          color:BROWN_XL,fontStyle:"italic"}}>Chưa có giao dịch</div>}
        {shown.map(tx=><TxRow key={tx.id} tx={tx}/>)}
      </div>
    </div>;
  };

  // ── GOALS SCREEN ────────────────────────────────────────────
  const GoalsScreen = () => (
    <div style={S.scr}>
      <div style={{...S.hdr,paddingBottom:16}}>
        <div style={{fontSize:22,fontWeight:700,color:WHITE,letterSpacing:"-0.5px"}}>Mục Tiêu</div>
        <div style={{fontSize:12,color:BROWN_XL,marginTop:4,fontStyle:"italic"}}>Tiết kiệm dài hạn</div>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{borderRadius:18,padding:"20px",marginBottom:18,
          background:BROWN_D,border:`1px solid ${BROWN_M}`,
          boxShadow:"0 4px 0 rgba(0,0,0,.3)"}}>
          <div style={{fontSize:11,color:BROWN_XL,letterSpacing:"1px",
            textTransform:"uppercase",marginBottom:6}}>Tổng Đã Tiết Kiệm</div>
          <div style={{fontSize:30,fontWeight:700,color:WHITE,letterSpacing:"-1px"}}>
            {fmtM(GOALS_DATA.reduce((s,g)=>s+g.saved,0))} ₫
          </div>
          <div style={{marginTop:8}}>
            <ProgBar pct={Math.round(GOALS_DATA.reduce((s,g)=>s+g.saved,0)/GOALS_DATA.reduce((s,g)=>s+g.target,0)*100)}
              color={ACCENT_L}/>
          </div>
          <div style={{fontSize:11,color:BROWN_L,marginTop:6}}>
            / {fmtM(GOALS_DATA.reduce((s,g)=>s+g.target,0))} ₫ mục tiêu
          </div>
        </div>
        {GOALS_DATA.map(g=>{
          const pct=Math.min(100,Math.round(g.saved/g.target*100));
          return <div key={g.id} style={{...card3dStyle(g.color),marginBottom:12,padding:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",
              alignItems:"flex-start",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:26}}>{g.icon}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:BROWN_D}}>{g.name}</div>
                  <div style={{fontSize:10,color:BROWN_L,marginTop:2}}>Hạn: {g.deadline}</div>
                </div>
              </div>
              <div style={{background:g.color+"15",borderRadius:99,padding:"4px 12px",
                fontSize:13,fontWeight:700,color:g.color}}>{pct}%</div>
            </div>
            <ProgBar pct={pct} color={g.color}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
              {[["Đã có",g.saved,GREEN],["Còn thiếu",g.target-g.saved,RED],["Mục tiêu",g.target,BROWN_L]].map(([l,v,c],i)=>(
                <div key={i} style={{textAlign:i===0?"left":i===1?"center":"right"}}>
                  <div style={{fontSize:9,color:BROWN_XL,textTransform:"uppercase",
                    letterSpacing:".5px",marginBottom:3}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:700,color:c}}>{fmtM(v)} ₫</div>
                </div>
              ))}
            </div>
          </div>;
        })}
      </div>
    </div>
  );

  // ── ADD MODAL ───────────────────────────────────────────────
  const AddModal = () => {
  const [lform, setLform] = useState({...form});
  const setLfield = (k,v) => setLform(p=>({...p,[k]:v}));

  const isThu = lform.type==="Thu";
  const cats  = isThu?THU_CATS:CHI_CATS;
  const subs  = isThu
    ? (THU_CATS[lform.cat]?.subs||[])
    : (CHI_CATS[lform.cat]?.items.map(i=>i.label)||[]);

  const handleSave = () => {
    if(!lform.amount||!lform.desc) return;
    const amt=parseInt(lform.amount.toString().replace(/\D/g,""),10);
    if(!amt) return;
    setTxs(p=>[...p,{...lform,id:nid,amount:amt}]);
    setNid(n=>n+1); setShowAdd(false); setDrillItem(null);
    setForm({date:NOW.toISOString().split("T")[0],type:"Chi",cat:"Ăn Uống",sub:"",desc:"",amount:"",pay:"Tiền mặt"});
  };

  return <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&closeModal()}>
    <div style={S.sheet}>
      <div style={S.handle}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{fontSize:17,fontWeight:700,color:BROWN_D}}>
          {drillItem?drillItem.label:"Thêm Giao Dịch"}
        </div>
        <button onClick={closeModal} style={{background:"none",border:"none",
          color:BROWN_L,fontSize:22,cursor:"pointer",padding:0,
          WebkitTapHighlightColor:"transparent"}}>✕</button>
      </div>

      {!drillItem&&<div style={{display:"flex",gap:8,marginBottom:18}}>
        {["Chi","Thu"].map(t=>(
          <button key={t} onClick={()=>setLform(p=>({...p,type:t,cat:t==="Thu"?"Lương Chồng":"Ăn Uống",sub:""}))}
            style={{flex:1,padding:"11px",borderRadius:14,border:"none",cursor:"pointer",
              fontSize:13,fontWeight:700,
              background:lform.type===t?(t==="Thu"?GREEN:BROWN_D):BG2,
              color:lform.type===t?WHITE:BROWN_L,
              WebkitTapHighlightColor:"transparent"}}>
            {t==="Thu"?"💰 Thu nhập":"💸 Chi tiêu"}
          </button>
        ))}
      </div>}

      {!drillItem&&<div style={{marginBottom:16}}>
        <label style={S.lbl}>Nhóm</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {Object.entries(cats).map(([cat,cfg])=>(
            <button key={cat} onClick={()=>setLform(p=>({...p,cat,sub:""}))}
              style={{padding:"10px 6px",borderRadius:12,cursor:"pointer",
                background:lform.cat===cat?cfg.color+"15":BG,
                border:`1.5px solid ${lform.cat===cat?cfg.color:BG3}`,
                WebkitTapHighlightColor:"transparent"}}>
              <div style={{fontSize:20,marginBottom:3}}>{cfg.icon}</div>
              <div style={{fontSize:9,fontWeight:600,lineHeight:1.2,textAlign:"center",
                color:lform.cat===cat?cfg.color:BROWN_L}}>{cat}</div>
            </button>
          ))}
        </div>
      </div>}

      {!drillItem&&subs.length>0&&<div style={{marginBottom:16}}>
        <label style={S.lbl}>Danh mục con</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {subs.map(s=>(
            <button key={s} onClick={()=>setLfield("sub",s)}
              style={{padding:"6px 12px",borderRadius:99,border:"none",cursor:"pointer",
                fontSize:11,fontWeight:600,
                background:lform.sub===s?BROWN_D:BG2,
                color:lform.sub===s?WHITE:BROWN_L,
                WebkitTapHighlightColor:"transparent"}}>{s}</button>
          ))}
        </div>
      </div>}

      <div style={{marginBottom:14}}>
        <label style={S.lbl}>Số Tiền (₫)</label>
        <input type="number" inputMode="numeric" placeholder="0"
          style={S.inp} value={lform.amount}
          onChange={e=>setLfield("amount",e.target.value)} autoComplete="off"/>
      </div>

      <div style={{marginBottom:14}}>
        <label style={S.lbl}>Mô Tả</label>
        <input type="text" placeholder="Ghi chú..." style={S.inp}
          value={lform.desc} onChange={e=>setLfield("desc",e.target.value)} autoComplete="off"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <div>
          <label style={S.lbl}>Ngày</label>
          <input type="date" style={S.inp} value={lform.date}
            onChange={e=>setLfield("date",e.target.value)}/>
        </div>
        <div>
          <label style={S.lbl}>Thanh Toán</label>
          <select style={{...S.inp,appearance:"none",WebkitAppearance:"none"}}
            value={lform.pay} onChange={e=>setLfield("pay",e.target.value)}>
            {PAYMENT.map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <button style={S.saveBtn} onClick={handleSave}>Lưu Giao Dịch</button>
    </div>
  </div>;
};

  // ── NAV ─────────────────────────────────────────────────────
  const NAV=[
    {id:"home", icon:"🏠",lb:"Tổng Quan"},
    {id:"chi",  icon:"💸",lb:"Khoản Chi"},
    {id:"add",  icon:"＋",lb:"Thêm",action:()=>setShowAdd(true)},
    {id:"txs",  icon:"📋",lb:"Giao Dịch"},
    {id:"goals",icon:"🎯",lb:"Mục Tiêu"},
  ];

  return <div style={S.app}>
    {tab==="home" &&<Home/>}
    {tab==="chi"  &&<ChiScreen/>}
    {tab==="txs"  &&<TxsScreen/>}
    {tab==="goals"&&<GoalsScreen/>}
    {showAdd&&<AddModal/>}

    <div style={S.bnav}>
      {NAV.map(n=>{
        const isAdd=n.id==="add";
        const active=tab===n.id&&!isAdd;
        return <button key={n.id}
          onClick={n.action||(()=>setTab(n.id))}
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
            gap:isAdd?0:3,background:"none",border:"none",cursor:"pointer",
            paddingTop:isAdd?0:6,WebkitTapHighlightColor:"transparent"}}>
          {isAdd
            ?<div style={{width:46,height:46,borderRadius:15,marginTop:-22,
                background:BROWN_D,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:24,color:WHITE,
                boxShadow:"0 4px 0 rgba(0,0,0,.25),0 6px 16px rgba(61,43,31,.3)"}}>＋</div>
            :<span style={{fontSize:21,opacity:active?1:.3,
                filter:active?"none":"grayscale(1)",transition:"opacity .1s"}}>{n.icon}</span>
          }
          <span style={{fontSize:10,fontWeight:700,
            color:active?ACCENT:isAdd?BROWN_M:BROWN_XL,
            marginTop:isAdd?4:0}}>{n.lb}</span>
        </button>;
      })}
    </div>
  </div>;
}
