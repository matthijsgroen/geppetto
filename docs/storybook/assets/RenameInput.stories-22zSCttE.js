import{p as b,j as d,F as v}from"./iframe-CkqNuqTG.js";import"./preload-helper-PPVm8Dsz.js";const{expect:n,fn:l,userEvent:a}=__STORYBOOK_MODULE_TEST__,p=b.meta({title:"Organisms/RenameInput",component:v,argTypes:{align:{control:{type:"radio"},options:["left","right","center"]}},decorators:[t=>d.jsxs("div",{className:"w-48",children:[d.jsx(t,{}),d.jsx("p",{children:"some text for the tests"})]})]}),i=p.story({args:{value:"My Item",align:"left",onRename:l()},play:async({canvas:t,args:o})=>{(await t.findByRole("button")).click();const e=await t.findByRole("textbox");n(e).toHaveFocus(),await a.clear(e),await a.type(e,"Renamed Item",{delay:100}),await a.keyboard("{Enter}"),n(o.onRename).toHaveBeenCalledWith("Renamed Item")}}),c=p.story({args:{value:"My Item",align:"left",onRename:l()},play:async({canvas:t,args:o})=>{(await t.findByRole("button")).click();const e=await t.findByRole("textbox");n(e).toHaveFocus(),e.dispatchEvent(new Event("blur",{bubbles:!0}));const s=await t.findByRole("paragraph");a.click(s);const y=await t.findByRole("button");n(y).toHaveTextContent("My Item"),n(o.onRename).not.toHaveBeenCalled()}}),r=p.story({args:{value:"My Item",align:"left",onRename:l()},play:async({canvas:t,args:o})=>{(await t.findByRole("button")).click();const e=await t.findByRole("textbox");n(e).toHaveFocus(),await a.clear(e),await a.type(e,"Renamed Item",{delay:100}),e.dispatchEvent(new Event("blur",{bubbles:!0}));const s=await t.findByRole("paragraph");a.click(s);const y=await t.findByRole("button");n(y).toHaveTextContent("My Item"),n(o.onRename).toHaveBeenCalledWith("Renamed Item")}}),u=p.story({args:{value:"My Item",align:"left",onRename:l()},play:async({canvas:t,args:o})=>{(await t.findByRole("button")).click();const e=await t.findByRole("textbox");n(e).toHaveFocus(),await a.clear(e),a.type(e,"Renamed Item",{delay:100}),await a.keyboard("{Escape}");const s=await t.findByRole("button");n(s).toHaveTextContent("My Item"),n(o.onRename).not.toHaveBeenCalled()}});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
    button.click();
    const input = await canvas.findByRole("textbox");
    expect(input).toHaveFocus();
    await userEvent.clear(input);
    await userEvent.type(input, "Renamed Item", {
      delay: 100
    });
    await userEvent.keyboard("{Enter}");
    expect(args.onRename).toHaveBeenCalledWith("Renamed Item");
  }
})`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
    button.click();
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
})`,...c.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
    button.click();
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
})`,...r.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
    button.click();
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
})`,...u.input.parameters?.docs?.source}}};const x=["Default","BlurWithoutChange","BlurWithChange","EscapeCancels"];export{r as BlurWithChange,c as BlurWithoutChange,i as Default,u as EscapeCancels,x as __namedExportsOrder,p as default};
