import{p as g,j as n,u as p,r as j,M as o,o as a,c as k,q as I,t as u,I as i,x as h,w as b,v,a as s,R as A,e as P,h as T,G as B,H as y,P as f,s as S,A as E,g as d,k as l,f as r,i as m}from"./iframe-HcbDREA1.js";import{M,S as C,a as x,b as R}from"./MenuHeader-D1JPz0ov.js";import{M as z}from"./MenuRadioGroup-Dw-SNWGE.js";import"./preload-helper-PPVm8Dsz.js";const O=g.meta({title:"Pages/Animation",argTypes:{children:{control:!1}},parameters:{layout:"fullscreen"},tags:["svg"]}),c=O.story({render:()=>n.jsxs(p,{children:[n.jsxs(j,{children:[n.jsxs(M,{menuButton:({open:t})=>n.jsx(a,{active:t,icon:n.jsx(k,{}),label:"Geppetto",notificationBadge:!0}),portal:!0,transition:!0,children:[n.jsx(o,{children:"↻ Restart for app update..."}),n.jsx(o,{children:"⇣ Install application locally"}),n.jsxs(C,{label:"File",children:[n.jsx(o,{children:"New"}),n.jsx(x,{}),n.jsx(o,{children:"Open"}),n.jsx(o,{children:"Load texture"}),n.jsx(x,{}),n.jsx(o,{children:"Reload texture"}),n.jsx(x,{}),n.jsx(o,{disabled:!0,children:"Save"}),n.jsx(o,{children:"Save as..."})]}),n.jsx(R,{children:"Edit"}),n.jsxs(C,{label:"Edit",children:[n.jsx(o,{children:"Cut"}),n.jsx(o,{children:"Copy"}),n.jsx(o,{children:"Paste"})]}),n.jsx(o,{children:"Print..."})]}),n.jsx(I,{}),n.jsx(u,{icon:n.jsx(i,{children:"🧬"}),label:"Layers"}),n.jsx(u,{icon:n.jsx(i,{children:"🤷🏼"}),label:"Composition"}),n.jsx(u,{active:!0,icon:n.jsx(i,{children:"🏃"}),label:"Animation"})]}),n.jsx(h,{workspace:!0,children:n.jsx(b,{children:n.jsxs(v,{children:[n.jsx(s,{label:"Control",children:n.jsxs("select",{children:[n.jsx("option",{value:"control1",children:"Control 1"}),n.jsx("option",{value:"control2",children:"Control 2"}),n.jsx("option",{value:"control3",children:"Control 3"})]})}),n.jsx(s,{label:"End value",children:n.jsxs(p,{children:[n.jsx(A,{defaultValue:1,max:5,min:.1,step:.1}),n.jsx(P,{value:1})]})}),n.jsx(s,{label:"Easing function",children:n.jsx(M,{align:"center",arrow:!0,direction:"bottom",menuButton:({open:t})=>n.jsx(a,{active:t,label:n.jsxs(n.Fragment,{children:[n.jsx(T,{size:"option",variant:"linear"})," Linear"]})}),portal:!0,transition:!0,children:n.jsx(z,{value:"linear",children:["linear","easeIn","easeOut","easeInOut"].map(t=>n.jsxs(o,{onClick:()=>{},type:"radio",value:t,children:[n.jsx(T,{size:"option",variant:t})," ",t]},`timing${t}`))})})}),n.jsx(s,{children:n.jsx(a,{label:"Done",standAlone:!0})})]})})}),n.jsx(B,{defaultSize:250,direction:y.North,minSize:100,children:n.jsxs(h,{padding:"sm",children:[n.jsxs(j,{children:[n.jsx(f,{children:"Animations"}),n.jsx(a,{icon:n.jsx(i,{children:"⏮️"}),tooltip:"Go to start"}),n.jsx(a,{icon:n.jsx(i,{children:"▶️"}),tooltip:"Play/Pause"}),n.jsx(a,{icon:n.jsx(i,{children:"⏭️"}),tooltip:"Go to end"}),n.jsx(I,{}),n.jsx(a,{icon:n.jsx(i,{children:"➕"}),label:"Animation",tooltip:"Add Animation track"}),n.jsx(a,{icon:n.jsx(i,{children:"➕"}),label:"Event",tooltip:"Add Event"}),n.jsx(a,{icon:n.jsx(i,{children:"➕"}),label:"Control",tooltip:"Add Control layer"}),n.jsx(S,{}),n.jsx(a,{icon:n.jsx(i,{children:"?"}),tooltip:"Help"})]}),n.jsxs(E,{duration:60,title:"Timeline",zoom:2,children:[Array.from({length:3}).map((t,e)=>n.jsxs(d,{length:Math.max(3+e*2,10+e,17),name:`Track ${1+e}`,children:[n.jsx(l,{location:3+e*2}),n.jsx(l,{location:10+e}),n.jsx(r,{duration:5,easing:"easeInOut",start:10,trackIndex:0}),n.jsx(r,{duration:5,easing:"easeInOut",start:12,trackIndex:1})]},e)),n.jsxs(d,{length:22,loop:!0,name:"Track 4",selected:!0,trackNames:["Control 1","Control 3","Control 4"],children:[n.jsx(r,{duration:3,easing:"easeInOut",selected:!0,start:3,trackIndex:0}),n.jsx(r,{duration:8,easing:"linear",start:12,trackIndex:0}),n.jsx(r,{duration:14,easing:"easeIn",start:7,trackIndex:1}),n.jsx(r,{duration:14,easing:"easeOut",start:0,trackIndex:2}),n.jsx(m,{location:14,loop:!0,trackIndex:2}),n.jsx(m,{location:22,loop:!0,trackIndex:1}),n.jsx(m,{location:20,loop:!0,trackIndex:0}),n.jsx(l,{location:3}),n.jsx(l,{location:8}),n.jsx(l,{location:16})]},3),Array.from({length:10}).map((t,e)=>n.jsxs(d,{length:Math.max(3+e*2,10+e),name:`Track ${5+e}`,children:[n.jsx(l,{location:3+e*2}),n.jsx(l,{location:10+e})]},5+e))]})]})})]})});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
      </ToolBar>
      <Panel workspace>
        <Inlay>
          <ControlPanel>
            <Control label="Control">
              <select>
                <option value="control1">Control 1</option>
                <option value="control2">Control 2</option>
                <option value="control3">Control 3</option>
              </select>
            </Control>
            <Control label="End value">
              <Column>
                <RangeInput defaultValue={1} max={5} min={0.1} step={0.1} />
                <RangeValue value={1} />
              </Column>
            </Control>
            <Control label="Easing function">
              <Menu align="center" arrow direction="bottom" menuButton={({
              open
            }) => <ToolButton active={open} label={<>
                        <TimeCurve size="option" variant="linear" /> Linear
                      </>} />} portal transition>
                <MenuRadioGroup value={"linear"}>
                  {(["linear", "easeIn", "easeOut", "easeInOut"] as const).map(timing => <MenuItem key={\`timing\${timing}\`} onClick={() => {}} type="radio" value={timing}>
                        <TimeCurve size="option" variant={timing} /> {timing}
                      </MenuItem>)}
                </MenuRadioGroup>
              </Menu>
            </Control>
            <Control>
              <ToolButton label="Done" standAlone />
            </Control>
          </ControlPanel>
        </Inlay>
      </Panel>
      <ResizePanel defaultSize={250} direction={ResizeDirection.North} minSize={100}>
        <Panel padding="sm">
          <ToolBar>
            <PanelTitle>Animations</PanelTitle>
            <ToolButton icon={<Icon>⏮️</Icon>} tooltip="Go to start" />
            <ToolButton icon={<Icon>▶️</Icon>} tooltip="Play/Pause" />
            <ToolButton icon={<Icon>⏭️</Icon>} tooltip="Go to end" />
            <ToolSeparator />
            <ToolButton icon={<Icon>➕</Icon>} label="Animation" tooltip="Add Animation track" />
            <ToolButton icon={<Icon>➕</Icon>} label="Event" tooltip="Add Event" />
            <ToolButton icon={<Icon>➕</Icon>} label="Control" tooltip="Add Control layer" />
            <ToolSpacer />
            <ToolButton icon={<Icon>?</Icon>} tooltip="Help" />
          </ToolBar>
          <AnimationsContainer duration={60} title="Timeline" zoom={2}>
            {Array.from({
            length: 3
          }).map((_, i) => <AnimationTrack key={i} length={Math.max(3 + i * 2, 10 + i, 17)} name={\`Track \${1 + i}\`}>
                <TimePin location={3 + i * 2} />
                <TimePin location={10 + i} />
                <TimeBar duration={5} easing="easeInOut" start={10} trackIndex={0} />
                <TimeBar duration={5} easing="easeInOut" start={12} trackIndex={1} />
              </AnimationTrack>)}
            <AnimationTrack key={3} length={22} loop={true} name="Track 4" selected trackNames={["Control 1", "Control 3", "Control 4"]}>
              <TimeBar duration={3} easing="easeInOut" selected start={3} trackIndex={0} />
              <TimeBar duration={8} easing="linear" start={12} trackIndex={0} />
              <TimeBar duration={14} easing="easeIn" start={7} trackIndex={1} />
              <TimeBar duration={14} easing="easeOut" start={0} trackIndex={2} />
              <TimeLineEndHandle location={14} loop={true} trackIndex={2} />
              <TimeLineEndHandle location={22} loop={true} trackIndex={1} />
              <TimeLineEndHandle location={20} loop={true} trackIndex={0} />

              <TimePin location={3} />
              <TimePin location={8} />
              <TimePin location={16} />
            </AnimationTrack>
            {Array.from({
            length: 10
          }).map((_, i) => <AnimationTrack key={5 + i} length={Math.max(3 + i * 2, 10 + i)} name={\`Track \${5 + i}\`}>
                <TimePin location={3 + i * 2} />
                <TimePin location={10 + i} />
              </AnimationTrack>)}
          </AnimationsContainer>
        </Panel>
      </ResizePanel>
    </Column>
})`,...c.input.parameters?.docs?.source}}};const D=["Version1"];export{c as Version1,D as __namedExportsOrder,O as default};
