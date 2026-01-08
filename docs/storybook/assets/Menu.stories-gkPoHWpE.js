import{p as i,j as e,M as t,o as s,I as o}from"./iframe-HcbDREA1.js";import{M as r,a,b as c,S as l}from"./MenuHeader-D1JPz0ov.js";import"./preload-helper-PPVm8Dsz.js";const d=i.meta({title:"Organisms/Menu",component:r,argTypes:{children:{control:!1}}}),n=d.story({render:()=>e.jsxs(r,{menuButton:({open:u})=>e.jsx(s,{active:u,icon:e.jsx(o,{children:"🧵"})}),portal:!0,transition:!0,children:[e.jsx(t,{children:"New File"}),e.jsx(t,{shortcut:{interaction:"KeyS",ctrlOrCmd:!0},children:"Save"}),e.jsx(a,{}),e.jsx(c,{children:"Edit"}),e.jsxs(l,{label:"Edit",children:[e.jsx(t,{shortcut:{interaction:"KeyX",ctrlOrCmd:!0,alt:!0},children:"Cut"}),e.jsx(t,{shortcut:{interaction:"KeyC",shift:!0},children:"Copy"}),e.jsx(t,{disabled:!0,shortcut:{interaction:"KeyV",shift:!0,alt:!0},children:"Paste"})]}),e.jsx(t,{children:"Print..."})]})});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Menu menuButton={({
    open
  }) => <ToolButton active={open} icon={<Icon>🧵</Icon>} />} portal transition>
      <MenuItem>New File</MenuItem>
      <MenuItem shortcut={{
      interaction: "KeyS",
      ctrlOrCmd: true
    }}>
        Save
      </MenuItem>
      <MenuDivider />
      <MenuHeader>Edit</MenuHeader>
      <SubMenu label="Edit">
        <MenuItem shortcut={{
        interaction: "KeyX",
        ctrlOrCmd: true,
        alt: true
      }}>
          Cut
        </MenuItem>
        <MenuItem shortcut={{
        interaction: "KeyC",
        shift: true
      }}>
          Copy
        </MenuItem>
        <MenuItem disabled shortcut={{
        interaction: "KeyV",
        shift: true,
        alt: true
      }}>
          Paste
        </MenuItem>
      </SubMenu>
      <MenuItem>Print...</MenuItem>
    </Menu>
})`,...n.input.parameters?.docs?.source}}};const h=["Default"];export{n as Default,h as __namedExportsOrder,d as default};
