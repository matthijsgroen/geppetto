import{p as i,j as r}from"./iframe-jl7oPzfV.js";import{N as a}from"./NumberInput-Bpcj5x8J.js";import{R as l}from"./RangeInput-GxjahNBL.js";import{T as u}from"./ToggleInput-DhAj2t1Z.js";import{C as c}from"./ControlPanel-B7zb8pFQ.js";import{C as m}from"./Control-WDna5xCq.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./Label-Dl2pAVjB.js";const s=i.meta({title:"Molecules/Control",component:m,argTypes:{children:{control:!1}},args:{label:"Label",htmlFor:"InputField"},decorators:[p=>r.jsx("div",{children:r.jsx(c,{children:r.jsx(p,{})})})]}),e=s.story({args:{children:r.jsx(a,{value:10,prefix:"x:",htmlId:"InputField"})}}),t=s.story({args:{children:[r.jsx(a,{value:10,prefix:"x:",htmlId:"InputField"},"x"),r.jsx(a,{value:10,prefix:"y:"},"y")]}}),o=s.story({args:{children:r.jsx(l,{value:10,id:"InputField"})}}),n=s.story({args:{children:r.jsx(u,{checked:!0,id:"InputField"})}});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <NumberInput value={10} prefix="x:" htmlId="InputField" />
  }
})`,...e.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: [<NumberInput key="x" value={10} prefix="x:" htmlId="InputField" />, <NumberInput key="y" value={10} prefix="y:" />]
  }
})`,...t.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <RangeInput value={10} id="InputField" />
  }
})`,...o.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <ToggleInput checked id="InputField" />
  }
})`,...n.input.parameters?.docs?.source}}};const v=["NumberControl","VectorControl","SliderControl","ToggleControl"];export{e as NumberControl,o as SliderControl,n as ToggleControl,t as VectorControl,v as __namedExportsOrder,s as default};
