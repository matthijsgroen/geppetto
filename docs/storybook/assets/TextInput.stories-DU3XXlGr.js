import{p as s,f as n,j as o,a as l}from"./iframe-CkqNuqTG.js";import"./preload-helper-PPVm8Dsz.js";const a=s.meta({title:"Atoms/Controls/TextInput",component:n,argTypes:{type:{control:!1},size:{control:{type:"radio"},options:["default","small"]},align:{control:{type:"radio"},options:["left","right","center"]}},args:{placeholder:"Enter text...",size:"default",align:"left",transparent:!1}}),t=a.story({decorators:[r=>o.jsx("div",{className:"w-64",children:o.jsx(r,{})})]}),e=a.story({decorators:[r=>o.jsx(l,{label:"Name",children:o.jsx(r,{})})]});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [Story => <div className="w-64">
        <Story />
      </div>]
})`,...t.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [Story => <Control label="Name">
        <Story />
      </Control>]
})`,...e.input.parameters?.docs?.source}}};const c=["StandAlone","InControl"];export{e as InControl,t as StandAlone,c as __namedExportsOrder,a as default};
