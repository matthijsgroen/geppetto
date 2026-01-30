import{p as b,j as y,H as v}from"./iframe-BjqMxiNP.js";import"./preload-helper-PPVm8Dsz.js";const{expect:a,fn:p,userEvent:n}=__STORYBOOK_MODULE_TEST__,d=b.meta({title:"Organisms/RenameInput",component:v,argTypes:{align:{control:{type:"radio"},options:["left","right","center"]}},decorators:[t=>y.jsxs("div",{className:"w-48",children:[y.jsx(t,{}),y.jsx("p",{children:"some text for the tests"})]})]}),r=d.story({args:{value:"My Item",align:"left",onRename:p()},play:async({canvas:t,args:o})=>{const s=await t.findByRole("button");await n.dblClick(s);const e=await t.findByRole("textbox");a(e).toHaveFocus(),await n.clear(e),await n.type(e,"Renamed Item",{delay:100}),await n.keyboard("{Enter}"),a(o.onRename).toHaveBeenCalledWith("Renamed Item")}}),c=d.story({args:{value:"My Item",align:"left",onRename:p()},play:async({canvas:t,args:o})=>{const s=await t.findByRole("button");await n.dblClick(s);const e=await t.findByRole("textbox");a(e).toHaveFocus(),e.dispatchEvent(new Event("blur",{bubbles:!0}));const i=await t.findByRole("paragraph");n.click(i);const m=await t.findByRole("button");a(m).toHaveTextContent("My Item"),a(o.onRename).not.toHaveBeenCalled()}}),u=d.story({args:{value:"My Item",align:"left",onRename:p()},play:async({canvas:t,args:o})=>{const s=await t.findByRole("button");await n.dblClick(s);const e=await t.findByRole("textbox");a(e).toHaveFocus(),await n.clear(e),await n.type(e,"Renamed Item",{delay:100}),e.dispatchEvent(new Event("blur",{bubbles:!0}));const i=await t.findByRole("paragraph");n.click(i);const m=await t.findByRole("button");a(m).toHaveTextContent("My Item"),a(o.onRename).toHaveBeenCalledWith("Renamed Item")}}),l=d.story({args:{value:"My Item",align:"left",onRename:p()},play:async({canvas:t,args:o})=>{const s=await t.findByRole("button");await n.dblClick(s);const e=await t.findByRole("textbox");a(e).toHaveFocus(),await n.clear(e),n.type(e,"Renamed Item",{delay:100}),await n.keyboard("{Escape}");const i=await t.findByRole("button");a(i).toHaveTextContent("My Item"),a(o.onRename).not.toHaveBeenCalled()}});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    value: "My Item",
    align: "left",
    onRename: fn()
  },
  play: async ({
    canvas,
    args
  }) => {
    const button = await canvas.findByRole("button");
    await userEvent.dblClick(button);
    const input = await canvas.findByRole("textbox");
    expect(input).toHaveFocus();
    await userEvent.clear(input);
    await userEvent.type(input, "Renamed Item", {
      delay: 100
    });
    await userEvent.keyboard("{Enter}");
    expect(args.onRename).toHaveBeenCalledWith("Renamed Item");
  }
})`,...r.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    value: "My Item",
    align: "left",
    onRename: fn()
  },
  play: async ({
    canvas,
    args
  }) => {
    const button = await canvas.findByRole("button");
    await userEvent.dblClick(button);
    const input = await canvas.findByRole("textbox");
    expect(input).toHaveFocus();
    input.dispatchEvent(new Event("blur", {
      bubbles: true
    }));
    const text = await canvas.findByRole("paragraph");
    userEvent.click(text);
    const buttonAfterEscape = await canvas.findByRole("button");
    expect(buttonAfterEscape).toHaveTextContent("My Item");
    expect(args.onRename).not.toHaveBeenCalled();
  }
})`,...c.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    value: "My Item",
    align: "left",
    onRename: fn()
  },
  play: async ({
    canvas,
    args
  }) => {
    const button = await canvas.findByRole("button");
    await userEvent.dblClick(button);
    const input = await canvas.findByRole("textbox");
    expect(input).toHaveFocus();
    await userEvent.clear(input);
    await userEvent.type(input, "Renamed Item", {
      delay: 100
    });
    input.dispatchEvent(new Event("blur", {
      bubbles: true
    }));
    const text = await canvas.findByRole("paragraph");
    userEvent.click(text);
    const buttonAfterEscape = await canvas.findByRole("button");
    expect(buttonAfterEscape).toHaveTextContent("My Item");
    expect(args.onRename).toHaveBeenCalledWith("Renamed Item");
  }
})`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    value: "My Item",
    align: "left",
    onRename: fn()
  },
  play: async ({
    canvas,
    args
  }) => {
    const button = await canvas.findByRole("button");
    await userEvent.dblClick(button);
    const input = await canvas.findByRole("textbox");
    expect(input).toHaveFocus();
    await userEvent.clear(input);
    userEvent.type(input, "Renamed Item", {
      delay: 100
    });
    await userEvent.keyboard("{Escape}");
    const buttonAfterEscape = await canvas.findByRole("button");
    expect(buttonAfterEscape).toHaveTextContent("My Item");
    expect(args.onRename).not.toHaveBeenCalled();
  }
})`,...l.input.parameters?.docs?.source}}};const w=["Default","BlurWithoutChange","BlurWithChange","EscapeCancels"];export{u as BlurWithChange,c as BlurWithoutChange,r as Default,l as EscapeCancels,w as __namedExportsOrder,d as default};
