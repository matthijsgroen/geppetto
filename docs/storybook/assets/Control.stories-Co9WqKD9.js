import{p,j as e,a as u,x as i,N as a,R as c,q as d}from"./iframe-Cm78seEQ.js";import"./preload-helper-PPVm8Dsz.js";const s=p.meta({title:"Molecules/Control",component:u,argTypes:{children:{control:!1}},args:{label:"Label",htmlFor:"InputField"},decorators:[l=>e.jsx("div",{children:e.jsx(i,{children:e.jsx(l,{})})})]}),r=s.story({args:{children:e.jsx(a,{htmlId:"InputField",prefix:"x:",value:10})}}),t=s.story({args:{children:[e.jsx(a,{htmlId:"InputField",prefix:"x:",value:10},"x"),e.jsx(a,{prefix:"y:",value:10},"y")]}}),n=s.story({args:{children:e.jsx(c,{id:"InputField",value:10})}}),o=s.story({args:{children:e.jsx(d,{checked:!0,id:"InputField"})}});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <NumberInput htmlId="InputField" prefix="x:" value={10} />
  }
})`,...r.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: [<NumberInput htmlId="InputField" key="x" prefix="x:" value={10} />, <NumberInput key="y" prefix="y:" value={10} />]
  }
})`,...t.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <RangeInput id="InputField" value={10} />
  }
})`,...n.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <ToggleInput checked id="InputField" />
  }
})`,...o.input.parameters?.docs?.source}}};const g=["NumberControl","VectorControl","SliderControl","ToggleControl"];export{r as NumberControl,n as SliderControl,o as ToggleControl,t as VectorControl,g as __namedExportsOrder,s as default};
