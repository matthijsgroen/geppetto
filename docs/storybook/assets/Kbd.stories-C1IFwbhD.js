import{p as d,j as s,K as u}from"./iframe-HcbDREA1.js";import"./preload-helper-PPVm8Dsz.js";const f=({interaction:o="KeyO",ctrlOrCmd:n=!1,shift:i=!1,alt:c=!1,mac:l=!1,...p})=>{const m={interaction:o,ctrlOrCmd:n,shift:i,alt:c,mac:l};return s.jsx("div",{children:s.jsx("p",{style:{background:"var(--colors-panel)",margin:0},children:s.jsx(u,{shortcut:m,...p})})})},a=d.meta({title:"Atoms/Kbd",component:f,argTypes:{ctrlOrCmd:{control:"boolean"},shift:{control:"boolean"},alt:{control:"boolean"},interaction:{options:["KeyO","KeyS","Backspace","Digit1","Digit3","Delete","DelOrBackspace","MouseDrag"],control:"select"}},args:{interaction:"KeyO",disabled:!1,ctrlOrCmd:!1,shift:!1,alt:!1,mac:!1,dimmed:!1,inMenu:!1}}),t=a.story(),e=a.story({args:{interaction:"KeyO",ctrlOrCmd:!0}}),r=a.story({args:{interaction:"Digit1",shift:!0}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:"meta.story()",...t.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    interaction: "KeyO",
    ctrlOrCmd: true
  }
})`,...e.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    interaction: "Digit1",
    shift: true
  }
})`,...r.input.parameters?.docs?.source}}};const K=["Kbd","KbdCmd","KbdShiftDigit"];export{t as Kbd,e as KbdCmd,r as KbdShiftDigit,K as __namedExportsOrder,a as default};
