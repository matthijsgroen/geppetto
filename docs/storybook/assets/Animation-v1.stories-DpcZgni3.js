import{p as I,j as e}from"./iframe-BB5eUGr5.js";import{I as o}from"./Icon-CXRC-y-A.js";import"./Kbd-Cz3xksv1.js";import"./Label-DT96c8W4.js";import{a as h,L as T}from"./Logo-ndBSlh0y.js";import"./NumberInput-D6Fl7Bql.js";import{P as M}from"./PanelTitle-DE0Jgq-3.js";import"./Paragraph-gXNISozF.js";import{R as P}from"./RangeInput-B20vUK4i.js";import"./RangeValue--j13x6Da.js";import"./TextButton-C5kZUrAh.js";import"./Title-CS8r_PPT.js";import"./ToggleInput-Du-UqRPY.js";import{T as t}from"./ToolButton-BNaLkAHX.js";import{T as a}from"./ToolSeparator-DS8RgUI0.js";import"./ToolSpacer-CE8tkWIv.js";import{T as s}from"./ToolTab-C9FB3s2u.js";import{C as c}from"./Column-Dk9EbNEg.js";import{C as S}from"./Control-BDRr7VuU.js";import{C as p}from"./ControlPanel-BkWjS1UU.js";import"./EmptyTree-VCrTo4t9.js";import{P as i}from"./Panel-DGj7-4j-.js";import{R as l,a as m}from"./ResizePanel-BMqm3Ol7.js";import{R as u}from"./Row-CdPrkGre.js";import{T as v}from"./ToolBar-kNIWjPNs.js";import"./ToolGrid-Bslftk7H.js";import{M as n}from"./Menu-Dj6_yfpy.js";import{a as b,s as f,T as R}from"./storybookTreeDataProvider-DIrc8i72.js";import{M as C,S as x,a as d,b as z}from"./MenuHeader-BL2oQ54s.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./ToolBarContext-C9UDrxTM.js";const g=I.meta({title:"Pages/Animation",argTypes:{children:{control:!1}},tags:["svg"]}),w=()=>null,r=g.story({render:()=>e.jsxs(c,{children:[e.jsxs(v,{children:[e.jsxs(C,{menuButton:({open:j})=>e.jsx(t,{active:j,icon:e.jsx(h,{}),label:"Geppetto",notificationBadge:!0}),portal:!0,transition:!0,children:[e.jsx(n,{children:"↻ Restart for app update..."}),e.jsx(n,{children:"⇣ Install application locally"}),e.jsxs(x,{label:"File",children:[e.jsx(n,{children:"New"}),e.jsx(d,{}),e.jsx(n,{children:"Open"}),e.jsx(n,{children:"Load texture"}),e.jsx(d,{}),e.jsx(n,{children:"Reload texture"}),e.jsx(d,{}),e.jsx(n,{disabled:!0,children:"Save"}),e.jsx(n,{children:"Save as..."})]}),e.jsx(z,{children:"Edit"}),e.jsxs(x,{label:"Edit",children:[e.jsx(n,{children:"Cut"}),e.jsx(n,{children:"Copy"}),e.jsx(n,{children:"Paste"})]}),e.jsx(n,{children:"Print..."})]}),e.jsx(a,{}),e.jsx(s,{icon:e.jsx(o,{children:"🧬"}),label:"Layers"}),e.jsx(s,{icon:e.jsx(o,{children:"🤷🏼"}),label:"Composition"}),e.jsx(s,{active:!0,icon:e.jsx(o,{children:"🏃"}),label:"Animation"}),e.jsx(a,{}),e.jsx(t,{icon:e.jsx(o,{children:"🔧"}),tooltip:"Adjust point mode"}),e.jsx(t,{icon:e.jsx(o,{children:"️▶️"}),tooltip:"Add point mode"}),e.jsx(a,{}),e.jsx(t,{disabled:!0,icon:e.jsx(o,{children:"🗑"}),tooltip:"Remove selected point"})]}),e.jsxs(c,{children:[e.jsx(l,{defaultSize:150,direction:m.South,minSize:100,children:e.jsxs(u,{children:[e.jsx(l,{defaultSize:175,direction:m.East,minSize:100,children:e.jsx(i,{padding:"sm",children:e.jsx(p,{})})}),e.jsx(i,{padding:"sm",workspace:!0})]})}),e.jsxs(u,{children:[e.jsx(l,{defaultSize:225,direction:m.East,minSize:100,children:e.jsxs(i,{padding:"sm",children:[e.jsx(b,{items:f(w),viewState:{},children:e.jsx(R,{treeId:"layers"})}),e.jsx(M,{children:"Control value"}),e.jsx(p,{children:e.jsx(S,{label:"Control 1",children:e.jsx(P,{})})})]})}),e.jsx(i,{center:!0,workspace:!0,children:e.jsxs("div",{children:[e.jsx(T,{}),e.jsx("h1",{children:"Welcome to Geppetto"}),e.jsx("p",{children:"Animation display here"})]})})]})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Column>
      <ToolBar>
        <Menu menuButton={({
        open
      }) => <ToolButton active={open} icon={<LogoIcon />} label="Geppetto" notificationBadge />} portal={true} transition>
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

        <ToolTab icon={<Icon>🧬</Icon>} label={"Layers"} />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} />
        <ToolTab active icon={<Icon>🏃</Icon>} label={"Animation"} />
        <ToolSeparator />

        <ToolButton icon={<Icon>🔧</Icon>} tooltip="Adjust point mode" />
        <ToolButton icon={<Icon>️▶️</Icon>} tooltip="Add point mode" />
        <ToolSeparator />
        <ToolButton disabled icon={<Icon>🗑</Icon>} tooltip="Remove selected point" />
      </ToolBar>

      <Column>
        <ResizePanel defaultSize={150} direction={ResizeDirection.South} minSize={100}>
          <Row>
            <ResizePanel defaultSize={175} direction={ResizeDirection.East} minSize={100}>
              <Panel padding="sm">
                <ControlPanel></ControlPanel>
              </Panel>
            </ResizePanel>
            <Panel padding="sm" workspace>
              {/* <TimeLineCurves />
               <TimeBox zoom={1.0}>
                <TimeEvent
                  easing={"easeOut"}
                  endTime={4000}
                  label={"Sun"}
                  row={0}
                  startTime={0}
                />
                <TimeEvent
                  easing={"easeIn"}
                  endTime={12000}
                  label={"Sun"}
                  row={0}
                  startTime={8000}
                />
               </TimeBox> */}
            </Panel>
          </Row>
        </ResizePanel>
        <Row>
          <ResizePanel defaultSize={225} direction={ResizeDirection.East} minSize={100}>
            <Panel padding="sm">
              <TreeEnvironment items={storyTreeItems(noToolsProvider)} viewState={{}}>
                <Tree treeId="layers" />
              </TreeEnvironment>
              <PanelTitle>Control value</PanelTitle>
              <ControlPanel>
                <Control label="Control 1">
                  <RangeInput />
                </Control>
              </ControlPanel>
            </Panel>
          </ResizePanel>
          <Panel center workspace>
            <div>
              <Logo />
              <h1>Welcome to Geppetto</h1>
              <p>Animation display here</p>
            </div>
          </Panel>
        </Row>
      </Column>
    </Column>
})`,...r.input.parameters?.docs?.source}}};const le=["Version1"];export{r as Version1,le as __namedExportsOrder,g as default};
