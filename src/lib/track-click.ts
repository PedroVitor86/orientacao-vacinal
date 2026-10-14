export function trackUbsClick(source: 'ACOMPANHAMENTO' | 'RESULTADO' | 'CARD_VACINA') {
  try {
    const payload = JSON.stringify({ source, target: 'DE_OLHO_NA_FILA' });
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/track-click',
        new Blob([payload], { type: 'application/json' })
      );
    } else {
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    console.error('Erro ao registrar clique:', err);
  }
}
