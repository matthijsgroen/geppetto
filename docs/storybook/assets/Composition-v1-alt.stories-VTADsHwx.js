import{p as z,j as e,w as c,t as d,M as l,r as n,c as S,s as h,v as u,I as o,u as f,B as g,O as x,Q as m,z as s,J as I,H as b,P as j,x as T,a as t,R as y,F as R,b as B,n as A,d as v,K as w,q as M,N as r}from"./iframe-Cm78seEQ.js";import{s as P}from"./storybookTreeDataProvider-BECUceWU.js";import{M as E,S as C,a as p,b as L}from"./MenuHeader-Dg0xhN78.js";import"./preload-helper-PPVm8Dsz.js";const O=z.meta({title:"Pages/Composition",parameters:{layout:"fullscreen"},tags:["svg"]}),N=i=>{if(i.type==="layer"||i.type==="layerFolder")return e.jsx(e.Fragment,{children:e.jsx(n,{active:!0,icon:e.jsx(o,{children:"👁"})})});if(i.type==="mutation")return e.jsx(e.Fragment,{children:e.jsx(n,{active:i.name==="Mutation",icon:e.jsx(o,{children:"📍"})})})},V=()=>null,a=O.story({render:()=>e.jsxs(c,{children:[e.jsxs(d,{children:[e.jsxs(E,{menuButton:({open:i})=>e.jsx(n,{active:i,icon:e.jsx(S,{}),notificationBadge:!0}),portal:!0,transition:!0,children:[e.jsx(l,{children:"↻ Restart for app update..."}),e.jsx(l,{children:"⇣ Install application locally"}),e.jsxs(C,{label:"File",children:[e.jsx(l,{children:"New"}),e.jsx(p,{}),e.jsx(l,{children:"Open"}),e.jsx(l,{children:"Load texture"}),e.jsx(p,{}),e.jsx(l,{children:"Reload texture"}),e.jsx(p,{}),e.jsx(l,{disabled:!0,children:"Save"}),e.jsx(l,{children:"Save as..."})]}),e.jsx(L,{children:"Edit"}),e.jsxs(C,{label:"Edit",children:[e.jsx(l,{children:"Cut"}),e.jsx(l,{children:"Copy"}),e.jsx(l,{children:"Paste"})]}),e.jsx(l,{children:"Print..."})]}),e.jsx(h,{}),e.jsx(u,{icon:e.jsx(o,{children:"🧬"}),label:"Layers"}),e.jsx(u,{active:!0,icon:e.jsx(o,{children:"🤷🏼"}),label:"Composition"}),e.jsx(u,{icon:e.jsx(o,{children:"🏃"}),label:"Animation"}),e.jsx(h,{}),e.jsx(f,{}),e.jsx(n,{active:!0,icon:e.jsx(o,{children:"ℹ"}),tooltip:"Vector information"})]}),e.jsxs(g,{children:[e.jsx(x,{defaultSize:250,direction:m.East,minSize:100,children:e.jsxs(c,{children:[e.jsxs(s,{padding:"sm",children:[e.jsxs(d,{size:"small",children:[e.jsx(n,{icon:e.jsx(o,{children:"📄"}),label:"+",tooltip:"Add layer"}),e.jsx(n,{icon:e.jsx(o,{children:"📁"}),label:"+",tooltip:"Add folder"}),e.jsx(n,{disabled:!0,icon:e.jsx(o,{children:"📑"}),tooltip:"Copy layer"}),e.jsx(n,{disabled:!0,icon:e.jsx(o,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsx(I,{items:P(N),viewState:{},children:e.jsx(b,{treeId:"layers"})})]}),e.jsx(x,{defaultSize:300,direction:m.North,minSize:200,children:e.jsxs(s,{padding:"sm",children:[e.jsx(j,{children:"Controls"}),e.jsxs(d,{size:"small",children:[e.jsx(n,{icon:e.jsx(o,{children:"⚙️"}),label:"+",tooltip:"Add control"}),e.jsx(n,{disabled:!0,icon:e.jsx(o,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsx(I,{items:P(V),viewState:{},children:e.jsx(b,{treeId:"controls"})}),e.jsx(j,{children:"Left Arm"}),e.jsxs(T,{children:[e.jsx(t,{label:"Value",children:e.jsx(y,{})}),e.jsx(t,{label:"Steps",children:e.jsxs(R,{children:[e.jsx(n,{icon:"1",size:"small"}),e.jsx(n,{icon:"2",size:"small"}),e.jsx(n,{icon:"+",size:"small"})]})})]})]})})]})}),e.jsx(s,{center:!0,workspace:!0,children:e.jsxs("div",{children:[e.jsx(B,{}),e.jsx(A,{children:"Welcome to Geppetto"}),e.jsx(v,{children:"Some introduction text here..."}),e.jsxs(v,{children:[e.jsx(n,{icon:e.jsx(o,{children:"📄"}),label:"Load file...",size:"small",standAlone:!0})," ",e.jsx(w,{shortcut:{interaction:"KeyO",ctrlOrCmd:!0}})]})]})}),e.jsx(x,{defaultSize:250,direction:m.West,minSize:100,children:e.jsx(c,{children:e.jsxs(s,{padding:"sm",children:[e.jsx(j,{children:"Opacity (4)"}),e.jsxs(T,{children:[e.jsx(t,{label:"Visible",children:e.jsx(M,{checked:!0})}),e.jsxs(t,{label:"Origin",children:[e.jsx(r,{prefix:"x:",value:10}),e.jsx(r,{prefix:"y:",value:20})]}),e.jsxs(t,{label:"Value",children:[e.jsx(r,{prefix:"x:",value:10}),e.jsx(r,{prefix:"y:",value:20})]}),e.jsx(t,{label:"Use Radius",children:e.jsx(M,{checked:!0})}),e.jsx(t,{label:"Radius",children:e.jsx(r,{value:10})}),e.jsx(t,{children:e.jsx(n,{label:"Add mutation to control",size:"small"})})]})]})})})]})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Column>
      <ToolBar>
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
        <ToolSeparator />

        <ToolSpacer />
        <ToolButton active icon={<Icon>ℹ</Icon>} tooltip="Vector information" />
      </ToolBar>

      <Row>
        <ResizePanel defaultSize={250} direction={ResizeDirection.East} minSize={100}>
          <Column>
            <Panel padding="sm">
              <ToolBar size="small">
                <ToolButton icon={<Icon>📄</Icon>} label="+" tooltip="Add layer" />
                <ToolButton icon={<Icon>📁</Icon>} label="+" tooltip="Add folder" />
                <ToolButton disabled icon={<Icon>📑</Icon>} tooltip="Copy layer" />
                <ToolButton disabled icon={<Icon>🗑</Icon>} tooltip="Remove item" />
              </ToolBar>
              <TreeEnvironment items={storyTreeItems(toolsProvider)} viewState={{}}>
                <Tree treeId="layers" />
              </TreeEnvironment>
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
                    <ToolGrid>
                      <ToolButton icon="1" size="small" />
                      <ToolButton icon="2" size="small" />
                      <ToolButton icon="+" size="small" />
                    </ToolGrid>
                  </Control>
                </ControlPanel>
              </Panel>
            </ResizePanel>
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
        <ResizePanel defaultSize={250} direction={ResizeDirection.West} minSize={100}>
          <Column>
            <Panel padding="sm">
              <PanelTitle>Opacity (4)</PanelTitle>
              <ControlPanel>
                <Control label="Visible">
                  <ToggleInput checked />
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
          </Column>
        </ResizePanel>
      </Row>
    </Column>
})`,...a.input.parameters?.docs?.source}}};const K=["Version1Alt"];export{a as Version1Alt,K as __namedExportsOrder,O as default};
