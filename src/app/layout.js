import './globals.css';

export const metadata = {
  title: 'ContextLGPD-Negotiator — CIn-UFPE',
  description: 'Negociação entre Computação Sensível ao Contexto e a LGPD por meio da Engenharia de Requisitos de Software',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
