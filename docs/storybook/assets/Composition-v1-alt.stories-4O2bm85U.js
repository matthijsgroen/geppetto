import{p as g,j as e,x as d,u,M as l,s as n,d as z,t as I,w as x,I as o,v as S,D as y,Q as m,S as j,B as s,O as b,J as T,P as a,y as p,a as t,R as f,G as R,b as B,o as A,e as v,K as w,N as i,r as P}from"./iframe-BjqMxiNP.js";import{s as C}from"./storybookTreeDataProvider-BECUceWU.js";import{M as E,S as M,a as h,b as N}from"./MenuHeader-Ct0bRlVs.js";import"./preload-helper-PPVm8Dsz.js";const L=g.meta({title:"Pages/Composition",parameters:{layout:"fullscreen"},tags:["svg"]}),O=r=>{if(r.type==="layer"||r.type==="layerFolder")return e.jsx(e.Fragment,{children:e.jsx(n,{active:!0,icon:e.jsx(o,{children:"👁"})})});if(r.type==="mutation")return e.jsx(e.Fragment,{children:e.jsx(n,{active:r.name==="Mutation",icon:e.jsx(o,{children:"📍"})})})},V=()=>null,c=L.story({render:()=>e.jsxs(d,{children:[e.jsxs(u,{children:[e.jsxs(E,{menuButton:({open:r})=>e.jsx(n,{active:r,icon:e.jsx(z,{}),notificationBadge:!0}),portal:!0,transition:!0,children:[e.jsx(l,{children:"↻ Restart for app update..."}),e.jsx(l,{children:"⇣ Install application locally"}),e.jsxs(M,{label:"File",children:[e.jsx(l,{children:"New"}),e.jsx(h,{}),e.jsx(l,{children:"Open"}),e.jsx(l,{children:"Load texture"}),e.jsx(h,{}),e.jsx(l,{children:"Reload texture"}),e.jsx(h,{}),e.jsx(l,{disabled:!0,children:"Save"}),e.jsx(l,{children:"Save as..."})]}),e.jsx(N,{children:"Edit"}),e.jsxs(M,{label:"Edit",children:[e.jsx(l,{children:"Cut"}),e.jsx(l,{children:"Copy"}),e.jsx(l,{children:"Paste"})]}),e.jsx(l,{children:"Print..."})]}),e.jsx(I,{}),e.jsx(x,{icon:e.jsx(o,{children:"🧬"}),label:"Layers"}),e.jsx(x,{active:!0,icon:e.jsx(o,{children:"🤷🏼"}),label:"Composition"}),e.jsx(x,{icon:e.jsx(o,{children:"🏃"}),label:"Animation"}),e.jsx(I,{}),e.jsx(S,{}),e.jsx(n,{active:!0,icon:e.jsx(o,{children:"ℹ"}),tooltip:"Vector information"})]}),e.jsxs(y,{children:[e.jsx(m,{defaultSize:250,direction:j.East,minSize:100,children:e.jsxs(d,{children:[e.jsxs(s,{padding:"sm",children:[e.jsxs(u,{size:"small",children:[e.jsx(n,{icon:e.jsx(o,{children:"📄"}),label:"+",tooltip:"Add layer"}),e.jsx(n,{icon:e.jsx(o,{children:"📁"}),label:"+",tooltip:"Add folder"}),e.jsx(n,{disabled:!0,icon:e.jsx(o,{children:"📑"}),tooltip:"Copy layer"}),e.jsx(n,{disabled:!0,icon:e.jsx(o,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsx(b,{items:C(O),viewState:{},children:e.jsx(T,{treeId:"layers"})})]}),e.jsx(m,{defaultSize:300,direction:j.North,minSize:200,children:e.jsxs(s,{padding:"sm",children:[e.jsx(a,{children:"Controls"}),e.jsxs(u,{size:"small",children:[e.jsx(n,{icon:e.jsx(o,{children:"⚙️"}),label:"+",tooltip:"Add control"}),e.jsx(n,{disabled:!0,icon:e.jsx(o,{children:"🗑"}),tooltip:"Remove item"})]}),e.jsx(b,{items:C(V),viewState:{},children:e.jsx(T,{treeId:"controls"})}),e.jsx(a,{children:"Left Arm"}),e.jsxs(p,{children:[e.jsx(t,{label:"Value",children:e.jsx(f,{})}),e.jsx(t,{label:"Steps",children:e.jsxs(R,{children:[e.jsx(n,{icon:"1",size:"small"}),e.jsx(n,{icon:"2",size:"small"}),e.jsx(n,{icon:"+",size:"small"})]})})]})]})})]})}),e.jsx(s,{center:!0,workspace:!0,children:e.jsxs("div",{children:[e.jsx(B,{}),e.jsx(A,{children:"Welcome to Geppetto"}),e.jsx(v,{children:"Some introduction text here..."}),e.jsxs(v,{children:[e.jsx(n,{icon:e.jsx(o,{children:"📄"}),label:"Load file...",size:"small",standAlone:!0})," ",e.jsx(w,{shortcut:{interaction:"KeyO",ctrlOrCmd:!0}})]})]})}),e.jsx(m,{defaultSize:250,direction:j.West,minSize:100,children:e.jsx(d,{children:e.jsxs(s,{padding:"sm",children:[e.jsx(a,{children:"Image Properties"}),e.jsxs(p,{children:[e.jsx(t,{label:"Width",children:e.jsx(i,{value:2048})}),e.jsx(t,{label:"Height",children:e.jsx(i,{value:1024})})]}),e.jsx(a,{children:"Opacity (4)"}),e.jsxs(p,{children:[e.jsx(t,{label:"Visible",children:e.jsx(P,{checked:!0})}),e.jsxs(t,{label:"Origin",children:[e.jsx(i,{prefix:"x:",value:10}),e.jsx(i,{prefix:"y:",value:20})]}),e.jsxs(t,{label:"Value",children:[e.jsx(i,{prefix:"x:",value:10}),e.jsx(i,{prefix:"y:",value:20})]}),e.jsx(t,{label:"Use Radius",children:e.jsx(P,{checked:!0})}),e.jsx(t,{label:"Radius",children:e.jsx(i,{value:10})}),e.jsx(t,{children:e.jsx(n,{label:"Add mutation to control",size:"small"})})]})]})})})]})]})});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
              <PanelTitle>Image Properties</PanelTitle>
              <ControlPanel>
                <Control label="Width">
                  <NumberInput value={2048} />
                </Control>
                <Control label="Height">
                  <NumberInput value={1024} />
                </Control>
              </ControlPanel>
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
})`,...c.input.parameters?.docs?.source}}};const F=["Version1Alt"];export{c as Version1Alt,F as __namedExportsOrder,L as default};
