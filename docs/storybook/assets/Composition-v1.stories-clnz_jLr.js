import{p as P,j as e,u as m,r as a,M as o,o as n,c as y,q as g,t as c,I as l,y as z,G as p,H as j,x as d,F as h,D as I,P as u,v as b,a as t,n as T,N as i,R as S,B as f,b as R,l as B,d as v,K as A}from"./iframe-W44ulTGX.js";import{s as M}from"./storybookTreeDataProvider-BECUceWU.js";import{M as E,S as C,a as x,b as w}from"./MenuHeader-eC2x75jq.js";import"./preload-helper-PPVm8Dsz.js";const L=P.meta({title:"Pages/Composition",parameters:{layout:"fullscreen"},tags:["svg"]}),N=r=>{if(r.type==="layer"||r.type==="layerFolder")return e.jsx(e.Fragment,{children:e.jsx(n,{active:!0,icon:e.jsx(l,{children:"👁"})})})},O=()=>null,s=L.story({render:()=>e.jsxs(m,{children:[e.jsxs(a,{children:[e.jsxs(E,{menuButton:({open:r})=>e.jsx(n,{active:r,icon:e.jsx(y,{}),label:"Geppetto",notificationBadge:!0}),portal:!0,transition:!0,children:[e.jsx(o,{children:"↻ Restart for app update..."}),e.jsx(o,{children:"⇣ Install application locally"}),e.jsxs(C,{label:"File",children:[e.jsx(o,{children:"New"}),e.jsx(x,{}),e.jsx(o,{children:"Open"}),e.jsx(o,{children:"Load texture"}),e.jsx(x,{}),e.jsx(o,{children:"Reload texture"}),e.jsx(x,{}),e.jsx(o,{disabled:!0,children:"Save"}),e.jsx(o,{children:"Save as..."})]}),e.jsx(w,{children:"Edit"}),e.jsxs(C,{label:"Edit",children:[e.jsx(o,{children:"Cut"}),e.jsx(o,{children:"Copy"}),e.jsx(o,{children:"Paste"})]}),e.jsx(o,{children:"Print..."})]}),e.jsx(g,{}),e.jsx(c,{icon:e.jsx(l,{children:"🧬"}),label:"Layers"}),e.jsx(c,{active:!0,icon:e.jsx(l,{children:"🤷🏼"}),label:"Composition"}),e.jsx(c,{icon:e.jsx(l,{children:"🏃"}),label:"Animation"})]}),e.jsxs(z,{children:[e.jsx(p,{defaultSize:250,direction:j.East,minSize:100,children:e.jsxs(m,{children:[e.jsxs(a,{size:"small",children:[e.jsx(n,{icon:e.jsx(l,{children:"📄"}),label:"+",tooltip:"Add layer"}),e.jsx(n,{icon:e.jsx(l,{children:"📁"}),label:"+",tooltip:"Add folder"}),e.jsx(n,{disabled:!0,icon:e.jsx(l,{children:"📑"}),tooltip:"Copy layer"}),e.jsx(n,{disabled:!0,icon:e.jsx(l,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsxs(d,{padding:"sm",children:[e.jsx(h,{items:M(N),viewState:{},children:e.jsx(I,{treeId:"layers"})}),e.jsx(u,{children:"Opacity (4)"}),e.jsxs(b,{children:[e.jsx(t,{label:"Visible",children:e.jsx(T,{checked:!0})}),e.jsxs(t,{label:"Origin",children:[e.jsx(i,{prefix:"x:",value:10}),e.jsx(i,{prefix:"y:",value:20})]}),e.jsxs(t,{label:"Value",children:[e.jsx(i,{prefix:"x:",value:10}),e.jsx(i,{prefix:"y:",value:20})]}),e.jsx(t,{label:"Use Radius",children:e.jsx(T,{checked:!0})}),e.jsx(t,{label:"Radius",children:e.jsx(i,{value:10})}),e.jsx(t,{children:e.jsx(n,{label:"Add mutation to control",size:"small"})})]})]}),e.jsx(p,{defaultSize:300,direction:j.North,minSize:200,children:e.jsxs(d,{padding:"sm",children:[e.jsx(u,{children:"Controls"}),e.jsxs(a,{size:"small",children:[e.jsx(n,{icon:e.jsx(l,{children:"⚙️"}),label:"+",tooltip:"Add control"}),e.jsx(n,{disabled:!0,icon:e.jsx(l,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsx(h,{items:M(O),viewState:{},children:e.jsx(I,{treeId:"controls"})}),e.jsx(u,{children:"Left Arm"}),e.jsxs(b,{children:[e.jsx(t,{label:"Value",children:e.jsx(S,{})}),e.jsx(t,{label:"Steps",children:e.jsxs(f,{children:[e.jsx(n,{icon:"1",size:"small"}),e.jsx(n,{icon:"2",size:"small"}),e.jsx(n,{icon:"+",size:"small"})]})})]})]})})]})}),e.jsx(d,{center:!0,workspace:!0,children:e.jsxs("div",{children:[e.jsx(R,{}),e.jsx(B,{children:"Welcome to Geppetto"}),e.jsx(v,{children:"Some introduction text here..."}),e.jsxs(v,{children:[e.jsx(n,{icon:e.jsx(l,{children:"📄"}),label:"Load file...",size:"small",standAlone:!0})," ",e.jsx(A,{shortcut:{interaction:"KeyO",ctrlOrCmd:!0}})]})]})})]})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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

        <ToolTab icon={<Icon>🧬</Icon>} label="Layers" />
        <ToolTab active icon={<Icon>🤷🏼</Icon>} label="Composition" />
        <ToolTab icon={<Icon>🏃</Icon>} label="Animation" />
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
              <TreeEnvironment items={storyTreeItems(toolsProvider)} viewState={{}}>
                <Tree treeId="layers" />
              </TreeEnvironment>
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
      </Row>
    </Column>
})`,...s.input.parameters?.docs?.source}}};const F=["Version1"];export{s as Version1,F as __namedExportsOrder,L as default};
