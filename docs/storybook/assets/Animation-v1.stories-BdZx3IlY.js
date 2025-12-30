import{p as k,j as e,n as i,k as h,M as t,h as l,c as y,i as j,m as u,I as r,r as v,q as C,o as f,a as s,R as M,e as N,w,x as P,P as B,l as z,y as m}from"./iframe-DP97NOyG.js";import{M as S,S as g,a as p,b as A}from"./MenuHeader-GK_pqaYn.js";import"./preload-helper-PPVm8Dsz.js";const E=k.meta({title:"Pages/Animation",argTypes:{children:{control:!1}},tags:["svg"]}),a=({location:o,activeTrack:n=!1})=>e.jsx("div",{className:"absolute top-0.5 bottom-0.5 z-20 w-0 border-x border-dashed border-control-edge",style:{left:`${o}em`},children:e.jsx("div",{className:m("cursor-grab rounded-full border border-control-edge bg-toolbar hover:bg-control-highlight",!n&&"-ml-1.5 size-3",n&&"-ml-2 size-4")})}),I=()=>e.jsx("div",{className:"h-4 w-1 cursor-ew-resize border-x border-control-edge hover:bg-control-active"}),O=({variant:o})=>e.jsx("div",{className:m("h-full flex-1 bg-control-focus/50",o==="linear"&&"clip-linear",o==="easeIn"&&"clip-ease-in",o==="easeOut"&&"clip-ease-out",o==="easeInOut"&&"clip-ease-in-out")}),c=({start:o,duration:n,selected:x=!1,trackIndex:T,easing:b})=>e.jsxs("div",{className:m("absolute z-10 flex h-5 cursor-pointer items-center justify-between gap-0.5 rounded-control-small border shadow-sm hover:bg-control-highlight",x&&"border-control-focus bg-control-active",!x&&"border-control-edge bg-toolbar"),style:{left:`${o}em`,width:`${n}em`,top:`calc(${(T+1)*5} * var(--spacing))`},children:[e.jsx(I,{}),b&&e.jsx(O,{variant:b}),e.jsx(I,{})]}),d=E.story({render:()=>e.jsxs(i,{children:[e.jsxs(h,{children:[e.jsxs(S,{menuButton:({open:o})=>e.jsx(l,{active:o,icon:e.jsx(y,{}),label:"Geppetto",notificationBadge:!0}),portal:!0,transition:!0,children:[e.jsx(t,{children:"↻ Restart for app update..."}),e.jsx(t,{children:"⇣ Install application locally"}),e.jsxs(g,{label:"File",children:[e.jsx(t,{children:"New"}),e.jsx(p,{}),e.jsx(t,{children:"Open"}),e.jsx(t,{children:"Load texture"}),e.jsx(p,{}),e.jsx(t,{children:"Reload texture"}),e.jsx(p,{}),e.jsx(t,{disabled:!0,children:"Save"}),e.jsx(t,{children:"Save as..."})]}),e.jsx(A,{children:"Edit"}),e.jsxs(g,{label:"Edit",children:[e.jsx(t,{children:"Cut"}),e.jsx(t,{children:"Copy"}),e.jsx(t,{children:"Paste"})]}),e.jsx(t,{children:"Print..."})]}),e.jsx(j,{}),e.jsx(u,{icon:e.jsx(r,{children:"🧬"}),label:"Layers"}),e.jsx(u,{icon:e.jsx(r,{children:"🤷🏼"}),label:"Composition"}),e.jsx(u,{active:!0,icon:e.jsx(r,{children:"🏃"}),label:"Animation"})]}),e.jsxs(i,{children:[e.jsx(v,{workspace:!0,children:e.jsx(C,{children:e.jsxs(f,{children:[e.jsx(s,{label:"Control",children:e.jsxs("select",{children:[e.jsx("option",{value:"control1",children:"Control 1"}),e.jsx("option",{value:"control2",children:"Control 2"}),e.jsx("option",{value:"control3",children:"Control 3"})]})}),e.jsx(s,{label:"End value",children:e.jsxs(i,{children:[e.jsx(M,{defaultValue:1,max:5,min:.1,step:.1}),e.jsx(N,{value:1})]})}),e.jsx(s,{label:"Easing function",children:e.jsxs("select",{children:[e.jsx("option",{value:"linear",children:"Linear"}),e.jsx("option",{value:"easeIn",children:"Ease In"}),e.jsx("option",{value:"easeOut",children:"Ease Out"}),e.jsx("option",{value:"easeInOut",children:"Ease In Out"})]})}),e.jsx(s,{children:e.jsx(l,{label:"Done",standAlone:!0})})]})})}),e.jsx(w,{defaultSize:250,direction:P.North,minSize:100,children:e.jsxs(v,{padding:"sm",children:[e.jsxs(h,{children:[e.jsx(B,{children:"Animations"}),e.jsx(l,{icon:e.jsx(r,{children:"⏮️"}),tooltip:"Go to start"}),e.jsx(l,{icon:e.jsx(r,{children:"◀️"}),tooltip:"Step backward"}),e.jsx(l,{icon:e.jsx(r,{children:"▶️"}),tooltip:"Play/Pause"}),e.jsx(l,{icon:e.jsx(r,{children:"⏭️"}),tooltip:"Go to end"}),e.jsx(j,{}),e.jsx(l,{icon:e.jsx(r,{children:"➕"}),label:"Animation",tooltip:"Add Animation track"}),e.jsx(l,{icon:e.jsx(r,{children:"➕"}),label:"Event",tooltip:"Add Event"}),e.jsx(l,{icon:e.jsx(r,{children:"➕"}),label:"Control",tooltip:"Add Control layer"}),e.jsx(z,{}),e.jsx(l,{icon:e.jsx(r,{children:"?"}),tooltip:"Help"})]}),e.jsx("div",{className:"overflow-scroll",children:e.jsxs("div",{className:"grid grid-cols-[minmax(min-content,20vw)_1fr] gap-x-1",children:[e.jsx("div",{className:"sticky top-0 left-0 z-40 border-b border-control-edge bg-toolbar/70 p-2 text-right backdrop-blur-md",children:"Timeline"}),e.jsx("div",{className:"sticky top-0 z-30 border-b border-control-edge bg-toolbar/70 p-2 backdrop-blur-md",children:"Timestamps"}),Array.from({length:3}).map((o,n)=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"sticky left-0 z-30 border-b border-control-edge bg-toolbar/50 px-2 py-2 text-right whitespace-nowrap backdrop-blur-md",children:["Track ",n+1]}),e.jsxs("div",{className:"relative w-7xl items-center border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control",children:[e.jsx(a,{location:3+n*2}),e.jsx(a,{location:10+n})]})]},n)),e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sticky left-0 z-30 border-b border-control-edge bg-control-active/50 px-2 py-1 text-right whitespace-nowrap backdrop-blur-md",children:e.jsxs(i,{children:[e.jsxs("div",{className:"h-5",children:["Track ",4]}),e.jsx("div",{className:"h-5 pl-4 text-sm",children:"Control 1"}),e.jsx("div",{className:"h-5 pl-4 text-sm",children:"Control 3"}),e.jsx("div",{className:"h-5 pl-4 text-sm",children:"Control 4"})]})}),e.jsxs("div",{className:"relative w-7xl border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control",children:[e.jsx("div",{className:"h-4 w-full bg-toolbar"}),e.jsx(c,{duration:5,easing:"easeInOut",selected:!0,start:10,trackIndex:0}),e.jsx(c,{duration:8,easing:"linear",start:20,trackIndex:0}),e.jsx(c,{duration:14,easing:"easeIn",start:7,trackIndex:1}),e.jsx(c,{duration:14,easing:"easeOut",start:12,trackIndex:2}),e.jsx(a,{activeTrack:!0,location:3}),e.jsx(a,{activeTrack:!0,location:10}),e.jsx(a,{activeTrack:!0,location:25}),e.jsx(a,{activeTrack:!0,location:45})]})]},3),Array.from({length:10}).map((o,n)=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"sticky left-0 z-30 border-b border-control-edge bg-toolbar/50 px-2 py-2 text-right whitespace-nowrap backdrop-blur-md",children:["Track ",n+5]}),e.jsxs("div",{className:"relative w-7xl border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control",children:[e.jsx(a,{location:3+n*2}),e.jsx(a,{location:10+n})]})]},5+n))]})})]})})]})]})});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
      <Column>
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
                <select>
                  <option value="linear">Linear</option>
                  <option value="easeIn">Ease In</option>
                  <option value="easeOut">Ease Out</option>
                  <option value="easeInOut">Ease In Out</option>
                </select>
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
              <ToolButton icon={<Icon>◀️</Icon>} tooltip="Step backward" />
              <ToolButton icon={<Icon>▶️</Icon>} tooltip="Play/Pause" />
              <ToolButton icon={<Icon>⏭️</Icon>} tooltip="Go to end" />
              <ToolSeparator />
              <ToolButton icon={<Icon>➕</Icon>} label="Animation" tooltip="Add Animation track" />
              <ToolButton icon={<Icon>➕</Icon>} label="Event" tooltip="Add Event" />
              <ToolButton icon={<Icon>➕</Icon>} label="Control" tooltip="Add Control layer" />
              <ToolSpacer />
              <ToolButton icon={<Icon>?</Icon>} tooltip="Help" />
            </ToolBar>
            <div className="overflow-scroll">
              <div className="grid grid-cols-[minmax(min-content,20vw)_1fr] gap-x-1">
                <div className="sticky top-0 left-0 z-40 border-b border-control-edge bg-toolbar/70 p-2 text-right backdrop-blur-md">
                  Timeline
                </div>
                <div className="sticky top-0 z-30 border-b border-control-edge bg-toolbar/70 p-2 backdrop-blur-md">
                  Timestamps
                </div>
                {Array.from({
                length: 3
              }).map((_, i) => <Fragment key={i}>
                    <div className="sticky left-0 z-30 border-b border-control-edge bg-toolbar/50 px-2 py-2 text-right whitespace-nowrap backdrop-blur-md">
                      Track {i + 1}
                    </div>
                    <div className="relative w-7xl items-center border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control">
                      <TimePin location={3 + i * 2} />
                      <TimePin location={10 + i} />
                    </div>
                  </Fragment>)}
                <Fragment key={3}>
                  <div className="sticky left-0 z-30 border-b border-control-edge bg-control-active/50 px-2 py-1 text-right whitespace-nowrap backdrop-blur-md">
                    <Column>
                      <div className="h-5">Track {3 + 1}</div>
                      <div className="h-5 pl-4 text-sm">Control 1</div>
                      <div className="h-5 pl-4 text-sm">Control 3</div>
                      <div className="h-5 pl-4 text-sm">Control 4</div>
                    </Column>
                  </div>
                  <div className="relative w-7xl border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control">
                    <div className="h-4 w-full bg-toolbar"></div>
                    <TimeBar duration={5} easing="easeInOut" selected start={10} trackIndex={0} />
                    <TimeBar duration={8} easing="linear" start={20} trackIndex={0} />
                    <TimeBar duration={14} easing="easeIn" start={7} trackIndex={1} />
                    <TimeBar duration={14} easing="easeOut" start={12} trackIndex={2} />

                    <TimePin activeTrack location={3} />
                    <TimePin activeTrack location={10} />
                    <TimePin activeTrack location={25} />
                    <TimePin activeTrack location={45} />
                  </div>
                </Fragment>
                {Array.from({
                length: 10
              }).map((_, i) => <Fragment key={5 + i}>
                    <div className="sticky left-0 z-30 border-b border-control-edge bg-toolbar/50 px-2 py-2 text-right whitespace-nowrap backdrop-blur-md">
                      Track {i + 5}
                    </div>
                    <div className="relative w-7xl border-b border-control-edge/50 bg-panel px-1 py-0.5 last:rounded-b-control nth-[4]:rounded-t-control">
                      <TimePin location={3 + i * 2} />
                      <TimePin location={10 + i} />
                    </div>
                  </Fragment>)}
              </div>
            </div>
          </Panel>
        </ResizePanel>
      </Column>
    </Column>
})`,...d.input.parameters?.docs?.source}}};const L=["Version1"];export{d as Version1,L as __namedExportsOrder,E as default};
