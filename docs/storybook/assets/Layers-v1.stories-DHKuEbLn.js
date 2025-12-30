import{p as j,j as e,n as c,k as d,M as n,h as t,c as I,i,m as a,I as o,s as h,w as M,x as v,r as u,v as T,u as b,b as g,f as y,d as p,K as B}from"./iframe-DP97NOyG.js";import{s as S}from"./storybookTreeDataProvider-BECUceWU.js";import{M as P}from"./MenuRadioGroup-BrDExlf7.js";import{M as m,S as x,a as s,b as R}from"./MenuHeader-GK_pqaYn.js";import"./preload-helper-PPVm8Dsz.js";const f=j.meta({title:"Pages/Layers",tags:["svg"]}),C=()=>null,l=f.story({render:()=>e.jsxs(c,{children:[e.jsxs(d,{children:[e.jsxs(m,{menuButton:({open:r})=>e.jsx(t,{active:r,icon:e.jsx(I,{}),label:"Geppetto",notificationBadge:!0}),portal:!0,transition:!0,children:[e.jsx(n,{children:"↻ Restart for app update..."}),e.jsx(n,{children:"⇣ Install application locally"}),e.jsxs(x,{label:"File",children:[e.jsx(n,{children:"New"}),e.jsx(s,{}),e.jsx(n,{children:"Open"}),e.jsx(n,{children:"Load texture"}),e.jsx(s,{}),e.jsx(n,{children:"Reload texture"}),e.jsx(s,{}),e.jsx(n,{disabled:!0,children:"Save"}),e.jsx(n,{children:"Save as..."})]}),e.jsx(R,{children:"Edit"}),e.jsxs(x,{label:"Edit",children:[e.jsx(n,{children:"Cut"}),e.jsx(n,{children:"Copy"}),e.jsx(n,{children:"Paste"})]}),e.jsx(n,{children:"Print..."})]}),e.jsx(i,{}),e.jsx(a,{active:!0,icon:e.jsx(o,{children:"🧬"}),label:"Layers"}),e.jsx(a,{icon:e.jsx(o,{children:"🤷🏼"}),label:"Composition"}),e.jsx(a,{icon:e.jsx(o,{children:"🏃"}),label:"Animation"}),e.jsx(i,{}),e.jsx(t,{active:!0,icon:e.jsx(o,{children:"✋"}),tooltip:"Move mode"}),e.jsx(t,{icon:e.jsx(o,{children:"🔧"}),tooltip:"Adjust point mode"}),e.jsx(t,{icon:e.jsx(o,{children:"✏️"}),tooltip:"Add point mode"}),e.jsx(i,{}),e.jsx(t,{disabled:!0,icon:e.jsx(o,{children:"🗑"}),tooltip:"Remove selected point"}),e.jsx(i,{}),e.jsx(t,{icon:e.jsx(o,{children:"📏"}),tooltip:"Toggle grid visibility"}),e.jsx(m,{align:"center",arrow:!0,direction:"bottom",menuButton:({open:r})=>e.jsx(t,{active:r,label:"32"}),portal:!0,transition:!0,children:e.jsxs(P,{value:32,children:[e.jsx(n,{type:"radio",value:8,children:"8"}),e.jsx(n,{type:"radio",value:16,children:"16"}),e.jsx(n,{type:"radio",value:32,children:"32"}),e.jsx(n,{type:"radio",value:64,children:"64"}),e.jsx(n,{type:"radio",value:128,children:"128"})]})}),e.jsx(t,{icon:e.jsx(o,{children:"🧲"}),tooltip:"Toggle magnetic grid"})]}),e.jsxs(h,{children:[e.jsx(M,{defaultSize:250,direction:v.East,minSize:100,children:e.jsxs(c,{children:[e.jsxs(d,{size:"small",children:[e.jsx(t,{icon:e.jsx(o,{children:"📄"}),label:"+",tooltip:"Add layer"}),e.jsx(t,{icon:e.jsx(o,{children:"📁"}),label:"+",tooltip:"Add folder"}),e.jsx(t,{disabled:!0,icon:e.jsx(o,{children:"📑"}),tooltip:"Copy layer"}),e.jsx(t,{disabled:!0,icon:e.jsx(o,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsx(u,{padding:"sm",children:e.jsx(T,{items:S(C),viewState:{},children:e.jsx(b,{treeId:"layers"})})})]})}),e.jsx(u,{center:!0,workspace:!0,children:e.jsxs("div",{children:[e.jsx(g,{}),e.jsx(y,{children:"Welcome to Geppetto"}),e.jsx(p,{children:"Some introduction text here..."}),e.jsxs(p,{children:[e.jsx(t,{icon:e.jsx(o,{children:"📄"}),label:"Load file...",size:"small",standAlone:!0})," ",e.jsx(B,{shortcut:{interaction:"KeyO",ctrlOrCmd:!0}})]})]})})]})]})});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Column>
      <ToolBar>
        <Menu menuButton={({
        open
      }) => <ToolButton active={open} icon={<LogoIcon />} label="Geppetto" notificationBadge />} portal transition>
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

        <ToolTab active icon={<Icon>🧬</Icon>} label="Layers" />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label="Composition" />
        <ToolTab icon={<Icon>🏃</Icon>} label="Animation" />
        <ToolSeparator />

        <ToolButton active icon={<Icon>✋</Icon>} tooltip="Move mode" />
        <ToolButton icon={<Icon>🔧</Icon>} tooltip="Adjust point mode" />
        <ToolButton icon={<Icon>✏️</Icon>} tooltip="Add point mode" />
        <ToolSeparator />
        <ToolButton disabled icon={<Icon>🗑</Icon>} tooltip="Remove selected point" />
        <ToolSeparator />
        <ToolButton icon={<Icon>📏</Icon>} tooltip="Toggle grid visibility" />
        <Menu align="center" arrow direction="bottom" menuButton={({
        open
      }) => <ToolButton active={open} label="32" />} portal transition>
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
        <ResizePanel defaultSize={250} direction={ResizeDirection.East} minSize={100}>
          <Column>
            <ToolBar size="small">
              <ToolButton icon={<Icon>📄</Icon>} label="+" tooltip="Add layer" />
              <ToolButton icon={<Icon>📁</Icon>} label="+" tooltip="Add folder" />
              <ToolButton disabled icon={<Icon>📑</Icon>} tooltip="Copy layer" />
              <ToolButton disabled icon={<Icon>🗑</Icon>} tooltip="Remove item" />
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
              <ToolButton icon={<Icon>📄</Icon>} label="Load file..." size="small" standAlone />{" "}
              <Kbd shortcut={{
              interaction: "KeyO",
              ctrlOrCmd: true
            }} />
            </Paragraph>
          </div>
        </Panel>
      </Row>
    </Column>
})`,...l.input.parameters?.docs?.source}}};const G=["Version1"];export{l as Version1,G as __namedExportsOrder,f as default};
