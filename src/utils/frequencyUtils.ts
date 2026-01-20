export function formatFrequency(frequency: number | string): string {
  if (typeof frequency === 'string') {
    return frequency;
  }

  if (frequency >= 0.8) {
    return 'Au quotidien';
  } else if (frequency >= 0.5) {
    return 'Souvent';
  } else if (frequency >= 0.2) {
    return 'De temps en temps';
  } else if (frequency > 0) {
    return 'Un tout petit peu';
  } else {
    return 'Jamais';
  }
}
