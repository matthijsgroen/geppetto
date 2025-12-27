import{p as o}from"./iframe-jl7oPzfV.js";import{R as s}from"./RangeValue-DfQ0yVsM.js";import"./preload-helper-PPVm8Dsz.js";const r=o.meta({title:"Atoms/RangeValue",component:s}),t=r.story({args:{value:42}}),e=r.story({args:{value:.83,formatter:a=>`${(a*100).toFixed(0)}%`}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    value: 42
  }
})`,...t.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    value: 0.83,
    formatter: v => \`\${(v * 100).toFixed(0)}%\`
  }
})`,...e.input.parameters?.docs?.source}}};const u=["Default","WithFormatter"];export{t as Default,e as WithFormatter,u as __namedExportsOrder,r as default};
