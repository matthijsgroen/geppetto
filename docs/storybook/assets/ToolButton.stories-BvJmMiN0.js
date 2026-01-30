import{p as y,s as g,j as a,I as t}from"./iframe-BjqMxiNP.js";import"./preload-helper-PPVm8Dsz.js";const{expect:m,fn:b,waitFor:v}=__STORYBOOK_MODULE_TEST__,e=y.meta({title:"Atoms/ToolButton",component:g,argTypes:{icon:{control:!1},onClick:{control:!1},onKeyDown:{control:!1},ref:{control:!1},onContextMenu:{control:!1},label:{control:"text"},tooltip:{control:"text"},size:{control:{type:"select"},options:["default","small","minimal"]}},args:{disabled:!1,active:!1,notificationBadge:!1,standAlone:!1,keyboardFocusOnly:!1,dangerous:!1,size:"default",onClick:b()}}),n=e.story({args:{icon:a.jsx(t,{children:"💡"})},play:async({canvas:u,userEvent:p,args:d})=>{await p.click(u.getByRole("button")),await m(d.onClick).toHaveBeenCalled()}}),o=e.story({args:{icon:a.jsx(t,{children:"💡"}),active:!0}}),s=e.story({args:{icon:a.jsx(t,{children:"💡"}),label:"Button"}}),r=e.story({args:{icon:a.jsx(t,{children:"💡"}),disabled:!0},play:async({args:u,canvas:p,userEvent:d})=>{await d.click(p.getByRole("button")),await v(()=>m(u.onClick).not.toHaveBeenCalled())}}),c=e.story({args:{icon:a.jsx(t,{children:"💡"}),disabled:!0,active:!0}}),i=e.story({args:{label:"Delete",dangerous:!0}}),l=e.story({args:{icon:a.jsx(t,{children:"💡"}),active:!1,keyboardFocusOnly:!0}});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
    label: "Delete",
    dangerous: true
  }
})`,...i.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    icon: <Icon>💡</Icon>,
    active: false,
    keyboardFocusOnly: true
  }
})`,...l.input.parameters?.docs?.source}}};const B=["Default","Active","WithLabel","Disabled","ActiveDisabled","Dangerous","KeyboardFocusOnly"];export{o as Active,c as ActiveDisabled,i as Dangerous,n as Default,r as Disabled,l as KeyboardFocusOnly,s as WithLabel,B as __namedExportsOrder,e as default};
