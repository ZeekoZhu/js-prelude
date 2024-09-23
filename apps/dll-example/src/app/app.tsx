import { Button } from 'antd';
import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <Button>Button from antd</Button>
      <NxWelcome title="dll-example" />
    </div>
  );
}

export default App;
