import{p,N as n,j as r,a as u}from"./iframe-Cm78seEQ.js";import"./preload-helper-PPVm8Dsz.js";const a=p.meta({title:"Atoms/Controls/NumberInput",component:n,args:{prefix:"x:",htmlId:"InputField",value:10}}),t=a.story(),e=a.story({decorators:[s=>r.jsx(u,{htmlFor:"InputField",label:"Label",children:r.jsx(s,{})})]}),o=a.story({decorators:[s=>r.jsxs(r.Fragment,{children:[r.jsx(s,{}),r.jsx(n,{prefix:"y:",value:10},"y")]})]});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:"meta.story()",...t.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [Story => <Control htmlFor="InputField" label="Label">
        <Story />
      </Control>]
})`,...e.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [Story => <>
        <Story />
        <NumberInput key="y" prefix="y:" value={10} />
      </>]
})`,...o.input.parameters?.docs?.source}}};const i=["Standalone","InControl","VectorControl"];export{e as InControl,t as Standalone,o as VectorControl,i as __namedExportsOrder,a as default};
