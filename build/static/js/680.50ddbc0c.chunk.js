"use strict";(window.webpackChunksupplementarydashboard=window.webpackChunksupplementarydashboard||[]).push([[680],{9680:(e,t,o)=>{o.r(t),o.d(t,{default:()=>V});var l=o(5043),a=o(2703),i=o(2206),n=o(6462),r=o(5827),s=o(8903),c=o(1906),d=o(9336),h=o(2258),m=o(2019),p=o(7901),f=o(3290),u=o(231);const g=o.p+"static/media/rJumpToFloor.27d14b20a130d835786d11d463b4c134.svg";var x=o(9516),v=o(4295),b=o(5586),A=o(7933),y=o(7670),w=o(1059),S=o(334),j=o(2371),C=o(7442);o.p;o(8265),o(4050),o(7135);const k=o.p+"static/media/greyQRTvechicle.852d6461d779fd0a8c93a10e8b73c9e1.svg";const I=o.p+"static/media/greyLAB.040a45bf62dd9024685ab24793f8b48a.svg";var _=o(579),E=o(9369),U=(o(3803),o(219),o(6598),o(9436),_.Fragment,function(e,t,o){return E.h.call(t,"css")?_.jsx(E.E,(0,E.c)(e,t),o):_.jsx(e,t,o)}),D=function(e,t,o){return E.h.call(t,"css")?_.jsxs(E.E,(0,E.c)(e,t),o):_.jsxs(e,t,o)};const T=["#29991d","RGB(128, 128,128)","#ff9933","red"],B=f.i7`
  0% { opacity: 1; }
  30% { opacity: 0.5; }
  100% { opacity: 1; }
`,R=f.i7`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
`,$=e=>{let{floorData:t}=e;const{value:o,setValue:r}=(0,l.useContext)(p.i),f=(0,n.Zp)(),[_,E]=(0,l.useState)(0);(0,l.useEffect)((()=>{const e=t.map((e=>{var t,o,l,a,i,n;const r=(null!==(t=e.biological_alarms)&&void 0!==t?t:0)+(null!==(o=e.chemical_alarms)&&void 0!==o?o:0)+(null!==(l=e.radiological_alarms)&&void 0!==l?l:0),s=null!==(a=e.activeSensors)&&void 0!==a?a:0,c=null!==(i=e.totalSensors)&&void 0!==i?i:0,d=(null!==(n=e.unhealthySensors)&&void 0!==n?n:0)>0;return r>0?"#E30613":d?"#ff9933":0===c||0===s?"RGB(128, 128,128)":"#28A745"}));r(e);const o=setInterval((()=>{E((e=>e+1))}),2e4);return()=>clearInterval(o)}),[t,r]);const $=e=>{f("floorwise?floor="+e)};return U(a.A,{mt:2,children:U(s.Ay,{container:!0,spacing:8,justifyContent:"center",children:t.map(((e,t)=>{var o,l,n,r,p,E;const F=e.disconnected_sensors+e.inactiveSensors,W=e.biological_alarms+e.chemical_alarms+e.radiological_alarms,N=W>0?"red":e.unhealthySensors>0?"#ff9933":F>0||0===e.activeSensors||0===e.totalSensors?"RGB(128, 128,128)":"#29991d",Z=0===e.totalSensors?S.A:e.biological_alarms>0?y.A:F>0||0===e.activeSensors?S.A:v.A,G=0===e.totalSensors?j.A:e.chemical_alarms>0?A.A:F>0||0===e.activeSensors?j.A:x.A,H=0===e.totalSensors?C.A:e.radiological_alarms>0?w.A:F>0||0===e.activeSensors?C.A:b.A,L=(e.activeSensors||0)+(F||0)+e.unhealthySensors,z={chart:{type:"donut",animations:{enabled:!0,easing:"linear",speed:2e3},toolbar:{show:!1}},labels:["Active","Inactive","Unhealthy Sensors","CBRN Alarms"],legend:{show:!0,position:"bottom"},colors:T,dataLabels:{enabled:!0,formatter:(t,o)=>{let{seriesIndex:l}=o;return[e.activeSensors||0,F||0,e.unhealthySensors||0,W||0][l]||0}},plotOptions:{pie:{donut:{size:"60%",labels:{show:!0,total:{show:!0,label:"Total",fontSize:"12px",color:"#000",formatter:()=>`${L}`}}}}}},Q=[e.activeSensors||0,F||0,e.unhealthySensors||0,W||0],J=null!==(o=null===(l=e.floor)||void 0===l?void 0:l.toUpperCase())&&void 0!==o?o:"";let V;V=J.includes("QRT")?k:J.includes("LAB")?I:g;const X=0===(null!==(n=e.totalSensors)&&void 0!==n?n:0)||0===(null!==(r=e.activeSensors)&&void 0!==r?r:0)&&(null!==F&&void 0!==F?F:0)>0;return U(s.Ay,{item:!0,xs:12,sm:6,md:4,lg:3,xl:2.4,children:U(h.J,{statusColor:N,sx:{width:"100%",height:"100%"},children:D(a.A,{p:2,display:"flex",backgroundColor:"white",flexDirection:"column",height:"100%",children:[D(a.A,{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2,children:[D(a.A,{display:"flex",gap:2,alignItems:"center",children:[D(a.A,{display:"flex",alignItems:"center",gap:1.5,children:[U("img",{src:G,alt:"Chemical Alert",width:24,height:24}),U(i.U,{variant:"caption",fontWeight:"bold",color:"black",ml:1,children:e.chemical_alarms||0})]}),U(i.U,{variant:"caption",mx:1,children:"|"}),D(a.A,{display:"flex",alignItems:"center",gap:1.5,children:[U("img",{src:Z,alt:"Biological Alert",width:24,height:24}),U(i.U,{variant:"caption",fontWeight:"bold",color:"black",ml:1,children:e.biological_alarms||0})]}),U(i.U,{variant:"caption",mx:1,children:"|"}),D(a.A,{display:"flex",alignItems:"center",gap:1.5,children:[U("img",{src:H,alt:"Radiation Alert",width:24,height:24}),U(i.U,{variant:"caption",fontWeight:"bold",color:"black",ml:1,children:e.radiological_alarms||0})]})]}),U(a.A,{component:"img",src:V,alt:"Floor Icon",width:30,height:30,sx:{marginLeft:1,filter:X?"grayscale(100%) brightness(80%)":0===W&&0!==(null!==(p=e.totalSensors)&&void 0!==p?p:0)&&(null!==(E=e.activeSensors)&&void 0!==E?E:0)>0?"brightness(0) saturate(100%) invert(38%) sepia(75%) saturate(498%) hue-rotate(92deg) brightness(90%) contrast(95%)":"none",animation:W>0?`${R} 1.5s infinite ease-in-out`:"none"}})]}),U(i.U,{variant:"title3",style:{fontWeight:"bold"},children:e.floor.toUpperCase()}),U(a.A,{display:"flex",justifyContent:"center",mt:1,mb:1,sx:{width:"100%",height:"200px"},children:Q.every((e=>0===e||void 0===e||null===e))?U(a.A,{mt:10,children:U(i.U,{variant:"body2",color:"textSecondary",children:"No sensors available to display"})}):U(m.A,{options:z,series:Q,type:"donut",width:"100%",height:200},_)}),D(c.A,{variant:"contained",sx:{border:W>0?"1px solid #E30613":"1px solid #29991d",backgroundColor:W>0?"#E30613":"#29991d",color:"white",textTransform:"none",alignSelf:"center",width:"100%",display:"flex",justifyContent:"space-between",animation:W>0?`${B} 1s infinite`:"none"},onClick:()=>{(e.biological_alarms||0)>0||(e.chemical_alarms||0)>0||(e.radiological_alarms||0)>0?f(`/floorwiseAlarms?floor=${encodeURIComponent(e.floor)}`):$(e.floor)},children:[U("span",{children:"Total Detected Alarms"}),U("span",{children:W||"00"})]}),U(d.A,{style:{backgroundColor:"#D1D5DB",margin:"8px 0"}}),D(a.A,{display:"flex",justifyContent:"space-between",alignItems:"center",mt:1,children:[D(a.A,{display:"flex",alignItems:"center",children:[U("img",{src:u.A,alt:"Total Zone",width:16,height:16}),D(i.U,{variant:"body",ml:1,children:["Total Zones: ",U("strong",{children:e.totalZones})]})]}),U(c.A,{variant:"contained",color:"primary",style:{border:"1px solid #146BD2",backgroundColor:"#0073E7",textTransform:"none",width:"124px",height:"32px"},onClick:()=>$(e.floor),children:"Go to Floor"})]})]})})},t)}))})})};var F=o(9147),W=o(4260);o(387),o(5308);const N=()=>(0,_.jsx)(d.A,{style:{border:"1px solid #70707059",margin:"1rem"}});var Z=o(9493),G=o(5865);const H=f.i7`
  0% {
    transform: translateX(100vw);
  }
  100% {
    transform: translateX(-100%);
  }
`,L=f.i7`
  0% { opacity: 1; }
  30% { opacity: 0.5; }
  100% { opacity: 1; }
`,z=()=>{const[e,t]=(0,l.useState)(!1);(0,l.useEffect)((()=>{let e;const o=async()=>{const e=(await(0,W.$j)()).some((e=>"CBRN Alarms"===e.title&&Number(e.value)>0));t(e)};return o(),e=setInterval(o,5e3),()=>clearInterval(e)}),[]);const o=e?"Alarm Detected":"No Alarm Detected";return(0,_.jsx)(a.A,{sx:{width:"100%",overflow:"hidden",whiteSpace:"nowrap",backgroundColor:e?"#E30613":"#008000",padding:"8px",position:"relative",border:e?"2px solid red":"2px solid green",borderRadius:"5px",color:"white",textAlign:"center",animation:e?`${L} 1s infinite`:"none"},children:(0,_.jsx)(a.A,{sx:{display:"flex",width:"100%",position:"relative",overflow:"hidden"},children:(0,_.jsx)(G.A,{variant:"h6",sx:{display:"inline-block",whiteSpace:"nowrap",animation:`${H} 25s linear infinite`,fontWeight:"bold"},children:o})})})};var Q=o(3536);const J=f.AH`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:hover {
    overflow: auto;
  }

  /* Hide scrollbar in Firefox */
  scrollbar-width: none;
  /* Hide scrollbar in IE and Edge */
  -ms-overflow-style: none;

  /* Hide scrollbar in WebKit browsers */
  &::-webkit-scrollbar {
    width: 0px;
  }

  /* Show scrollbar on hover */
  &:hover::-webkit-scrollbar {
    width: 8px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: #d3d3d3;
    border-radius: 4px;
  }
`,V=()=>{const[e,t]=(0,l.useState)([]),[o,s]=(0,l.useState)(!0),c=(0,n.Zp)();(0,l.useEffect)((()=>{let o,l=!0,a=!0;const i=async()=>{a&&s(!0);try{const o=await(0,W.VQ)();!(0,Q.isEqual)(o,e)&&t(o)}catch(n){console.error("Error fetching floor data:",n)}finally{l&&(a&&(s(!1),a=!1),o=setTimeout(i,500))}};return i(),()=>{l=!1,clearTimeout(o)}}),[]);return(0,_.jsxs)(_.Fragment,{children:[o&&(0,_.jsx)(Z.A,{}),(0,_.jsxs)(a.A,{css:J,children:[(0,_.jsxs)(a.A,{position:"sticky",top:0,zIndex:1e3,bgcolor:"#f0f1f6",children:[(0,_.jsx)(a.A,{p:1,children:(0,_.jsx)(F.A,{})}),(0,_.jsx)(N,{}),(0,_.jsx)(i.U,{variant:"title3",children:(0,_.jsx)(z,{})}),(0,_.jsx)(N,{})]}),(0,_.jsxs)(a.A,{display:"flex",mt:2,flexDirection:"column",alignItems:"center",children:[(0,_.jsx)(a.A,{width:"100%",children:(0,_.jsx)(r.A,{floorData:e,onTabChange:e=>{c(`floorwise?floor=${e}`)}})}),(0,_.jsx)(a.A,{width:"100%",mt:2,children:(0,_.jsx)($,{floorData:e})}),(0,_.jsx)(a.A,{mt:1})]})]})]})}}}]);
//# sourceMappingURL=680.50ddbc0c.chunk.js.map