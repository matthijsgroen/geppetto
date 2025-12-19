import{j as u,p as i}from"./iframe-CY0xYQ0n.js";import"./preload-helper-PPVm8Dsz.js";const a=({value:r,formatter:n=o=>o.toString()})=>u.jsx("p",{className:"w-[4ch] text-right text-sm text-dimmed",children:n(r)});a.__docgenInfo={description:"",methods:[],displayName:"RangeValue",props:{value:{required:!0,tsType:{name:"number"},description:""},formatter:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => string",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"string"}}},description:"",defaultValue:{value:"(v) => v.toString()",computed:!1}}}};const s=i.meta({title:"Atoms/RangeValue",component:a}),e=s.story({args:{value:42}}),t=s.story({args:{value:.83,formatter:r=>`${(r*100).toFixed(0)}%`}});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    value: 42
  }
})`,...e.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    value: 0.83,
    formatter: v => \`\${(v * 100).toFixed(0)}%\`
  }
})`,...t.input.parameters?.docs?.source}}};const c=["Default","WithFormatter"];export{e as Default,t as WithFormatter,c as __namedExportsOrder,s as default};
