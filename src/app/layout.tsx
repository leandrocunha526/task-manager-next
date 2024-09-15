import { Metadata } from 'next';
import StyledComponentsRegistry from './lib/registry';

export const metadata: Metadata = {
  title: 'Gerenciador de tarefas',
  description: 'Gerencie tarefas organizando por listas e prioridade',
}

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>
          {props.children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
