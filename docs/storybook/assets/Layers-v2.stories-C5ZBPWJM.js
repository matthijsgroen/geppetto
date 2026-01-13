import{p as I,j as e,z as d,s as r,M as n,q as t,c as h,r as a,u as s,I as o,J as M,O as T,v as u,y as m,P as v,H as b,G as y,b as g,m as B,d as p,K as P}from"./iframe-CkqNuqTG.js";import{s as S}from"./storybookTreeDataProvider-BECUceWU.js";import{M as x,S as j,a as c,b as R}from"./MenuHeader-P21QTvGr.js";import{M as f}from"./MenuRadioGroup-Cfuj7Yzp.js";import"./preload-helper-PPVm8Dsz.js";const C=I.meta({title:"Pages/Layers",parameters:{layout:"fullscreen"},tags:["svg"]}),w=()=>null,i=C.story({render:()=>e.jsxs(d,{children:[e.jsxs(r,{vertical:!0,children:[e.jsxs(x,{menuButton:({open:l})=>e.jsx(t,{active:l,icon:e.jsx(h,{}),notificationBadge:!0}),portal:!0,transition:!0,children:[e.jsx(n,{children:"↻ Restart for app update..."}),e.jsx(n,{children:"⇣ Install application locally"}),e.jsxs(j,{label:"File",children:[e.jsx(n,{children:"New"}),e.jsx(c,{}),e.jsx(n,{children:"Open"}),e.jsx(n,{children:"Load texture"}),e.jsx(c,{}),e.jsx(n,{children:"Reload texture"}),e.jsx(c,{}),e.jsx(n,{disabled:!0,children:"Save"}),e.jsx(n,{children:"Save as..."})]}),e.jsx(R,{children:"Edit"}),e.jsxs(j,{label:"Edit",children:[e.jsx(n,{children:"Cut"}),e.jsx(n,{children:"Copy"}),e.jsx(n,{children:"Paste"})]}),e.jsx(n,{children:"Print..."})]}),e.jsx(a,{}),e.jsx(s,{active:!0,icon:e.jsx(o,{children:"🧬"}),label:"Layers"}),e.jsx(s,{icon:e.jsx(o,{children:"🤷🏼"}),label:"Composition"}),e.jsx(s,{icon:e.jsx(o,{children:"🏃"}),label:"Animation"})]}),e.jsx(M,{defaultSize:250,direction:T.East,minSize:100,children:e.jsx(u,{children:e.jsxs(m,{padding:"sm",children:[e.jsx(v,{children:"Layers"}),e.jsxs(r,{size:"small",children:[e.jsx(t,{icon:e.jsx(o,{children:"📄"}),label:"+",tooltip:"Add layer"}),e.jsx(t,{icon:e.jsx(o,{children:"📁"}),label:"+",tooltip:"Add folder"}),e.jsx(t,{disabled:!0,icon:e.jsx(o,{children:"📑"}),tooltip:"Copy layer"}),e.jsx(t,{disabled:!0,icon:e.jsx(o,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsx(b,{items:S(w),viewState:{},children:e.jsx(y,{treeId:"layers"})})]})})}),e.jsxs(u,{children:[e.jsxs(r,{children:[e.jsx(t,{active:!0,icon:e.jsx(o,{children:"✋"}),tooltip:"Move mode"}),e.jsx(t,{icon:e.jsx(o,{children:"🔧"}),tooltip:"Adjust point mode"}),e.jsx(t,{icon:e.jsx(o,{children:"✏️"}),tooltip:"Add point mode"}),e.jsx(a,{}),e.jsx(t,{disabled:!0,icon:e.jsx(o,{children:"🗑"}),tooltip:"Remove selected point"}),e.jsx(a,{}),e.jsx(t,{icon:e.jsx(o,{children:"📏"}),tooltip:"Toggle grid visibility"}),e.jsx(x,{align:"center",arrow:!0,direction:"bottom",menuButton:({open:l})=>e.jsx(t,{active:l,label:"32"}),portal:!0,transition:!0,children:e.jsxs(f,{value:32,children:[e.jsx(n,{type:"radio",value:8,children:"8"}),e.jsx(n,{type:"radio",value:16,children:"16"}),e.jsx(n,{type:"radio",value:32,children:"32"}),e.jsx(n,{type:"radio",value:64,children:"64"}),e.jsx(n,{type:"radio",value:128,children:"128"})]})}),e.jsx(t,{icon:e.jsx(o,{children:"🧲"}),tooltip:"Toggle magnetic grid"})]}),e.jsx(d,{children:e.jsx(m,{center:!0,workspace:!0,children:e.jsxs("div",{children:[e.jsx(g,{}),e.jsx(B,{children:"Welcome to Geppetto"}),e.jsx(p,{children:"Some introduction text here..."}),e.jsxs(p,{children:[e.jsx(t,{icon:e.jsx(o,{children:"📄"}),label:"Load file...",size:"small",standAlone:!0})," ",e.jsx(P,{shortcut:{interaction:"KeyO",ctrlOrCmd:!0}})]})]})})})]})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Row>
      <ToolBar vertical>
        <Menu menuButton={({
        open
      }) => <ToolButton active={open} icon={<LogoIcon />} notificationBadge />} portal transition>
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
      </ToolBar>
      <ResizePanel defaultSize={250} direction={ResizeDirection.East} minSize={100}>
        <Column>
          <Panel padding="sm">
            <PanelTitle>Layers</PanelTitle>
            <ToolBar size="small">
              <ToolButton icon={<Icon>📄</Icon>} label="+" tooltip="Add layer" />
              <ToolButton icon={<Icon>📁</Icon>} label="+" tooltip="Add folder" />
              <ToolButton disabled icon={<Icon>📑</Icon>} tooltip="Copy layer" />
              <ToolButton disabled icon={<Icon>🗑</Icon>} tooltip="Remove item" />
            </ToolBar>
            <TreeEnvironment items={storyTreeItems(noToolsProvider)} viewState={{}}>
              <Tree treeId="layers" />
            </TreeEnvironment>
          </Panel>
        </Column>
      </ResizePanel>

      <Column>
        <ToolBar>
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
    </Row>
})`,...i.input.parameters?.docs?.source}}};const D=["Version2"];export{i as Version2,D as __namedExportsOrder,C as default};
