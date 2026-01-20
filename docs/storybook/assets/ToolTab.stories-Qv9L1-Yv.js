import{p as v,v as b,j as o,I as s}from"./iframe-Cm78seEQ.js";import"./preload-helper-PPVm8Dsz.js";const{expect:p,fn:y,userEvent:u,waitFor:d,within:m}=__STORYBOOK_MODULE_TEST__,c=v.meta({title:"Atoms/ToolTab",component:b,argTypes:{icon:{control:!1},ref:{control:!1},label:{control:"text"},size:{control:"radio",options:["default","small","minimal"]},active:{control:"boolean"},disabled:{control:"boolean"},vertical:{control:"boolean"},onClick:{action:"clicked"},onKeyDown:{action:"keyed down"}},args:{disabled:!1,active:!1,vertical:!1,label:"",size:"default",tooltip:"Tool Tab",onClick:y()}}),a=c.story({args:{icon:o.jsx(s,{children:"💡"}),label:"Canvas"},play:async({args:r,canvasElement:i})=>{const l=m(i);await u.click(l.getByRole("button")),await d(()=>p(r.onClick).toHaveBeenCalled())}}),e=c.story({args:{icon:o.jsx(s,{children:"💡"}),active:!0}}),n=c.story({args:{icon:o.jsx(s,{children:"💡"}),disabled:!0},play:async({args:r,canvasElement:i})=>{const l=m(i);await u.click(l.getByRole("button")),await d(()=>p(r.onClick).not.toHaveBeenCalled())}}),t=c.story({args:{icon:o.jsx(s,{children:"💡"}),disabled:!0,active:!0}});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    label: "Canvas"
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onClick).toHaveBeenCalled());
  }
})`,...a.input.parameters?.docs?.source}}};e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    active: true
  }
})`,...e.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    disabled: true
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onClick).not.toHaveBeenCalled());
  }
})`,...n.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    disabled: true,
    active: true
  }
})`,...t.input.parameters?.docs?.source}}};const T=["ToolTab","Active","Disabled","ActiveDisabled"];export{e as Active,t as ActiveDisabled,n as Disabled,a as ToolTab,T as __namedExportsOrder,c as default};
