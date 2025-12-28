import{p as i,j as r}from"./iframe-BB5eUGr5.js";import{N as a}from"./NumberInput-D6Fl7Bql.js";import{R as l}from"./RangeInput-B20vUK4i.js";import{T as u}from"./ToggleInput-Du-UqRPY.js";import{C as c}from"./ControlPanel-BkWjS1UU.js";import{C as m}from"./Control-BDRr7VuU.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./Label-DT96c8W4.js";const s=i.meta({title:"Molecules/Control",component:m,argTypes:{children:{control:!1}},args:{label:"Label",htmlFor:"InputField"},decorators:[p=>r.jsx("div",{children:r.jsx(c,{children:r.jsx(p,{})})})]}),e=s.story({args:{children:r.jsx(a,{htmlId:"InputField",prefix:"x:",value:10})}}),t=s.story({args:{children:[r.jsx(a,{htmlId:"InputField",prefix:"x:",value:10},"x"),r.jsx(a,{prefix:"y:",value:10},"y")]}}),o=s.story({args:{children:r.jsx(l,{id:"InputField",value:10})}}),n=s.story({args:{children:r.jsx(u,{checked:!0,id:"InputField"})}});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <NumberInput htmlId="InputField" prefix="x:" value={10} />
  }
})`,...e.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: [<NumberInput htmlId="InputField" key="x" prefix="x:" value={10} />, <NumberInput key="y" prefix="y:" value={10} />]
  }
})`,...t.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <RangeInput id="InputField" value={10} />
  }
})`,...o.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <ToggleInput checked id="InputField" />
  }
})`,...n.input.parameters?.docs?.source}}};const v=["NumberControl","VectorControl","SliderControl","ToggleControl"];export{e as NumberControl,o as SliderControl,n as ToggleControl,t as VectorControl,v as __namedExportsOrder,s as default};
