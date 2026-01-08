import{p as o,j as a,T as r}from"./iframe-HcbDREA1.js";import"./preload-helper-PPVm8Dsz.js";const{expect:c,fn:i,userEvent:l,waitFor:p,within:d}=__STORYBOOK_MODULE_TEST__,m=o.meta({title:"Atoms/TextButton",component:r,argTypes:{onClick:{control:!1}},args:{children:"Hello world",onClick:i()},decorators:[e=>a.jsxs("p",{className:"text-text",children:["This is a paragraph. ",a.jsx(e,{})," is inside a paragraph."]})]}),t=m.story({args:{children:"Hello world"},play:async({args:e,canvasElement:n})=>{const s=d(n);await l.click(s.getByRole("button")),await p(()=>c(e.onClick).toHaveBeenCalled())}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const w=["TextButton"];export{t as TextButton,w as __namedExportsOrder,m as default};
