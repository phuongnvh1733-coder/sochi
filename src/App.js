import { useState, useMemo } from "react";

// ── Design Tokens: Trắng · Beige · Nâu ───────────────────────────
// Background layers
const BG       = "#FAF7F2";   // beige trắng ấm – nền chính
const BG2      = "#F2EDE4";   // beige nhạt – card layer 1
const BG3      = "#E8E0D4";   // beige đậm hơn – card layer 2 / border
const SURFACE  = "#FFFFFF";   // trắng thuần – card nổi bật
// Browns
const BROWN_D  = "#3D2B1F";   // nâu đậm – text chính, header
const BROWN_M  = "#6B4C3B";   // nâu giữa – text phụ
const BROWN_L  = "#9C7B6B";   // nâu nhạt – placeholder, label
const BROWN_XL = "#C4A99A";   // nâu rất nhạt – border, divider
// Accent – nâu đỏ ấm
const ACCENT   = "#8B4513";   // saddle brown – CTA chính
const ACCENT_L = "#B5622A";   // lighter accent
// Semantic
const GREEN    = "#3A7D44";   // thu nhập
const GREEN_BG = "#EAF3EC";
const RED      = "#B03A2E";   // chi tiêu
const RED_BG   = "#FAEDEC";
const GOLD     = "#8A6914";   // tiết kiệm
const GOLD_BG  = "#FBF5E6";

// Category colors – tất cả dùng tông nâu/đất ấm
const CHI_CATEGORIES = {
  "Thuê Nhà & Tiện Ích": { icon:"🏠", color:"#5C4033", subs:["Tiền thuê nhà","Điện","Nước","Internet / Mạng","Gas","Khác"] },
  "Ăn Uống":             { icon:"🍜", color:"#8B4513", subs:["Chợ / Siêu thị","Bữa sáng","Bữa trưa","Bữa tối","Ăn ngoài","Cafe / Trà sữa"] },
  "Em Bé":               { icon:"👶", color:"#9B4A6A", subs:["Sữa / Ăn dặm","Tã bỉm","Quần áo bé","Học phí / Nhà trẻ","Đồ chơi","Khám bệnh bé","Khác"] },
  "Chi Cá Nhân Ba":      { icon:"👨", color:"#2E6B8A", subs:["Xăng xe","Ăn uống riêng","Quần áo","Cắt tóc","Sức khỏe","Khác"] },
  "Chi Cá Nhân Mẹ":      { icon:"👩", color:"#7A4A8A", subs:["Xăng xe","Ăn uống riêng","Quần áo / Mỹ phẩm","Làm tóc / Nail","Sức khỏe","Khác"] },
  "Giải Trí & Du Lịch":  { icon:"🎉", color:"#8A6914", subs:["Xem phim / Giải trí","Du lịch","Quà tặng","Tiệc / Đám tiệc","Khác"] },
  "Tiết Kiệm & Đầu Tư":  { icon:"🏦", color:"#3A7D44", subs:["Quỹ khẩn cấp","Tiết kiệm định kỳ","Đầu tư chứng khoán","Quỹ cho bé","Khác"] },
};
const THU_CATEGORIES = {
  "Lương Chồng":    { icon:"👨‍💼", color:"#2E6B8A", subs:["Lương tháng","Thưởng","Phụ cấp","Overtime"] },
  "Lương Vợ":       { icon:"👩‍💼", color:"#7A4A8A", subs:["Lương tháng","Thưởng","Phụ cấp","Overtime"] },
  "Thu Nhập Chung": { icon:"💼",   color:"#3A7D44", subs:["Đầu tư / Lãi suất","Cho thuê","Bán đồ","Tiền mừng / Quà","Khác"] },
};
const ALL_CATS = {...CHI_CATEGORIES,...THU_CATEGORIES};
const PAYMENT  = ["Tiền mặt","Chuyển khoản","Thẻ tín dụng","Ví MoMo / ZaloPay"];
const MS       = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
const MVN      = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];

const NOW = new Date();
const y   = NOW.getFullYear();
const mkD = (m,dd) => `${y}-${String(m).padStart(2,"0")}-${String(dd).padStart(2,"0")}`;

