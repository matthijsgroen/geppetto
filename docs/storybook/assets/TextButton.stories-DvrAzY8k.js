import{p as s,j as a}from"./iframe-CY0xYQ0n.js";import{T as r}from"./TextButton-DdOhi-z_.js";import"./preload-helper-PPVm8Dsz.js";const{expect:c,fn:i,userEvent:l,waitFor:p,within:m}=__STORYBOOK_MODULE_TEST__,d=s.meta({title:"Atoms/TextButton",component:r,argTypes:{onClick:{control:!1}},args:{children:"Hello world",onClick:i()},decorators:[e=>a.jsxs("p",{className:"text-text",children:["This is a paragraph. ",a.jsx(e,{})," is inside a paragraph."]})]}),t=d.story({args:{children:"Hello world"},play:async({args:e,canvasElement:n})=>{const o=m(n);await l.click(o.getByRole("button")),await p(()=>c(e.onClick).toHaveBeenCalled())}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: "Hello world"
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onClick).toHaveBeenCalled());
  }
})`,...t.input.parameters?.docs?.source}}};const g=["TextButton"];export{t as TextButton,g as __namedExportsOrder,d as default};
