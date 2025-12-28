import{p,j as r}from"./iframe-BB5eUGr5.js";import{C as m}from"./Control-BDRr7VuU.js";import{N as n}from"./NumberInput-D6Fl7Bql.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-DT96c8W4.js";import"./clsx-B-dksMZM.js";const a=p.meta({title:"Atoms/Controls/NumberInput",component:n,args:{prefix:"x:",htmlId:"InputField",value:10}}),t=a.story(),o=a.story({decorators:[s=>r.jsx(m,{htmlFor:"InputField",label:"Label",children:r.jsx(s,{})})]}),e=a.story({decorators:[s=>r.jsxs(r.Fragment,{children:[r.jsx(s,{}),r.jsx(n,{prefix:"y:",value:10},"y")]})]});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:"meta.story()",...t.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [Story => <Control htmlFor="InputField" label="Label">
        <Story />
      </Control>]
})`,...o.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [Story => <>
        <Story />
        <NumberInput key="y" prefix="y:" value={10} />
      </>]
})`,...e.input.parameters?.docs?.source}}};const x=["Standalone","InControl","VectorControl"];export{o as InControl,t as Standalone,e as VectorControl,x as __namedExportsOrder,a as default};
