import{p as a,j as t,k as s}from"./iframe-BjqMxiNP.js";import"./preload-helper-PPVm8Dsz.js";const o=a.meta({title:"Atoms/TimeCurve",component:s,argTypes:{variant:{control:"select",options:["linear","easeIn","easeOut","easeInOut"]},size:{control:"radio",options:["flex","option"]},start:{control:"number",defaultValue:0},end:{control:"number",defaultValue:1}},parameters:{layout:"fullscreen"},decorators:[r=>t.jsx("div",{className:"flex-1 bg-toolbar p-4",children:t.jsx(r,{})})]}),e=o.story({args:{variant:"easeInOut",size:"option",start:0,end:1}});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    variant: "easeInOut",
    size: "option",
    start: 0,
    end: 1
  }
})`,...e.input.parameters?.docs?.source}}};const u=["TimeCurve"];export{e as TimeCurve,u as __namedExportsOrder,o as default};
