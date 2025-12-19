import{p as c,j as e}from"./iframe-CY0xYQ0n.js";import{C as o}from"./Column-6i4d-oi8.js";import{P as n}from"./Panel-KhMFgAXU.js";import{R as l}from"./Row-BYo6iSQm.js";import{R as t,a as i}from"./ResizePanel-DkAQlQC0.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";const a={North:t.North,South:t.South,East:t.East,West:t.West},p=c.meta({title:"Molecules/ResizePanel",component:i,argTypes:{direction:{options:Object.keys(a),mapping:a,control:{type:"radio"}}},args:{direction:a.East,minSize:40,maxSize:400}}),s=p.story({render:r=>r.direction===t.East?e.jsxs(l,{children:[e.jsx(i,{...r,children:e.jsx(n,{padding:"md",children:e.jsx("p",{children:"Resizable panel"})})}),e.jsx(n,{workspace:!0,center:!0,children:e.jsx("p",{children:"Other content"})})]}):r.direction===t.North?e.jsxs(o,{children:[e.jsx(n,{workspace:!0,center:!0,children:e.jsx("p",{children:"Other content"})}),e.jsx(i,{...r,children:e.jsx(n,{padding:"md",children:e.jsx("p",{children:"Resizable panel"})})})]}):r.direction===t.South?e.jsxs(o,{children:[e.jsx(i,{...r,children:e.jsx(n,{padding:"md",children:e.jsx("p",{children:"Resizable panel"})})}),e.jsx(n,{workspace:!0,center:!0,children:e.jsx("p",{children:"Other content"})})]}):e.jsxs(l,{children:[e.jsx(n,{workspace:!0,center:!0,children:e.jsx("p",{children:"Other content"})}),e.jsx(i,{...r,children:e.jsx(n,{padding:"md",children:e.jsx("p",{children:"Resizable panel"})})})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    if (args.direction === ResizeDirection.East) {
      return <Row>
          <ResizePanel {...args}>
            <Panel padding="md">
              <p>Resizable panel</p>
            </Panel>
          </ResizePanel>
          <Panel workspace center>
            <p>Other content</p>
          </Panel>
        </Row>;
    }
    if (args.direction === ResizeDirection.North) {
      return <Column>
          <Panel workspace center>
            <p>Other content</p>
          </Panel>
          <ResizePanel {...args}>
            <Panel padding="md">
              <p>Resizable panel</p>
            </Panel>
          </ResizePanel>
        </Column>;
    }
    if (args.direction === ResizeDirection.South) {
      return <Column>
          <ResizePanel {...args}>
            <Panel padding="md">
              <p>Resizable panel</p>
            </Panel>
          </ResizePanel>
          <Panel workspace center>
            <p>Other content</p>
          </Panel>
        </Column>;
    }
    return <Row>
        <Panel workspace center>
          <p>Other content</p>
        </Panel>
        <ResizePanel {...args}>
          <Panel padding="md">
            <p>Resizable panel</p>
          </Panel>
        </ResizePanel>
      </Row>;
  }
})`,...s.input.parameters?.docs?.source}}};const j=["Default"];export{s as Default,j as __namedExportsOrder};
