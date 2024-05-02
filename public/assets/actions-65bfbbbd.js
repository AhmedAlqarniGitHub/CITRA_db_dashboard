import{r as i,j as e,T as c,M as y,y as h,O as I,W as U}from"./index-68cf636a.js";import{a as M,C as G,F as v,I as b,S as j}from"./axios-9c6a5e82.js";import{C as A}from"./Container-c2567aed.js";import{C as q}from"./CardContent-4b2d8757.js";import{B as V}from"./Button-71f483d7.js";import{C as K}from"./CircularProgress-12514937.js";const P={}.VITE_API_URL||"https://citra-api-qp4p25cifq-ww.a.run.app";function Y(){const[u,$]=i.useState(""),[S,N]=i.useState(""),[p,O]=i.useState(""),[C,D]=i.useState(""),[E,m]=i.useState(!1),[F,T]=i.useState([]),[J,_]=i.useState([]),k=["January","February","March","April","May","June","July","August","September","October","November","December"],x=["Provide a summary of the most common user emotions observed at all events over time","Detail the user emotions observed during a specific event in a given month","Offer a comprehensive overview of attendee emotions for a selected event","Present recommendations to enhance attendee satisfaction based on event data."],R={January:"Jan",February:"Feb",March:"Mar",April:"Apr",May:"May",June:"Jun",July:"Jul",August:"Aug",September:"Sep",October:"Oct",November:"Nov",December:"Dec"};i.useEffect(()=>{W()},[]);const W=async()=>{m(!0);const t=localStorage.getItem("id");try{const n=await M.get(`${P}/events/chatgpt/${t}`);T(n.data),_(Object.keys(n.data[0]).filter(s=>s!=="month")),m(!1)}catch(n){console.error("Error fetching event data:",n),m(!1)}},z=(t,n,s)=>{const a=x.indexOf(t)+1,r=B(F,p,S,a);switch(a){case 1:return`Please analyze the aggregated facial emotion detection data across all events and provide a summary of the predominant emotions that have been observed. Include the data: ${r}. The response should be structured in JSON format with the keys "Predominant_Emotions" and "Insights", for example: { "Predominant_Emotions": ["Happy", "Surprised"], "Insights": ["The most frequent emotion is...", "There was a notable trend..."] }.`;case 2:return`Examine the facial emotion detection data for ${n} in the month of ${s}: ${r}, and summarize the main emotions detected among attendees. Your summary should be in JSON format with the keys "Event", "Month", "Visitors Emotions", and "Insights". For instance: { "Event": "${n}", "Month": "${s}", "Visitors Emotions": {"Happy": 120, "Neutral": 50}, "Insights": ["The dominant emotion was happiness", "Neutral expressions were largely due to the wait times."] }.`;case 3:return`Analyze the emotional data for ${n} over all available months. Data: ${r}. Organize your analysis into JSON format, with keys for "Event", "Emotions_Per_Month", and "Insights". For example: { "Event": "${n}", "Emotions_Per_Month": {"January": {"Happy": 100, "Sad": 20}, "February": {"Happy": 150, "Sad": 25}}, "Insights": ["An uptick in happiness was noted in February", "Sadness levels remained fairly consistent", "Interactive exhibits are recommended to further enhance positivity."] }.`;case 4:return`Review the facial emotion detection data and propose actionable steps that event organizers can take to improve attendee satisfaction at ${n}. The data provided: ${r}, should guide your recommendations. Please respond with a JSON object only, including keys "Event" and "Recommendations", like this: { "Event": "${n}", "Recommendations": ["To foster engagement, add more interactive sessions", "Incorporate relaxation areas to allow attendees to recharge."] }.`;default:return""}},B=(t,n,s,a)=>{switch(a){case 1:case 4:return JSON.stringify(t);case 2:const r=t.find(d=>d.month===R[s]);if(!r)return"";const l=r[n];return l?JSON.stringify({event:n,month:s,user_emotions:l}):"";case 3:const o=t.map(d=>{const f=d[n],g=d.month;return f?{[g]:f}:{[g]:{}}});return JSON.stringify(o);default:return""}},H=async()=>{m(!0);const t=z(u,p,S);try{const n=await M.post(`${P}/actions/generate-text`,{prompt:t});D(n.data)}catch(n){console.error("Error generating insights:",n)}finally{m(!1)}},L=t=>{let n,s="";const a=t.indexOf("{"),r=t.lastIndexOf("}")+1;a>-1&&r>a&&(s=t.substring(0,a),t=t.substring(a,r));try{n=JSON.parse(t)}catch(l){return console.error("Couldn't parse the response as JSON:",l),e.jsx(c,{variant:"body1",children:t})}return e.jsxs(A,{children:[s&&e.jsxs(h,{sx:{mb:2},children:[e.jsx(c,{variant:"subtitle1",sx:{fontWeight:"bold",mb:1},children:"Observations:"}),e.jsx(I,{elevation:2,sx:{p:2},children:e.jsx(c,{variant:"body1",sx:{whiteSpace:"pre-wrap"},children:s})})]}),Object.entries(n).map(([l,o],d)=>e.jsxs(h,{sx:{mb:2},children:[e.jsxs(c,{variant:"subtitle1",sx:{fontWeight:"bold",mb:1},children:[w(l),":"]}),e.jsx(I,{elevation:2,sx:{p:2},children:typeof o=="object"&&!Array.isArray(o)?Q(o):Array.isArray(o)?e.jsx("ul",{style:{padding:0,listStylePosition:"inside"},children:o.map((f,g)=>e.jsx("li",{children:e.jsx(c,{variant:"body1",sx:{color:"text.secondary",display:"inline"},children:f})},g))}):e.jsx(c,{variant:"body1",sx:{color:"text.secondary"},children:o.toString()})})]},d))]})};function w(t){return t.replace(/_/g," ").replace(/\w\S*/g,n=>n.replace(/^\w/,s=>s.toUpperCase()))}function Q(t){return e.jsx(I,{elevation:0,sx:{p:2},children:Object.entries(t).map(([n,s],a)=>e.jsxs(c,{variant:"body1",sx:{color:"text.secondary"},children:[w(n),": ",typeof s=="object"?JSON.stringify(s):s.toString()]},a))})}return e.jsxs(A,{maxWidth:"md",children:[e.jsx(c,{variant:"h4",gutterBottom:!0,children:"Insights Generator"}),e.jsx(G,{sx:{mb:2},children:e.jsxs(q,{children:[e.jsxs(v,{fullWidth:!0,sx:{mb:2},children:[e.jsx(b,{children:"Question"}),e.jsx(j,{label:"Question",value:u,onChange:t=>$(t.target.value),children:x.map((t,n)=>e.jsx(y,{value:t,children:t},n))})]}),u===x[1]&&e.jsxs(h,{children:[e.jsxs(v,{fullWidth:!0,sx:{mb:2},children:[e.jsx(b,{children:"Month"}),e.jsx(j,{label:"Month",value:S,onChange:t=>N(t.target.value),children:k.map(t=>e.jsx(y,{value:t,children:t},t))})]}),e.jsxs(v,{fullWidth:!0,sx:{mb:2},children:[e.jsx(b,{children:"Event"}),e.jsx(j,{label:"Event",value:p,onChange:t=>O(t.target.value),children:J.map(t=>e.jsx(y,{value:t,children:t},t))})]})]}),u===x[2]&&e.jsx(h,{children:e.jsxs(v,{fullWidth:!0,sx:{mb:2},children:[e.jsx(b,{children:"Event"}),e.jsx(j,{label:"Event",value:p,onChange:t=>O(t.target.value),children:J.map(t=>e.jsx(y,{value:t,children:t},t))})]})}),e.jsx(V,{variant:"contained",onClick:H,disabled:E,children:"Generate Insights"}),E&&e.jsxs(h,{sx:{display:"flex",justifyContent:"center",alignItems:"center",height:"100px"},children:[e.jsx(K,{})," "]}),!E&&C&&e.jsx(h,{sx:{mt:2},children:L(C)})]})})]})}function ae(){return e.jsxs(e.Fragment,{children:[e.jsx(U,{children:e.jsx("title",{children:" Insightful Action | CITRA Dashboard "})}),e.jsx(Y,{})]})}export{ae as default};