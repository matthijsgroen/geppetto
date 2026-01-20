import{p as m,r as y,j as e,I as t}from"./iframe-Cm78seEQ.js";import"./preload-helper-PPVm8Dsz.js";const{expect:d,fn:g,waitFor:v}=__STORYBOOK_MODULE_TEST__,n=m.meta({title:"Atoms/ToolButton",component:y,argTypes:{icon:{control:!1},onClick:{control:!1},onKeyDown:{control:!1},ref:{control:!1},onContextMenu:{control:!1},label:{control:"text"},tooltip:{control:"text"},size:{control:{type:"select"},options:["default","small","minimal"]}},args:{disabled:!1,active:!1,notificationBadge:!1,standAlone:!1,keyboardFocusOnly:!1,size:"default",onClick:g()}}),a=n.story({args:{icon:e.jsx(t,{children:"💡"})},play:async({canvas:l,userEvent:u,args:p})=>{await u.click(l.getByRole("button")),await d(p.onClick).toHaveBeenCalled()}}),o=n.story({args:{icon:e.jsx(t,{children:"💡"}),active:!0}}),s=n.story({args:{icon:e.jsx(t,{children:"💡"}),label:"Button"}}),r=n.story({args:{icon:e.jsx(t,{children:"💡"}),disabled:!0},play:async({args:l,canvas:u,userEvent:p})=>{await p.click(u.getByRole("button")),await v(()=>d(l.onClick).not.toHaveBeenCalled())}}),c=n.story({args:{icon:e.jsx(t,{children:"💡"}),disabled:!0,active:!0}}),i=n.story({args:{icon:e.jsx(t,{children:"💡"}),active:!1,keyboardFocusOnly:!0}});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    active: false,
    keyboardFocusOnly: true
  }
})`,...i.input.parameters?.docs?.source}}};const x=["Default","Active","WithLabel","Disabled","ActiveDisabled","KeyboardFocusOnly"];export{o as Active,c as ActiveDisabled,a as Default,r as Disabled,i as KeyboardFocusOnly,s as WithLabel,x as __namedExportsOrder,n as default};