const SEED = [
  {id:1, date:mkD(4,1), type:"Thu",cat:"Lương Chồng",        sub:"Lương tháng",     desc:"Lương T4",           amount:18000000,pay:"Chuyển khoản"},
  {id:2, date:mkD(4,1), type:"Thu",cat:"Lương Vợ",           sub:"Lương tháng",     desc:"Lương T4",           amount:14000000,pay:"Chuyển khoản"},
  {id:3, date:mkD(4,2), type:"Chi",cat:"Thuê Nhà & Tiện Ích",sub:"Tiền thuê nhà",  desc:"Thuê nhà T4",        amount:8500000, pay:"Chuyển khoản"},
  {id:4, date:mkD(4,3), type:"Chi",cat:"Thuê Nhà & Tiện Ích",sub:"Điện",           desc:"Tiền điện T4",       amount:450000,  pay:"Chuyển khoản"},
  {id:5, date:mkD(4,3), type:"Chi",cat:"Thuê Nhà & Tiện Ích",sub:"Internet / Mạng",desc:"FPT T4",             amount:270000,  pay:"Chuyển khoản"},
  {id:6, date:mkD(4,5), type:"Chi",cat:"Ăn Uống",            sub:"Chợ / Siêu thị", desc:"Chợ đầu tuần",      amount:380000,  pay:"Tiền mặt"},
  {id:7, date:mkD(4,6), type:"Chi",cat:"Ăn Uống",            sub:"Bữa sáng",       desc:"Bánh mì + cà phê",  amount:65000,   pay:"Tiền mặt"},
  {id:8, date:mkD(4,7), type:"Chi",cat:"Em Bé",              sub:"Sữa / Ăn dặm",   desc:"Sữa Nan tháng",     amount:620000,  pay:"Thẻ tín dụng"},
  {id:9, date:mkD(4,8), type:"Chi",cat:"Em Bé",              sub:"Tã bỉm",          desc:"Tã Pampers",        amount:350000,  pay:"Thẻ tín dụng"},
  {id:10,date:mkD(4,9), type:"Chi",cat:"Chi Cá Nhân Ba",     sub:"Xăng xe",         desc:"Đổ xăng xe máy",   amount:120000,  pay:"Tiền mặt"},
  {id:11,date:mkD(4,10),type:"Chi",cat:"Chi Cá Nhân Mẹ",    sub:"Ăn uống riêng",   desc:"Cơm trưa VP",      amount:45000,   pay:"Tiền mặt"},
  {id:12,date:mkD(4,11),type:"Chi",cat:"Ăn Uống",            sub:"Ăn ngoài",        desc:"Bữa tối gia đình", amount:320000,  pay:"Tiền mặt"},
  {id:13,date:mkD(4,12),type:"Chi",cat:"Em Bé",              sub:"Học phí / Nhà trẻ",desc:"Nhà trẻ T4",      amount:2500000, pay:"Chuyển khoản"},
  {id:14,date:mkD(4,13),type:"Chi",cat:"Tiết Kiệm & Đầu Tư", sub:"Quỹ khẩn cấp",  desc:"Tiết kiệm T4",     amount:3000000, pay:"Chuyển khoản"},
  {id:15,date:mkD(4,14),type:"Chi",cat:"Chi Cá Nhân Mẹ",    sub:"Làm tóc / Nail",  desc:"Làm nail",         amount:250000,  pay:"Tiền mặt"},
  {id:16,date:mkD(4,14),type:"Chi",cat:"Ăn Uống",            sub:"Chợ / Siêu thị",  desc:"Siêu thị cuối tuần",amount:750000,pay:"Thẻ tín dụng"},
  {id:17,date:mkD(3,1), type:"Thu",cat:"Lương Chồng",        sub:"Lương tháng",     desc:"Lương T3",         amount:18000000,pay:"Chuyển khoản"},
  {id:18,date:mkD(3,1), type:"Thu",cat:"Lương Vợ",           sub:"Lương tháng",     desc:"Lương T3",         amount:14000000,pay:"Chuyển khoản"},
  {id:19,date:mkD(3,5), type:"Chi",cat:"Thuê Nhà & Tiện Ích",sub:"Tiền thuê nhà",  desc:"Thuê nhà T3",      amount:8500000, pay:"Chuyển khoản"},
  {id:20,date:mkD(3,15),type:"Chi",cat:"Giải Trí & Du Lịch", sub:"Du lịch",        desc:"Vé máy bay Đà Nẵng",amount:2400000,pay:"Thẻ tín dụng"},
  {id:21,date:mkD(3,20),type:"Chi",cat:"Em Bé",              sub:"Sữa / Ăn dặm",   desc:"Sữa Nan T3",       amount:620000,  pay:"Thẻ tín dụng"},
  {id:22,date:mkD(3,20),type:"Thu",cat:"Thu Nhập Chung",     sub:"Đầu tư / Lãi suất",desc:"Lãi ngân hàng",  amount:800000,  pay:"Chuyển khoản"},
  {id:23,date:mkD(2,1), type:"Thu",cat:"Lương Chồng",        sub:"Lương tháng",     desc:"Lương T2",         amount:18000000,pay:"Chuyển khoản"},
  {id:24,date:mkD(2,1), type:"Thu",cat:"Lương Vợ",           sub:"Thưởng",          desc:"Thưởng Tết",       amount:5000000, pay:"Chuyển khoản"},
  {id:25,date:mkD(2,5), type:"Chi",cat:"Thuê Nhà & Tiện Ích",sub:"Tiền thuê nhà",  desc:"Thuê nhà T2",      amount:8500000, pay:"Chuyển khoản"},
];

