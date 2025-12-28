import{p as m,j as e}from"./iframe-BB5eUGr5.js";import{T as r}from"./ToggleInput-Du-UqRPY.js";import{C as o}from"./Control-BDRr7VuU.js";import{C as t}from"./ControlPanel-BkWjS1UU.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./Label-DT96c8W4.js";const p=m.meta({title:"Molecules/ControlPanel",component:t,argTypes:{children:{control:!1},extraControlCount:{control:"number"}},args:{shadow:!1,extraControlCount:2},render:({extraControlCount:a,children:s,...i})=>e.jsx("div",{className:"max-w-60",children:e.jsxs(t,{...i,children:[s,Array.from({length:a??0}).map((c,n)=>e.jsx(o,{label:`Extra Field ${n+1}`,children:e.jsx(r,{})},n))]})})}),l=p.story({args:{children:[e.jsx(o,{label:"Hello",children:e.jsx(r,{})},"field1"),e.jsx(o,{label:"Hello with a really really long name",children:e.jsx(r,{})},"field2")]}});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: [<Control key="field1" label="Hello">
        <ToggleInput />
      </Control>, <Control key="field2" label="Hello with a really really long name">
        <ToggleInput />
      </Control>]
  }
})`,...l.input.parameters?.docs?.source}}};const j=["ControlPanel"];export{l as ControlPanel,j as __namedExportsOrder,p as default};
