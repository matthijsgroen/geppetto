import{p as a,j as t}from"./iframe-CY0xYQ0n.js";import{F as n,a as s}from"./foundation-CfPE3Lbb.js";import"./preload-helper-PPVm8Dsz.js";import"./Title-1HcuaiII.js";const i=a.meta({title:"Foundations/Elevation",args:{}}),e=i.story({render:()=>t.jsx(n,{title:"Elevation",children:["shadow-sm","shadow-md","shadow-xl","shadow-inset-sm"].map(o=>t.jsx(s,{label:o,children:t.jsx("div",{className:`bg-panel rounded-control size-20 ${o}`,children:" "})},o))})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <FoundationList title="Elevation">
      {["shadow-sm", "shadow-md", "shadow-xl", "shadow-inset-sm"].map(elevation => <FoundationItem key={elevation} label={elevation}>
            <div className={\`bg-panel rounded-control size-20 \${elevation}\`}>
              &nbsp;
            </div>
          </FoundationItem>)}
    </FoundationList>
})`,...e.input.parameters?.docs?.source}}};const p=["Elevation"];export{e as Elevation,p as __namedExportsOrder,i as default};
