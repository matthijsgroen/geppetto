import{p as m,j as e}from"./iframe-CY0xYQ0n.js";import{T as r}from"./ToggleInput-I7-_W6T4.js";import{C as o}from"./Control-CBSjmguG.js";import{C as t}from"./ControlPanel-z6OS4T1-.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./Label-D2RPCB9Z.js";const p=m.meta({title:"Molecules/ControlPanel",component:t,argTypes:{children:{control:!1},extraControlCount:{control:"number"}},args:{shadow:!1,extraControlCount:2},render:({extraControlCount:a,children:s,...i})=>e.jsx("div",{className:"max-w-60",children:e.jsxs(t,{...i,children:[s,Array.from({length:a??0}).map((c,n)=>e.jsx(o,{label:`Extra Field ${n+1}`,children:e.jsx(r,{})},n))]})})}),l=p.story({args:{children:[e.jsx(o,{label:"Hello",children:e.jsx(r,{})},"field1"),e.jsx(o,{label:"Hello with a really really long name",children:e.jsx(r,{})},"field2")]}});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: [<Control label="Hello" key="field1">
        <ToggleInput />
      </Control>, <Control label="Hello with a really really long name" key="field2">
        <ToggleInput />
      </Control>]
  }
})`,...l.input.parameters?.docs?.source}}};const j=["ControlPanel"];export{l as ControlPanel,j as __namedExportsOrder,p as default};