const GOALS = [
  {id:1,name:"Quỹ Khẩn Cấp",   icon:"🚨",color:ACCENT,   deadline:"12/2026",target:90000000, saved:30000000},
  {id:2,name:"Mua Nhà",         icon:"🏠",color:"#5C4033",deadline:"12/2028",target:500000000,saved:55000000},
  {id:3,name:"Học Phí Đại Học", icon:"🎓",color:GREEN,    deadline:"09/2030",target:200000000,saved:10000000},
  {id:4,name:"Du Lịch Nhật",    icon:"✈️",color:"#7A4A8A",deadline:"06/2027",target:30000000, saved:5000000},
];

const fmtM    = n => n>=1000000?(n/1000000).toFixed(1).replace(/\.0$/,"")+"M":n>=1000?Math.round(n/1000)+"K":n.toString();
const fmtFull = n => new Intl.NumberFormat("vi-VN").format(n)+" ₫";
const fmtD    = s => { const d=new Date(s); return `${d.getDate()}/${d.getMonth()+1}`; };
const getM    = s => new Date(s).getMonth();

// ── Micro components ─────────────────────────────────────────────
const ProgBar = ({pct,color,thin=false})=>(
  <div style={{height:thin?4:7,borderRadius:99,background:BG3,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(pct,100)}%`,borderRadius:99,
      background:color,transition:"width .5s ease"}}/>
  </div>
);

const Chip = ({label,color,bg})=>(
  <span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:99,
    background:bg||color+"18",color,letterSpacing:"0.2px",whiteSpace:"nowrap"}}>{label}</span>
);

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]         = useState("home");
  const [txs,setTxs]         = useState(SEED);
  const [showAdd,setShowAdd] = useState(false);
  const [selM,setSelM]       = useState(NOW.getMonth());
  const [nid,setNid]         = useState(300);
  const [form,setForm]       = useState({
    date:NOW.toISOString().split("T")[0],
    type:"Chi",cat:"Ăn Uống",sub:"",desc:"",amount:"",pay:"Tiền mặt",
  });

  const mTxs = useMemo(()=>txs.filter(t=>getM(t.date)===selM),[txs,selM]);

  const ST = useMemo(()=>{
    const inc = mTxs.filter(t=>t.type==="Thu").reduce((s,t)=>s+t.amount,0);
    const exp = mTxs.filter(t=>t.type==="Chi").reduce((s,t)=>s+t.amount,0);
    const sav = inc-exp;
    const rt  = inc>0?Math.round(sav/inc*100):0;
    const husb   = mTxs.filter(t=>t.cat==="Lương Chồng").reduce((s,t)=>s+t.amount,0);
    const wife   = mTxs.filter(t=>t.cat==="Lương Vợ").reduce((s,t)=>s+t.amount,0);
    const shared = mTxs.filter(t=>t.cat==="Thu Nhập Chung").reduce((s,t)=>s+t.amount,0);
    const bycat  = {};
    Object.keys(CHI_CATEGORIES).forEach(c=>{
      bycat[c]=mTxs.filter(t=>t.type==="Chi"&&t.cat===c).reduce((s,t)=>s+t.amount,0);
    });
    return {inc,exp,sav,rt,husb,wife,shared,bycat};
  },[mTxs]);

  const trend = useMemo(()=>MS.map((_,mi)=>({
    exp:txs.filter(t=>t.type==="Chi"&&getM(t.date)===mi).reduce((s,t)=>s+t.amount,0),
  })),[txs]);

  const rtColor = ST.rt>=20?GREEN:ST.rt>=10?GOLD:RED;
  const rtBg    = ST.rt>=20?GREEN_BG:ST.rt>=10?GOLD_BG:RED_BG;

  const addTx = ()=>{
    if(!form.amount||!form.desc) return;
    setTxs(p=>[...p,{...form,id:nid,amount:+form.amount.replace(/\D/g,"")}]);
    setNid(n=>n+1); setShowAdd(false);
    setForm({date:NOW.toISOString().split("T")[0],type:"Chi",cat:"Ăn Uống",sub:"",desc:"",amount:"",pay:"Tiền mặt"});
  };

  // ── Shared CSS ────────────────────────────────────────────────
  const T = {
    app:{maxWidth:390,margin:"0 auto",minHeight:"100vh",background:BG,
         color:BROWN_D,fontFamily:"'Georgia','Palatino',serif",overflowX:"hidden"},
    scr:{paddingBottom:90},

    // Header – warm beige gradient
    hdr:{
      background:`linear-gradient(160deg, ${BROWN_D} 0%, ${BROWN_M} 100%)`,
      padding:"52px 20px 22px",
    },

    // Month strip
    mstrip:{display:"flex",gap:6,padding:"14px 16px",overflowX:"auto",scrollbarWidth:"none",
            background:SURFACE,borderBottom:`1px solid ${BG3}`},
    mpill:a=>({
      padding:"5px 13px",borderRadius:99,border:"none",cursor:"pointer",
      fontSize:11,fontWeight:700,whiteSpace:"nowrap",transition:"all .15s",
      fontFamily:"'Georgia',serif",
      background:a?ACCENT:BG2, color:a?SURFACE:BROWN_L,
      boxShadow:a?"0 2px 8px rgba(139,69,19,.25)":"none",
    }),

    // Section
    sec:{padding:"0 16px",marginBottom:22},
    stl:{fontSize:10,fontWeight:700,color:BROWN_XL,letterSpacing:"1.5px",
         textTransform:"uppercase",marginBottom:10,fontFamily:"'Georgia',serif"},

    // Card
    card:{background:SURFACE,borderRadius:16,padding:"14px",
          border:`1px solid ${BG3}`,marginBottom:10,
          boxShadow:"0 1px 4px rgba(61,43,31,.06)"},

    // Transaction row
    txR:{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
         borderRadius:14,marginBottom:8,background:SURFACE,
         border:`1px solid ${BG3}`,boxShadow:"0 1px 3px rgba(61,43,31,.05)"},
    txIco:c=>({width:42,height:42,borderRadius:12,background:c+"15",
               display:"flex",alignItems:"center",justifyContent:"center",
               fontSize:20,flexShrink:0,border:`1px solid ${c}22`}),

    // Bottom nav
    bnav:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
          width:"100%",maxWidth:390,
          background:SURFACE,borderTop:`1.5px solid ${BG3}`,
          display:"flex",padding:"10px 0 24px",zIndex:40,
          boxShadow:"0 -4px 20px rgba(61,43,31,.08)"},

    // Modal
    overlay:{position:"fixed",inset:0,background:"rgba(61,43,31,.5)",
             backdropFilter:"blur(4px)",zIndex:99,display:"flex",alignItems:"flex-end"},
    sheet:{background:SURFACE,borderRadius:"24px 24px 0 0",
           padding:"16px 20px 48px",width:"100%",maxWidth:390,margin:"0 auto",
           border:`1px solid ${BG3}`,maxHeight:"90vh",overflowY:"auto"},
    lbl:{fontSize:10,color:BROWN_L,marginBottom:7,textTransform:"uppercase",
         letterSpacing:"0.8px",fontWeight:700,fontFamily:"'Georgia',serif",display:"block"},
    inp:{width:"100%",padding:"11px 14px",borderRadius:12,boxSizing:"border-box",
         background:BG,border:`1.5px solid ${BG3}`,
         color:BROWN_D,fontSize:14,outline:"none",fontFamily:"inherit",
         transition:"border-color .15s"},
    saveBtn:{width:"100%",padding:"15px",borderRadius:16,border:"none",cursor:"pointer",
             background:BROWN_D,color:SURFACE,fontSize:15,fontWeight:700,
             fontFamily:"'Georgia',serif",letterSpacing:"0.3px",
             boxShadow:`0 4px 16px rgba(61,43,31,.3)`},
  };

  // ── HOME ─────────────────────────────────────────────────────
  const Home = ()=>{
    const maxE = Math.max(...trend.map(t=>t.exp),1);
    return <div style={T.scr}>

      {/* Header */}
      <div style={T.hdr}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <div style={{fontSize:11,color:BROWN_XL,marginBottom:5,letterSpacing:"1px",
              textTransform:"uppercase",fontFamily:"'Georgia',serif"}}>
              {MVN[selM]} · {y}
            </div>
            <div style={{fontSize:26,fontWeight:700,color:SURFACE,letterSpacing:"-0.5px",
              fontFamily:"'Georgia',serif",lineHeight:1.1}}>
              Sổ Chi Tiêu<br/>
              <span style={{fontSize:14,fontWeight:400,color:BROWN_XL,letterSpacing:"0px"}}>
                Gia Đình
              </span>
            </div>
          </div>
          <button style={{
            width:44,height:44,borderRadius:14,border:"none",cursor:"pointer",
            background:SURFACE,color:BROWN_D,fontSize:22,fontWeight:300,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 2px 12px rgba(0,0,0,.15)",
          }} onClick={()=>setShowAdd(true)}>＋</button>
        </div>

        {/* 3 KPI pills in header */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[
            {lb:"Thu",v:ST.inc, c:GREEN, bg:"rgba(58,125,68,.15)"},
            {lb:"Chi",v:ST.exp, c:"#E8C4B8", bg:"rgba(176,58,46,.15)"},
            {lb:"Tiết Kiệm",v:Math.abs(ST.sav),c:ST.sav>=0?"#C8E6CA":"#E8C4B8",bg:"rgba(138,105,20,.15)"},
          ].map((k,i)=>(
            <div key={i} style={{borderRadius:14,padding:"10px 12px",background:k.bg,
              border:"1px solid rgba(255,255,255,.1)"}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,.5)",marginBottom:4,
                textTransform:"uppercase",letterSpacing:"0.8px"}}>{k.lb}</div>
              <div style={{fontSize:15,fontWeight:700,color:k.c,fontFamily:"'Georgia',serif"}}>
                {fmtM(k.v)} ₫
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Month strip */}
      <div style={T.mstrip}>
        {MS.map((m,i)=><button key={i} style={T.mpill(selM===i)} onClick={()=>setSelM(i)}>{m}</button>)}
      </div>

      {/* Saving rate banner */}
      <div style={{padding:"14px 16px 0"}}>
        <div style={{borderRadius:14,padding:"12px 16px",background:rtBg,
          border:`1px solid ${rtColor}30`,display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:24}}>{ST.rt>=20?"✅":ST.rt>=10?"⚠️":"❌"}</div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:rtColor,fontFamily:"'Georgia',serif"}}>
              Tiết kiệm {ST.rt}% thu nhập
            </div>
            <div style={{fontSize:11,color:BROWN_L,marginTop:2}}>
              {ST.rt>=20?"Đạt mục tiêu 20% — tuyệt vời!":ST.rt>=10?"Còn thiếu "+(20-ST.rt)+"% nữa đạt mục tiêu":"Chi vượt thu — cần review ngay"}
            </div>
          </div>
        </div>
      </div>

      {/* Income sources */}
      <div style={{...T.sec,marginTop:18}}>
        <div style={T.stl}>Thu Nhập</div>
        <div style={T.card}>
          {[
            {lb:"👨‍💼 Lương Chồng",v:ST.husb,  c:"#2E6B8A"},
            {lb:"👩‍💼 Lương Vợ",   v:ST.wife,  c:"#7A4A8A"},
            {lb:"💼 Thu Nhập Chung",v:ST.shared,c:GREEN},
          ].map((s,i,arr)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              paddingTop:i>0?12:0,marginTop:i>0?12:0,
              borderTop:i>0?`1px solid ${BG3}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:10,height:10,borderRadius:3,background:s.c+"40",
                  border:`2px solid ${s.c}`,flexShrink:0}}/>
                <span style={{fontSize:13,color:BROWN_M}}>{s.lb}</span>
              </div>
              <div style={{fontSize:15,fontWeight:700,color:s.v>0?GREEN:BROWN_XL,
                fontFamily:"'Georgia',serif"}}>
                {s.v>0?`+${fmtM(s.v)} ₫`:"—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chi breakdown */}
      <div style={T.sec}>
        <div style={T.stl}>Chi Tiêu Theo Nhóm</div>
        {Object.entries(CHI_CATEGORIES).map(([cat,cfg])=>{
          const amt=ST.bycat[cat]||0; if(!amt) return null;
          const pct=ST.exp>0?Math.round(amt/ST.exp*100):0;
          return (
            <div key={cat} style={T.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,borderRadius:10,background:cfg.color+"12",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:19,border:`1px solid ${cfg.color}20`}}>{cfg.icon}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:BROWN_D,
                      fontFamily:"'Georgia',serif"}}>{cat}</div>
                    <div style={{fontSize:10,color:BROWN_L,marginTop:1}}>{pct}% tổng chi</div>
                  </div>
                </div>
                <div style={{fontSize:15,fontWeight:700,color:cfg.color,
                  fontFamily:"'Georgia',serif"}}>{fmtM(amt)} ₫</div>
              </div>
              <ProgBar pct={pct} color={cfg.color}/>
            </div>
          );
        })}
      </div>

      {/* Trend bars */}
      <div style={T.sec}>
        <div style={T.stl}>Chi Tiêu 12 Tháng</div>
        <div style={{...T.card,padding:"16px 14px"}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:3,height:72}}>
            {trend.map((t,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:"100%",borderRadius:"4px 4px 0 0",
                  height:t.exp>0?Math.max((t.exp/maxE)*62,4):2,
                  background:i===selM?ACCENT:BG3,transition:"height .3s ease",
                  border:i===selM?`1px solid ${ACCENT_L}`:"none"}}/>
                <span style={{fontSize:8,color:i===selM?ACCENT:BROWN_XL,fontWeight:700,
                  letterSpacing:"-0.3px"}}>{MS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent */}
      <div style={T.sec}>
        <div style={T.stl}>Gần Đây</div>
        {[...mTxs].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6).map(tx=>{
          const cfg=ALL_CATS[tx.cat]||{icon:"📦",color:BROWN_L};
          return (
            <div key={tx.id} style={T.txR}>
              <div style={T.txIco(cfg.color)}>{cfg.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:BROWN_D,whiteSpace:"nowrap",
                  overflow:"hidden",textOverflow:"ellipsis",fontFamily:"'Georgia',serif"}}>
                  {tx.desc}
                </div>
                <div style={{fontSize:11,color:BROWN_L,marginTop:2}}>{tx.sub} · {fmtD(tx.date)}</div>
              </div>
              <div style={{fontSize:14,fontWeight:700,flexShrink:0,
                fontFamily:"'Georgia',serif",
                color:tx.type==="Thu"?GREEN:RED}}>
                {tx.type==="Thu"?"+":"-"}{fmtM(tx.amount)} ₫
              </div>
            </div>
          );
        })}
      </div>
    </div>;
  };

  // ── TRANSACTIONS ─────────────────────────────────────────────
  const Txs = ()=>{
    const [ft,setFt]=useState("all");
    const shown=[...mTxs].filter(t=>ft==="all"||t.type===ft)
                          .sort((a,b)=>new Date(b.date)-new Date(a.date));
    return <div style={T.scr}>
      <div style={{...T.hdr,paddingBottom:20}}>
        <div style={{fontSize:24,fontWeight:700,color:SURFACE,fontFamily:"'Georgia',serif",
          letterSpacing:"-0.5px",marginBottom:14}}>Giao Dịch</div>
        <div style={{display:"flex",gap:8}}>
          {[["all","Tất cả"],["Thu","Thu nhập"],["Chi","Chi tiêu"]].map(([v,l])=>(
            <button key={v} style={{padding:"6px 14px",borderRadius:99,border:"none",cursor:"pointer",
              fontSize:11,fontWeight:700,fontFamily:"'Georgia',serif",letterSpacing:"0.2px",
              background:ft===v?SURFACE:"rgba(255,255,255,.1)",
              color:ft===v?BROWN_D:"rgba(255,255,255,.6)",
              boxShadow:ft===v?"0 1px 6px rgba(0,0,0,.15)":"none"}}
              onClick={()=>setFt(v)}>{l}</button>
          ))}
        </div>
      </div>
      <div style={T.mstrip}>
        {MS.map((m,i)=><button key={i} style={T.mpill(selM===i)} onClick={()=>setSelM(i)}>{m}</button>)}
      </div>
      <div style={{padding:"14px 16px 24px"}}>
        {shown.length===0&&(
          <div style={{textAlign:"center",padding:"48px 0",color:BROWN_XL,
            fontFamily:"'Georgia',serif",fontStyle:"italic"}}>Chưa có giao dịch</div>
        )}
        {shown.map(tx=>{
          const cfg=ALL_CATS[tx.cat]||{icon:"📦",color:BROWN_L};
          return (
            <div key={tx.id} style={T.txR}>
              <div style={T.txIco(cfg.color)}>{cfg.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:BROWN_D,whiteSpace:"nowrap",
                  overflow:"hidden",textOverflow:"ellipsis",fontFamily:"'Georgia',serif"}}>
                  {tx.desc}
                </div>
                <div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap"}}>
                  <Chip label={tx.cat} color={cfg.color}/>
                  {tx.sub&&<Chip label={tx.sub} color={BROWN_L} bg={BG2}/>}
                </div>
                <div style={{fontSize:10,color:BROWN_XL,marginTop:4}}>{fmtD(tx.date)} · {tx.pay}</div>
              </div>
              <div style={{fontSize:15,fontWeight:700,flexShrink:0,
                fontFamily:"'Georgia',serif",color:tx.type==="Thu"?GREEN:RED}}>
                {tx.type==="Thu"?"+":"-"}{fmtM(tx.amount)} ₫
              </div>
            </div>
          );
        })}
      </div>
    </div>;
  };

  // ── GOALS ────────────────────────────────────────────────────
  const Goals = ()=>(
    <div style={T.scr}>
      <div style={{...T.hdr,paddingBottom:20}}>
        <div style={{fontSize:24,fontWeight:700,color:SURFACE,fontFamily:"'Georgia',serif",
          letterSpacing:"-0.5px"}}>Mục Tiêu</div>
        <div style={{fontSize:12,color:BROWN_XL,marginTop:4,fontStyle:"italic"}}>
          Tiết kiệm dài hạn gia đình
        </div>
      </div>
      <div style={{padding:"16px 16px 0"}}>
        {/* Total savings hero */}
        <div style={{borderRadius:18,padding:"20px",marginBottom:18,
          background:BROWN_D,border:`1px solid ${BROWN_M}`}}>
          <div style={{fontSize:11,color:BROWN_XL,letterSpacing:"1px",textTransform:"uppercase",
            fontFamily:"'Georgia',serif",marginBottom:6}}>Tổng Đã Tiết Kiệm</div>
          <div style={{fontSize:32,fontWeight:700,color:SURFACE,fontFamily:"'Georgia',serif",
            letterSpacing:"-1px"}}>
            {fmtM(GOALS.reduce((s,g)=>s+g.saved,0))} ₫
          </div>
          <div style={{marginTop:8}}>
            <ProgBar pct={Math.round(GOALS.reduce((s,g)=>s+g.saved,0)/GOALS.reduce((s,g)=>s+g.target,0)*100)}
              color={ACCENT_L}/>
          </div>
          <div style={{fontSize:11,color:BROWN_L,marginTop:6}}>
            trên {fmtM(GOALS.reduce((s,g)=>s+g.target,0))} ₫ mục tiêu
          </div>
        </div>

        {GOALS.map(g=>{
          const pct=Math.min(100,Math.round(g.saved/g.target*100));
          return (
            <div key={g.id} style={{...T.card,padding:"16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",
                alignItems:"flex-start",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:26}}>{g.icon}</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:BROWN_D,
                      fontFamily:"'Georgia',serif"}}>{g.name}</div>
                    <div style={{fontSize:10,color:BROWN_L,marginTop:2}}>Hạn: {g.deadline}</div>
                  </div>
                </div>
                <div style={{background:g.color+"15",borderRadius:99,padding:"4px 12px",
                  fontSize:13,fontWeight:700,color:g.color,fontFamily:"'Georgia',serif"}}>
                  {pct}%
                </div>
              </div>
              <ProgBar pct={pct} color={g.color}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
                {[["Đã có",g.saved,GREEN],["Còn thiếu",g.target-g.saved,RED],
                  ["Mục tiêu",g.target,BROWN_L]].map(([l,v,c],i)=>(
                  <div key={i} style={{textAlign:i===0?"left":i===1?"center":"right"}}>
                    <div style={{fontSize:9,color:BROWN_XL,textTransform:"uppercase",
                      letterSpacing:"0.5px",marginBottom:3}}>{l}</div>
                    <div style={{fontSize:13,fontWeight:700,color:c,
                      fontFamily:"'Georgia',serif"}}>{fmtM(v)} ₫</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── ADD MODAL ────────────────────────────────────────────────
  const AddModal = ()=>{
    const isThu = form.type==="Thu";
    const cats  = isThu?THU_CATEGORIES:CHI_CATEGORIES;
    const subs  = cats[form.cat]?.subs||[];
    return (
      <div style={T.overlay} onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
        <div style={T.sheet}>
          <div style={{width:36,height:4,borderRadius:99,background:BG3,margin:"0 auto 20px"}}/>
          <div style={{fontSize:18,fontWeight:700,color:BROWN_D,marginBottom:18,
            fontFamily:"'Georgia',serif"}}>Thêm Giao Dịch</div>

          {/* Thu / Chi */}
          <div style={{display:"flex",gap:8,marginBottom:18}}>
            {["Chi","Thu"].map(t=>(
              <button key={t} style={{flex:1,padding:"11px",borderRadius:14,border:"none",cursor:"pointer",
                fontSize:13,fontWeight:700,fontFamily:"'Georgia',serif",transition:"all .2s",
                background:form.type===t?(t==="Thu"?GREEN:BROWN_D):BG2,
                color:form.type===t?SURFACE:BROWN_L,
                boxShadow:form.type===t?"0 3px 12px rgba(61,43,31,.2)":"none"}}
                onClick={()=>setForm({...form,type:t,
                  cat:t==="Thu"?"Lương Chồng":"Ăn Uống",sub:""})}>
                {t==="Thu"?"💰 Thu nhập":"💸 Chi tiêu"}
              </button>
            ))}
          </div>

          {/* Category grid */}
          <div style={{marginBottom:16}}>
            <label style={T.lbl}>Nhóm</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {Object.entries(cats).map(([cat,cfg])=>(
                <button key={cat} style={{padding:"10px 6px",borderRadius:12,cursor:"pointer",
                  background:form.cat===cat?cfg.color+"12":BG,
                  border:`1.5px solid ${form.cat===cat?cfg.color:BG3}`,
                  color:BROWN_D,transition:"all .15s"}}
                  onClick={()=>setForm({...form,cat,sub:""})}>
                  <div style={{fontSize:20,marginBottom:3}}>{cfg.icon}</div>
                  <div style={{fontSize:9,fontWeight:600,lineHeight:1.2,textAlign:"center",
                    color:form.cat===cat?cfg.color:BROWN_L,fontFamily:"'Georgia',serif"}}>
                    {cat}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sub-cats */}
          {subs.length>0&&(
            <div style={{marginBottom:16}}>
              <label style={T.lbl}>Danh mục con</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {subs.map(s=>(
                  <button key={s} style={{padding:"6px 12px",borderRadius:99,border:"none",
                    cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'Georgia',serif",
                    background:form.sub===s?BROWN_D:BG2,
                    color:form.sub===s?SURFACE:BROWN_L,transition:"all .15s"}}
                    onClick={()=>setForm({...form,sub:s})}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Amount + Date */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div>
              <label style={T.lbl}>Số Tiền (₫)</label>
              <input type="number" placeholder="0" style={T.inp} value={form.amount}
                onChange={e=>setForm({...form,amount:e.target.value})}/>
            </div>
            <div>
              <label style={T.lbl}>Ngày</label>
              <input type="date" style={T.inp} value={form.date}
                onChange={e=>setForm({...form,date:e.target.value})}/>
            </div>
          </div>

          <div style={{marginBottom:14}}>
            <label style={T.lbl}>Mô Tả</label>
            <input type="text" placeholder="Ghi chú..." style={T.inp} value={form.desc}
              onChange={e=>setForm({...form,desc:e.target.value})}/>
          </div>

          <div style={{marginBottom:22}}>
            <label style={T.lbl}>Thanh Toán</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {PAYMENT.map(p=>(
                <button key={p} style={{padding:"6px 12px",borderRadius:99,border:"none",
                  cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'Georgia',serif",
                  background:form.pay===p?ACCENT:BG2,
                  color:form.pay===p?SURFACE:BROWN_L,transition:"all .15s",
                  boxShadow:form.pay===p?"0 2px 8px rgba(139,69,19,.2)":"none"}}
                  onClick={()=>setForm({...form,pay:p})}>{p}</button>
              ))}
            </div>
          </div>

          <button style={T.saveBtn} onClick={addTx}>Lưu Giao Dịch</button>
        </div>
      </div>
    );
  };

  // ── NAV ──────────────────────────────────────────────────────
  const NAV=[
    {id:"home", icon:"🏠",lb:"Tổng Quan"},
    {id:"add",  icon:"+", lb:"Thêm",     action:()=>setShowAdd(true)},
    {id:"txs",  icon:"📋",lb:"Giao Dịch"},
    {id:"goals",icon:"🎯",lb:"Mục Tiêu"},
  ];

  return (
    <div style={T.app}>
      {tab==="home" &&<Home/>}
      {tab==="txs"  &&<Txs/>}
      {tab==="goals"&&<Goals/>}
      {showAdd&&<AddModal/>}

      <div style={T.bnav}>
        {NAV.map(n=>{
          const isAdd=n.id==="add";
          const active=tab===n.id&&!isAdd;
          return (
            <button key={n.id} onClick={n.action||(()=>setTab(n.id))}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                gap:isAdd?0:3,background:"none",border:"none",cursor:"pointer",
                paddingTop:isAdd?0:6}}>
              {isAdd
                ? <div style={{width:46,height:46,borderRadius:15,marginTop:-22,
                    background:BROWN_D,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:24,color:SURFACE,
                    boxShadow:`0 4px 16px rgba(61,43,31,.35)`}}>＋</div>
                : <span style={{fontSize:21,opacity:active?1:.3,transition:"opacity .15s"}}>{n.icon}</span>
              }
              <span style={{fontSize:10,fontWeight:700,
                fontFamily:"'Georgia',serif",letterSpacing:"0.2px",
                color:active?ACCENT:isAdd?BROWN_M:BROWN_XL,
                marginTop:isAdd?4:0}}>{n.lb}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
