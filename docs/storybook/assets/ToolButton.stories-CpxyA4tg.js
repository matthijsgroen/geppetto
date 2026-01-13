import{p as d,q as m,j as e,I as t}from"./iframe-CkqNuqTG.js";import"./preload-helper-PPVm8Dsz.js";const{expect:p,fn:g,waitFor:y}=__STORYBOOK_MODULE_TEST__,n=d.meta({title:"Atoms/ToolButton",component:m,argTypes:{icon:{control:!1},onClick:{control:!1},onKeyDown:{control:!1},ref:{control:!1},onContextMenu:{control:!1},label:{control:"text"},tooltip:{control:"text"}},args:{disabled:!1,active:!1,notificationBadge:!1,standAlone:!1,onClick:g()}}),a=n.story({args:{icon:e.jsx(t,{children:"💡"})},play:async({canvas:i,userEvent:l,args:u})=>{await l.click(i.getByRole("button")),await p(u.onClick).toHaveBeenCalled()}}),o=n.story({args:{icon:e.jsx(t,{children:"💡"}),active:!0}}),s=n.story({args:{icon:e.jsx(t,{children:"💡"}),label:"Button"}}),r=n.story({args:{icon:e.jsx(t,{children:"💡"}),disabled:!0},play:async({args:i,canvas:l,userEvent:u})=>{await u.click(l.getByRole("button")),await y(()=>p(i.onClick).not.toHaveBeenCalled())}}),c=n.story({args:{icon:e.jsx(t,{children:"💡"}),disabled:!0,active:!0}});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalled();
  }
})`,...a.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    active: true
  }
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    label: "Button"
  }
})`,...s.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    disabled: true
  },
  play: async ({
    args,
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onClick).not.toHaveBeenCalled());
  }
})`,...r.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    disabled: true,
    active: true
  }
})`,...c.input.parameters?.docs?.source}}};const f=["Default","Active","WithLabel","Disabled","ActiveDisabled"];export{o as Active,c as ActiveDisabled,a as Default,r as Disabled,s as WithLabel,f as __namedExportsOrder,n as default};
