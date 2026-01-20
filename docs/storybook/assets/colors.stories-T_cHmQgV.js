import{p as n,j as e}from"./iframe-Cm78seEQ.js";import{F as r,a as i}from"./foundation-C1Lkz4gB.js";import"./preload-helper-PPVm8Dsz.js";const a=n.meta({title:"Foundations/Colors",args:{}}),o=a.story({render:()=>e.jsx(r,{title:"Colors",children:["bg-workspace","bg-toolbar","bg-notification","bg-panel","bg-control-interaction","bg-control-edge","bg-control-focus","bg-control-highlight","bg-control-active","bg-control-active-dimmed","bg-text","bg-dimmed","bg-active"].map(t=>e.jsx(i,{label:t.slice(3),children:e.jsx("div",{className:`${t} size-20 rounded-control shadow-md`,children:" "})},t))})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <FoundationList title="Colors">
      {["bg-workspace", "bg-toolbar", "bg-notification", "bg-panel", "bg-control-interaction", "bg-control-edge", "bg-control-focus", "bg-control-highlight", "bg-control-active", "bg-control-active-dimmed", "bg-text", "bg-dimmed", "bg-active"].map(color => <FoundationItem key={color} label={color.slice(3)}>
          <div className={\`\${color} size-20 rounded-control shadow-md\`}>
            &nbsp;
          </div>
        </FoundationItem>)}
    </FoundationList>
})`,...o.input.parameters?.docs?.source}}};const d=["Colors"];export{o as Colors,d as __namedExportsOrder,a as default};
