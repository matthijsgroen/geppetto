import{p as c,j as e,o as a,a as o,g as r}from"./iframe-DP97NOyG.js";import"./preload-helper-PPVm8Dsz.js";const d=c.meta({title:"Molecules/ControlPanel",component:a,argTypes:{children:{control:!1},extraControlCount:{control:"number"}},args:{shadow:!1,extraControlCount:2},render:({extraControlCount:t,children:s,...i})=>e.jsx("div",{className:"max-w-60",children:e.jsxs(a,{...i,children:[s,Array.from({length:t??0}).map((p,n)=>e.jsx(o,{label:`Extra Field ${n+1}`,children:e.jsx(r,{})},n))]})})}),l=d.story({args:{children:[e.jsx(o,{label:"Hello",children:e.jsx(r,{})},"field1"),e.jsx(o,{label:"Hello with a really really long name",children:e.jsx(r,{})},"field2")]}});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: [<Control key="field1" label="Hello">
        <ToggleInput />
      </Control>, <Control key="field2" label="Hello with a really really long name">
        <ToggleInput />
      </Control>]
  }
})`,...l.input.parameters?.docs?.source}}};const g=["ControlPanel"];export{l as ControlPanel,g as __namedExportsOrder,d as default};
