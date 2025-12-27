import{p as m,j as e}from"./iframe-jl7oPzfV.js";import{T as r}from"./ToggleInput-DhAj2t1Z.js";import{C as o}from"./Control-WDna5xCq.js";import{C as t}from"./ControlPanel-B7zb8pFQ.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./Label-Dl2pAVjB.js";const p=m.meta({title:"Molecules/ControlPanel",component:t,argTypes:{children:{control:!1},extraControlCount:{control:"number"}},args:{shadow:!1,extraControlCount:2},render:({extraControlCount:a,children:s,...i})=>e.jsx("div",{className:"max-w-60",children:e.jsxs(t,{...i,children:[s,Array.from({length:a??0}).map((c,n)=>e.jsx(o,{label:`Extra Field ${n+1}`,children:e.jsx(r,{})},n))]})})}),l=p.story({args:{children:[e.jsx(o,{label:"Hello",children:e.jsx(r,{})},"field1"),e.jsx(o,{label:"Hello with a really really long name",children:e.jsx(r,{})},"field2")]}});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: [<Control label="Hello" key="field1">
        <ToggleInput />
      </Control>, <Control label="Hello with a really really long name" key="field2">
        <ToggleInput />
      </Control>]
  }
})`,...l.input.parameters?.docs?.source}}};const j=["ControlPanel"];export{l as ControlPanel,j as __namedExportsOrder,p as default};
