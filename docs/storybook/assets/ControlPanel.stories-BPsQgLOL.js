import{p as c,j as e,v as a,a as r,n as o}from"./iframe-HcbDREA1.js";import"./preload-helper-PPVm8Dsz.js";const d=c.meta({title:"Molecules/ControlPanel",component:a,argTypes:{children:{control:!1},extraControlCount:{control:"number"}},args:{shadow:!1,extraControlCount:2},render:({extraControlCount:t,children:s,...i})=>e.jsx("div",{className:"max-w-60",children:e.jsxs(a,{...i,children:[s,Array.from({length:t??0}).map((p,n)=>e.jsx(r,{label:`Extra Field ${n+1}`,children:e.jsx(o,{})},n))]})})}),l=d.story({args:{children:[e.jsx(r,{label:"Hello",children:e.jsx(o,{})},"field1"),e.jsx(r,{label:"Hello with a really really long name",children:e.jsx(o,{})},"field2")]}});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: [<Control key="field1" label="Hello">
        <ToggleInput />
      </Control>, <Control key="field2" label="Hello with a really really long name">
        <ToggleInput />
      </Control>]
  }
})`,...l.input.parameters?.docs?.source}}};const x=["ControlPanel"];export{l as ControlPanel,x as __namedExportsOrder,d as default};
