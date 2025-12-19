import{p as j,j as e}from"./iframe-CY0xYQ0n.js";import{I as n}from"./Icon-BdRUnBtT.js";import{K as I}from"./Kbd-DEpuBJHE.js";import"./Label-D2RPCB9Z.js";import{a as h,L as M}from"./Logo-Cu2EEQxh.js";import"./NumberInput-yloyHXNo.js";import"./PanelTitle-Crr6YRed.js";import{P as c}from"./Paragraph-BTIcz1xP.js";import"./RangeInput-BLiiTESK.js";import"./TextButton-DdOhi-z_.js";import{T}from"./Title-1HcuaiII.js";import"./ToggleInput-I7-_W6T4.js";import{T as t}from"./ToolButton-DTjKaDok.js";import{T as i}from"./ToolSeparator-Bry69ak6.js";import"./ToolSpacer-DZdImMrk.js";import{T as a}from"./ToolTab-DqzQ3BQZ.js";import{C as d}from"./Column-6i4d-oi8.js";import"./Control-CBSjmguG.js";import"./ControlPanel-z6OS4T1-.js";import"./EmptyTree-DSbgCL9x.js";import{P as u}from"./Panel-KhMFgAXU.js";import{a as v,R as b}from"./ResizePanel-DkAQlQC0.js";import{R as g}from"./Row-BYo6iSQm.js";import{T as m}from"./ToolBar-DxtCiX02.js";import"./ToolGrid-D-Vyh_XJ.js";import{M as o}from"./Menu-BeloUNNo.js";import{a as y,s as f,T as B}from"./storybookTreeDataProvider-Dyobvtcj.js";import{M as S}from"./MenuRadioGroup-B0HccTkM.js";import{M as p,S as x,a as s,b as P}from"./MenuHeader-kGP0G8Dv.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./ToolBarContext-FVLpZIoL.js";const R=j.meta({title:"Pages/Layers",tags:["svg"]}),C=()=>null,r=R.story({render:()=>e.jsxs(d,{children:[e.jsxs(m,{children:[e.jsxs(p,{portal:!0,transition:!0,menuButton:({open:l})=>e.jsx(t,{icon:e.jsx(h,{}),active:l,notificationBadge:!0}),children:[e.jsx(o,{children:"↻ Restart for app update..."}),e.jsx(o,{children:"⇣ Install application locally"}),e.jsxs(x,{label:"File",children:[e.jsx(o,{children:"New"}),e.jsx(s,{}),e.jsx(o,{children:"Open"}),e.jsx(o,{children:"Load texture"}),e.jsx(s,{}),e.jsx(o,{children:"Reload texture"}),e.jsx(s,{}),e.jsx(o,{disabled:!0,children:"Save"}),e.jsx(o,{children:"Save as..."})]}),e.jsx(P,{children:"Edit"}),e.jsxs(x,{label:"Edit",children:[e.jsx(o,{children:"Cut"}),e.jsx(o,{children:"Copy"}),e.jsx(o,{children:"Paste"})]}),e.jsx(o,{children:"Print..."})]}),e.jsx(i,{}),e.jsx(a,{icon:e.jsx(n,{children:"🧬"}),label:"Layers",active:!0}),e.jsx(a,{icon:e.jsx(n,{children:"🤷🏼"}),label:"Composition"}),e.jsx(a,{icon:e.jsx(n,{children:"🏃"}),label:"Animation"}),e.jsx(i,{}),e.jsx(t,{active:!0,icon:e.jsx(n,{children:"✋"}),tooltip:"Move mode"}),e.jsx(t,{icon:e.jsx(n,{children:"🔧"}),tooltip:"Adjust point mode"}),e.jsx(t,{icon:e.jsx(n,{children:"✏️"}),tooltip:"Add point mode"}),e.jsx(i,{}),e.jsx(t,{icon:e.jsx(n,{children:"🗑"}),disabled:!0,tooltip:"Remove selected point"}),e.jsx(i,{}),e.jsx(t,{icon:e.jsx(n,{children:"📏"}),tooltip:"Toggle grid visibility"}),e.jsx(p,{portal:!0,menuButton:({open:l})=>e.jsx(t,{active:l,label:"32"}),direction:"bottom",align:"center",arrow:!0,transition:!0,children:e.jsxs(S,{value:32,children:[e.jsx(o,{type:"radio",value:8,children:"8"}),e.jsx(o,{type:"radio",value:16,children:"16"}),e.jsx(o,{type:"radio",value:32,children:"32"}),e.jsx(o,{type:"radio",value:64,children:"64"}),e.jsx(o,{type:"radio",value:128,children:"128"})]})}),e.jsx(t,{icon:e.jsx(n,{children:"🧲"}),tooltip:"Toggle magnetic grid"})]}),e.jsxs(g,{children:[e.jsx(v,{direction:b.East,minSize:100,defaultSize:250,children:e.jsxs(d,{children:[e.jsxs(m,{size:"small",children:[e.jsx(t,{icon:e.jsx(n,{children:"📄"}),label:"+",tooltip:"Add layer"}),e.jsx(t,{icon:e.jsx(n,{children:"📁"}),label:"+",tooltip:"Add folder"}),e.jsx(t,{icon:e.jsx(n,{children:"📑"}),disabled:!0,tooltip:"Copy layer"}),e.jsx(t,{icon:e.jsx(n,{children:"🗑"}),disabled:!0,tooltip:"Remove item"})]}),e.jsx(u,{padding:"sm",children:e.jsx(y,{items:f(C),viewState:{},children:e.jsx(B,{treeId:"layers"})})})]})}),e.jsx(u,{center:!0,workspace:!0,children:e.jsxs("div",{children:[e.jsx(M,{}),e.jsx(T,{children:"Welcome to Geppetto"}),e.jsx(c,{children:"Some introduction text here..."}),e.jsxs(c,{children:[e.jsx(t,{icon:e.jsx(n,{children:"📄"}),label:"Load file...",size:"small",shadow:!0})," ",e.jsx(I,{shortcut:{interaction:"KeyO",ctrlOrCmd:!0}})]})]})})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Column>
      <ToolBar>
        <Menu portal transition menuButton={({
        open
      }) => <ToolButton icon={<LogoIcon />} active={open} notificationBadge />}>
          <MenuItem>↻ Restart for app update...</MenuItem>
          <MenuItem>⇣ Install application locally</MenuItem>
          <SubMenu label="File">
            <MenuItem>New</MenuItem>
            <MenuDivider />
            <MenuItem>Open</MenuItem>
            <MenuItem>Load texture</MenuItem>
            <MenuDivider />
            <MenuItem>Reload texture</MenuItem>
            <MenuDivider />
            <MenuItem disabled>Save</MenuItem>
            <MenuItem>Save as...</MenuItem>
          </SubMenu>
          <MenuHeader>Edit</MenuHeader>
          <SubMenu label="Edit">
            <MenuItem>Cut</MenuItem>
            <MenuItem>Copy</MenuItem>
            <MenuItem>Paste</MenuItem>
          </SubMenu>
          <MenuItem>Print...</MenuItem>
        </Menu>
        <ToolSeparator />

        <ToolTab icon={<Icon>🧬</Icon>} label="Layers" active />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label="Composition" />
        <ToolTab icon={<Icon>🏃</Icon>} label="Animation" />
        <ToolSeparator />

        <ToolButton active icon={<Icon>✋</Icon>} tooltip="Move mode" />
        <ToolButton icon={<Icon>🔧</Icon>} tooltip="Adjust point mode" />
        <ToolButton icon={<Icon>✏️</Icon>} tooltip="Add point mode" />
        <ToolSeparator />
        <ToolButton icon={<Icon>🗑</Icon>} disabled tooltip="Remove selected point" />
        <ToolSeparator />
        <ToolButton icon={<Icon>📏</Icon>} tooltip="Toggle grid visibility" />
        <Menu portal menuButton={({
        open
      }) => <ToolButton active={open} label="32" />} direction="bottom" align="center" arrow transition>
          <MenuRadioGroup value={32}>
            <MenuItem type="radio" value={8}>
              8
            </MenuItem>
            <MenuItem type="radio" value={16}>
              16
            </MenuItem>
            <MenuItem type="radio" value={32}>
              32
            </MenuItem>
            <MenuItem type="radio" value={64}>
              64
            </MenuItem>
            <MenuItem type="radio" value={128}>
              128
            </MenuItem>
          </MenuRadioGroup>
        </Menu>
        <ToolButton icon={<Icon>🧲</Icon>} tooltip="Toggle magnetic grid" />
      </ToolBar>

      <Row>
        <ResizePanel direction={ResizeDirection.East} minSize={100} defaultSize={250}>
          <Column>
            <ToolBar size="small">
              <ToolButton icon={<Icon>📄</Icon>} label="+" tooltip="Add layer" />
              <ToolButton icon={<Icon>📁</Icon>} label="+" tooltip="Add folder" />
              <ToolButton icon={<Icon>📑</Icon>} disabled tooltip="Copy layer" />
              <ToolButton icon={<Icon>🗑</Icon>} disabled tooltip="Remove item" />
            </ToolBar>
            <Panel padding="sm">
              <TreeEnvironment items={storyTreeItems(noToolsProvider)} viewState={{}}>
                <Tree treeId="layers" />
              </TreeEnvironment>
            </Panel>
          </Column>
        </ResizePanel>
        <Panel center workspace>
          <div>
            <Logo />
            <Title>Welcome to Geppetto</Title>
            <Paragraph>Some introduction text here...</Paragraph>
            <Paragraph>
              <ToolButton icon={<Icon>📄</Icon>} label="Load file..." size="small" shadow />{" "}
              <Kbd shortcut={{
              interaction: "KeyO",
              ctrlOrCmd: true
            }} />
            </Paragraph>
          </div>
        </Panel>
      </Row>
    </Column>
})`,...r.input.parameters?.docs?.source}}};const se=["Version1"];export{r as Version1,se as __namedExportsOrder,R as default};
