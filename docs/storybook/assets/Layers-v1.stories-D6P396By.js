import{p as j,j as e}from"./iframe-BB5eUGr5.js";import{a as I,s as M,T as h}from"./storybookTreeDataProvider-DIrc8i72.js";import{I as n}from"./Icon-CXRC-y-A.js";import{K as T}from"./Kbd-Cz3xksv1.js";import"./Label-DT96c8W4.js";import{a as v,L as b}from"./Logo-ndBSlh0y.js";import"./NumberInput-D6Fl7Bql.js";import"./PanelTitle-DE0Jgq-3.js";import{P as c}from"./Paragraph-gXNISozF.js";import"./RangeInput-B20vUK4i.js";import"./RangeValue--j13x6Da.js";import"./TextButton-C5kZUrAh.js";import{T as g}from"./Title-CS8r_PPT.js";import"./ToggleInput-Du-UqRPY.js";import{T as t}from"./ToolButton-BNaLkAHX.js";import{T as i}from"./ToolSeparator-DS8RgUI0.js";import"./ToolSpacer-CE8tkWIv.js";import{T as a}from"./ToolTab-C9FB3s2u.js";import{C as d}from"./Column-Dk9EbNEg.js";import"./Control-BDRr7VuU.js";import"./ControlPanel-BkWjS1UU.js";import"./EmptyTree-VCrTo4t9.js";import{P as m}from"./Panel-DGj7-4j-.js";import{R as y,a as f}from"./ResizePanel-BMqm3Ol7.js";import{R as B}from"./Row-CdPrkGre.js";import{T as u}from"./ToolBar-kNIWjPNs.js";import"./ToolGrid-Bslftk7H.js";import{M as o}from"./Menu-Dj6_yfpy.js";import{M as S}from"./MenuRadioGroup-PqjGU6O-.js";import{M as p,S as x,a as s,b as P}from"./MenuHeader-BL2oQ54s.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./ToolBarContext-C9UDrxTM.js";const R=j.meta({title:"Pages/Layers",tags:["svg"]}),C=()=>null,r=R.story({render:()=>e.jsxs(d,{children:[e.jsxs(u,{children:[e.jsxs(p,{menuButton:({open:l})=>e.jsx(t,{active:l,icon:e.jsx(v,{}),label:"Geppetto",notificationBadge:!0}),portal:!0,transition:!0,children:[e.jsx(o,{children:"↻ Restart for app update..."}),e.jsx(o,{children:"⇣ Install application locally"}),e.jsxs(x,{label:"File",children:[e.jsx(o,{children:"New"}),e.jsx(s,{}),e.jsx(o,{children:"Open"}),e.jsx(o,{children:"Load texture"}),e.jsx(s,{}),e.jsx(o,{children:"Reload texture"}),e.jsx(s,{}),e.jsx(o,{disabled:!0,children:"Save"}),e.jsx(o,{children:"Save as..."})]}),e.jsx(P,{children:"Edit"}),e.jsxs(x,{label:"Edit",children:[e.jsx(o,{children:"Cut"}),e.jsx(o,{children:"Copy"}),e.jsx(o,{children:"Paste"})]}),e.jsx(o,{children:"Print..."})]}),e.jsx(i,{}),e.jsx(a,{active:!0,icon:e.jsx(n,{children:"🧬"}),label:"Layers"}),e.jsx(a,{icon:e.jsx(n,{children:"🤷🏼"}),label:"Composition"}),e.jsx(a,{icon:e.jsx(n,{children:"🏃"}),label:"Animation"}),e.jsx(i,{}),e.jsx(t,{active:!0,icon:e.jsx(n,{children:"✋"}),tooltip:"Move mode"}),e.jsx(t,{icon:e.jsx(n,{children:"🔧"}),tooltip:"Adjust point mode"}),e.jsx(t,{icon:e.jsx(n,{children:"✏️"}),tooltip:"Add point mode"}),e.jsx(i,{}),e.jsx(t,{disabled:!0,icon:e.jsx(n,{children:"🗑"}),tooltip:"Remove selected point"}),e.jsx(i,{}),e.jsx(t,{icon:e.jsx(n,{children:"📏"}),tooltip:"Toggle grid visibility"}),e.jsx(p,{align:"center",arrow:!0,direction:"bottom",menuButton:({open:l})=>e.jsx(t,{active:l,label:"32"}),portal:!0,transition:!0,children:e.jsxs(S,{value:32,children:[e.jsx(o,{type:"radio",value:8,children:"8"}),e.jsx(o,{type:"radio",value:16,children:"16"}),e.jsx(o,{type:"radio",value:32,children:"32"}),e.jsx(o,{type:"radio",value:64,children:"64"}),e.jsx(o,{type:"radio",value:128,children:"128"})]})}),e.jsx(t,{icon:e.jsx(n,{children:"🧲"}),tooltip:"Toggle magnetic grid"})]}),e.jsxs(B,{children:[e.jsx(y,{defaultSize:250,direction:f.East,minSize:100,children:e.jsxs(d,{children:[e.jsxs(u,{size:"small",children:[e.jsx(t,{icon:e.jsx(n,{children:"📄"}),label:"+",tooltip:"Add layer"}),e.jsx(t,{icon:e.jsx(n,{children:"📁"}),label:"+",tooltip:"Add folder"}),e.jsx(t,{disabled:!0,icon:e.jsx(n,{children:"📑"}),tooltip:"Copy layer"}),e.jsx(t,{disabled:!0,icon:e.jsx(n,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsx(m,{padding:"sm",children:e.jsx(I,{items:M(C),viewState:{},children:e.jsx(h,{treeId:"layers"})})})]})}),e.jsx(m,{center:!0,workspace:!0,children:e.jsxs("div",{children:[e.jsx(b,{}),e.jsx(g,{children:"Welcome to Geppetto"}),e.jsx(c,{children:"Some introduction text here..."}),e.jsxs(c,{children:[e.jsx(t,{icon:e.jsx(n,{children:"📄"}),label:"Load file...",size:"small",standAlone:!0})," ",e.jsx(T,{shortcut:{interaction:"KeyO",ctrlOrCmd:!0}})]})]})})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...r.input.parameters?.docs?.source}}};const ce=["Version1"];export{r as Version1,ce as __namedExportsOrder,R as default};
