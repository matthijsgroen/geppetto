import{p,j as r}from"./iframe-CY0xYQ0n.js";import{C as m}from"./Control-CBSjmguG.js";import{N as n}from"./NumberInput-yloyHXNo.js";import"./preload-helper-PPVm8Dsz.js";import"./Label-D2RPCB9Z.js";import"./clsx-B-dksMZM.js";const a=p.meta({title:"Atoms/Controls/NumberInput",component:n,args:{prefix:"x:",htmlId:"InputField",value:10}}),t=a.story(),o=a.story({decorators:[s=>r.jsx(m,{label:"Label",htmlFor:"InputField",children:r.jsx(s,{})})]}),e=a.story({decorators:[s=>r.jsxs(r.Fragment,{children:[r.jsx(s,{}),r.jsx(n,{value:10,prefix:"y:"},"y")]})]});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:"meta.story()",...t.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [Story => <Control label="Label" htmlFor="InputField">
        <Story />
      </Control>]
})`,...o.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [Story => <>
        <Story />
        <NumberInput key="y" value={10} prefix="y:" />
      </>]
})`,...e.input.parameters?.docs?.source}}};const x=["Standalone","InControl","VectorControl"];export{o as InControl,t as Standalone,e as VectorControl,x as __namedExportsOrder,a as default};
