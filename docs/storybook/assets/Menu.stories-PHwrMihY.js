import{p as o,j as e}from"./iframe-jl7oPzfV.js";import{I as u}from"./Icon-Bo5a_kWh.js";import{T as s}from"./ToolButton-DzUaFgeo.js";import{M as t}from"./Menu-Dd91Tsdn.js";import{M as r,a,b as c,S as m}from"./MenuHeader-DIQT2gVO.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./Label-Dl2pAVjB.js";import"./ToolBarContext-DIKXAc5j.js";import"./Kbd-CTD47dCN.js";const l=o.meta({title:"Organisms/Menu",component:r,argTypes:{children:{control:!1}}}),n=l.story({render:()=>e.jsxs(r,{portal:!0,menuButton:({open:i})=>e.jsx(s,{icon:e.jsx(u,{children:"🧵"}),active:i}),transition:!0,children:[e.jsx(t,{children:"New File"}),e.jsx(t,{shortcut:{interaction:"KeyS",ctrlOrCmd:!0},children:"Save"}),e.jsx(a,{}),e.jsx(c,{children:"Edit"}),e.jsxs(m,{label:"Edit",children:[e.jsx(t,{shortcut:{interaction:"KeyX",ctrlOrCmd:!0,alt:!0},children:"Cut"}),e.jsx(t,{shortcut:{interaction:"KeyC",shift:!0},children:"Copy"}),e.jsx(t,{disabled:!0,shortcut:{interaction:"KeyV",shift:!0,alt:!0},children:"Paste"})]}),e.jsx(t,{children:"Print..."})]})});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Menu portal menuButton={({
    open
  }) => <ToolButton icon={<Icon>🧵</Icon>} active={open} />} transition>
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
})`,...n.input.parameters?.docs?.source}}};const S=["Default"];export{n as Default,S as __namedExportsOrder,l as default};
