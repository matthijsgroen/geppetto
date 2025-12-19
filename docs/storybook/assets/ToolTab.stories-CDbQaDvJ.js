import{p as v,j as o}from"./iframe-CY0xYQ0n.js";import{I as s}from"./Icon-BdRUnBtT.js";import{T as g}from"./ToolTab-DqzQ3BQZ.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./ToolBarContext-FVLpZIoL.js";import"./Label-D2RPCB9Z.js";const{expect:p,fn:y,userEvent:u,waitFor:m,within:d}=__STORYBOOK_MODULE_TEST__,r=v.meta({title:"Atoms/ToolTab",component:g,argTypes:{icon:{control:!1},label:{control:"text"}},args:{disabled:!1,active:!1,vertical:!1,onClick:y()}}),a=r.story({args:{icon:o.jsx(s,{children:"💡"}),label:"Canvas"},play:async({args:c,canvasElement:i})=>{const l=d(i);await u.click(l.getByRole("button")),await m(()=>p(c.onClick).toHaveBeenCalled())}}),e=r.story({args:{icon:o.jsx(s,{children:"💡"}),active:!0}}),n=r.story({args:{icon:o.jsx(s,{children:"💡"}),disabled:!0},play:async({args:c,canvasElement:i})=>{const l=d(i);await u.click(l.getByRole("button")),await m(()=>p(c.onClick).not.toHaveBeenCalled())}}),t=r.story({args:{icon:o.jsx(s,{children:"💡"}),disabled:!0,active:!0}});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const f=["ToolTab","Active","Disabled","ActiveDisabled"];export{e as Active,t as ActiveDisabled,n as Disabled,a as ToolTab,f as __namedExportsOrder,r as default};
