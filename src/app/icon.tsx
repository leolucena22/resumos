// app/favicon.ico
import { ImageResponse } from 'next/og';



export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f9ff', // Fundo azul clarinho
          borderRadius: '20%',
          overflow: 'hidden',
          border: '1px solid #bae6fd', // Azul bem claro
        }}
      >
        {/* Ícone de Livro */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            position: 'relative',
          }}
        >
          {/* Parte esquerda do livro */}
          <div
            style={{
              width: '9px',
              height: '18px',
              background: '#0ea5e9',
              borderRadius: '2px 0 0 2px',
              transform: 'skewY(10deg)',
              marginRight: '-1px',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            }}
          />
          {/* Parte direita do livro */}
          <div
            style={{
              width: '9px',
              height: '18px',
              background: '#22c55e',
              borderRadius: '0 2px 2px 0',
              transform: 'skewY(-10deg)',
              marginLeft: '-1px',
              boxShadow: '-1px 1px 2px rgba(0,0,0,0.2)',
            }}
          />
          {/* Linha central */}
          <div
            style={{
              position: 'absolute',
              width: '2px',
              height: '18px',
              background: '#0369a1',
            }}
          />
        </div>

        {/* Letra "R" representando Resumo */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: '#0ea5e9',
            marginTop: 1,
            fontFamily: 'sans-serif',
          }}
        >
          R
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
