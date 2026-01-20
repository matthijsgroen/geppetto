import{p as u,j as s,K as f}from"./iframe-Cm78seEQ.js";import"./preload-helper-PPVm8Dsz.js";const g=({interaction:o="KeyO",ctrlOrCmd:n=!1,ctrl:i=!1,shift:c=!1,alt:l=!1,mac:p=!1,...d})=>{const m={interaction:o,ctrlOrCmd:n,ctrl:i,shift:c,alt:l,mac:p};return s.jsx("div",{children:s.jsx("p",{style:{background:"var(--colors-panel)",margin:0},children:s.jsx(f,{shortcut:m,...d})})})},a=u.meta({title:"Atoms/Kbd",component:g,argTypes:{ctrlOrCmd:{control:"boolean"},ctrl:{control:"boolean"},shift:{control:"boolean"},alt:{control:"boolean"},interaction:{options:["KeyO","KeyS","Backspace","Digit1","Digit3","Delete","DelOrBackspace","Enter","Escape","Tab","MouseDrag","Undo","Redo"],control:"select"}},args:{interaction:"KeyO",disabled:!1,ctrlOrCmd:!1,ctrl:!1,shift:!1,alt:!1,mac:!1,dimmed:!1,inMenu:!1}}),t=a.story(),e=a.story({args:{interaction:"KeyO",ctrlOrCmd:!0}}),r=a.story({args:{interaction:"Digit1",shift:!0}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:"meta.story()",...t.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
