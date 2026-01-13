import{p as P,j as e,z as y,s as c,M as o,q as n,c as z,r as g,u as d,I as l,J as x,O as p,v as j,y as u,P as s,H as h,G as I,w as b,a as t,o as T,N as i,R as S,b as f,m as R,d as v,K as B}from"./iframe-CkqNuqTG.js";import{s as C}from"./storybookTreeDataProvider-BECUceWU.js";import{M as A,S as M,a as m,b as w}from"./MenuHeader-P21QTvGr.js";import"./preload-helper-PPVm8Dsz.js";const E=P.meta({title:"Pages/Composition",parameters:{layout:"fullscreen"},tags:["svg"]}),L=r=>{if(r.type==="layer"||r.type==="layerFolder")return e.jsx(e.Fragment,{children:e.jsx(n,{active:!0,icon:e.jsx(l,{children:"👁"})})})},O=()=>null,a=E.story({render:()=>e.jsxs(y,{children:[e.jsxs(c,{vertical:!0,children:[e.jsxs(A,{menuButton:({open:r})=>e.jsx(n,{active:r,icon:e.jsx(z,{}),notificationBadge:!0}),portal:!0,transition:!0,children:[e.jsx(o,{children:"↻ Restart for app update..."}),e.jsx(o,{children:"⇣ Install application locally"}),e.jsxs(M,{label:"File",children:[e.jsx(o,{children:"New"}),e.jsx(m,{}),e.jsx(o,{children:"Open"}),e.jsx(o,{children:"Load texture"}),e.jsx(m,{}),e.jsx(o,{children:"Reload texture"}),e.jsx(m,{}),e.jsx(o,{disabled:!0,children:"Save"}),e.jsx(o,{children:"Save as..."})]}),e.jsx(w,{children:"Edit"}),e.jsxs(M,{label:"Edit",children:[e.jsx(o,{children:"Cut"}),e.jsx(o,{children:"Copy"}),e.jsx(o,{children:"Paste"})]}),e.jsx(o,{children:"Print..."})]}),e.jsx(g,{}),e.jsx(d,{icon:e.jsx(l,{children:"🧬"}),label:"Layers"}),e.jsx(d,{active:!0,icon:e.jsx(l,{children:"🤷🏼"}),label:"Composition"}),e.jsx(d,{icon:e.jsx(l,{children:"🏃"}),label:"Animation"})]}),e.jsx(x,{defaultSize:250,direction:p.East,minSize:100,children:e.jsxs(j,{children:[e.jsxs(u,{padding:"sm",children:[e.jsx(s,{children:"Composition"}),e.jsxs(c,{size:"small",children:[e.jsx(n,{icon:e.jsx(l,{children:"📄"}),label:"+",tooltip:"Add layer"}),e.jsx(n,{icon:e.jsx(l,{children:"📁"}),label:"+",tooltip:"Add folder"}),e.jsx(n,{disabled:!0,icon:e.jsx(l,{children:"📑"}),tooltip:"Copy layer"}),e.jsx(n,{disabled:!0,icon:e.jsx(l,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsx(h,{items:C(L),viewState:{},children:e.jsx(I,{treeId:"layers"})}),e.jsx(s,{children:"Opacity (4)"}),e.jsxs(b,{children:[e.jsx(t,{label:"Visible",children:e.jsx(T,{})}),e.jsxs(t,{label:"Origin",children:[e.jsx(i,{prefix:"x:",value:10}),e.jsx(i,{prefix:"y:",value:20})]}),e.jsxs(t,{label:"Value",children:[e.jsx(i,{prefix:"x:",value:10}),e.jsx(i,{prefix:"y:",value:20})]}),e.jsx(t,{label:"Use Radius",children:e.jsx(T,{checked:!0})}),e.jsx(t,{label:"Radius",children:e.jsx(i,{value:10})}),e.jsx(t,{children:e.jsx(n,{label:"Add mutation to control",size:"small"})})]})]}),e.jsx(x,{defaultSize:300,direction:p.North,minSize:200,children:e.jsxs(u,{padding:"sm",children:[e.jsx(s,{children:"Controls"}),e.jsxs(c,{size:"small",children:[e.jsx(n,{icon:e.jsx(l,{children:"⚙️"}),label:"+",tooltip:"Add control"}),e.jsx(n,{disabled:!0,icon:e.jsx(l,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsx(h,{items:C(O),viewState:{},children:e.jsx(I,{treeId:"controls"})}),e.jsx(s,{children:"Left Arm"}),e.jsxs(b,{children:[e.jsx(t,{label:"Value",children:e.jsx(S,{})}),e.jsxs(t,{label:"Steps",children:[e.jsx(n,{icon:"1",size:"small"}),e.jsx(n,{icon:"2",size:"small"}),e.jsx(n,{icon:"+",size:"small"})]})]})]})})]})}),e.jsx(j,{children:e.jsx(u,{center:!0,workspace:!0,children:e.jsxs("div",{children:[e.jsx(f,{}),e.jsx(R,{children:"Welcome to Geppetto"}),e.jsx(v,{children:"Some introduction text here..."}),e.jsxs(v,{children:[e.jsx(n,{icon:e.jsx(l,{children:"📄"}),label:"Load file...",size:"small",standAlone:!0})," ",e.jsx(B,{shortcut:{interaction:"KeyO",ctrlOrCmd:!0}})]})]})})})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
        <ToolTab icon={<Icon>🧬</Icon>} label="Layers" />
        <ToolTab active icon={<Icon>🤷🏼</Icon>} label="Composition" />
        <ToolTab icon={<Icon>🏃</Icon>} label="Animation" />
      </ToolBar>

      <ResizePanel defaultSize={250} direction={ResizeDirection.East} minSize={100}>
        <Column>
          <Panel padding="sm">
            <PanelTitle>Composition</PanelTitle>
            <ToolBar size="small">
              <ToolButton icon={<Icon>📄</Icon>} label="+" tooltip="Add layer" />
              <ToolButton icon={<Icon>📁</Icon>} label="+" tooltip="Add folder" />
              <ToolButton disabled icon={<Icon>📑</Icon>} tooltip="Copy layer" />
              <ToolButton disabled icon={<Icon>🗑</Icon>} tooltip="Remove item" />
            </ToolBar>
            <TreeEnvironment items={storyTreeItems(toolsProvider)} viewState={{}}>
              <Tree treeId="layers" />
            </TreeEnvironment>
            <PanelTitle>Opacity (4)</PanelTitle>
            <ControlPanel>
              <Control label="Visible">
                <ToggleInput />
              </Control>
              <Control label="Origin">
                <NumberInput prefix="x:" value={10} />
                <NumberInput prefix="y:" value={20} />
              </Control>
              <Control label="Value">
                <NumberInput prefix="x:" value={10} />
                <NumberInput prefix="y:" value={20} />
              </Control>
              <Control label="Use Radius">
                <ToggleInput checked />
              </Control>
              <Control label="Radius">
                <NumberInput value={10} />
              </Control>
              <Control>
                <ToolButton label="Add mutation to control" size="small" />
              </Control>
            </ControlPanel>
          </Panel>
          <ResizePanel defaultSize={300} direction={ResizeDirection.North} minSize={200}>
            <Panel padding="sm">
              <PanelTitle>Controls</PanelTitle>
              <ToolBar size="small">
                <ToolButton icon={<Icon>⚙️</Icon>} label="+" tooltip="Add control" />
                <ToolButton disabled icon={<Icon>🗑</Icon>} tooltip="Remove item" />
              </ToolBar>
              <TreeEnvironment items={storyTreeItems(noToolsProvider)} viewState={{}}>
                <Tree treeId="controls" />
              </TreeEnvironment>
              <PanelTitle>Left Arm</PanelTitle>
              <ControlPanel>
                <Control label="Value">
                  <RangeInput />
                </Control>
                <Control label="Steps">
                  <ToolButton icon="1" size="small" />
                  <ToolButton icon="2" size="small" />
                  <ToolButton icon="+" size="small" />
                </Control>
              </ControlPanel>
            </Panel>
          </ResizePanel>
        </Column>
      </ResizePanel>
      <Column>
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
      </Column>
    </Row>
})`,...a.input.parameters?.docs?.source}}};const k=["Version2"];export{a as Version2,k as __namedExportsOrder,E as default};
