import{p as C,c as S,j as D,K as j}from"./iframe-BjqMxiNP.js";import"./preload-helper-PPVm8Dsz.js";const E=f=>{const t=S.c(19);let e,r,s,o,a,n,i;t[0]!==f?({interaction:r,ctrlOrCmd:s,ctrl:o,shift:a,alt:n,mac:i,...e}=f,t[0]=f,t[1]=e,t[2]=r,t[3]=s,t[4]=o,t[5]=a,t[6]=n,t[7]=i):(e=t[1],r=t[2],s=t[3],o=t[4],a=t[5],n=t[6],i=t[7]);const g=r===void 0?"KeyO":r,b=s===void 0?!1:s,y=o===void 0?!1:o,K=a===void 0?!1:a,O=n===void 0?!1:n,h=i===void 0?!1:i;let c;t[8]!==O||t[9]!==y||t[10]!==b||t[11]!==g||t[12]!==h||t[13]!==K?(c={interaction:g,ctrlOrCmd:b,ctrl:y,shift:K,alt:O,mac:h},t[8]=O,t[9]=y,t[10]=b,t[11]=g,t[12]=h,t[13]=K,t[14]=c):c=t[14];const v=c;let l;t[15]===Symbol.for("react.memo_cache_sentinel")?(l={background:"var(--colors-panel)",margin:0},t[15]=l):l=t[15];let d;return t[16]!==e||t[17]!==v?(d=D.jsx("div",{children:D.jsx("p",{style:l,children:D.jsx(j,{shortcut:v,...e})})}),t[16]=e,t[17]=v,t[18]=d):d=t[18],d},x=C.meta({title:"Atoms/Kbd",component:E,argTypes:{ctrlOrCmd:{control:"boolean"},ctrl:{control:"boolean"},shift:{control:"boolean"},alt:{control:"boolean"},interaction:{options:["KeyO","KeyS","Backspace","Digit1","Digit3","Delete","DelOrBackspace","Enter","Escape","Tab","MouseDrag","Undo","Redo"],control:"select"}},args:{interaction:"KeyO",disabled:!1,ctrlOrCmd:!1,ctrl:!1,shift:!1,alt:!1,mac:!1,dimmed:!1,inMenu:!1}}),m=x.story(),p=x.story({args:{interaction:"KeyO",ctrlOrCmd:!0}}),u=x.story({args:{interaction:"Digit1",shift:!0}});m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:"meta.story()",...m.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    interaction: "KeyO",
    ctrlOrCmd: true
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    interaction: "Digit1",
    shift: true
  }
})`,...u.input.parameters?.docs?.source}}};const R=["Kbd","KbdCmd","KbdShiftDigit"];export{m as Kbd,p as KbdCmd,u as KbdShiftDigit,R as __namedExportsOrder,x as default};
